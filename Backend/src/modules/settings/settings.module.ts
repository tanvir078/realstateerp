import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemSetting } from './entities/system-setting.entity';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { RolesGuard } from '../../common/auth/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([SystemSetting])],
  controllers: [SettingsController],
  providers: [SettingsService, RolesGuard],
  exports: [SettingsService],
})
export class SettingsModule {}
