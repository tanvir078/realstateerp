import { MigrationInterface, QueryRunner } from 'typeorm';

export class BackfillKnownBookingMoney1789065000000 implements MigrationInterface {
  name = 'BackfillKnownBookingMoney1789065000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "ledger_entries"
        ("referenceType", "referenceId", "project_id", "debitAccountCode", "creditAccountCode", "amount", "postingDate", "description", "status")
      SELECT
        'BOOKING_ADVANCE', s.id, s."projectId",
        CASE s."bookingPaymentMethod"
          WHEN 'cash' THEN '1111'
          WHEN 'bank_transfer' THEN '1114'
          WHEN 'cheque' THEN '1115'
        END,
        '2111', s."downPayment",
        COALESCE(s."saleDate", CURRENT_DATE),
        'Historical booking money for ' || s."saleId", 'APPROVED'
      FROM "sales" s
      WHERE s."downPayment" > 0
        AND s."bookingPaymentMethod" IN ('cash', 'bank_transfer', 'cheque')
        AND NOT EXISTS (
          SELECT 1 FROM "ledger_entries" l
          WHERE l."referenceType" = 'BOOKING_ADVANCE' AND l."referenceId" = s.id::text
        )
    `);
    await queryRunner.query(`
      INSERT INTO "collection_payments"
        ("receiptNo", "installmentId", "bookingId", "clientId", "amount", "paymentMethod", "paymentDate", "remarks")
      SELECT
        'BM-HIST-' || SUBSTRING(s.id::text, 1, 8), NULL, s.id, s."clientId",
        s."downPayment", s."bookingPaymentMethod", COALESCE(s."saleDate", CURRENT_DATE),
        'Historical booking money for ' || s."saleId"
      FROM "sales" s
      WHERE s."downPayment" > 0
        AND s."bookingPaymentMethod" IN ('cash', 'bank_transfer', 'cheque')
        AND NOT EXISTS (
          SELECT 1 FROM "collection_payments" p
          WHERE p."bookingId" = s.id
        )
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "collection_payments" WHERE "receiptNo" LIKE 'BM-HIST-%'`);
    await queryRunner.query(`DELETE FROM "ledger_entries" WHERE "referenceType" = 'BOOKING_ADVANCE' AND "description" LIKE 'Historical booking money for %'`);
  }
}
