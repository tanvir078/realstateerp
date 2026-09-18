import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Unit } from './unit.entity';

export enum ProjectType {
  RESIDENTIAL = 'RESIDENTIAL',
  COMMERCIAL = 'COMMERCIAL',
  LAND = 'LAND',
  MIXED = 'MIXED',
}

export enum ProjectStatus {
  UPCOMING = 'UPCOMING',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  ON_HOLD = 'ON_HOLD',
}

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 30 })
  projectCode: string;

  @Column({ length: 150 })
  projectName: string;

  @Column({ type: 'enum', enum: ProjectType })
  projectType: ProjectType;

  @Column({ length: 255 })
  location: string;

  @Column({ length: 100 })
  landSize: string;

  @Column({ type: 'int', default: 0 })
  totalFloors: number;

  @Column({ type: 'int', default: 0 })
  totalUnits: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 50 })
  developerRatio: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 50 })
  landownerRatio: number;

  @Column({ type: 'date' })
  targetLaunchDate: string;

  @Column({ type: 'date' })
  expectedHandover: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  constructionProgress: number;

  @Column({ type: 'enum', enum: ProjectStatus, default: ProjectStatus.UPCOMING })
  status: ProjectStatus;

  @Column({ name: 'wip_account_id', nullable: true })
  wipAccountId: string | null;

  @OneToMany(() => Unit, (unit) => unit.project)
  units: Unit[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}