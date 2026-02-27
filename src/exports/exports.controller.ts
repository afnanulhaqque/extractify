import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ExportsService } from './exports.service';

@Controller('api/v1/exports')
export class ExportsController {
  constructor(private readonly exportsService: ExportsService) {}

  @Post()
  async exportData(@Body() body: { runId: string, format: string }) {
    const exportRecord = await this.exportsService.createExport(body.runId, body.format || 'csv');
    return { success: true, data: exportRecord };
  }

  @Get()
  async getExportHistory() {
    const history = await this.exportsService.getHistory();
    return { success: true, data: history };
  }

  @Get(':id/download')
  async downloadExport(@Param('id') id: string) {
    const data = await this.exportsService.download(id);
    return { success: true, data };
  }
}
