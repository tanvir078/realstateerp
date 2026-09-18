import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('account_mappings')
export class AccountMapping {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 80 })
  mappingKey: string;

  @Column({ length: 20 })
  accountCode: string;

  @Column({ length: 150 })
  label: string;

  @Column({ length: 40 })
  module: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
