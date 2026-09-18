import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddContractBasis1789059000000 implements MigrationInterface {
  name = 'AddContractBasis1789059000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "contractors" ALTER COLUMN "contractValue" DROP NOT NULL');
    await queryRunner.query('ALTER TABLE "contractors" ADD "contractBasis" character varying NOT NULL DEFAULT \'FIXED_AMOUNT\'');
    await queryRunner.query('ALTER TABLE "contractors" ADD "measurementUnit" character varying(40)');
    await queryRunner.query('ALTER TABLE "contractors" ADD "quantity" numeric(15,2)');
    await queryRunner.query('ALTER TABLE "contractors" ADD "rate" numeric(15,2)');
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "contractors" DROP COLUMN "rate"');
    await queryRunner.query('ALTER TABLE "contractors" DROP COLUMN "quantity"');
    await queryRunner.query('ALTER TABLE "contractors" DROP COLUMN "measurementUnit"');
    await queryRunner.query('ALTER TABLE "contractors" DROP COLUMN "contractBasis"');
    await queryRunner.query('ALTER TABLE "contractors" ALTER COLUMN "contractValue" SET NOT NULL');
  }
}
