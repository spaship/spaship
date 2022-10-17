import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import { AllExceptionFilter } from "./core/filter/exception.filter";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { LoggingInterceptor } from "./core/interceptors/logger.interceptor";
import { LoggerService } from "./core/logger/logger.service";
import { ResponseFormat, ResponseInterceptor } from "./core/interceptors/response.interceptor";

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
  if (env !== "production") {
    const config = new DocumentBuilder()
      .addBearerAuth()
      .setTitle("SPAship API Documentation")
      .setDescription("Doc for SPAship apis")
      .setVersion("1.0")
      .build();
    const document = SwaggerModule.createDocument(app, config, {
      extraModels: [ResponseFormat],
      deepScanRoutes: true,
    });
    SwaggerModule.setup("api", app, document);
  }

  await app.listen(3000);
}
bootstrap();
