import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddManualVoucherDescription1789061000000 implements MigrationInterface {
  name = 'AddManualVoucherDescription1789061000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "ledger_entries" ADD COLUMN IF NOT EXISTS "description" text');
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "ledger_entries" DROP COLUMN IF EXISTS "description"');
  }
}
