import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('payroll_lines')
export class PayrollLine {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ unique: true }) payslipNo: string;
  @Column() payrollId: string;
  @Column() payrollNo: string;
  @Column() employeeId: string;
  @Column() employeeCode: string;
  @Column() employeeName: string;
  @Column() department: string;
  @Column() designation: string;
  @Column() month: string;
  @Column() year: string;
  @Column({ type: 'decimal', precision: 15, scale: 2 }) basicSalary: number;
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 }) houseRent: number;
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 }) medicalAllowance: number;
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 }) siteAllowance: number;
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 }) allowances: number;
  @Column({ type: 'decimal', precision: 15, scale: 2 }) grossAmount: number;
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 }) providentFund: number;
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 }) otherDeduction: number;
  @Column({ type: 'decimal', precision: 15, scale: 2 }) totalDeduction: number;
  @Column({ type: 'decimal', precision: 15, scale: 2 }) netPayable: number;
  @CreateDateColumn() createdAt: Date;
}
