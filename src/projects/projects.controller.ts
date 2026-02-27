import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProjectsService } from './projects.service';

@Controller('api/v1/projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  async create(@Body() createProjectDto: { name: string, workspaceId: string }) {
    const project = await this.projectsService.create(createProjectDto.workspaceId, createProjectDto.name);
    return { success: true, data: project };
  }

  @Get()
  async findAll(@Query('workspaceId') workspaceId: string) {
    // Note: MVP says GET /projects, but realistically it needs workspace context.
    // If workspaceId is not provided, we could fetch all projects for the user through workspaces, but standard is passing workspaceId or getting it from a header.
    // Assuming workspaceId is passed as query param for MVP purposes.
    const projects = await this.projectsService.findAll(workspaceId);
    return { success: true, data: projects };
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Query('workspaceId') workspaceId: string) {
    const project = await this.projectsService.findOne(id, workspaceId);
    return { success: true, data: project };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Query('workspaceId') workspaceId: string, @Body() updateProjectDto: { name: string }) {
    const project = await this.projectsService.update(id, workspaceId, updateProjectDto.name);
    return { success: true, data: project };
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Query('workspaceId') workspaceId: string) {
    await this.projectsService.remove(id, workspaceId);
    return { success: true, message: 'Deleted successfully' };
  }
}
