import { MigrationInterface, QueryRunner } from 'typeorm';

export class ImplementRealEstateChartOfAccounts1789053000000 implements MigrationInterface {
  name = 'ImplementRealEstateChartOfAccounts1789053000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const legacyToNew: Record<string, string> = {
      '1100': '1111',
      '1101': '1114',
      '1200': '1131',
      '1201': '1131',
      '1300': '1122',
      '2000': '2121',
      '2100': '2133',
      '2110': '2122',
      '2200': '2133',
      '2210': '2132',
      '2400': '2223',
      '3120': '3103',
      '4000': '4101',
      '4100': '4102',
      '5000': '5212',
      '5100': '1122',
      '5200': '5231',
      '6100': '5212',
      'SB-1200': '1126',
    };

    for (const [oldCode, newCode] of Object.entries(legacyToNew)) {
      const updates = [
        ['ledger_entries', 'debitAccountCode'],
        ['ledger_entries', 'creditAccountCode'],
        ['payroll_ledger_entries', 'debitAccountCode'],
        ['payroll_ledger_entries', 'creditAccountCode'],
        ['payable_ledger_entries', 'debitAccountCode'],
        ['payable_ledger_entries', 'creditAccountCode'],
        ['construction_ledger_entries', 'debitAccountCode'],
        ['construction_ledger_entries', 'creditAccountCode'],
        ['account_mappings', 'accountCode'],
      ];
      for (const [table, column] of updates) {
        await queryRunner.query(`UPDATE "${table}" SET "${column}" = $1 WHERE "${column}" = $2`, [newCode, oldCode]);
      }
    }

    const oldAccounts = await queryRunner.query(
      `SELECT "code", "openingBalance" FROM "accounts" WHERE "code" = ANY($1::varchar[])`,
      [Object.keys(legacyToNew)],
    );
    const openingByCode = new Map<string, number>();
    for (const account of oldAccounts) {
      const target = legacyToNew[account.code];
      openingByCode.set(target, (openingByCode.get(target) ?? 0) + Number(account.openingBalance));
    }

    for (const oldCode of Object.keys(legacyToNew)) {
      await queryRunner.query(`UPDATE "accounts" SET "code" = $1, "status" = 'INACTIVE', "isPostable" = false WHERE "code" = $2`, [
        `LEGACY-${oldCode}`,
        oldCode,
      ]);
    }

    const accounts = [
      ['1000', 'Assets', 'ASSET', true, false, null],
      ['1100', 'Current Assets', 'ASSET', true, false, '1000'],
      ['1110', 'Cash & Cash Equivalents', 'ASSET', true, false, '1100'],
      ['1111', 'Cash in Hand - Head Office', 'ASSET', false, true, '1110'],
      ['1112', 'Petty Cash - Project Site 01', 'ASSET', false, true, '1110'],
      ['1114', 'Bank Account - Head Office / Project', 'ASSET', false, true, '1110'],
      ['1115', 'Cheques in Transit', 'ASSET', false, true, '1110'],
      ['1120', 'WIP / Inventory', 'ASSET', true, false, '1100'],
      ['1121', 'WIP - Land Cost', 'ASSET', false, true, '1120'],
      ['1122', 'WIP - Construction Materials', 'ASSET', false, true, '1120'],
      ['1123', 'WIP - Labour & Subcontractor', 'ASSET', false, true, '1120'],
      ['1124', 'WIP - Legal & Utility Fees', 'ASSET', false, true, '1120'],
      ['1125', 'WIP - Project Overhead', 'ASSET', false, true, '1120'],
      ['1126', 'WIP - SB Sahabuddin Tower', 'ASSET', false, true, '1120'],
      ['1130', 'Accounts Receivable', 'ASSET', true, false, '1100'],
      ['1131', 'Receivable from Flat Buyers', 'ASSET', false, true, '1130'],
      ['1140', 'Advances & Prepayments', 'ASSET', true, false, '1100'],
      ['1141', 'Advance to Suppliers', 'ASSET', false, true, '1140'],
      ['1142', 'Advance Against Land Procurement', 'ASSET', false, true, '1140'],
      ['1200', 'Non-Current Assets', 'ASSET', true, false, '1000'],
      ['1210', 'Property, Plant & Equipment', 'ASSET', true, false, '1200'],
      ['1211', 'Construction Machinery', 'ASSET', false, true, '1210'],
      ['1212', 'Office Equipment & IT Assets', 'ASSET', false, true, '1210'],
      ['1213', 'Office Furniture & Fixtures', 'ASSET', false, true, '1210'],
      ['1214', 'Accumulated Depreciation', 'ASSET', false, true, '1210'],
      ['2000', 'Liabilities', 'LIABILITY', true, false, null],
      ['2100', 'Current Liabilities', 'LIABILITY', true, false, '2000'],
      ['2110', 'Customer Advances', 'LIABILITY', true, false, '2100'],
      ['2111', 'Advance Booking & Installments', 'LIABILITY', false, true, '2110'],
      ['2120', 'Trade Payables', 'LIABILITY', true, false, '2100'],
      ['2121', 'Accounts Payable - Suppliers', 'LIABILITY', false, true, '2120'],
      ['2122', 'Accounts Payable - Subcontractors', 'LIABILITY', false, true, '2120'],
      ['2130', 'Accrued & Statutory Liabilities', 'LIABILITY', true, false, '2100'],
      ['2131', 'Accrued Site Expenses', 'LIABILITY', false, true, '2130'],
      ['2132', 'VAT / TDS Payable', 'LIABILITY', false, true, '2130'],
      ['2133', 'Salary Payable', 'LIABILITY', false, true, '2130'],
      ['2200', 'Non-Current Liabilities', 'LIABILITY', true, false, '2000'],
      ['2210', 'Long-Term Borrowings', 'LIABILITY', true, false, '2200'],
      ['2211', 'Project Term Loan', 'LIABILITY', false, true, '2210'],
      ['2220', 'Joint Venture Liabilities', 'LIABILITY', true, false, '2200'],
      ['2221', "Landowner's Signing Money Payable", 'LIABILITY', false, true, '2220'],
      ['2222', 'Plot Agreement Money Payable', 'LIABILITY', false, true, '2220'],
      ['2223', 'Investor Payable', 'LIABILITY', false, true, '2220'],
      ['2230', "Directors' Loan Payable", 'LIABILITY', false, true, '2200'],
      ['3000', 'Equity', 'EQUITY', true, false, null],
      ['3100', "Shareholders' Equity", 'EQUITY', true, false, '3000'],
      ['3101', 'Paid-up Capital', 'EQUITY', false, true, '3100'],
      ['3102', "Directors' Capital Contribution", 'EQUITY', false, true, '3100'],
      ['3103', 'Investor Capital', 'EQUITY', false, true, '3100'],
      ['3104', 'Retained Earnings', 'EQUITY', false, true, '3100'],
      ['4000', 'Revenue', 'REVENUE', true, false, null],
      ['4100', 'Core Operational Income', 'REVENUE', true, false, '4000'],
      ['4101', 'Flat Sales Revenue', 'REVENUE', false, true, '4100'],
      ['4102', 'Parking Sales Revenue', 'REVENUE', false, true, '4100'],
      ['4200', 'Other Operational Income', 'REVENUE', true, false, '4000'],
      ['4201', 'Utility Connection Fees', 'REVENUE', false, true, '4200'],
      ['4202', 'Documentation Service Charge', 'REVENUE', false, true, '4200'],
      ['4203', 'Delay Payment Penalty', 'REVENUE', false, true, '4200'],
      ['5000', 'Expenses', 'EXPENSE', true, false, null],
      ['5100', 'Cost of Goods Sold', 'EXPENSE', true, false, '5000'],
      ['5101', 'Cost of Flats Delivered', 'EXPENSE', false, true, '5100'],
      ['5200', 'Administrative Expenses', 'EXPENSE', true, false, '5000'],
      ['5211', 'Head Office Rent & Utilities', 'EXPENSE', false, true, '5200'],
      ['5212', 'Staff Salaries & Allowances', 'EXPENSE', false, true, '5200'],
      ['5213', 'Professional & Legal Fees', 'EXPENSE', false, true, '5200'],
      ['5231', 'Investor Distribution Expense', 'EXPENSE', false, true, '5200'],
      ['5300', 'Selling & Marketing Expenses', 'EXPENSE', true, false, '5000'],
      ['5311', 'Advertisement & Digital Marketing', 'EXPENSE', false, true, '5300'],
      ['5312', 'Sales Commission', 'EXPENSE', false, true, '5300'],
      ['5313', 'Brochure & Project Model Costs', 'EXPENSE', false, true, '5300'],
      ['5400', 'Financial Expenses', 'EXPENSE', true, false, '5000'],
      ['5401', 'Bank Interest on Project Loan', 'EXPENSE', false, true, '5400'],
      ['5402', 'Bank Charges & Excise Duty', 'EXPENSE', false, true, '5400'],
    ] as const;

    for (const [code, name, type, isHeader, isPostable, parentCode] of accounts) {
      await queryRunner.query(
        `INSERT INTO "accounts" ("code","name","type","isHeader","isPostable","openingBalance","status","description","parent_id")
         VALUES ($1,$2,$3,$4,$5,$6,'ACTIVE',$7,
           (SELECT "id" FROM "accounts" WHERE "code" = $8))
         ON CONFLICT ("code") DO UPDATE SET "name"=EXCLUDED."name","type"=EXCLUDED."type",
           "isHeader"=EXCLUDED."isHeader","isPostable"=EXCLUDED."isPostable","status"='ACTIVE',
           "description"=EXCLUDED."description","parent_id"=EXCLUDED."parent_id"`,
        [code, name, type, isHeader, isPostable, openingByCode.get(code) ?? 0, `Real-estate chart of accounts: ${name}`, parentCode],
      );
    }

    const mappingUpdates: Record<string, string> = {
      customer_receipt_cash: '1111',
      customer_receipt_bank: '1114',
      customer_receipt_cheque: '1115',
      customer_receivable: '1131',
      vendor_payable: '2121',
      vendor_expense: '1122',
      salary_expense: '5212',
      salary_payable: '2133',
      payroll_deduction_payable: '2132',
      investor_capital: '3103',
      investor_payable: '2223',
      investor_payout_expense: '5231',
      construction_cost: '1122',
      utility_expense: '1124',
      contractor_payable: '2122',
      site_labor_expense: '1123',
    };
    for (const [mappingKey, accountCode] of Object.entries(mappingUpdates)) {
      await queryRunner.query(`UPDATE "account_mappings" SET "accountCode"=$1 WHERE "mappingKey"=$2`, [accountCode, mappingKey]);
    }
  }

  public async down(): Promise<void> {
    // Account migrations are intentionally forward-only: posted history must not be rewritten automatically.
  }
}
