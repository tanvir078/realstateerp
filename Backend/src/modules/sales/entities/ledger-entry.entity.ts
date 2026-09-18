import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ledger_entries')
export class LedgerEntry {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() referenceType: string;
  @Column() referenceId: string;
  @Column({ name: 'project_id', nullable: true })
  projectId: string | null;
  @Column() debitAccountCode: string;
  @Column() creditAccountCode: string;
  @Column({ type: 'text', nullable: true })
  description: string | null;
  @Column({ type: 'decimal', precision: 15, scale: 2 }) amount: number;
  @Column({ type: 'date' }) postingDate: string;
  @Column({ default: 'APPROVED' })
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'REVERSED';
  @Column({ nullable: true })
  rejectionReason: string | null;
  @Column({ nullable: true })
  approvedBy: string | null;
  @Column({ nullable: true })
  approvedAt: Date | null;
  @CreateDateColumn() createdAt: Date;
}