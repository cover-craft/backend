import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { UserExceptionFilter } from './app.filter';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.MATCHING_SERVICE_HOST || 'localhost',
        port: parseInt(process.env.MATCHING_SERVICE_PORT) || 20020,
      },
    },
  );
  app.useGlobalFilters(new UserExceptionFilter());

  await app.listen();
}
bootstrap();
