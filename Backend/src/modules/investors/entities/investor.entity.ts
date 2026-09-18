import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('investors')
export class Investor {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ length: 150 }) name: string;
  @Column({ length: 30 }) type: string;
  @Column({ length: 40 }) contact: string;
  @Column({ length: 150 }) email: string;
  @Column({ nullable: true }) address?: string;
  @Column({ default: 'ACTIVE' }) status: string;
  @Column({ type: 'date' }) joined: string;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
