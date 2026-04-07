import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const publicPath = join(process.cwd(), 'public');
  app.useStaticAssets(publicPath);

  // CORS — permitir web app e mobile
  app.enableCors({
    origin: [
      process.env.WEB_URL || 'http://localhost:3000',
      'http://localhost:19006', // Expo
    ],
    credentials: true,
  });

  // Validação global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,          // Remove campos não esperados
      forbidNonWhitelisted: true,
      transform: true,          // Converte tipos automaticamente
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Prefixo global da API
  app.setGlobalPrefix('api/v1');

  // Swagger — documentação automática
  const config = new DocumentBuilder()
    .setTitle('🐾 PetShop Gestão API')
    .setDescription('API completa para gestão de petshop com banho, tosa, hotel e táxi dog')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = parseInt(process.env.PORT || '3000', 10);
  await app.listen(port);

  console.log(`\n🐾 PetShop API rodando na porta: ${port}`);
  console.log(`📋 Documentação: http://localhost:${port}/docs`);
}

bootstrap();
