import { Module } from '@nestjs/common';
import { ScrapersService } from './scrapers.service';
import { ScrapersController } from './scrapers.controller';

@Module({
  providers: [ScrapersService],
  controllers: [ScrapersController]
})
export class ScrapersModule {}
