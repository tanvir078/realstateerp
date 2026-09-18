import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.getHttpAdapter().getInstance().disable('x-powered-by');

  // Global prefix
  const apiPrefix = process.env.API_PREFIX || 'api/v1';
  app.setGlobalPrefix(apiPrefix);

  // Enable CORS
  app.enableCors({
    origin: (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',').map((origin) => origin.trim()),
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('SLBL ERP API')
      .setDescription('Sardar Landmark & Builders Ltd. - Enterprise Resource Planning System API')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, config));
  }

  const port = Number(process.env.PORT || 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be a valid TCP port');
  await app.listen(port);

  console.log(`
    🚀 SLBL ERP Backend API
    📡 Server running on: http://localhost:${port}/${apiPrefix}
    📚 API Documentation: http://localhost:${port}/api/docs
    🏢 Company: ${process.env.COMPANY_NAME || 'Sardar Landmark & Builders Ltd.'}
    🌍 Environment: ${process.env.NODE_ENV || 'development'}
  `);
}

bootstrap();
