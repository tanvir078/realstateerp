import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { HrService } from './hr.service';
import { CreateAttendanceDto, CreateEmployeeDto, CreatePayrollDto, UpdateEmployeeDto, UpdateAttendanceDto, CreateLeaveDto, CreateLoanDto, CreateRepaymentDto, CreatePerformanceReviewDto } from './dtos/hr.dto';
import { PayPayrollDto } from './dtos/pay-payroll.dto';
import { Roles } from '../../common/auth/roles.decorator';
import { RolesGuard } from '../../common/auth/roles.guard';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('hr')
@Controller('hr')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.VIEWER)
@ApiBearerAuth()
export class HrController {
  constructor(private service: HrService) {}

  @Get('employees') employees() { return this.service.findEmployees(); }

  @Post('employees') createEmployee(@Body() dto: CreateEmployeeDto) { return this.service.createEmployee(dto); }
  @Patch('employees/:id') updateEmployee(@Param('id') id: string, @Body() dto: UpdateEmployeeDto) { return this.service.updateEmployee(id, dto); }

  @Get('attendance') attendance() { return this.service.findAttendance(); }

  @Post('attendance') recordAttendance(@Body() dto: CreateAttendanceDto) { return this.service.recordAttendance(dto); }
  @Patch('attendance/:id') updateAttendance(@Param('id') id: string, @Body() dto: UpdateAttendanceDto) { return this.service.updateAttendance(id, dto); }
  @Get('leave') leave() { return this.service.findLeaves(); }
  @Post('leave') createLeave(@Body() dto: CreateLeaveDto) { return this.service.createLeave(dto); }
  @Post('leave/:id/approve') approveLeave(@Param('id') id: string, @Body('decisionNote') decisionNote?: string) { return this.service.decideLeave(id, 'APPROVED', decisionNote); }
  @Post('leave/:id/reject') rejectLeave(@Param('id') id: string, @Body('decisionNote') decisionNote?: string) { return this.service.decideLeave(id, 'REJECTED', decisionNote); }
  @Get('loans') loans() { return this.service.findLoans(); }
  @Post('loans') createLoan(@Body() dto: CreateLoanDto) { return this.service.createLoan(dto); }
  @Post('loans/:id/repay') repayLoan(@Param('id') id: string, @Body() dto: CreateRepaymentDto) { return this.service.repayLoan(id, dto); }
  @Get('performance') performance() { return this.service.findPerformanceReviews(); }
  @Post('performance') createPerformance(@Body() dto: CreatePerformanceReviewDto) { return this.service.createPerformanceReview(dto); }

  @Get('payroll') payroll() { return this.service.findPayroll(); }
  @Get('payslips') payslips() { return this.service.findPayslips(); }
  @Get('payslips/:id') payslip(@Param('id') id: string) { return this.service.findPayslip(id); }

  @Post('payroll') createPayroll(@Body() dto: CreatePayrollDto) { return this.service.createPayroll(dto); }

  @Post('payroll/:id/approve') approve(@Param('id') id: string) { return this.service.approvePayroll(id); }

  @Post('payroll/:id/post') post(@Param('id') id: string) { return this.service.postPayroll(id); }

  @Post('payroll/:id/pay') pay(@Param('id') id: string, @Body() dto: PayPayrollDto) { return this.service.payPayroll(id, dto); }
}