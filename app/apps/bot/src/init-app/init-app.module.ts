import { Module } from '@nestjs/common';
import { InitAppService } from './init-app.service';

@Module({
  providers: [InitAppService],
})
export class InitAppModule {}
