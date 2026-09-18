import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('investor_payouts')
export class InvestorPayout {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ unique: true }) payoutNo: string;
  @Column() investorId: string;
  @Column({ length: 150 }) project: string;
  @Column({ type: 'decimal', precision: 15, scale: 2 }) amount: number;
  @Column({ length: 50 }) type: string;
  @Column({ type: 'date' }) scheduledDate: string;
  @Column({ default: 'SCHEDULED' }) status: string;
  @Column({ nullable: true }) paidDate?: string;
  @Column({ nullable: true }) paymentMethod?: string;
  @Column({ nullable: true }) referenceNumber?: string;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
