import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Import modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AccountingModule } from './modules/accounting/accounting.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { ClientsModule } from './modules/clients/clients.module';
import { SalesModule } from './modules/sales/sales.module';
import { ProcurementModule } from './modules/procurement/procurement.module';
import { ConstructionModule } from './modules/construction/construction.module';
import { InvestorsModule } from './modules/investors/investors.module';
import { HrModule } from './modules/hr/hr.module';
import { ReportsModule } from './modules/reports/reports.module';
import { SettingsModule } from './modules/settings/settings.module';
import { AuditModule } from './modules/audit/audit.module';
import { ThrottlerGuard } from '@nestjs/throttler';

function validateEnvironment(config: Record<string, unknown>) {
  const nodeEnv = String(config.NODE_ENV ?? 'development');
  const required = ['DB_HOST', 'DB_USERNAME', 'DB_DATABASE', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];
  const missing = required.filter((key) => !config[key]);
  if (missing.length) throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  if (nodeEnv === 'production') {
    if (config.DB_SYNCHRONIZE === 'true') throw new Error('DB_SYNCHRONIZE must be false in production');
    if (String(config.JWT_SECRET).includes('change_in_production') || String(config.JWT_REFRESH_SECRET).includes('change_in_production')) {
      throw new Error('Production JWT secrets must be replaced with non-default values');
    }
  }
  return config;
}

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate: validateEnvironment,
    }),

    // Rate Limiting
    ThrottlerModule.forRoot([
      {
        ttl: parseInt(process.env.THROTTLE_TTL) || 60000,
        limit: parseInt(process.env.THROTTLE_LIMIT) || 100,
      },
    ]),

    // Database
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE || 'slbl_erp',
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false' } : false,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
      migrationsRun: process.env.DB_MIGRATIONS_RUN === 'true' ||
        (process.env.NODE_ENV === 'production' && process.env.DB_MIGRATIONS_RUN !== 'false'),
      synchronize: process.env.NODE_ENV !== 'production' && process.env.DB_SYNCHRONIZE === 'true',
      logging: process.env.DB_LOGGING === 'true',
    }),

    // Feature Modules
    AuthModule,
    UsersModule,
    AccountingModule,
    ProjectsModule,
    ClientsModule,
    SalesModule,
    ProcurementModule,
    ConstructionModule,
    InvestorsModule,
    HrModule,
    ReportsModule,
    SettingsModule,
    AuditModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
