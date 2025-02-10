import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // Add validation input
  app.useGlobalPipes(new ValidationPipe());

  // Enable CORS
  app.enableCors({
    
    origin: ['http://localhost:3000'], // Các domain được phép
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Các phương thức HTTP được phép
    credentials: true, // Cho phép gửi cookie
  });

  // Swagger setup
  const configSwagger = new DocumentBuilder()
    .setTitle('API SONAHA')
    .setDescription('SONAHA API LIST')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const swagger = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('Swagger', app, swagger);

  // Lấy port từ ConfigService hoặc sử dụng mặc định là 8080
  const port = configService.get<number>('PORT') || 8080;
  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();

