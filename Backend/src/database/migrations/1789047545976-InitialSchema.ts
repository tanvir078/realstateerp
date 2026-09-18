import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1789047545976 implements MigrationInterface {
    name = 'InitialSchema1789047545976'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "system_settings" ("key" character varying(120) NOT NULL, "value" jsonb NOT NULL, "updatedBy" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b1b5bc664526d375c94ce9ad43d" PRIMARY KEY ("key"))`);
        await queryRunner.query(`CREATE TABLE "audit_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "actorId" character varying, "actorEmail" character varying, "action" character varying(80) NOT NULL, "module" character varying(80) NOT NULL, "details" jsonb, "ipAddress" character varying, "userAgent" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1bb179d048bbc581caa3b013439" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2854cdf0e31b4f0da1e24babe8" ON "audit_logs" ("module", "action") `);
        await queryRunner.query(`CREATE INDEX "IDX_c69efb19bf127c97e6740ad530" ON "audit_logs" ("createdAt") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_c69efb19bf127c97e6740ad530"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2854cdf0e31b4f0da1e24babe8"`);
        await queryRunner.query(`DROP TABLE "audit_logs"`);
        await queryRunner.query(`DROP TABLE "system_settings"`);
    }

}
