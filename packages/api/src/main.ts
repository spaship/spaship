import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { ALLOWED_ORIGIN, ENV, ENV_TYPE, SPASHIP_VERSION } from './configuration';
import { LoggingInterceptor } from './configuration/interceptors/logger.interceptor';
import { ResponseFormat, ResponseInterceptor } from './configuration/interceptors/response.interceptor';
import { LoggerService } from './configuration/logger/logger.service';
import { TrimPipe } from './configuration/pipe/trim-pipe.pipe';
import { AllExceptionFilter } from './server/exceptions/exception.filter';

async function bootstrap() {
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
  if (ENV_TYPE !== ENV.PRODUCTION && ENV_TYPE !== ENV.STAGE) {
    const config = new DocumentBuilder()
      .addBearerAuth()
      .setTitle('SPAship API Documentation')
      .setDescription('Doc for SPAship apis')
      .setVersion(SPASHIP_VERSION)
      .build();
    const document = SwaggerModule.createDocument(app, config, {
      extraModels: [ResponseFormat],
      deepScanRoutes: true
    });
    SwaggerModule.setup('api-docs', app, document);
    app.enableCors({
      origin: ALLOWED_ORIGIN.hosts,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'
    });
  }

  await app.listen(2345);
}
bootstrap();
