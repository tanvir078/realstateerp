import { ConflictException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale, SaleStatus, PaymentMethod } from './entities/sale.entity';
import { CreateSaleDto } from './dtos/create-sale.dto';
import { UpdateSaleDto } from './dtos/update-sale.dto';
import { Unit, UnitStatus, UnitType } from '../projects/entities/unit.entity';
import { Project } from '../projects/entities/project.entity';
import { Client, ClientStatus, PaymentStatus } from '../clients/entities/client.entity';
import { CreateInstallmentDto } from './dtos/create-installment.dto';
import { Installment, InstallmentStatus } from './entities/installment.entity';
import { CollectionPayment } from './entities/collection-payment.entity';
import { LedgerEntry } from './entities/ledger-entry.entity';
import { CollectPaymentDto } from './dtos/collect-payment.dto';
import { CreateInvoiceDto } from './dtos/create-invoice.dto';
import { RefundBookingDto } from './dtos/refund-booking.dto';
import { Invoice, InvoiceStatus } from './entities/invoice.entity';
import { Handover, HandoverStatus } from './entities/handover.entity';
import { DataSource } from 'typeorm';
import { AccountingPeriodService } from '../accounting/period.service';
import { TaxService } from '../accounting/tax.service';
import { TaxType } from '../accounting/entities/tax-configuration.entity';
import { AccountingService } from '../accounting/accounting.service';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private salesRepository: Repository<Sale>,
    @InjectRepository(Unit)
    private unitsRepository: Repository<Unit>,
    @InjectRepository(Installment)
    private installmentsRepository: Repository<Installment>,
    @InjectRepository(CollectionPayment)
    private paymentsRepository: Repository<CollectionPayment>,
    @InjectRepository(LedgerEntry)
    private ledgerRepository: Repository<LedgerEntry>,
    @InjectRepository(Invoice)
    private invoicesRepository: Repository<Invoice>,
    @InjectRepository(Handover)
    private handoversRepository: Repository<Handover>,
    private dataSource: DataSource,
    private readonly periodService: AccountingPeriodService,
    private readonly taxService: TaxService,
    private readonly accountingService: AccountingService,
  ) {}

  async create(createSaleDto: CreateSaleDto): Promise<Sale> {
    return this.dataSource.transaction(async (manager) => {
      const client = await manager.findOne(Client, { where: { id: createSaleDto.clientId } });
      if (!client) throw new NotFoundException(`Client with ID ${createSaleDto.clientId} not found`);
      const unit = await manager.findOne(Unit, { where: { id: createSaleDto.unitId } });
      if (!unit) throw new NotFoundException(`Unit with ID ${createSaleDto.unitId} not found`);
      if (unit.unitType === UnitType.PARKING) throw new UnprocessableEntityException('A parking space must be added to a property sale, not sold as the primary unit');
      if (unit.status !== UnitStatus.AVAILABLE) throw new ConflictException('Selected unit is not available');
      const activeBooking = await manager.findOne(Sale, { where: { unitId: unit.id, status: SaleStatus.CONFIRMED } });
      if (activeBooking) throw new ConflictException('Selected unit already has an active booking');
      const bookingCode = createSaleDto.saleId || `BK-${new Date().getFullYear()}-${String((await manager.count(Sale)) + 1).padStart(3, '0')}`;
      let parkingPrice = 0;
      let parkingUnit: Unit | null = null;
      if (createSaleDto.parkingUnitId) {
        parkingUnit = await manager.findOne(Unit, { where: { id: createSaleDto.parkingUnitId } });
        if (!parkingUnit) throw new NotFoundException(`Parking unit with ID ${createSaleDto.parkingUnitId} not found`);
        if (parkingUnit.projectId !== unit.projectId || parkingUnit.unitType !== UnitType.PARKING) {
          throw new UnprocessableEntityException('Selected parking must belong to the same project');
        }
        if (parkingUnit.status !== UnitStatus.AVAILABLE) throw new ConflictException('Selected parking is not available');
        parkingPrice = Number(parkingUnit.totalPrice);
      }
      const includesParking = Boolean(createSaleDto.parkingUnitId || createSaleDto.includesParking);
      const propertyPriceWithoutParking = Number(unit.totalPrice) - Number(unit.parkingPrice || 0);
      const totalPrice = Number(createSaleDto.totalPrice ?? (propertyPriceWithoutParking + parkingPrice));
      const downPayment = Number(createSaleDto.downPayment ?? 0);
      const bookingPaymentMethod = downPayment > 0
        ? (createSaleDto.bookingPaymentMethod ?? (
          [PaymentMethod.CASH, PaymentMethod.BANK_TRANSFER, PaymentMethod.CHEQUE].includes(createSaleDto.paymentMethod as PaymentMethod)
            ? createSaleDto.paymentMethod
            : PaymentMethod.CASH
        ))
        : createSaleDto.bookingPaymentMethod;
      if (!Number.isFinite(downPayment) || downPayment < 0 || downPayment > totalPrice) {
        throw new UnprocessableEntityException('Booking money must be between zero and the agreement value');
      }
      if (downPayment > 0 && ![PaymentMethod.CASH, PaymentMethod.BANK_TRANSFER, PaymentMethod.CHEQUE].includes(bookingPaymentMethod as PaymentMethod)) {
        throw new UnprocessableEntityException('A cash, bank transfer, or cheque channel is required when booking money is received');
      }
      const sale = manager.create(Sale, {
        ...createSaleDto,
        saleId: bookingCode,
        projectId: unit.projectId,
        projectName: createSaleDto.projectName || '',
        unitNo: createSaleDto.unitNo || unit.unitCode,
        unitPrice: Number(createSaleDto.unitPrice ?? unit.basePricePerSft),
        totalPrice,
        parkingUnitId: parkingUnit?.id,
        parkingPrice,
        includesParking,
        downPayment,
        amountPaid: downPayment,
        balanceDue: totalPrice - downPayment,
        bookingPaymentMethod,
        status: SaleStatus.PENDING,
      });
      unit.status = UnitStatus.BOOKED;
      await manager.save(unit);
      if (parkingUnit) {
        parkingUnit.status = UnitStatus.BOOKED;
        await manager.save(parkingUnit);
      }
      const savedSale = await manager.save(sale);
      const bookingMoney = Number(savedSale.downPayment || 0);
      if (bookingMoney > 0) {
        const postingDate = savedSale.saleDate
          ? new Date(savedSale.saleDate).toISOString().slice(0, 10)
          : new Date().toISOString().slice(0, 10);
        await this.periodService.ensureOpen(postingDate);
        const debitAccountCode = await this.accountingService.resolvePaymentAccount(bookingPaymentMethod!);
        const creditAccountCode = await this.accountingService.getMappedAccountCode('customer_advance', '2111');
        const receiptNo = `BM-${new Date().getFullYear()}-${String((await manager.count(CollectionPayment)) + 1).padStart(4, '0')}`;
        await manager.save(manager.create(CollectionPayment, {
          receiptNo,
          installmentId: null,
          bookingId: savedSale.id,
          clientId: savedSale.clientId,
          amount: bookingMoney,
          paymentMethod: savedSale.bookingPaymentMethod,
          referenceNo: null,
          paymentDate: postingDate,
          remarks: `Booking money for ${savedSale.saleId}`,
        }));
        await manager.save(manager.create(LedgerEntry, {
          referenceType: 'BOOKING_ADVANCE',
          referenceId: savedSale.id,
          projectId: savedSale.projectId,
          debitAccountCode,
          creditAccountCode,
          amount: bookingMoney,
          postingDate,
          description: `Booking money for ${savedSale.saleId}`,
        }));
      }
      await this.syncClientFinance(manager, client.id);
      return savedSale;
    });
  }

  async confirm(id: string): Promise<Sale> {
    return this.dataSource.transaction(async (manager) => {
      const sale = await manager.findOne(Sale, { where: { id } });
      if (!sale) throw new NotFoundException(`Sale with ID ${id} not found`);
      if (sale.status !== SaleStatus.PENDING) throw new UnprocessableEntityException('Only pending bookings can be confirmed');
      sale.status = SaleStatus.CONFIRMED;
      const savedSale = await manager.save(sale);
      await this.syncClientFinance(manager, sale.clientId);
      return savedSale;
    });
  }

  async cancel(id: string): Promise<Sale> {
    return this.dataSource.transaction(async (manager) => {
      const sale = await manager.findOne(Sale, { where: { id } });
      if (!sale) throw new NotFoundException(`Sale with ID ${id} not found`);
      if (sale.status === SaleStatus.COMPLETED) throw new UnprocessableEntityException('Completed booking cannot be cancelled');
      if (sale.status === SaleStatus.CANCELLED) throw new ConflictException('Booking is already cancelled');
      sale.status = SaleStatus.CANCELLED;
      const unit = await manager.findOne(Unit, { where: { id: sale.unitId } });
      if (unit) unit.status = UnitStatus.AVAILABLE;
      if (unit) await manager.save(unit);
      if (sale.parkingUnitId) {
        const parkingUnit = await manager.findOne(Unit, { where: { id: sale.parkingUnitId } });
        if (parkingUnit) {
          parkingUnit.status = UnitStatus.AVAILABLE;
          await manager.save(parkingUnit);
        }

      }
      const savedSale = await manager.save(sale);
      await this.syncClientFinance(manager, sale.clientId);
      return savedSale;
    });
  }

  async refundBooking(id: string, dto: RefundBookingDto): Promise<Sale> {
    return this.dataSource.transaction(async (manager) => {
      const sale = await manager.findOne(Sale, { where: { id } });
      if (!sale) throw new NotFoundException(`Sale with ID ${id} not found`);
      if (sale.status !== SaleStatus.CANCELLED) {
        throw new UnprocessableEntityException('Only cancelled bookings can be refunded');
      }
      const bookingAdvance = await this.accountingService.getMappedAccountCode('customer_advance', '2111');
      const originalAdvance = await manager.findOne(LedgerEntry, {
        where: { referenceType: 'BOOKING_ADVANCE', referenceId: sale.id, creditAccountCode: bookingAdvance },
      });
      if (!originalAdvance) throw new UnprocessableEntityException('No booking advance ledger exists for this booking');
      const existingRefunds = await manager.find(LedgerEntry, {
        where: { referenceType: 'BOOKING_ADVANCE_REFUND', referenceId: sale.id },
      });
      const refunded = existingRefunds.reduce((sum, entry) => sum + Number(entry.amount), 0);
      const refundable = Number(originalAdvance.amount) - refunded;
      if (dto.amount > refundable) {
        throw new UnprocessableEntityException('Refund exceeds the remaining booking advance');
      }
      await this.periodService.ensureOpen(dto.refundDate);
      const paymentAccount = await this.accountingService.resolvePaymentAccount(dto.paymentMethod);
      await manager.save(manager.create(LedgerEntry, {
        referenceType: 'BOOKING_ADVANCE_REFUND',
        referenceId: sale.id,
        projectId: sale.projectId,
        debitAccountCode: bookingAdvance,
        creditAccountCode: paymentAccount,
        amount: dto.amount,
        postingDate: dto.refundDate,
        description: `Booking advance refund for ${sale.saleId}${dto.referenceNo ? ` (${dto.referenceNo})` : ''}`,
      }));
      sale.downPayment = Math.max(Number(sale.downPayment) - dto.amount, 0);
      sale.amountPaid = Math.max(Number(sale.amountPaid) - dto.amount, 0);
      sale.balanceDue = Math.max(Number(sale.totalPrice) - Number(sale.amountPaid), 0);
      const savedSale = await manager.save(sale);
      await this.syncClientFinance(manager, sale.clientId);
      return savedSale;
    });
  }

  async findAll(): Promise<Sale[]> {
    const sales = await this.salesRepository.find({ order: { createdAt: 'DESC' } });
    const [clients, units] = await Promise.all([this.dataSource.getRepository(Client).find(), this.unitsRepository.find()]);
    const clientNames = new Map(clients.map((client) => [client.id, client.clientName]));
    const unitCodes = new Map(units.map((unit) => [unit.id, unit.unitCode]));
    return sales.map((sale) => ({
      ...sale,
      clientName: clientNames.get(sale.clientId) ?? sale.clientId,
      clientRecordId: sale.clientId,
      clientId: clientNames.get(sale.clientId) ?? sale.clientId,
      parkingUnitNo: sale.parkingUnitId ? unitCodes.get(sale.parkingUnitId) ?? sale.parkingUnitId : null,
    })) as Sale[];
  }

  async findInstallments() {
    const installments = await this.installmentsRepository.find({ order: { dueDate: 'ASC' } });
    const [clients, bookings, projects, units] = await Promise.all([
      this.dataSource.getRepository(Client).find(),
      this.salesRepository.find(),
      this.dataSource.getRepository(Project).find(),
      this.unitsRepository.find(),
    ]);
    const clientNames = new Map(clients.map((client) => [client.id, client.clientName]));
    const bookingMap = new Map(bookings.map((booking) => [booking.id, booking]));
    const projectNames = new Map(projects.map((project) => [project.id, project.projectName]));
    const unitCodes = new Map(units.map((unit) => [unit.id, unit.unitCode]));
    return installments.map((installment) => ({
      ...installment,
      amount: Number(installment.amount),
      paidAmount: Number(installment.paidAmount),
      dueAmount: Number(installment.amount) - Number(installment.paidAmount),
      clientName: clientNames.get(installment.clientId) ?? installment.clientId,
      clientRecordId: installment.clientId,
      clientId: clientNames.get(installment.clientId) ?? installment.clientId,
      bookingCode: bookingMap.get(installment.bookingId)?.saleId ?? installment.bookingId,
      projectName: bookingMap.get(installment.bookingId)?.projectName ?? projectNames.get(bookingMap.get(installment.bookingId)?.projectId ?? '') ?? 'Unassigned',
      unitNo: bookingMap.get(installment.bookingId)?.unitNo ?? 'Not allocated',
      parkingUnitNo: bookingMap.get(installment.bookingId)?.parkingUnitId ? unitCodes.get(bookingMap.get(installment.bookingId)!.parkingUnitId!) ?? 'Not allocated' : 'Not allocated',
    }));
  }

  async createInstallment(dto: CreateInstallmentDto) {
    const booking = await this.findById(dto.bookingId);
    if (![SaleStatus.CONFIRMED, SaleStatus.IN_PROGRESS].includes(booking.status)) {
      throw new UnprocessableEntityException('Only active bookings can receive installments');
    }
    const existing = await this.installmentsRepository.find({ where: { bookingId: dto.bookingId } });
    const allocated = existing.reduce((sum, item) => sum + Number(item.amount), 0);
    if (allocated + dto.amount > Number(booking.totalPrice) - Number(booking.downPayment)) {
      throw new UnprocessableEntityException('Installment schedule exceeds the booking balance');
    }
    const installment = this.installmentsRepository.create({
      ...dto,
      clientId: booking.clientId,
      installmentNo: `INS-${new Date().getFullYear()}-${String((await this.installmentsRepository.count()) + 1).padStart(3, '0')}`,
      paidAmount: 0,
      status: new Date(dto.dueDate) < new Date() ? InstallmentStatus.OVERDUE : InstallmentStatus.UPCOMING,
    });
    return this.installmentsRepository.save(installment);
  }

  async collectPayment(dto: CollectPaymentDto) {
    return this.dataSource.transaction(async (manager) => {
       await this.periodService.ensureOpen(dto.paymentDate);
      const installment = await manager.findOne(Installment, { where: { id: dto.installmentId } });
      if (!installment) throw new NotFoundException(`Installment with ID ${dto.installmentId} not found`);
      const outstanding = Number(installment.amount) - Number(installment.paidAmount);
      if (dto.amount > outstanding) throw new UnprocessableEntityException('Collection amount exceeds installment outstanding balance');
      const paidAmount = Number(installment.paidAmount) + dto.amount;
      installment.paidAmount = paidAmount;
      installment.status = paidAmount === Number(installment.amount) ? InstallmentStatus.PAID : InstallmentStatus.DUE_SOON;
      const booking = await manager.findOne(Sale, { where: { id: installment.bookingId } });
      if (!booking) throw new NotFoundException(`Booking with ID ${installment.bookingId} not found`);
      if (booking.status === SaleStatus.CANCELLED) throw new UnprocessableEntityException('Cancelled bookings cannot receive collections');
      const bookingInstallments = await manager.find(Installment, { where: { bookingId: booking.id } });
      const installmentPaid = bookingInstallments.reduce((sum, item) =>
        sum + Number(item.id === installment.id ? paidAmount : item.paidAmount || 0), 0);
      booking.amountPaid = Number(booking.downPayment || 0) + installmentPaid;
      booking.balanceDue = Math.max(Number(booking.totalPrice) - booking.amountPaid, 0);
      if (booking.balanceDue <= 0) booking.status = SaleStatus.COMPLETED;
      else if (booking.amountPaid > 0) booking.status = SaleStatus.IN_PROGRESS;
      const receiptNo = `MR-${new Date().getFullYear()}-${String((await manager.count(CollectionPayment)) + 1).padStart(4, '0')}`;
      const payment = manager.create(CollectionPayment, { ...dto, receiptNo, clientId: installment.clientId });
      const receiptAccount = await this.accountingService.resolvePaymentAccount(dto.paymentMethod, dto.accountCode);
      const invoice = await manager.findOne(Invoice, { where: { installmentId: installment.id } });
      // Receipts are advances until an invoice has been issued; invoiced amounts settle AR.
      const creditAccount = invoice
        ? await this.accountingService.getMappedAccountCode('customer_receivable', '1131')
        : await this.accountingService.getMappedAccountCode('customer_advance', '2111');
      const ledger = manager.create(LedgerEntry, {
        referenceType: 'INSTALLMENT_COLLECTION', referenceId: installment.id,
        projectId: booking.projectId,
        debitAccountCode: receiptAccount, creditAccountCode: creditAccount, amount: dto.amount, postingDate: dto.paymentDate,
      });
      await manager.save(installment);
      await manager.save(booking);
      await manager.save(payment);
      await manager.save(ledger);
      if (invoice) {
        invoice.paidAmount = installment.paidAmount;
        invoice.status = installment.status === InstallmentStatus.PAID
          ? InvoiceStatus.PAID
          : installment.paidAmount > 0
            ? InvoiceStatus.PARTIAL
            : InvoiceStatus.ISSUED;
        await manager.save(invoice);
      }
      await this.syncClientFinance(manager, installment.clientId);
      return { receipt: payment, ledger, installment };
    });
  }

  async findCollections() {
    const payments = await this.paymentsRepository.find({ order: { paymentDate: 'DESC', createdAt: 'DESC' } });
    return Promise.all(payments.map(async (payment) => {
      const [client, installment] = await Promise.all([
        this.paymentsRepository.manager.findOne(Client, { where: { id: payment.clientId } }),
        this.paymentsRepository.manager.findOne(Installment, { where: { id: payment.installmentId } }),
      ]);
      const sale = installment
        ? await this.paymentsRepository.manager.findOne(Sale, { where: { id: installment.bookingId } })
        : null;
      const booking = payment.bookingId
        ? await this.paymentsRepository.manager.findOne(Sale, { where: { id: payment.bookingId } })
        : null;
      const relatedSale = sale ?? booking;
      const unit = relatedSale
        ? await this.paymentsRepository.manager.findOne(Unit, { where: { id: relatedSale.unitId } })
        : null;
      return {
        ...payment,
        clientName: client?.clientName ?? payment.clientId,
        clientPhone: client?.phone ?? '',
        clientEmail: client?.email ?? '',
        clientAddress: client?.address ?? '',
        clientNid: client?.nid ?? '',
        projectName: relatedSale?.projectName ?? '',
        unitNo: relatedSale?.unitNo ?? '',
        unitType: unit?.unitType ?? '',
        unitSize: unit ? Number(unit.size) : 0,
        status: payment.paymentMethod === 'cheque' ? 'PENDING_CLEARANCE' : 'CLEARED',
      };
    }));
  }

  async findInvoices() {
    const invoices = await this.invoicesRepository.find({ order: { issueDate: 'DESC' } });
    const installmentIds = invoices.map((invoice) => invoice.installmentId);
    const installments = installmentIds.length
      ? await this.installmentsRepository.findBy(installmentIds.map((id) => ({ id })))
      : [];
    const installmentById = new Map(installments.map((installment) => [installment.id, installment]));
    const [clients, bookings] = await Promise.all([this.dataSource.getRepository(Client).find(), this.salesRepository.find()]);
    const clientNames = new Map(clients.map((client) => [client.id, client.clientName]));
    const bookingMap = new Map(bookings.map((booking) => [booking.id, booking]));
    return invoices.map((invoice) => {
      const installment = installmentById.get(invoice.installmentId);
      const amount = Number(invoice.amount);
      const paidAmount = installment ? Number(installment.paidAmount) : Number(invoice.paidAmount);
      const status = installment?.status === InstallmentStatus.PAID
        ? InvoiceStatus.PAID
        : paidAmount > 0
          ? InvoiceStatus.PARTIAL
          : invoice.status;
      const booking = installment ? bookingMap.get(installment.bookingId) : undefined;
      const clientName = installment ? clientNames.get(installment.clientId) ?? installment.clientId : 'Not allocated';
      return { ...invoice, amount, paidAmount, balanceDue: Math.max(amount - paidAmount, 0), status, clientName, clientRecordId: installment?.clientId, clientId: clientName, bookingCode: booking?.saleId ?? installment?.bookingId ?? 'Not allocated', projectName: booking?.projectName ?? 'Unassigned', unitNo: booking?.unitNo ?? 'Not allocated' };
    });
  }

  async findHandovers() {
    return this.handoversRepository.find({ order: { scheduledDate: 'ASC' } });
  }

  async initiateHandover(dto: { saleId: string; scheduledDate: string }) {
    const sale = await this.findById(dto.saleId);
    if (sale.status !== SaleStatus.COMPLETED || Number(sale.balanceDue) > 0) {
      throw new UnprocessableEntityException('Handover requires a fully paid completed booking');
    }
    const existing = await this.handoversRepository.findOne({ where: { saleId: sale.id } });
    if (existing) throw new ConflictException('A handover already exists for this booking');
    return this.handoversRepository.save(this.handoversRepository.create({
      handoverCode: `HO-${new Date().getFullYear()}-${String((await this.handoversRepository.count()) + 1).padStart(3, '0')}`,
      saleId: sale.id,
      clientId: sale.clientId,
      projectName: sale.projectName,
      unitNo: sale.unitNo,
      scheduledDate: dto.scheduledDate,
      status: HandoverStatus.PENDING,
    }));
  }

  async startHandover(id: string) {
    const handover = await this.handoversRepository.findOne({ where: { id } });
    if (!handover) throw new NotFoundException(`Handover with ID ${id} not found`);
    if (![HandoverStatus.PENDING, HandoverStatus.ON_HOLD].includes(handover.status)) {
      throw new UnprocessableEntityException('Only pending or on-hold handovers can be started');
    }
    handover.status = HandoverStatus.IN_PROGRESS;
    return this.handoversRepository.save(handover);
  }

  async completeHandover(id: string) {
    const handover = await this.handoversRepository.findOne({ where: { id } });
    if (!handover) throw new NotFoundException(`Handover with ID ${id} not found`);
    if (handover.status === HandoverStatus.COMPLETED) {
      throw new UnprocessableEntityException('Handover is already completed');
    }
    if (handover.status !== HandoverStatus.IN_PROGRESS) {
      throw new UnprocessableEntityException('Handover must be in progress before completion');
    }
    handover.status = HandoverStatus.COMPLETED;
    handover.completionPercentage = 100;
    handover.checklistCompleted = handover.checklistItems;
    handover.actualDate = new Date().toISOString().slice(0, 10);
    return this.handoversRepository.save(handover);
  }

  async createInvoice(dto: CreateInvoiceDto) {
    return this.dataSource.transaction(async (manager) => {
       await this.periodService.ensureOpen(dto.issueDate);
      const installment = await manager.findOne(Installment, { where: { id: dto.installmentId } });
      if (!installment) throw new NotFoundException(`Installment with ID ${dto.installmentId} not found`);
      const existing = await manager.findOne(Invoice, { where: { installmentId: dto.installmentId } });
      if (existing) throw new ConflictException('An invoice already exists for this installment');
      const booking = await manager.findOne(Sale, { where: { id: installment.bookingId } });
      if (!booking) throw new NotFoundException(`Booking with ID ${installment.bookingId} not found`);
      if (booking.status === SaleStatus.CANCELLED) throw new UnprocessableEntityException('Cancelled bookings cannot be invoiced');
      const tax = await this.taxService.calculate(TaxType.VAT, Number(installment.amount), dto.issueDate, 'output');
      const appliedTax = tax.accountCode ? tax.taxAmount : 0;
      const invoiceAmount = Number(installment.amount) + appliedTax;
      const invoice = manager.create(Invoice, {
        ...dto,
        bookingId: installment.bookingId,
        clientId: installment.clientId,
        amount: invoiceAmount,
        taxAmount: appliedTax,
        taxCode: tax.configurationId ? tax.type : null,
        paidAmount: installment.paidAmount,
        invoiceNo: `INV-${new Date().getFullYear()}-${String((await manager.count(Invoice)) + 1).padStart(4, '0')}`,
        status: installment.status === InstallmentStatus.PAID ? InvoiceStatus.PAID : InvoiceStatus.ISSUED,
      });
      const savedInvoice = await manager.save(invoice);
      const installmentAmount = Number(installment.amount);
      const parkingPrice = Math.max(Number(booking.parkingPrice ?? 0), 0);
      const bookingTotal = Math.max(Number(booking.totalPrice ?? 0), 0);
      const parkingRevenue = parkingPrice > 0 && bookingTotal > 0
        ? Math.min(installmentAmount, installmentAmount * parkingPrice / bookingTotal)
        : 0;
      const flatRevenue = installmentAmount - parkingRevenue;
      const receivableAccount = await this.accountingService.getMappedAccountCode('customer_receivable', '1131');
      const entries: LedgerEntry[] = [];
      if (flatRevenue > 0) {
        entries.push(manager.create(LedgerEntry, {
          referenceType: 'SALES_INVOICE',
          referenceId: savedInvoice.id,
          projectId: booking.projectId ?? null,
          debitAccountCode: receivableAccount,
          creditAccountCode: await this.accountingService.getMappedAccountCode('flat_sales_revenue', '4101'),
          amount: flatRevenue,
          postingDate: dto.issueDate,
        }));
      }
      if (parkingRevenue > 0) {
        entries.push(manager.create(LedgerEntry, {
          referenceType: 'SALES_INVOICE_PARKING',
          referenceId: savedInvoice.id,
          projectId: booking.projectId ?? null,
          debitAccountCode: receivableAccount,
          creditAccountCode: await this.accountingService.getMappedAccountCode('parking_sales_revenue', '4102'),
          amount: parkingRevenue,
          postingDate: dto.issueDate,
        }));
      }
      if (appliedTax > 0 && tax.accountCode) {
        entries.push(manager.create(LedgerEntry, {
          referenceType: 'SALES_VAT',
          referenceId: savedInvoice.id,
          debitAccountCode: await this.accountingService.getMappedAccountCode('customer_receivable', '1131'),
          creditAccountCode: tax.accountCode,
          amount: appliedTax,
          postingDate: dto.issueDate,
        }));
      }
      const bookingAdvanceEntries = await manager.find(LedgerEntry, {
        where: { referenceType: 'BOOKING_ADVANCE', referenceId: booking.id },
      });
      const bookingRefundEntries = await manager.find(LedgerEntry, {
        where: { referenceType: 'BOOKING_ADVANCE_REFUND', referenceId: booking.id },
      });
      const bookingAdvanceBalance = bookingAdvanceEntries.reduce((sum, entry) => sum + Number(entry.amount), 0)
        - bookingRefundEntries.reduce((sum, entry) => sum + Number(entry.amount), 0);
      const advanceToApply = Math.min(
        Math.max(bookingAdvanceBalance, 0),
        Math.max(installmentAmount - Number(installment.paidAmount || 0), 0),
      );
      if (advanceToApply > 0) {
        entries.push(manager.create(LedgerEntry, {
          referenceType: 'CUSTOMER_ADVANCE_ADJUSTMENT',
          referenceId: savedInvoice.id,
          projectId: booking.projectId ?? null,
          debitAccountCode: await this.accountingService.getMappedAccountCode('customer_advance', '2111'),
          creditAccountCode: receivableAccount,
          amount: advanceToApply,
          postingDate: dto.issueDate,
          description: `Booking advance applied to ${savedInvoice.invoiceNo}`,
        }));
        savedInvoice.paidAmount = Number(savedInvoice.paidAmount || 0) + advanceToApply;
        savedInvoice.status = savedInvoice.paidAmount >= invoiceAmount ? InvoiceStatus.PAID : InvoiceStatus.PARTIAL;
      }
      await manager.save(entries);
      return manager.save(savedInvoice);
    });
  }

  async findById(id: string): Promise<Sale> {
    const sale = await this.salesRepository.findOne({ where: { id } });
    if (!sale) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }
    return sale;
  }

  async findBySaleId(saleId: string): Promise<Sale | null> {
    return this.salesRepository.findOne({ where: { saleId } });
  }

  async findByClientId(clientId: string): Promise<Sale[]> {
    return this.salesRepository.find({ where: { clientId } });
  }

  async findByProjectId(projectId: string): Promise<Sale[]> {
    return this.salesRepository.find({ where: { projectId } });
  }

  async findByStatus(status: SaleStatus): Promise<Sale[]> {
    return this.salesRepository.find({ where: { status } });
  }

  async update(id: string, updateSaleDto: UpdateSaleDto): Promise<Sale> {
    const sale = await this.findById(id);
    Object.assign(sale, updateSaleDto);
    return this.salesRepository.save(sale);
  }

  async remove(id: string): Promise<void> {
    const sale = await this.findById(id);
    await this.salesRepository.remove(sale);
  }

  async searchSales(query: string): Promise<Sale[]> {
    return this.salesRepository
      .createQueryBuilder('sale')
      .where('sale.saleId LIKE :query', { query: `%${query}%` })
      .orWhere('sale.projectName LIKE :query', { query: `%${query}%` })
      .orWhere('sale.unitNo LIKE :query', { query: `%${query}%` })
      .getMany();
  }

  async updatePaymentStatus(id: string, amountPaid: number): Promise<Sale> {
    void id;
    void amountPaid;
    throw new UnprocessableEntityException('Direct payment status updates are disabled; record a collection with its payment method');
  }

  private async syncClientFinance(manager: import('typeorm').EntityManager, clientId: string) {
    const client = await manager.findOne(Client, { where: { id: clientId } });
    if (!client) return;
    const sales = await manager.find(Sale, { where: { clientId } });
    const totalPrice = sales.reduce((sum, sale) => sum + Number(sale.totalPrice || 0), 0);
    const totalPaid = sales.reduce((sum, sale) => sum + Number(sale.amountPaid || 0), 0);
    client.totalPrice = totalPrice;
    client.totalPaid = totalPaid;
    client.dueAmount = Math.max(totalPrice - totalPaid, 0);
    client.status = ClientStatus.ACTIVE;
    client.paymentStatus = client.dueAmount <= 0 ? PaymentStatus.UP_TO_DATE : PaymentStatus.PENDING;
    await manager.save(client);
  }
}
