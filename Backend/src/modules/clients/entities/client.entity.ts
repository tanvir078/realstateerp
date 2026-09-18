import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum ClientType {
  INDIVIDUAL = 'individual',
  CORPORATE = 'corporate',
}

export enum PaymentStatus {
  UP_TO_DATE = 'UP TO DATE',
  OVERDUE = 'OVERDUE',
  PENDING = 'PENDING',
}

export enum ClientStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  BLACKLISTED = 'blacklisted',
}

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  clientId: string;

  @Column()
  clientName: string;

  @Column({
    type: 'enum',
    enum: ClientType,
    default: ClientType.INDIVIDUAL,
  })
  clientType: ClientType;

  @Column()
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  area: string;

  @Column({ nullable: true })
  nid: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  companyName: string;

  @Column({ nullable: true })
  companyRegistration: string;

  @Column({ nullable: true })
  businessType: string;

  @Column({ nullable: true })
  emergencyContact: string;

  @Column({ nullable: true })
  emergencyPhone: string;

  @Column({ nullable: true })
  emergencyRelation: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ nullable: true })
  project: string;

  @Column({ nullable: true })
  unitNo: string;

  @Column({ nullable: true })
  projectId: string;

  @Column({ nullable: true })
  unitId: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalPrice: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalPaid: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  dueAmount: number;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @Column({ nullable: true })
  salesRep: string;

  @Column({
    type: 'enum',
    enum: ClientStatus,
    default: ClientStatus.PENDING,
  })
  status: ClientStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
