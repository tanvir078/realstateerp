import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('collection_payments')
export class CollectionPayment {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ unique: true }) receiptNo: string;
  @Column({ nullable: true }) installmentId: string | null;
  @Column({ nullable: true }) bookingId: string | null;
  @Column() clientId: string;
  @Column({ type: 'decimal', precision: 15, scale: 2 }) amount: number;
  @Column({ length: 30 }) paymentMethod: string;
  @Column({ nullable: true }) referenceNo: string;
  @Column({ type: 'date' }) paymentDate: string;
  @Column({ type: 'text', nullable: true }) remarks: string;
  @CreateDateColumn() createdAt: Date;
}