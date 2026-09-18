import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPayrollWithholding1789049804451 implements MigrationInterface {
    name = 'AddPayrollWithholding1789049804451'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payroll_runs" ADD "withholdingAmount" numeric(15,2) NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payroll_runs" DROP COLUMN "withholdingAmount"`);
    }

}
