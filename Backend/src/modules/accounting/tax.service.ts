import { ConflictException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Repository } from 'typeorm';
import { CreateTaxConfigurationDto } from './dtos/tax-configuration.dto';
import { TaxConfiguration, TaxType } from './entities/tax-configuration.entity';
import { LedgerEntry } from '../sales/entities/ledger-entry.entity';
import { PayrollLedgerEntry } from '../hr/entities/payroll-ledger.entity';
import { PayableLedgerEntry } from '../procurement/entities/payable-ledger.entity';
import { ConstructionLedgerEntry } from '../construction/entities/construction-ledger.entity';

@Injectable()
export class TaxService {
  constructor(
    @InjectRepository(TaxConfiguration) private readonly repository: Repository<TaxConfiguration>,
    @InjectRepository(LedgerEntry) private readonly salesLedger: Repository<LedgerEntry>,
    @InjectRepository(PayrollLedgerEntry) private readonly payrollLedger: Repository<PayrollLedgerEntry>,
    @InjectRepository(PayableLedgerEntry) private readonly payableLedger: Repository<PayableLedgerEntry>,
    @InjectRepository(ConstructionLedgerEntry) private readonly constructionLedger: Repository<ConstructionLedgerEntry>,
  ) {}

  list() {
    return this.repository.find({ order: { type: 'ASC', effectiveFrom: 'DESC' } });
  }

  async create(dto: CreateTaxConfigurationDto) {
    if (dto.effectiveTo && dto.effectiveTo < dto.effectiveFrom) {
      throw new UnprocessableEntityException('Tax effective end cannot be before its start');
    }
    const duplicate = await this.repository.findOne({ where: { code: dto.code.trim().toUpperCase() } });
    if (duplicate) throw new ConflictException('Tax code already exists');
    return this.repository.save(this.repository.create({ ...dto, code: dto.code.trim().toUpperCase(), enabled: dto.enabled ?? true }));
  }

  async update(id: string, dto: Partial<CreateTaxConfigurationDto>) {
    const tax = await this.repository.findOne({ where: { id } });
    if (!tax) throw new NotFoundException('Tax configuration not found');
    if (dto.code && dto.code.trim().toUpperCase() !== tax.code) {
      const duplicate = await this.repository.findOne({ where: { code: dto.code.trim().toUpperCase() } });
      if (duplicate) throw new ConflictException('Tax code already exists');
    }
    Object.assign(tax, dto, dto.code ? { code: dto.code.trim().toUpperCase() } : {});
    return this.repository.save(tax);
  }

  async calculate(type: TaxType, baseAmount: number, date: string, accountRole: 'output' | 'input' = 'output') {
    if (!Number.isFinite(baseAmount) || baseAmount < 0) throw new UnprocessableEntityException('Tax base amount must be zero or positive');
    const tax = await this.repository.createQueryBuilder('tax')
      .where('tax.type = :type', { type })
      .andWhere('tax.enabled = true')
      .andWhere('tax."effectiveFrom" <= :date', { date })
      .andWhere('(tax."effectiveTo" IS NULL OR tax."effectiveTo" >= :date)', { date })
      .orderBy('tax."effectiveFrom"', 'DESC')
      .getOne();
    if (!tax) return { type, baseAmount, ratePercent: 0, taxAmount: 0, configurationId: null };
    return {
      type,
      baseAmount,
      ratePercent: Number(tax.ratePercent),
      taxAmount: Math.round(baseAmount * Number(tax.ratePercent) / 100 * 100) / 100,
      configurationId: tax.id,
      accountCode: type === TaxType.VAT
        ? accountRole === 'input' ? tax.inputAccountCode ?? tax.outputAccountCode : tax.outputAccountCode ?? tax.inputAccountCode
        : tax.withholdingAccountCode,
    };
  }

  async report(fromDate: string, toDate: string) {
    if (!fromDate || !toDate || fromDate > toDate) {
      throw new UnprocessableEntityException('Tax report dates must be valid and ordered');
    }
    const referenceTypes = In(['SALES_VAT', 'PURCHASE_VAT', 'PURCHASE_TDS', 'PAYROLL_TDS']);
    const dateRange = Between(fromDate, toDate);
    const entries = (await Promise.all([
      this.salesLedger.find({ where: { referenceType: referenceTypes, postingDate: dateRange } }),
      this.payrollLedger.find({ where: { referenceType: referenceTypes, postingDate: dateRange } }),
      this.payableLedger.find({ where: { referenceType: referenceTypes, postingDate: dateRange } }),
      this.constructionLedger.find({ where: { referenceType: referenceTypes, postingDate: dateRange } }),
    ])).flat();
    const totals = entries.reduce((result, entry) => {
      const amount = Number(entry.amount);
      result[entry.referenceType] = (result[entry.referenceType] ?? 0) + amount;
      return result;
    }, {} as Record<string, number>);
    const outputVat = totals.SALES_VAT ?? 0;
    const inputVat = totals.PURCHASE_VAT ?? 0;
    const tds = (totals.PURCHASE_TDS ?? 0) + (totals.PAYROLL_TDS ?? 0);
    return {
      fromDate,
      toDate,
      outputVat,
      inputVat,
      netVat: outputVat - inputVat,
      tds,
      totals,
      entryCount: entries.length,
    };
  }
}
