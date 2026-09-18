import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRefreshSessions1789049148501 implements MigrationInterface {
    name = 'AddRefreshSessions1789049148501'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "refresh_sessions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying NOT NULL, "tokenId" character varying NOT NULL, "tokenHash" character varying(64) NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "revokedAt" TIMESTAMP, "replacedByTokenId" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_7dc1380284d99ef0c9f2ad71aa3" UNIQUE ("tokenId"), CONSTRAINT "PK_9190032f6967b7971dca07d69f3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ad8010ec3f96f4497d3fbb588a" ON "refresh_sessions" ("userId", "revokedAt") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_ad8010ec3f96f4497d3fbb588a"`);
        await queryRunner.query(`DROP TABLE "refresh_sessions"`);
    }

}
