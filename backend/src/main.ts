import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AppService } from './app.service';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors({
    credentials: true,
    origin: async (
      requestOrigin: string,
      next: (err: Error | null, origin?: string[]) => void,
    ) => {
      const origins = await app.get(AppService).getOrigins();
      next(null, origins);
    },
  });


  const config = new DocumentBuilder()
    .setTitle('Visão API')
    .setDescription('Sistema de triagem ocular escolar')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  SwaggerModule.setup('api-docs', app, SwaggerModule.createDocument(app, config));

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
