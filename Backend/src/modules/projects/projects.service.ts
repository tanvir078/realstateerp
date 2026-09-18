import { ConflictException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { unlink } from 'node:fs/promises';
import { join } from 'node:path';
import { CreateProjectDto } from './dtos/create-project.dto';
import { CreateUnitDto } from './dtos/create-unit.dto';
import { UpdateProjectDto } from './dtos/update-project.dto';
import { Project } from './entities/project.entity';
import { Unit, UnitOwnership, UnitStatus, UnitType } from './entities/unit.entity';
import { ProjectMilestone } from './entities/project-milestone.entity';
import { ProjectDocument } from './entities/project-document.entity';
import { ProjectPhoto } from './entities/project-photo.entity';
import { LandParcel, LandParcelStatus } from './entities/land-parcel.entity';
import { UtilityBill } from './entities/utility-bill.entity';
import { UtilityConnection, UtilityType } from './entities/utility-connection.entity';
import { PayableLedgerEntry } from '../procurement/entities/payable-ledger.entity';
import { AccountingPeriodService } from '../accounting/period.service';
import { Sale, SaleStatus } from '../sales/entities/sale.entity';
import { VendorBill } from '../procurement/entities/vendor-bill.entity';
import { RABill } from '../construction/entities/construction-workflow.entity';
import { Building } from './entities/building.entity';
import { CreateBuildingDto } from './dtos/create-building.dto';
import { AccountingService } from '../accounting/accounting.service';
import { Account, AccountStatus, AccountType } from '../accounting/entities/account.entity';
import { ProjectStorageService } from './project-storage.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private readonly projectsRepository: Repository<Project>,
    @InjectRepository(Building) private readonly buildingsRepository: Repository<Building>,
    @InjectRepository(Unit) private readonly unitsRepository: Repository<Unit>,
    @InjectRepository(ProjectMilestone) private readonly milestonesRepository: Repository<ProjectMilestone>,
    @InjectRepository(ProjectDocument) private readonly documentsRepository: Repository<ProjectDocument>,
    @InjectRepository(ProjectPhoto) private readonly photosRepository: Repository<ProjectPhoto>,
    @InjectRepository(LandParcel) private readonly landParcelsRepository: Repository<LandParcel>,
    @InjectRepository(UtilityConnection) private readonly utilitiesRepository: Repository<UtilityConnection>,
    @InjectRepository(UtilityBill) private readonly utilityBillsRepository: Repository<UtilityBill>,
    @InjectRepository(Sale) private readonly salesRepository: Repository<Sale>,
    @InjectRepository(VendorBill) private readonly vendorBillsRepository: Repository<VendorBill>,
    @InjectRepository(PayableLedgerEntry) private readonly payableLedgerRepository: Repository<PayableLedgerEntry>,
    @InjectRepository(RABill) private readonly raBillsRepository: Repository<RABill>,
    private readonly dataSource: DataSource,
    private readonly periodService: AccountingPeriodService,
    private readonly accountingService: AccountingService,
    private readonly projectStorage: ProjectStorageService,
  ) {}

  async findProjects() {
    return this.projectsRepository.find({ relations: { units: true }, order: { projectCode: 'ASC' } });
  }

  async findProjectOptions() {
    return this.projectsRepository.find({
      select: { id: true, projectCode: true, projectName: true, status: true },
      order: { projectCode: 'ASC' },
    });
  }

  async createProject(dto: CreateProjectDto) {
    if (dto.developerRatio + dto.landownerRatio !== 100) {
      throw new UnprocessableEntityException('Developer and landowner ratios must total 100%');
    }

    return this.dataSource.transaction(async (manager) => {
      const projectCode = await this.nextProjectCode();
      const project = manager.create(Project, { ...dto, projectCode, wipAccountId: null });
      const savedProject = await manager.save(project);
      const parent = await manager.findOne(Account, { where: { code: '1120', status: AccountStatus.ACTIVE } });
      if (!parent || parent.type !== AccountType.ASSET || !parent.isHeader) {
        throw new UnprocessableEntityException('WIP / Inventory account group 1120 is not configured');
      }
      const existingProjectAccount = await manager.findOne(Account, {
        where: { name: `WIP - ${savedProject.projectName}`, parentId: parent.id, status: AccountStatus.ACTIVE },
      });
      const account = existingProjectAccount ?? manager.create(Account, {
        code: await this.nextProjectWipAccountCode(manager),
        name: `WIP - ${savedProject.projectName}`,
        type: AccountType.ASSET,
        isHeader: false,
        isPostable: true,
        parentId: parent.id,
        status: AccountStatus.ACTIVE,
        openingBalance: '0',
      });
      const savedAccount = await manager.save(account);
      savedProject.wipAccountId = savedAccount.id;
      return manager.save(savedProject);
    });
  }

  private async nextProjectWipAccountCode(manager: import('typeorm').EntityManager): Promise<string> {
    const accounts = await manager
      .createQueryBuilder(Account, 'account')
      .where('account.code ~ :numericCode', { numericCode: '^[0-9]+$' })
      .andWhere('CAST(account.code AS integer) BETWEEN :min AND :max', { min: 1126, max: 1199 })
      .orderBy('CAST(account.code AS integer)', 'DESC')
      .getMany();
    const nextCode = (Number(accounts[0]?.code ?? '1125') + 1);
    if (nextCode > 1199) throw new UnprocessableEntityException('No available project WIP account code remains in 1126-1199');
    return String(nextCode);
  }

  async updateProject(id: string, dto: UpdateProjectDto) {
    const project = await this.findProject(id);
    if (dto.developerRatio !== undefined || dto.landownerRatio !== undefined) {
      const developerRatio = dto.developerRatio ?? Number(project.developerRatio);
      const landownerRatio = dto.landownerRatio ?? Number(project.landownerRatio);
      if (developerRatio + landownerRatio !== 100) {
        throw new UnprocessableEntityException('Developer and landowner ratios must total 100%');
      }
    }
    return this.dataSource.transaction(async (manager) => {
      const previousName = project.projectName;
      Object.assign(project, dto);
      const savedProject = await manager.save(project);
      if (dto.projectName && dto.projectName !== previousName && savedProject.wipAccountId) {
        const wipAccount = await manager.findOne(Account, { where: { id: savedProject.wipAccountId } });
        if (wipAccount && wipAccount.status === AccountStatus.ACTIVE) {
          wipAccount.name = `WIP - ${dto.projectName}`;
          await manager.save(wipAccount);
        }
      }
      return savedProject;
    });
  }

  async deleteProject(id: string) {
    const project = await this.findProject(id);
    if (project.units?.length) throw new ConflictException('Project with units cannot be deleted');
    await this.projectsRepository.remove(project);
    return { deleted: true, id };
  }

  async findProject(id: string) {
    const project = await this.projectsRepository.findOne({ where: { id }, relations: { units: true } });
    if (!project) throw new NotFoundException(`Project with ID ${id} not found`);
    return project;
  }

  async getFinancialSummary(projectId: string) {
    const project = await this.findProject(projectId);
    const sales = await this.salesRepository.find({ where: { projectId } });
    const vendorBills = await this.vendorBillsRepository.find({ where: { projectId } });
    const raBills = await this.raBillsRepository.find({ where: { projectId } });
    const activeSales = sales.filter((sale) => sale.status !== SaleStatus.CANCELLED);
    const revenue = activeSales.reduce((sum, sale) => sum + Number(sale.totalPrice || 0), 0);
    const collected = activeSales.reduce((sum, sale) => sum + Number(sale.amountPaid || 0), 0);
    const receivable = Math.max(revenue - collected, 0);
    const vendorCost = vendorBills.reduce((sum, bill) => sum + Number(bill.amount || 0), 0);
    const paidVendorCost = vendorBills.reduce((sum, bill) => sum + Number(bill.paidAmount || 0), 0);
    const postedConstructionCost = raBills
      .filter((bill) => ['POSTED', 'PARTIAL', 'PAID'].includes(bill.status))
      .reduce((sum, bill) => sum + Number(bill.amount || 0) - Number(bill.retentionAmount || 0), 0);
    const totalCost = vendorCost + postedConstructionCost;

    return {
      projectId,
      projectName: project.projectName,
      revenue,
      collected,
      receivable,
      vendorCost,
      paidVendorCost,
      postedConstructionCost,
      totalCost,
      grossProfit: revenue - totalCost,
      marginPercent: revenue > 0 ? ((revenue - totalCost) / revenue) * 100 : 0,
      salesCount: activeSales.length,
      units: {
        total: project.units?.length ?? 0,
        available: project.units?.filter((unit) => unit.status === UnitStatus.AVAILABLE).length ?? 0,
        booked: project.units?.filter((unit) => unit.status === UnitStatus.BOOKED).length ?? 0,
        sold: project.units?.filter((unit) => unit.status === UnitStatus.SOLD).length ?? 0,
      },
    };
  }

  async findUnits(projectId?: string) {
    return this.unitsRepository.find({
      where: projectId ? { projectId } : {},
      relations: { project: true, building: true },
      order: { unitCode: 'ASC' },
    });
  }

  async findBuildings(projectId?: string) {
    return this.buildingsRepository.find({
      where: projectId ? { projectId } : {},
      relations: { project: true, units: true },
      order: { buildingCode: 'ASC' },
    });
  }

  async createBuilding(dto: CreateBuildingDto) {
    await this.findProject(dto.projectId);
    const duplicate = await this.buildingsRepository.findOne({ where: { projectId: dto.projectId, buildingCode: dto.buildingCode } });
    if (duplicate) throw new ConflictException(`Building ${dto.buildingCode} already exists in this project`);
    return this.buildingsRepository.save(this.buildingsRepository.create({
      ...dto,
      totalFloors: dto.totalFloors ?? 0,
      status: dto.status ?? 'ACTIVE',
    }));
  }

  async updateBuilding(id: string, dto: Partial<CreateBuildingDto>) {
    const building = await this.buildingsRepository.findOne({ where: { id } });
    if (!building) throw new NotFoundException(`Building with ID ${id} not found`);
    if (dto.projectId && dto.projectId !== building.projectId) await this.findProject(dto.projectId);
    Object.assign(building, dto);
    return this.buildingsRepository.save(building);
  }

  async deleteBuilding(id: string) {
    const building = await this.buildingsRepository.findOne({ where: { id }, relations: { units: true } });
    if (!building) throw new NotFoundException(`Building with ID ${id} not found`);
    if (building.units?.length) throw new ConflictException('Building with units cannot be deleted');
    await this.buildingsRepository.remove(building);
    return { deleted: true, id };
  }

  async findAvailableParking(projectId: string) {
    await this.findProject(projectId);
    return this.unitsRepository.find({
      where: { projectId, unitType: UnitType.PARKING, status: UnitStatus.AVAILABLE },
      relations: { project: true },
      order: { unitCode: 'ASC' },
    });
  }

  async createUnit(dto: CreateUnitDto) {
    await this.findProject(dto.projectId);
    const duplicate = await this.unitsRepository.findOne({ where: { projectId: dto.projectId, unitCode: dto.unitCode } });
    if (duplicate) throw new ConflictException(`Unit ${dto.unitCode} already exists in this project`);
    const utilityCharges = dto.utilityCharges ?? 0;
    const totalPrice = dto.price !== undefined
      ? dto.price + utilityCharges
      : dto.size * dto.basePricePerSft + utilityCharges;
    const unitData = { ...dto };
    delete unitData.price;
    return this.unitsRepository.save(this.unitsRepository.create({
      ...unitData,
      utilityCharges,
      ownership: dto.ownership || UnitOwnership.DEVELOPER_SHARE,
      status: dto.status || UnitStatus.AVAILABLE,
      totalPrice,
    }));
  }

  async bulkCreateUnits(dto: { projectId: string; fromFloor: number; toFloor: number; unitsPerFloor: number; defaultSize: number; defaultPricePerSft: number; defaultParkingPrice: number; defaultUtilityCharges: number; defaultOwnership?: string; defaultStatus?: string }) {
    await this.findProject(dto.projectId);
    if (dto.fromFloor > dto.toFloor || dto.unitsPerFloor < 1) throw new UnprocessableEntityException('Invalid floor range or units per floor');
    const created: Unit[] = [];
    for (let floor = dto.fromFloor; floor <= dto.toFloor; floor += 1) {
      for (let index = 0; index < dto.unitsPerFloor; index += 1) {
        const unitCode = `${floor === 0 ? 'G' : floor}-${String.fromCharCode(65 + index)}`;
        const exists = await this.unitsRepository.findOne({ where: { projectId: dto.projectId, unitCode } });
        if (exists) continue;
        created.push(this.unitsRepository.create({
          projectId: dto.projectId,
          unitCode,
          floorLevel: floor === 0 ? 'Ground Floor' : `${floor}th Floor`,
          unitType: UnitType.APARTMENT,
          size: dto.defaultSize,
          facing: 'NORTH',
          bedrooms: 0,
          bathrooms: 0,
          basePricePerSft: dto.defaultPricePerSft,
          parkingPrice: dto.defaultParkingPrice,
          utilityCharges: dto.defaultUtilityCharges,
          totalPrice: dto.defaultSize * dto.defaultPricePerSft + dto.defaultParkingPrice + dto.defaultUtilityCharges,
          ownership: (dto.defaultOwnership as UnitOwnership) || UnitOwnership.DEVELOPER_SHARE,
          status: (dto.defaultStatus as UnitStatus) || UnitStatus.AVAILABLE,
        }));
      }
    }
    return this.unitsRepository.save(created);
  }

  async findMilestones(projectId: string) {
    await this.findProject(projectId);
    return this.milestonesRepository.find({ where: { projectId }, order: { targetDate: 'ASC' } });
  }

  async createMilestone(projectId: string, dto: { title: string; targetDate: string; progress?: number; status?: string; notes?: string }) {
    await this.findProject(projectId);
    return this.milestonesRepository.save(this.milestonesRepository.create({ ...dto, projectId, progress: dto.progress ?? 0, status: dto.status ?? 'PENDING' }));
  }

  async updateMilestone(id: string, dto: Partial<ProjectMilestone>) {
    const milestone = await this.milestonesRepository.findOne({ where: { id } });
    if (!milestone) throw new NotFoundException(`Milestone with ID ${id} not found`);
    Object.assign(milestone, dto);
    return this.milestonesRepository.save(milestone);
  }

  async findDocuments(projectId: string) {
    await this.findProject(projectId);
    return this.documentsRepository.find({ where: { projectId }, order: { createdAt: 'DESC' } });
  }

  async createDocument(projectId: string, dto: { title: string; documentType: string; fileUrl: string }) {
    await this.findProject(projectId);
    return this.documentsRepository.save(this.documentsRepository.create({ ...dto, projectId }));
  }

  async findDocument(projectId: string, documentId: string) {
    const document = await this.documentsRepository.findOne({ where: { id: documentId, projectId } });
    if (!document) throw new NotFoundException('Project document not found');
    return document;
  }

  async deleteDocument(projectId: string, documentId: string) {
    const document = await this.findDocument(projectId, documentId);
    await this.projectStorage.delete(document.fileUrl);
    await this.documentsRepository.remove(document);
    return { deleted: true, id: documentId };
  }

  async findPhotos(projectId: string) {
    await this.findProject(projectId);
    return this.photosRepository.find({ where: { projectId }, order: { createdAt: 'DESC' } });
  }

  async findPhoto(projectId: string, photoId: string) {
    const photo = await this.photosRepository.findOne({ where: { id: photoId, projectId } });
    if (!photo) throw new NotFoundException('Project photo not found');
    return photo;
  }

  async createPhoto(projectId: string, dto: { title: string; fileUrl: string; fileType: string }) {
    await this.findProject(projectId);
    return this.photosRepository.save(this.photosRepository.create({ ...dto, projectId }));
  }

  async deletePhoto(projectId: string, photoId: string) {
    const photo = await this.findPhoto(projectId, photoId);
    await this.projectStorage.delete(photo.fileUrl);
    await this.photosRepository.remove(photo);
    return { deleted: true, id: photoId };
  }

  async findLandParcels() {
    return this.landParcelsRepository.find({ relations: { project: true }, order: { parcelCode: 'ASC' } });
  }

  async createLandParcel(dto: Partial<LandParcel>) {
    if (!dto.parcelCode || !dto.ownerName || !dto.location || !dto.area) {
      throw new UnprocessableEntityException('Parcel code, owner, location and area are required');
    }
    const existing = await this.landParcelsRepository.findOne({ where: { parcelCode: dto.parcelCode } });
    if (existing) throw new ConflictException('Parcel code already exists');
    if (dto.projectId) await this.findProject(dto.projectId);
    return this.landParcelsRepository.save(this.landParcelsRepository.create({
      ...dto,
      acquisitionCost: dto.acquisitionCost ?? 0,
      status: dto.status ?? LandParcelStatus.AVAILABLE,
    }));
  }

  async updateLandParcel(id: string, dto: Partial<LandParcel>) {
    const parcel = await this.landParcelsRepository.findOne({ where: { id } });
    if (!parcel) throw new NotFoundException(`Land parcel with ID ${id} not found`);
    if (dto.projectId) await this.findProject(dto.projectId);
    Object.assign(parcel, dto);
    return this.landParcelsRepository.save(parcel);
  }

  async findUtilities(projectId?: string) {
    return this.utilitiesRepository.find({
      where: projectId ? { projectId } : {},
      relations: { project: true, unit: true },
      order: { createdAt: 'DESC' },
    });
  }

  async createUtility(dto: Partial<UtilityConnection>) {
    if (!dto.projectId || !dto.utilityType || !dto.connectionCode || !dto.meterNumber) {
      throw new UnprocessableEntityException('Project, utility type, connection code and meter number are required');
    }
    await this.findProject(dto.projectId);
    if (dto.unitId) {
      const unit = await this.unitsRepository.findOne({ where: { id: dto.unitId, projectId: dto.projectId } });
      if (!unit) throw new UnprocessableEntityException('Unit does not belong to the selected project');
    }
    return this.utilitiesRepository.save(this.utilitiesRepository.create({
      ...dto,
      utilityType: dto.utilityType as UtilityType,
      monthlyRate: dto.monthlyRate ?? 0,
      status: dto.status ?? 'ACTIVE',
    }));
  }

  async createUtilityBill(dto: Partial<UtilityBill>) {
    if (!dto.connectionId || !dto.billingMonth || dto.amount === undefined) {
      throw new UnprocessableEntityException('Connection, billing month and amount are required');
    }
    const amount = Number(dto.amount);
    if (!Number.isFinite(amount) || amount <= 0) throw new UnprocessableEntityException('Bill amount must be positive');
    const billingMonth = this.normalizeBillingMonth(String(dto.billingMonth));
    await this.periodService.ensureOpen(billingMonth);

    return this.dataSource.transaction(async (manager) => {
      const connection = await manager.findOne(UtilityConnection, { where: { id: dto.connectionId } });
      if (!connection) throw new NotFoundException(`Utility connection with ID ${dto.connectionId} not found`);
      const duplicate = await manager.findOne(UtilityBill, { where: { connectionId: connection.id, billingMonth } });
      if (duplicate) throw new ConflictException('A utility bill already exists for this connection and billing month');

      const paidAmount = Number(dto.paidAmount ?? 0);
      if (!Number.isFinite(paidAmount) || paidAmount < 0 || paidAmount > amount) {
        throw new UnprocessableEntityException('Paid amount must be between zero and the bill amount');
      }
      const bill = manager.create(UtilityBill, {
        ...dto,
        billingMonth,
        amount,
        paidAmount,
        status: paidAmount >= amount ? 'PAID' : paidAmount > 0 ? 'PARTIALLY_PAID' : 'DUE',
      });
      const savedBill = await manager.save(bill);
      const project = await manager.findOne(Project, { where: { id: connection.projectId } });
      if (!project) throw new NotFoundException('Utility connection project not found');
      const wipAccount = await this.accountingService.resolveProjectWipAccount(project.wipAccountId);
      const vendorPayable = await this.accountingService.getMappedAccountCode('vendor_payable', '2100');
      const ledger = manager.create(PayableLedgerEntry, {
        referenceType: 'UTILITY_BILL',
        referenceId: savedBill.id,
        projectId: connection.projectId,
        debitAccountCode: wipAccount,
        creditAccountCode: vendorPayable,
        amount,
        postingDate: billingMonth,
      });
      await manager.save(ledger);
      if (paidAmount > 0) {
        const paymentAccount = await this.accountingService.resolvePaymentAccount(
          typeof (dto as Partial<UtilityBill> & { paymentMethod?: string }).paymentMethod === 'string'
            ? (dto as Partial<UtilityBill> & { paymentMethod?: string }).paymentMethod
            : 'bank',
          typeof (dto as Partial<UtilityBill> & { accountCode?: string }).accountCode === 'string'
            ? (dto as Partial<UtilityBill> & { accountCode?: string }).accountCode
            : undefined,
        );
        await manager.save(manager.create(PayableLedgerEntry, {
          referenceType: 'UTILITY_PAYMENT',
          referenceId: savedBill.id,
          projectId: connection.projectId,
          debitAccountCode: vendorPayable,
          creditAccountCode: paymentAccount,
          amount: paidAmount,
          postingDate: billingMonth,
        }));
      }
      return { bill: savedBill, ledger };
    });
  }

  async findUtilityBills() {
    return this.utilityBillsRepository.find({ relations: { connection: true }, order: { billingMonth: 'DESC' } });
  }

  async payUtilityBill(id: string, amount: number, paymentDate = new Date().toISOString().slice(0, 10)) {
    if (!Number.isFinite(amount) || amount <= 0) throw new UnprocessableEntityException('Payment amount must be positive');
    await this.periodService.ensureOpen(paymentDate);
    return this.dataSource.transaction(async (manager) => {
      const bill = await manager.findOne(UtilityBill, { where: { id } });
      if (!bill) throw new NotFoundException(`Utility bill with ID ${id} not found`);
      const connection = await manager.findOne(UtilityConnection, { where: { id: bill.connectionId } });
      if (!connection) throw new NotFoundException('Utility connection not found');
      const due = Number(bill.amount) - Number(bill.paidAmount);
      if (due <= 0) throw new UnprocessableEntityException('Utility bill is already fully paid');
      if (amount > due) throw new UnprocessableEntityException('Payment exceeds utility bill balance');
      bill.paidAmount = Number(bill.paidAmount) + amount;
      bill.status = bill.paidAmount >= Number(bill.amount) ? 'PAID' : 'PARTIALLY_PAID';
      const vendorPayable = await this.accountingService.getMappedAccountCode('vendor_payable', '2100');
      const paymentAccount = await this.accountingService.resolvePaymentAccount('bank');
      const ledger = manager.create(PayableLedgerEntry, {
        referenceType: 'UTILITY_PAYMENT',
        referenceId: bill.id,
        projectId: connection.projectId,
        debitAccountCode: vendorPayable,
        creditAccountCode: paymentAccount,
        amount,
        postingDate: paymentDate,
      });
      const savedBill = await manager.save(bill);
      await manager.save(ledger);
      return { bill: savedBill, ledger };
    });
  }

  private normalizeBillingMonth(value: string) {
    const normalized = /^\d{4}-\d{2}$/.test(value) ? `${value}-01` : value;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized) || Number.isNaN(Date.parse(normalized))) {
      throw new UnprocessableEntityException('Billing month must be a valid date');
    }
    return normalized;
  }

  async updateUnit(id: string, dto: Partial<CreateUnitDto>) {
    const unit = await this.unitsRepository.findOne({ where: { id } });
    if (!unit) throw new NotFoundException(`Unit with ID ${id} not found`);
    if (dto.projectId && dto.projectId !== unit.projectId) await this.findProject(dto.projectId);
    if (dto.unitCode && (dto.unitCode !== unit.unitCode || dto.projectId)) {
      const duplicate = await this.unitsRepository.findOne({ where: { projectId: dto.projectId ?? unit.projectId, unitCode: dto.unitCode } });
      if (duplicate && duplicate.id !== id) throw new ConflictException(`Unit ${dto.unitCode} already exists in this project`);
    }
    const { price, ...unitData } = dto;
    Object.assign(unit, unitData);
    if (price !== undefined) {
      unit.totalPrice = price + (dto.utilityCharges ?? Number(unit.utilityCharges) ?? 0);
      return this.unitsRepository.save(unit);
    }
    const size = dto.size ?? Number(unit.size);
    const basePricePerSft = dto.basePricePerSft ?? Number(unit.basePricePerSft);
    const parkingPrice = dto.parkingPrice ?? Number(unit.parkingPrice);
    const utilityCharges = dto.utilityCharges ?? Number(unit.utilityCharges);
    unit.totalPrice = size * basePricePerSft + parkingPrice + utilityCharges;
    return this.unitsRepository.save(unit);
  }

  async deleteUnit(id: string) {
    const unit = await this.unitsRepository.findOne({ where: { id } });
    if (!unit) throw new NotFoundException(`Unit with ID ${id} not found`);
    if (unit.status !== UnitStatus.AVAILABLE) throw new ConflictException('Only available units can be deleted');
    await this.unitsRepository.remove(unit);
    return { deleted: true, id };
  }

  private async nextProjectCode() {
    const year = new Date().getFullYear();
    const count = await this.projectsRepository.count();
    return `PRJ-${year}-${String(count + 1).padStart(3, '0')}`;
  }
}