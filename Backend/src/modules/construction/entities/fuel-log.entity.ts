import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('construction_fuel_logs')
export class ConstructionFuelLog {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() equipmentId: string;
  @Column({ type: 'date' }) date: string;
  @Column({ type: 'decimal', precision: 12, scale: 2 }) quantity: number;
  @Column({ type: 'decimal', precision: 12, scale: 2 }) rate: number;
  @Column({ length: 160 }) supplier: string;
  @Column({ nullable: true }) operator?: string;
  @CreateDateColumn() createdAt: Date;
}
