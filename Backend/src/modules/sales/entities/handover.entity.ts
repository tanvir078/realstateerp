import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum HandoverStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ON_HOLD = 'ON_HOLD',
}

@Entity('handovers')
export class Handover {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ unique: true }) handoverCode: string;
  @Column() saleId: string;
  @Column() clientId: string;
  @Column() projectName: string;
  @Column() unitNo: string;
  @Column({ type: 'date' }) scheduledDate: string;
  @Column({ type: 'date', nullable: true }) actualDate: string;
  @Column({ type: 'enum', enum: HandoverStatus, default: HandoverStatus.PENDING }) status: HandoverStatus;
  @Column({ type: 'int', default: 0 }) completionPercentage: number;
  @Column({ type: 'int', default: 12 }) checklistItems: number;
  @Column({ type: 'int', default: 0 }) checklistCompleted: number;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
