import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAccountMappings1789049000000 implements MigrationInterface {
  name = 'AddAccountMappings1789049000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "account_mappings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "mappingKey" character varying(80) NOT NULL, "accountCode" character varying(20) NOT NULL, "label" character varying(150) NOT NULL, "module" character varying(40) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_account_mappings_key" UNIQUE ("mappingKey"), CONSTRAINT "PK_account_mappings_id" PRIMARY KEY ("id"))`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "account_mappings"`);
  }
}
