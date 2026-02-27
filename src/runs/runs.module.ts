import { Module } from '@nestjs/common';
import { RunsService } from './runs.service';
import { RunsController } from './runs.controller';

@Module({
  providers: [RunsService],
  controllers: [RunsController]
})
export class RunsModule {}
