import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum TaxType {
  VAT = 'VAT',
  TDS = 'TDS',
}

@Entity('tax_configurations')
export class TaxConfiguration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: TaxType })
  type: TaxType;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 7, scale: 4 })
  ratePercent: number;

  @Column({ default: true })
  enabled: boolean;

  @Column({ type: 'date' })
  effectiveFrom: string;

  @Column({ type: 'date', nullable: true })
  effectiveTo?: string;

  @Column({ nullable: true })
  outputAccountCode?: string;

  @Column({ nullable: true })
  inputAccountCode?: string;

  @Column({ nullable: true })
  withholdingAccountCode?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
