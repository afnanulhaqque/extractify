import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(workspaceId: string, name: string) {
    return this.prisma.project.create({
      data: { name, workspaceId },
    });
  }

  async findAll(workspaceId: string) {
    return this.prisma.project.findMany({
      where: { workspaceId },
    });
  }

  async findOne(id: string, workspaceId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id, workspaceId },
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async update(id: string, workspaceId: string, name: string) {
    await this.findOne(id, workspaceId);
    return this.prisma.project.update({
      where: { id },
      data: { name },
    });
  }

  async remove(id: string, workspaceId: string) {
    await this.findOne(id, workspaceId);
    return this.prisma.project.delete({ where: { id } });
  }
}
