import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('investor_allocations')
export class InvestorAllocation {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() investorId: string;
  @Column({ length: 150 }) project: string;
  @Column({ type: 'decimal', precision: 7, scale: 2 }) equityPercent: number;
  @Column({ type: 'decimal', precision: 15, scale: 2 }) investment: number;
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 }) currentValue: number;
  @Column({ default: 'ACTIVE' }) status: string;
  @CreateDateColumn() createdAt: Date;
}
