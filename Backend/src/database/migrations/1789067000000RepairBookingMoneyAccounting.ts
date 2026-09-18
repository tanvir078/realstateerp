import { MigrationInterface, QueryRunner } from 'typeorm';

export class RepairBookingMoneyAccounting1789067000000 implements MigrationInterface {
  name = 'RepairBookingMoneyAccounting1789067000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE "sales"
      SET "bookingPaymentMethod" = CASE
        WHEN "paymentMethod" IN ('cash', 'bank_transfer', 'cheque') THEN "paymentMethod"::text::"public"."sales_booking_payment_method_enum"
        ELSE 'cash'::"public"."sales_booking_payment_method_enum"
      END
      WHERE "downPayment" > 0
        AND "bookingPaymentMethod" IS NULL
    `);

    await queryRunner.query(`
      INSERT INTO "ledger_entries"
        ("referenceType", "referenceId", "project_id", "debitAccountCode", "creditAccountCode", "amount", "postingDate", "description", "status")
      SELECT
        'BOOKING_ADVANCE', s.id, s."projectId",
        COALESCE(
          (SELECT m."accountCode" FROM "account_mappings" m
           WHERE m."mappingKey" = CASE s."bookingPaymentMethod"
             WHEN 'cash' THEN 'customer_receipt_cash'
             WHEN 'bank_transfer' THEN 'customer_receipt_bank'
             WHEN 'cheque' THEN 'customer_receipt_cheque'
           END
           LIMIT 1),
          CASE s."bookingPaymentMethod"
            WHEN 'cash' THEN '1111'
            WHEN 'bank_transfer' THEN '1114'
            WHEN 'cheque' THEN '1115'
          END
        ),
        COALESCE(
          (SELECT m."accountCode" FROM "account_mappings" m WHERE m."mappingKey" = 'customer_advance' LIMIT 1),
          '2111'
        ),
        s."downPayment", COALESCE(s."saleDate", CURRENT_DATE),
        'Booking money for ' || s."saleId", 'APPROVED'
      FROM "sales" s
      WHERE s."downPayment" > 0
        AND s."bookingPaymentMethod" IN ('cash', 'bank_transfer', 'cheque')
        AND NOT EXISTS (
          SELECT 1 FROM "ledger_entries" l
          WHERE l."referenceType" = 'BOOKING_ADVANCE'
            AND l."referenceId" = s.id::text
        )
    `);

    await queryRunner.query(`
      INSERT INTO "collection_payments"
        ("receiptNo", "installmentId", "bookingId", "clientId", "amount", "paymentMethod", "paymentDate", "remarks")
      SELECT
        'BM-REPAIR-' || SUBSTRING(s.id::text, 1, 8), NULL, s.id, s."clientId",
        s."downPayment", s."bookingPaymentMethod", COALESCE(s."saleDate", CURRENT_DATE),
        'Booking money for ' || s."saleId"
      FROM "sales" s
      WHERE s."downPayment" > 0
        AND s."bookingPaymentMethod" IN ('cash', 'bank_transfer', 'cheque')
        AND NOT EXISTS (
          SELECT 1 FROM "collection_payments" p
          WHERE p."bookingId" = s.id
        )
    `);
  }

  async down(): Promise<void> {
    // Repairs are intentionally not reversed because these are financial records.
  }
}
