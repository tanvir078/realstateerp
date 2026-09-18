import { MigrationInterface, QueryRunner } from 'typeorm';

export class CleanUpOrphanChequeClearingAccount1789054000000 implements MigrationInterface {
  name = 'CleanUpOrphanChequeClearingAccount1789054000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "accounts"
       SET "status" = 'INACTIVE', "isPostable" = false
       WHERE "code" = $1
         AND NOT EXISTS (
           SELECT 1
           FROM "ledger_entries"
           WHERE "debitAccountCode" = $1 OR "creditAccountCode" = $1
         )
         AND NOT EXISTS (
           SELECT 1
           FROM "payroll_ledger_entries"
           WHERE "debitAccountCode" = $1 OR "creditAccountCode" = $1
         )
         AND NOT EXISTS (
           SELECT 1
           FROM "payable_ledger_entries"
           WHERE "debitAccountCode" = $1 OR "creditAccountCode" = $1
         )
         AND NOT EXISTS (
           SELECT 1
           FROM "construction_ledger_entries"
           WHERE "debitAccountCode" = $1 OR "creditAccountCode" = $1
         )`,
      ['1150'],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "accounts"
       SET "status" = 'ACTIVE', "isPostable" = true
       WHERE "code" = $1`,
      ['1150'],
    );
  }
}
