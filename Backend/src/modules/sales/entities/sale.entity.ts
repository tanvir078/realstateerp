import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

export enum SaleStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum PaymentMethod {
  CASH = 'cash',
  BANK_TRANSFER = 'bank_transfer',
  CHEQUE = 'cheque',
  INSTALLMENT = 'installment',
}

@Entity('sales')
export class Sale {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  saleId: string;

  @Column()
  projectId: string;

  @Column()
  projectName: string;

  @Column()
  unitNo: string;

  @Column()
  unitId: string;

  @Column({ nullable: true })
  parkingUnitId?: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  parkingPrice: number;

  @Column({ type: 'boolean', default: false })
  includesParking: boolean;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  unitPrice: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  totalPrice: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  downPayment: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  amountPaid: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  balanceDue: number;

  @Column({
    type: 'enum',
    enum: SaleStatus,
    default: SaleStatus.PENDING,
  })
  status: SaleStatus;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.INSTALLMENT,
  })
  paymentMethod: PaymentMethod;

  @Column({ type: 'enum', enum: PaymentMethod, nullable: true })
  bookingPaymentMethod?: PaymentMethod;

  @Column({ type: 'int', default: 0 })
  installments: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  installmentAmount: number;

  @Column({ type: 'date', nullable: true })
  saleDate: Date;

  @Column({ type: 'date', nullable: true })
  expectedCompletionDate: Date;

  @Column({ type: 'date', nullable: true })
  actualCompletionDate: Date;

  @Column({ nullable: true })
  notes: string;

  @Column()
  clientId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
