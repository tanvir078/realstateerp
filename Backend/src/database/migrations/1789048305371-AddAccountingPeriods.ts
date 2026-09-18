import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAccountingPeriods1789048305371 implements MigrationInterface {
    name = 'AddAccountingPeriods1789048305371'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "accounting_periods" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "periodStart" date NOT NULL, "periodEnd" date NOT NULL, "isClosed" boolean NOT NULL DEFAULT false, "closedBy" character varying, "closedAt" TIMESTAMP, "reason" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a574217de733282cf1ea1c1970f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_8e3330983c45b0289189e4096a" ON "accounting_periods" ("periodStart", "periodEnd") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_8e3330983c45b0289189e4096a"`);
        await queryRunner.query(`DROP TABLE "accounting_periods"`);
    }

}
