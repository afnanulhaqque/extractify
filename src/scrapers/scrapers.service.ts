import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ScrapersService {
  constructor(private prisma: PrismaService) {}

  async create(projectId: string, name: string, targetUrl: string, selectors: object = {}) {
    return this.prisma.scraper.create({
      data: { projectId, name, targetUrl, selectors: selectors as any },
    });
  }

  async findAll(projectId?: string) {
    if (projectId) {
      return this.prisma.scraper.findMany({ where: { projectId } });
    }
    return this.prisma.scraper.findMany();
  }

  async findOne(id: string) {
    const scraper = await this.prisma.scraper.findUnique({ where: { id } });
    if (!scraper) throw new NotFoundException('Scraper not found');
    return scraper;
  }

  async update(id: string, updateData: { name?: string; targetUrl?: string; selectors?: object }) {
    await this.findOne(id);
    return this.prisma.scraper.update({
      where: { id },
      data: {
        ...updateData,
        selectors: updateData.selectors ? updateData.selectors as any : undefined,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.scraper.delete({ where: { id } });
  }
}
