import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Project } from './project.entity';

export enum LandParcelStatus {
  AVAILABLE = 'AVAILABLE',
  ALLOCATED = 'ALLOCATED',
  ACQUIRED = 'ACQUIRED',
  DISPUTED = 'DISPUTED',
  SOLD = 'SOLD',
}

@Entity('land_parcels')
export class LandParcel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  parcelCode: string;

  @Column({ length: 180 })
  description: string;

  @Column({ length: 255 })
  location: string;

  @Column({ type: 'decimal', precision: 14, scale: 2 })
  area: number;

  @Column({ length: 20, default: 'SQFT' })
  areaUnit: string;

  @Column({ length: 180 })
  ownerName: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  acquisitionCost: number;

  @Column({ type: 'enum', enum: LandParcelStatus, default: LandParcelStatus.AVAILABLE })
  status: LandParcelStatus;

  @Column({ nullable: true })
  projectId?: string;

  @ManyToOne(() => Project, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'project_id' })
  project?: Project;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
