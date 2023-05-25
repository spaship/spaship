import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './configuration/interceptors/logger.interceptor';
import { ResponseFormat, ResponseInterceptor } from './configuration/interceptors/response.interceptor';
import { LoggerService } from './configuration/logger/logger.service';
import { TrimPipe } from './configuration/pipe/trim-pipe.pipe';
import { AllExceptionFilter } from './server/exceptions/exception.filter';

async function bootstrap() {
  const env = process.env.NODE_ENV;
  const app = await NestFactory.create(AppModule);

  // cookie parser
  app.use(cookieParser());

  // pipes
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalPipes(new TrimPipe());

  // filter
  app.useGlobalFilters(new AllExceptionFilter(new LoggerService()));

  // interceptors
  app.useGlobalInterceptors(new LoggingInterceptor(new LoggerService()));
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.setGlobalPrefix('api/v1', {
    exclude: [{ path: 'api-docs', method: RequestMethod.GET }]
  });

  // swagger & cors config
  if (env !== 'production' && env !== 'stage') {
    const config = new DocumentBuilder()
      .addBearerAuth()
      .setTitle('SPAship API Documentation')
      .setDescription('Doc for SPAship apis')
      .setVersion('3.3.0')
      .build();
    const document = SwaggerModule.createDocument(app, config, {
      extraModels: [ResponseFormat],
      deepScanRoutes: true
    });
    SwaggerModule.setup('api-docs', app, document);
    app.enableCors({
      origin: ['http://localhost:2468'],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'
    });
  }

  await app.listen(2345);
}
bootstrap();
