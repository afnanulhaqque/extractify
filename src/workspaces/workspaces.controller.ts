import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';

@Controller('api/v1/workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Post()
  async create(@Request() req: any, @Body() createWorkspaceDto: { name: string }) {
    const workspace = await this.workspacesService.create(req.user.id, createWorkspaceDto.name);
    return { success: true, data: workspace };
  }

  @Get()
  async findAll(@Request() req: any) {
    const workspaces = await this.workspacesService.findAll(req.user.id);
    return { success: true, data: workspaces };
  }

  @Get(':id')
  async findOne(@Request() req: any, @Param('id') id: string) {
    const workspace = await this.workspacesService.findOne(id, req.user.id);
    return { success: true, data: workspace };
  }

  @Patch(':id')
  async update(@Request() req: any, @Param('id') id: string, @Body() updateWorkspaceDto: { name: string }) {
    const workspace = await this.workspacesService.update(id, req.user.id, updateWorkspaceDto.name);
    return { success: true, data: workspace };
  }

  @Delete(':id')
  async remove(@Request() req: any, @Param('id') id: string) {
    await this.workspacesService.remove(id, req.user.id);
    return { success: true, message: 'Deleted successfully' };
  }
}
