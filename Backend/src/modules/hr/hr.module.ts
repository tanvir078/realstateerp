import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HrController } from './hr.controller';
import { HrService } from './hr.service';
import { Employee, AttendanceRecord, PayrollRun, LeaveRequest, EmployeeLoan, LoanRepayment, PerformanceReview } from './entities/hr-workflow.entity';
import { PayrollLedgerEntry } from './entities/payroll-ledger.entity';
import { PayrollLine } from './entities/payroll-line.entity';
import { AccountingModule } from '../accounting/accounting.module';
import { RolesGuard } from '../../common/auth/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, AttendanceRecord, PayrollRun, LeaveRequest, EmployeeLoan, LoanRepayment, PerformanceReview, PayrollLedgerEntry, PayrollLine]), AccountingModule],
  controllers: [HrController],
  providers: [HrService, RolesGuard],
  exports: [HrService],
})
export class HrModule {}
