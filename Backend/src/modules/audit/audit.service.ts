import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';

@Injectable()
export class AuditService {
  constructor(@InjectRepository(AuditLog) private readonly repository: Repository<AuditLog>) {}

  record(input: Partial<AuditLog>) {
    return this.repository.save(this.repository.create(input));
  }

  findAll(limit = 100) {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: Math.min(Math.max(limit, 1), 500) });
  }
}
