import { NestFactory } from '@nestjs/core';
import { BotModule } from './bot.module';

async function bootstrap() {
  const app = await NestFactory.create(BotModule);

  return app.listen(0);
}
bootstrap();
