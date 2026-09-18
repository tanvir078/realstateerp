import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Project } from './project.entity';
import { Building } from './building.entity';

export enum UnitType {
  APARTMENT = 'APARTMENT',
  COMMERCIAL_SHOP = 'COMMERCIAL_SHOP',
  PARKING = 'PARKING',
  OFFICE_SPACE = 'OFFICE_SPACE',
}

export enum UnitOwnership {
  DEVELOPER_SHARE = 'DEVELOPER_SHARE',
  LANDOWNER_SHARE = 'LANDOWNER_SHARE',
}

export enum UnitStatus {
  AVAILABLE = 'AVAILABLE',
  BOOKED = 'BOOKED',
  SOLD = 'SOLD',
  BLOCKED = 'BLOCKED',
}

@Entity('project_units')
export class Unit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  unitCode: string;

  @Column({ length: 50 })
  floorLevel: string;

  @Column({ type: 'enum', enum: UnitType })
  unitType: UnitType;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  size: number;

  @Column({ length: 30 })
  facing: string;

  @Column({ type: 'int', default: 0 })
  bedrooms: number;

  @Column({ type: 'int', default: 0 })
  bathrooms: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  basePricePerSft: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  parkingPrice: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  utilityCharges: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  totalPrice: number;

  @Column({ type: 'enum', enum: UnitOwnership })
  ownership: UnitOwnership;

  @Column({ type: 'enum', enum: UnitStatus, default: UnitStatus.AVAILABLE })
  status: UnitStatus;

  @ManyToOne(() => Project, (project) => project.units, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ name: 'project_id' })
  projectId: string;

  @Column({ name: 'building_id', nullable: true })
  buildingId?: string;

  @ManyToOne(() => Building, (building) => building.units, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'building_id' })
  building?: Building;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}