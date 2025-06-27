import { SearchDto } from '@/common/dtos/search.dto';
import { Body, Controller, Get, Post, Query, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './projects.dto';
import { ProjectSerializer } from './project.serializer';
import { AuthGuard } from '@/common/guards/auth.guard';
import { GetUser, User } from '@/common/decorators/user.decorator';

@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) { }

    @UseGuards(AuthGuard)
    @Get('list')
    async getProjectsList(@Query() search: SearchDto) {
        return await this.projectsService.getProjects(search);
    }

    @UseGuards(AuthGuard)
    @Post('create')
    async createProject(@Body() createProjectDto: CreateProjectDto, @GetUser() user: User) {
        const project = await this.projectsService.createProject(createProjectDto, user);
        return new ProjectSerializer(project);
    }
}
