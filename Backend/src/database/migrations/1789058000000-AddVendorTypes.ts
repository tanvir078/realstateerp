import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddVendorTypes1789058000000 implements MigrationInterface {
  name = 'AddVendorTypes1789058000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TABLE "vendor_types" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(80) NOT NULL, "status" character varying NOT NULL DEFAULT \'ACTIVE\', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_vendor_types_id" PRIMARY KEY ("id"), CONSTRAINT "UQ_vendor_types_name" UNIQUE ("name"))');
    await queryRunner.query(`INSERT INTO "vendor_types" ("name") VALUES ('Construction'), ('Materials'), ('Services'), ('Equipment') ON CONFLICT ("name") DO NOTHING`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "vendor_types"');
  }
}
