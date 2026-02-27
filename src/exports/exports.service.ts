import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExportsService {
  constructor(private prisma: PrismaService) {}

  async createExport(runId: string, format: string) {
    const run = await this.prisma.scraperRun.findUnique({ where: { id: runId } });
    if (!run) throw new NotFoundException('Run not found');

    // Here we would typically trigger a background job to generate CSV/Excel and upload to S3
    // For MVP, we just create a record and return a mock URL
    return this.prisma.export.create({
      data: {
        runId,
        format,
        url: `https://mock-storage.com/exports/${runId}.${format}`
      }
    });
  }

  async getHistory() {
    return this.prisma.export.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async download(id: string) {
    const exp = await this.prisma.export.findUnique({ where: { id } });
    if (!exp) throw new NotFoundException('Export not found');
    return { url: exp.url };
  }
}
