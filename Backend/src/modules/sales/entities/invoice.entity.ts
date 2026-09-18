import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum InvoiceStatus { DRAFT = 'DRAFT', ISSUED = 'ISSUED', PARTIAL = 'PARTIAL', PAID = 'PAID', OVERDUE = 'OVERDUE' }

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ unique: true }) invoiceNo: string;
  @Column() installmentId: string;
  @Column() bookingId: string;
  @Column() clientId: string;
  @Column({ type: 'decimal', precision: 15, scale: 2 }) amount: number;
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 }) taxAmount: number;
  @Column({ nullable: true }) taxCode: string;
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 }) paidAmount: number;
  @Column({ type: 'date' }) issueDate: string;
  @Column({ type: 'date' }) dueDate: string;
  @Column({ type: 'enum', enum: InvoiceStatus, default: InvoiceStatus.ISSUED }) status: InvoiceStatus;
  @Column({ type: 'text', nullable: true }) particulars: string;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}