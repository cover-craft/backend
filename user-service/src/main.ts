import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { UserExceptionFilter } from './app.filter';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.USER_SERVICE_HOST || 'localhost',
        port: parseInt(process.env.USER_SERVICE_PORT) || 20010,
      },
    },
  );
  app.useGlobalFilters(new UserExceptionFilter());

  await app.listen();
}
bootstrap();
