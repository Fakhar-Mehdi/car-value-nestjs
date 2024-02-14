import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
// import { config } from 'dotenv';

async function bootstrap() {
  const port = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);
  await app.listen(port);
  console.log(`Listening to the port ${port}`);
}

// config();
bootstrap();
