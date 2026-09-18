import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBookingMoneyReceipts1789064000000 implements MigrationInterface {
  name = 'AddBookingMoneyReceipts1789064000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "collection_payments" ALTER COLUMN "installmentId" DROP NOT NULL');
    await queryRunner.query('ALTER TABLE "collection_payments" ADD COLUMN IF NOT EXISTS "bookingId" uuid');
    await queryRunner.query('CREATE INDEX IF NOT EXISTS "IDX_collection_payments_booking_id" ON "collection_payments" ("bookingId")');
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX IF EXISTS "IDX_collection_payments_booking_id"');
    await queryRunner.query('ALTER TABLE "collection_payments" DROP COLUMN IF EXISTS "bookingId"');
    await queryRunner.query('ALTER TABLE "collection_payments" ALTER COLUMN "installmentId" SET NOT NULL');
  }
}
