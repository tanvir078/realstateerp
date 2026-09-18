import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UtilityConnection } from './utility-connection.entity';

@Entity('utility_bills')
export class UtilityBill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  connectionId: string;

  @ManyToOne(() => UtilityConnection, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'connection_id' })
  connection: UtilityConnection;

  @Column({ type: 'date' })
  billingMonth: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  paidAmount: number;

  @Column({ length: 30, default: 'DUE' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}
