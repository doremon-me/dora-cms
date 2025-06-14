import { SearchDto } from '@/common/dtos/search.dto';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './projects.dto';
import { ProjectSerializer } from './project.serializer';

@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) { }
    @Get('list')
    async getProjectsList(@Query() search: SearchDto) {
        const projects = await this.projectsService.getProjects(search);
        return projects;
    }

    @Post('create')
    async createProject(@Body() createProjectDto: CreateProjectDto) {
        const project = await this.projectsService.createProject(createProjectDto);
        return new ProjectSerializer(project);
    }
}
