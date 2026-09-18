import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('bank_reconciliation_transactions')
export class BankReconciliationTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  bankAccountId: string;

  @Column({ type: 'date' })
  transactionDate: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  reference: string | null;

  @Column({ type: 'varchar' })
  type: 'DEPOSIT' | 'WITHDRAWAL';

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  amount: number;

  @Column({ default: 'UNMATCHED' })
  status: 'MATCHED' | 'UNMATCHED';

  @Column({ nullable: true })
  matchedVoucherNo: string | null;

  @Column({ nullable: true })
  matchNote: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
