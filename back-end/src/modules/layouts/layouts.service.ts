import { User } from '@/common/decorators/user.decorator';
import { Injectable } from '@nestjs/common';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class LayoutsService {
    constructor(projectsService: ProjectsService) { }
    async getDashboardLayout({ projectId, user }: { projectId: string, user: User }) {

    }
}
