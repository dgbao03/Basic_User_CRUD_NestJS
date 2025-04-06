import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get("PORT");

  // const dataSource = app.get(DataSource);
  // if (dataSource.isInitialized) {
  //   console.log('Database connection established successfully!');
  // } else {
  //   console.error('Failed to connect to database!');
  // }

  await app.listen(port);
}
bootstrap();
