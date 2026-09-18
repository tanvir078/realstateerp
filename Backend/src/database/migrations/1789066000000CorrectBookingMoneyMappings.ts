import { MigrationInterface, QueryRunner } from 'typeorm';

export class CorrectBookingMoneyMappings1789066000000 implements MigrationInterface {
  name = 'CorrectBookingMoneyMappings1789066000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE "ledger_entries" l
      SET
        "debitAccountCode" = COALESCE(
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
        "creditAccountCode" = COALESCE(
          (SELECT m."accountCode" FROM "account_mappings" m WHERE m."mappingKey" = 'customer_advance' LIMIT 1),
          '2111'
        )
      FROM "sales" s
      WHERE l."referenceType" = 'BOOKING_ADVANCE'
        AND l."referenceId" = s.id::text
        AND s."bookingPaymentMethod" IN ('cash', 'bank_transfer', 'cheque')
    `);
  }

  async down(): Promise<void> {
    // Mapping corrections are intentionally not reversed because account mappings may change after deployment.
  }
}
