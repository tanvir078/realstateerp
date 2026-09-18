import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ unique: true }) employeeId: string;
  @Column() fullName: string;
  @Column() phone: string;
  @Column({ nullable: true }) email: string;
  @Column() department: string;
  @Column() designation: string;
  @Column({ type: 'date' }) joiningDate: string;
  @Column({ type: 'decimal', precision: 15, scale: 2 }) basicSalary: number;
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 }) houseRent: number;
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 }) medicalAllowance: number;
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 }) siteAllowance: number;
  @Column({ default: 'ACTIVE' }) status: string;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}

@Entity('attendance_records')
export class AttendanceRecord {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() employeeId: string;
  @Column({ type: 'date' }) date: string;
  @Column({ nullable: true }) checkIn: string;
  @Column({ nullable: true }) checkOut: string;
  @Column({ default: 'PRESENT' }) status: string;
  @Column({ nullable: true }) siteLocation: string;
  @Column({ nullable: true }) notes: string;
  @CreateDateColumn() createdAt: Date;
}

@Entity('payroll_runs')
export class PayrollRun {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ unique: true }) payrollNo: string;
  @Column() month: string;
  @Column() year: string;
  @Column({ name: 'project_id', nullable: true })
  projectId: string | null;
  @Column({ type: 'decimal', precision: 15, scale: 2 }) grossAmount: number;
  @Column({ type: 'decimal', precision: 15, scale: 2 }) totalDeduction: number;
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 }) withholdingAmount: number;
  @Column({ type: 'decimal', precision: 15, scale: 2 }) netPayable: number;
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 }) paidAmount: number;
  @Column({ default: 'DRAFT' }) status: string;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}

@Entity('leave_requests')
export class LeaveRequest {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() employeeId: string;
  @Column() leaveType: string;
  @Column({ type: 'date' }) startDate: string;
  @Column({ type: 'date' }) endDate: string;
  @Column() reason: string;
  @Column({ nullable: true }) reliever: string;
  @Column({ default: 'PENDING' }) status: string;
  @Column({ nullable: true }) decisionNote: string;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}

@Entity('employee_loans')
export class EmployeeLoan {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() employeeId: string;
  @Column() loanType: string;
  @Column({ type: 'decimal', precision: 15, scale: 2 }) principal: number;
  @Column({ type: 'decimal', precision: 15, scale: 2 }) installmentAmount: number;
  @Column({ type: 'decimal', precision: 15, scale: 2 }) outstanding: number;
  @Column({ type: 'date' }) startDate: string;
  @Column({ default: 'ACTIVE' }) status: string;
  @CreateDateColumn() createdAt: Date;
}

@Entity('loan_repayments')
export class LoanRepayment {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() loanId: string;
  @Column({ type: 'decimal', precision: 15, scale: 2 }) amount: number;
  @Column({ type: 'date' }) paymentDate: string;
  @CreateDateColumn() createdAt: Date;
}

@Entity('performance_reviews')
export class PerformanceReview {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() employeeId: string;
  @Column() period: string;
  @Column({ type: 'decimal', precision: 5, scale: 2 }) rating: number;
  @Column() reviewer: string;
  @Column() comments: string;
  @Column({ default: 'DRAFT' }) status: string;
  @CreateDateColumn() createdAt: Date;
}