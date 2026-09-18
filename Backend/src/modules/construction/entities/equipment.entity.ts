import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('construction_equipment')
export class ConstructionEquipment {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ length: 160 }) name: string;
  @Column({ length: 80 }) type: string;
  @Column({ nullable: true }) projectId?: string;
  @Column({ default: 'ACTIVE' }) status: string;
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 }) fuelConsumptionPerDay: number;
  @Column({ type: 'date', nullable: true }) lastMaintenance?: string;
  @Column({ nullable: true }) operator?: string;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
