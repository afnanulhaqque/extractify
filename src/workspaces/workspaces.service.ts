import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorkspacesService {
  constructor(private prisma: PrismaService) {}

  async create(ownerId: string, name: string) {
    return this.prisma.workspace.create({
      data: { name, ownerId },
    });
  }

  async findAll(ownerId: string) {
    return this.prisma.workspace.findMany({
      where: { ownerId },
    });
  }

  async findOne(id: string, ownerId: string) {
    const workspace = await this.prisma.workspace.findFirst({
      where: { id, ownerId },
    });
    if (!workspace) throw new NotFoundException();
    return workspace;
  }

  async update(id: string, ownerId: string, name: string) {
    await this.findOne(id, ownerId);
    return this.prisma.workspace.update({
      where: { id },
      data: { name },
    });
  }

  async remove(id: string, ownerId: string) {
    await this.findOne(id, ownerId);
    return this.prisma.workspace.delete({ where: { id } });
  }
}
