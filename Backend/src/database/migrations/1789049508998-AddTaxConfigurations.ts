import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTaxConfigurations1789049508998 implements MigrationInterface {
    name = 'AddTaxConfigurations1789049508998'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."tax_configurations_type_enum" AS ENUM('VAT', 'TDS')`);
        await queryRunner.query(`CREATE TABLE "tax_configurations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."tax_configurations_type_enum" NOT NULL, "code" character varying NOT NULL, "name" character varying NOT NULL, "ratePercent" numeric(7,4) NOT NULL, "enabled" boolean NOT NULL DEFAULT true, "effectiveFrom" date NOT NULL, "effectiveTo" date, "outputAccountCode" character varying, "inputAccountCode" character varying, "withholdingAccountCode" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_6b6fb1e9c62b29a119c685365e4" UNIQUE ("code"), CONSTRAINT "PK_bb509e47d5b1be419b248299b09" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "tax_configurations"`);
        await queryRunner.query(`DROP TYPE "public"."tax_configurations_type_enum"`);
    }

}
