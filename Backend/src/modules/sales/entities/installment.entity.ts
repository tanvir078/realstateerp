import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum InstallmentStatus {
  UPCOMING = 'UPCOMING',
  DUE_SOON = 'DUE_SOON',
  OVERDUE = 'OVERDUE',
  PAID = 'PAID',
}

@Entity('installments')
export class Installment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 30 })
  installmentNo: string;

  @Column()
  bookingId: string;

  @Column()
  clientId: string;

  @Column()
  title: string;

  @Column({ type: 'date' })
  dueDate: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  paidAmount: number;

  @Column({ type: 'enum', enum: InstallmentStatus, default: InstallmentStatus.UPCOMING })
  status: InstallmentStatus;

  @Column({ type: 'text', nullable: true })
  remarks: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}