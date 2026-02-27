import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ScrapersService } from './scrapers.service';

@Controller('api/v1/scrapers')
export class ScrapersController {
  constructor(private readonly scrapersService: ScrapersService) {}

  @Post()
  async create(@Body() createScraperDto: { projectId: string; name: string; targetUrl: string; selectors?: object }) {
    const scraper = await this.scrapersService.create(
      createScraperDto.projectId,
      createScraperDto.name,
      createScraperDto.targetUrl,
      createScraperDto.selectors
    );
    return { success: true, data: scraper };
  }

  @Get()
  async findAll(@Query('projectId') projectId?: string) {
    const scrapers = await this.scrapersService.findAll(projectId);
    return { success: true, data: scrapers };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const scraper = await this.scrapersService.findOne(id);
    return { success: true, data: scraper };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateScraperDto: { name?: string; targetUrl?: string; selectors?: object }) {
    const scraper = await this.scrapersService.update(id, updateScraperDto);
    return { success: true, data: scraper };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.scrapersService.remove(id);
    return { success: true, message: 'Deleted successfully' };
  }
}
