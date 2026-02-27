import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RunsService {
  constructor(private prisma: PrismaService) {}

  async runScraper(scraperId: string) {
    const scraper = await this.prisma.scraper.findUnique({ where: { id: scraperId } });
    if (!scraper) throw new NotFoundException('Scraper not found');

    // Here we would typically queue a BullMQ job. For MVP, we just create the record.
    return this.prisma.scraperRun.create({
      data: { scraperId, status: 'RUNNING', startedAt: new Date() },
    });
  }

  async findAllForScraper(scraperId: string) {
    return this.prisma.scraperRun.findMany({ where: { scraperId }, orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const run = await this.prisma.scraperRun.findUnique({ where: { id } });
    if (!run) throw new NotFoundException('Run not found');
    return run;
  }

  async stopRun(id: string) {
    await this.findOne(id);
    return this.prisma.scraperRun.update({
      where: { id },
      data: { status: 'STOPPED', completedAt: new Date() },
    });
  }

  async getData(id: string, page: number = 1, limit: number = 50) {
    const run = await this.findOne(id);
    const data = (run.data as any[]) || [];
    const startIndex = (page - 1) * limit;
    const paginatedData = data.slice(startIndex, startIndex + limit);
    return { data: paginatedData, total: data.length, page, limit };
  }

  async searchData(id: string, keyword: string) {
    const run = await this.findOne(id);
    const data = (run.data as any[]) || [];
    const filtered = data.filter(item => JSON.stringify(item).toLowerCase().includes(keyword.toLowerCase()));
    return filtered;
  }

  async clearData(id: string) {
    await this.findOne(id);
    return this.prisma.scraperRun.update({
      where: { id },
      data: { data: [] },
    });
  }
}
