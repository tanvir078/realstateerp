import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTaxAmountsToDocuments1789049672034 implements MigrationInterface {
    name = 'AddTaxAmountsToDocuments1789049672034'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoices" ADD "taxAmount" numeric(15,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD "taxCode" character varying`);
        await queryRunner.query(`ALTER TABLE "vendor_bills" ADD "taxAmount" numeric(15,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "vendor_bills" ADD "withholdingAmount" numeric(15,2) NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vendor_bills" DROP COLUMN "withholdingAmount"`);
        await queryRunner.query(`ALTER TABLE "vendor_bills" DROP COLUMN "taxAmount"`);
        await queryRunner.query(`ALTER TABLE "invoices" DROP COLUMN "taxCode"`);
        await queryRunner.query(`ALTER TABLE "invoices" DROP COLUMN "taxAmount"`);
    }

}
