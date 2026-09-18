import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProjectBuildings1789052000000 implements MigrationInterface {
  name = 'AddProjectBuildings1789052000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "project_buildings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "buildingCode" character varying(30) NOT NULL, "name" character varying(150) NOT NULL, "totalFloors" integer NOT NULL DEFAULT 0, "status" character varying(30) NOT NULL DEFAULT 'ACTIVE', "project_id" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_project_buildings_id" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_project_buildings_project_code" ON "project_buildings" ("project_id", "buildingCode")`);
    await queryRunner.query(`ALTER TABLE "project_buildings" ADD CONSTRAINT "FK_project_buildings_project" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE`);
    await queryRunner.query(`ALTER TABLE "project_units" ADD "building_id" uuid`);
    await queryRunner.query(`ALTER TABLE "project_units" ADD CONSTRAINT "FK_project_units_building" FOREIGN KEY ("building_id") REFERENCES "project_buildings"("id") ON DELETE SET NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "project_units" DROP CONSTRAINT "FK_project_units_building"`);
    await queryRunner.query(`ALTER TABLE "project_units" DROP COLUMN "building_id"`);
    await queryRunner.query(`ALTER TABLE "project_buildings" DROP CONSTRAINT "FK_project_buildings_project"`);
    await queryRunner.query(`DROP INDEX "IDX_project_buildings_project_code"`);
    await queryRunner.query(`DROP TABLE "project_buildings"`);
  }
}
