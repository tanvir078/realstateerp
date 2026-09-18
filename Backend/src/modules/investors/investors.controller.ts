import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { InvestorsService } from './investors.service';
import { Roles } from '../../common/auth/roles.decorator';
import { RolesGuard } from '../../common/auth/roles.guard';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('investors')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.VIEWER)
@Controller('investors')
export class InvestorsController {
  constructor(private readonly service: InvestorsService) {}
  @Get() list() { return this.service.listInvestors(); }
  @Post() create(@Body() dto: any) { return this.service.createInvestor(dto); }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: any) { return this.service.updateInvestor(id, dto); }
  @Get('allocations') allocations() { return this.service.listAllocations(); }
  @Post('allocations') createAllocation(@Body() dto: any) { return this.service.createAllocation(dto); }
  @Post('allocations/:id/receive') receiveInvestment(@Param('id') id: string, @Body() dto: any) {
    return this.service.receiveInvestment(id, dto);
  }
  @Get('payouts') payouts() { return this.service.listPayouts(); }
  @Post('payouts') createPayout(@Body() dto: any) { return this.service.createPayout(dto); }
  @Post('payouts/:id/process') process(@Param('id') id: string, @Body() dto: any) { return this.service.processPayout(id, dto); }
 @Get('dashboard')
  @ApiOperation({ summary: 'Get investors dashboard aggregates' })
  dashboard() {
    return this.service.getDashboard();
  } 
}