import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('contractors')
export class Contractor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 30 })
  contractorCode: string;

  @Column({ length: 180 })
  name: string;

  @Column({ length: 30 })
  type: string;

  @Column({ length: 50 })
  contact: string;

  @Column({ length: 180, nullable: true })
  email?: string;

  @Column({ length: 255, nullable: true })
  address?: string;

  @Column({ nullable: true })
  projectId?: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  contractValue?: number;

  @Column({ default: 'FIXED_AMOUNT' })
  contractBasis: string;

  @Column({ length: 40, nullable: true })
  measurementUnit?: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  quantity?: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  rate?: number;

  @Column({ default: 'PENDING' })
  status: string;

  @Column({ type: 'date', nullable: true })
  startDate?: string;

  @Column({ type: 'date', nullable: true })
  endDate?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
