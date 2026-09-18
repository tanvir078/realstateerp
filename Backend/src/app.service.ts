import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  constructor(private readonly dataSource: DataSource) {}

  getHello(): string {
    return 'SLBL ERP API - Sardar Landmark & Builders Ltd.';
  }

  getHealth() {
    return this.dataSource.query('SELECT 1')
      .then(() => ({
        status: 'ok',
        database: 'connected',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0',
      }))
      .catch(() => ({
        status: 'degraded',
        database: 'unavailable',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0',
      }));
  }
}
