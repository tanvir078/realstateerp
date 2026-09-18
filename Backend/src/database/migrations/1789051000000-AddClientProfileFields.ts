import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddClientProfileFields1789051000000 implements MigrationInterface {
  name = 'AddClientProfileFields1789051000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "area" character varying`);
    await queryRunner.query(`ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "nid" character varying`);
    await queryRunner.query(`ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "dateOfBirth" date`);
    await queryRunner.query(`ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "gender" character varying`);
    await queryRunner.query(`ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "companyName" character varying`);
    await queryRunner.query(`ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "companyRegistration" character varying`);
    await queryRunner.query(`ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "businessType" character varying`);
    await queryRunner.query(`ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "emergencyContact" character varying`);
    await queryRunner.query(`ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "emergencyPhone" character varying`);
    await queryRunner.query(`ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "emergencyRelation" character varying`);
    await queryRunner.query(`ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "notes" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "notes"`);
    await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "emergencyRelation"`);
    await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "emergencyPhone"`);
    await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "emergencyContact"`);
    await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "businessType"`);
    await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "companyRegistration"`);
    await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "companyName"`);
    await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "gender"`);
    await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "dateOfBirth"`);
    await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "nid"`);
    await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "area"`);
  }
}
