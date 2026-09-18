import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemSetting } from './entities/system-setting.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(SystemSetting)
    private readonly settingsRepository: Repository<SystemSetting>,
  ) {}

  findAll() {
    return this.settingsRepository.find({ order: { key: 'ASC' } });
  }

  async findOne(key: string) {
    const setting = await this.settingsRepository.findOne({ where: { key } });
    if (!setting) throw new NotFoundException(`Setting ${key} was not found`);
    return setting;
  }

  async upsert(key: string, value: unknown, updatedBy?: string) {
    const setting = this.settingsRepository.create({ key, value, updatedBy });
    return this.settingsRepository.save(setting);
  }
}
