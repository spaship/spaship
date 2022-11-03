import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './configuration/interceptors/logger.interceptor';
import { ResponseFormat, ResponseInterceptor } from './configuration/interceptors/response.interceptor';
import { LoggerService } from './configuration/logger/logger.service';
import { AllExceptionFilter } from './server/exceptions/exception.filter';
import { SSEConsumeService } from './server/sse-services/service/sse-consume.service';

async function bootstrap() {
  const env = process.env.NODE_ENV;
  const app = await NestFactory.create(AppModule);

  // cookie parser
  app.use(cookieParser());

  // pipes
  app.useGlobalPipes(new ValidationPipe());

  // filter
  app.useGlobalFilters(new AllExceptionFilter(new LoggerService()));

  // interceptors
  app.useGlobalInterceptors(new LoggingInterceptor(new LoggerService()));
  app.useGlobalInterceptors(new ResponseInterceptor());

  // swagger config
  if (env !== 'production') {
    const config = new DocumentBuilder()
      .addBearerAuth()
      .setTitle('SPAship API Documentation')
      .setDescription('Doc for SPAship apis')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config, {
      extraModels: [ResponseFormat],
      deepScanRoutes: true
    });
    SwaggerModule.setup('api', app, document);
  }
  new SSEConsumeService().consumeEvent();
  await app.listen(2345);
}
bootstrap();
