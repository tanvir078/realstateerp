import { Body, Controller, Get, Param, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../../common/auth/roles.decorator';
import { RolesGuard } from '../../common/auth/roles.guard';
import { UserRole } from '../users/entities/user.entity';
import { SettingsService } from './settings.service';

@ApiTags('settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.ACCOUNTING_MANAGER, UserRole.VIEWER)
  @ApiOperation({ summary: 'List system settings' })
  findAll() {
    return this.settingsService.findAll();
  }

  @Get(':key')
  @Roles(UserRole.ADMIN, UserRole.ACCOUNTING_MANAGER, UserRole.VIEWER)
  findOne(@Param('key') key: string) {
    return this.settingsService.findOne(key);
  }

  @Put(':key')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create or update a system setting' })
  upsert(@Param('key') key: string, @Body('value') value: unknown, @Req() request: { user: { id: string } }) {
    return this.settingsService.upsert(key, value, request.user.id);
  }
}
