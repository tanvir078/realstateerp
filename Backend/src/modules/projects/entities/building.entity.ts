import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Project } from './project.entity';
import { Unit } from './unit.entity';

@Entity('project_buildings')
export class Building {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 30 })
  buildingCode: string;

  @Column({ length: 150 })
  name: string;

  @Column({ type: 'int', default: 0 })
  totalFloors: number;

  @Column({ length: 30, default: 'ACTIVE' })
  status: string;

  @Column({ name: 'project_id' })
  projectId: string;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @OneToMany(() => Unit, (unit) => unit.building)
  units: Unit[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
