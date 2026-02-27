import { Controller, Get, Post, Param, Delete, Query } from '@nestjs/common';
import { RunsService } from './runs.service';

@Controller('api/v1')
export class RunsController {
  constructor(private readonly runsService: RunsService) {}

  @Post('scrapers/:id/run')
  async runScraper(@Param('id') scraperId: string) {
    const run = await this.runsService.runScraper(scraperId);
    return { success: true, data: run };
  }

  @Get('scrapers/:id/runs')
  async getRuns(@Param('id') scraperId: string) {
    const runs = await this.runsService.findAllForScraper(scraperId);
    return { success: true, data: runs };
  }

  @Get('runs/:runId')
  async getRunDetails(@Param('runId') runId: string) {
    const run = await this.runsService.findOne(runId);
    return { success: true, data: run };
  }

  @Post('runs/:runId/stop')
  async stopRunningJob(@Param('runId') runId: string) {
    const run = await this.runsService.stopRun(runId);
    return { success: true, data: run };
  }

  @Get('runs/:runId/data')
  async getData(@Param('runId') runId: string, @Query('page') page: string, @Query('limit') limit: string) {
    const data = await this.runsService.getData(runId, page ? parseInt(page) : 1, limit ? parseInt(limit) : 50);
    return { success: true, data };
  }

  @Get('runs/:runId/data/search')
  async searchData(@Param('runId') runId: string, @Query('q') query: string) {
    const data = await this.runsService.searchData(runId, query || '');
    return { success: true, data };
  }

  @Delete('runs/:runId/data')
  async deleteData(@Param('runId') runId: string) {
    const run = await this.runsService.clearData(runId);
    return { success: true, message: 'Data cleared successfully' };
  }
}
