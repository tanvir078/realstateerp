import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Project } from './project.entity';
import { Unit } from './unit.entity';

export enum UtilityType {
  ELECTRICITY = 'ELECTRICITY',
  WATER = 'WATER',
  GAS = 'GAS',
  SERVICE_CHARGE = 'SERVICE_CHARGE',
  OTHER = 'OTHER',
}

@Entity('utility_connections')
export class UtilityConnection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  connectionCode: string;

  @Column({ type: 'enum', enum: UtilityType })
  utilityType: UtilityType;

  @Column({ length: 100 })
  meterNumber: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  monthlyRate: number;

  @Column({ length: 30, default: 'ACTIVE' })
  status: string;

  @Column()
  projectId: string;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ nullable: true })
  unitId?: string;

  @ManyToOne(() => Unit, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'unit_id' })
  unit?: Unit;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
