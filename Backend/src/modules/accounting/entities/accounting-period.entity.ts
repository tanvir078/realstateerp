import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('accounting_periods')
@Index(['periodStart', 'periodEnd'], { unique: true })
export class AccountingPeriod {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  periodStart: string;

  @Column({ type: 'date' })
  periodEnd: string;

  @Column({ default: false })
  isClosed: boolean;

  @Column({ nullable: true })
  closedBy?: string;

  @Column({ nullable: true })
  closedAt?: Date;

  @Column({ nullable: true })
  reason?: string;

  @CreateDateColumn()
  createdAt: Date;
}
