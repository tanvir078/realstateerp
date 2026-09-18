import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBookingPaymentMethod1789063000000 implements MigrationInterface {
  name = 'AddBookingPaymentMethod1789063000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DO $$ BEGIN
      CREATE TYPE "public"."sales_booking_payment_method_enum" AS ENUM('cash', 'bank_transfer', 'cheque', 'installment');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;`);
    await queryRunner.query(`ALTER TABLE "sales"
      ADD COLUMN IF NOT EXISTS "bookingPaymentMethod" "public"."sales_booking_payment_method_enum"`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "sales" DROP COLUMN IF EXISTS "bookingPaymentMethod"');
    await queryRunner.query('DROP TYPE IF EXISTS "public"."sales_booking_payment_method_enum"');
  }
}
