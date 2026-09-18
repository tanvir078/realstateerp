import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProjectIdToLedgers1789056000000 implements MigrationInterface {
  name = 'AddProjectIdToLedgers1789056000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    const tables = ['ledger_entries', 'payable_ledger_entries', 'construction_ledger_entries', 'payroll_ledger_entries'];
    for (const table of tables) {
      await queryRunner.query(`ALTER TABLE "${table}" ADD COLUMN IF NOT EXISTS "project_id" uuid`);
      await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_${table}_project_id" ON "${table}" ("project_id")`);
    }
    await queryRunner.query(`ALTER TABLE "payroll_runs" ADD COLUMN IF NOT EXISTS "project_id" uuid`);
    await queryRunner.query(`ALTER TABLE "site_labor_records" ADD COLUMN IF NOT EXISTS "project_id" uuid`);

    await queryRunner.query(`
      UPDATE "ledger_entries" l
      SET "project_id" = s."projectId"::uuid
      FROM "sales" s
      JOIN "installments" i ON i."bookingId" = s.id::text
      WHERE l."project_id" IS NULL
        AND l."referenceId" = i.id::text
        AND l."referenceType" = 'INSTALLMENT_COLLECTION'
    `);
    await queryRunner.query(`
      UPDATE "payable_ledger_entries" l
      SET "project_id" = b."projectId"::uuid
      FROM "vendor_bills" b
      WHERE l."project_id" IS NULL
        AND l."referenceId" = b.id::text
        AND l."referenceType" IN ('VENDOR_BILL', 'VENDOR_PAYMENT', 'PURCHASE_VAT', 'PURCHASE_TDS')
    `);
    await queryRunner.query(`
      UPDATE "construction_ledger_entries" l
      SET "project_id" = b."projectId"::uuid
      FROM "ra_bills" b
      WHERE l."project_id" IS NULL
        AND l."referenceId" = b.id::text
        AND l."referenceType" IN ('RA_BILL', 'RA_PAYMENT')
    `);
    await queryRunner.query(`
      UPDATE "payroll_ledger_entries" l
      SET "project_id" = r."project_id"
      FROM "payroll_runs" r
      WHERE l."project_id" IS NULL
        AND l."referenceId" = r.id::text
    `);
    await queryRunner.query(`
      UPDATE "construction_ledger_entries" l
      SET "project_id" = s."project_id"
      FROM "site_labor_records" s
      WHERE l."project_id" IS NULL
        AND l."referenceId" = s.id::text
        AND l."referenceType" = 'SITE_LABOR_PAYMENT'
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "payroll_runs" DROP COLUMN IF EXISTS "project_id"');
    await queryRunner.query('ALTER TABLE "site_labor_records" DROP COLUMN IF EXISTS "project_id"');
    for (const table of ['ledger_entries', 'payable_ledger_entries', 'construction_ledger_entries', 'payroll_ledger_entries']) {
      await queryRunner.query(`DROP INDEX IF EXISTS "IDX_${table}_project_id"`);
      await queryRunner.query(`ALTER TABLE "${table}" DROP COLUMN IF EXISTS "project_id"`);
    }
  }
}
