import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProjectWipAccountLink1789055000000 implements MigrationInterface {
  name = 'AddProjectWipAccountLink1789055000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "wip_account_id" uuid');
    await queryRunner.query(`
      UPDATE "projects" p
      SET "wip_account_id" = a.id
      FROM "accounts" a
      WHERE p."wip_account_id" IS NULL
        AND a."status" = 'ACTIVE'
        AND a."type" = 'ASSET'
        AND a."isPostable" = true
        AND a."name" = 'WIP - ' || p."projectName"
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "projects" DROP COLUMN IF EXISTS "wip_account_id"');
  }
}
