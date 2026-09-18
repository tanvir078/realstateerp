import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('site_labor_records')
export class SiteLaborRecord {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ type: 'date' }) date: string;
  @Column() projectSite: string;
  @Column({ name: 'project_id', nullable: true })
  projectId: string | null;
  @Column() contractor: string;
  @Column({ type: 'int', default: 0 }) masonsCount: number;
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 }) masonsRate: number;
  @Column({ type: 'int', default: 0 }) helpersCount: number;
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 }) helpersRate: number;
  @Column({ type: 'int', default: 0 }) electriciansCount: number;
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 }) electriciansRate: number;
  @Column({ type: 'int', default: 0 }) carpentersCount: number;
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 }) carpentersRate: number;
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 }) overtimeHours: number;
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 }) overtimeRate: number;
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 }) totalPayable: number;
  @Column({ default: 'PENDING' }) status: string;
  @Column({ nullable: true }) disbursementDate?: string;
  @Column({ nullable: true }) paymentMethod?: string;
  @Column({ nullable: true }) referenceNumber?: string;
  @Column({ type: 'text', nullable: true }) notes?: string;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
