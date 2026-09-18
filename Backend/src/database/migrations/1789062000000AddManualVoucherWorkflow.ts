import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddManualVoucherWorkflow1789062000000 implements MigrationInterface {
  name = 'AddManualVoucherWorkflow1789062000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ledger_entries"
      ADD COLUMN IF NOT EXISTS "status" varchar NOT NULL DEFAULT 'APPROVED',
      ADD COLUMN IF NOT EXISTS "rejectionReason" varchar,
      ADD COLUMN IF NOT EXISTS "approvedBy" varchar,
      ADD COLUMN IF NOT EXISTS "approvedAt" timestamptz`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ledger_entries"
      DROP COLUMN IF EXISTS "approvedAt",
      DROP COLUMN IF EXISTS "approvedBy",
      DROP COLUMN IF EXISTS "rejectionReason",
      DROP COLUMN IF EXISTS "status"`);
  }
}
