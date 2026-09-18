import { MigrationInterface, QueryRunner } from 'typeorm';

export class CorrectSalesRevenueProjectDimensions1789060000000 implements MigrationInterface {
  name = 'CorrectSalesRevenueProjectDimensions1789060000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE "ledger_entries" l
      SET "project_id" = s."projectId"::uuid
      FROM "invoices" i
      JOIN "sales" s ON s.id::text = i."bookingId"
      WHERE l."referenceType" IN ('SALES_INVOICE', 'SALES_INVOICE_PARKING')
        AND l."referenceId" = i.id::text
        AND l."project_id" IS NULL
        AND s."projectId" IS NOT NULL
    `);

    await queryRunner.query(`
      UPDATE "ledger_entries" l
      SET "project_id" = s."projectId"::uuid
      FROM "installments" i
      JOIN "sales" s ON s.id::text = i."bookingId"
      WHERE l."referenceType" = 'INSTALLMENT_COLLECTION'
        AND l."referenceId" = i.id::text
        AND l."project_id" IS NULL
        AND s."projectId" IS NOT NULL
    `);

    await queryRunner.query(`
      INSERT INTO "ledger_entries"
        ("referenceType", "referenceId", "project_id", "debitAccountCode", "creditAccountCode", "amount", "postingDate")
      SELECT
        'REVENUE_RECLASSIFICATION',
        l.id::text,
        s."projectId"::uuid,
        '4102',
        '4101',
        l.amount,
        l."postingDate"
      FROM "ledger_entries" l
      JOIN "invoices" i ON i.id::text = l."referenceId"
      JOIN "sales" s ON s.id::text = i."bookingId"
      WHERE l."referenceType" = 'SALES_INVOICE'
        AND l."creditAccountCode" = '4102'
        AND COALESCE(s."parkingPrice", 0) = 0
        AND NOT EXISTS (
          SELECT 1
          FROM "ledger_entries" correction
          WHERE correction."referenceType" = 'REVENUE_RECLASSIFICATION'
            AND correction."referenceId" = l.id::text
        )
    `);
  }

  async down(): Promise<void> {
    // Historical corrections must remain auditable and are not removed on rollback.
  }
}
