import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeContractorOptionalFieldsNullable1789057000000 implements MigrationInterface {
  name = 'MakeContractorOptionalFieldsNullable1789057000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "contractors" ALTER COLUMN "email" DROP NOT NULL');
    await queryRunner.query('ALTER TABLE "contractors" ALTER COLUMN "address" DROP NOT NULL');
    await queryRunner.query('ALTER TABLE "contractors" ALTER COLUMN "startDate" DROP NOT NULL');
    await queryRunner.query('ALTER TABLE "contractors" ALTER COLUMN "endDate" DROP NOT NULL');
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "contractors" ALTER COLUMN "endDate" SET NOT NULL');
    await queryRunner.query('ALTER TABLE "contractors" ALTER COLUMN "startDate" SET NOT NULL');
    await queryRunner.query('ALTER TABLE "contractors" ALTER COLUMN "address" SET NOT NULL');
    await queryRunner.query('ALTER TABLE "contractors" ALTER COLUMN "email" SET NOT NULL');
  }
}
