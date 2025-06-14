import { DRIZZLE } from '@/db/db.module';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { projects, SelectProject, SelectPublicProjectsView, publicProjectsView } from '@/db/schemas/projects.schema';
import { asc, count, desc, ilike } from 'drizzle-orm';
import { SearchDto, SearchResponseDto } from '@/common/dtos/search.dto';
import { CreateProjectDto } from './projects.dto';

@Injectable()
export class ProjectsService {
    constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase) { }

    async getProjects(params: SearchDto) {
        const page = parseInt(params.page || "1", 10);
        const limit = parseInt(params.limit || "10", 10);
        const offset = (page - 1) * limit;

        // const condition = params.search ? and(eq(projects.isDeleted, false), ilike(projects.name, `%${params.search}%`)) : eq(projects.isDeleted, false);

        const condition = params.search ? ilike(publicProjectsView.name, `%${params.search}%`) : undefined;

        try {
            const projectList = await this.db.select().from(publicProjectsView).where(condition).orderBy(params.sort === "asc" ? asc(publicProjectsView[params.sortBy || "created_at"]) : desc(publicProjectsView[params.sortBy || "created_at"])).limit(limit).offset(offset);
            const [countResult] = await this.db.select({ count: count(publicProjectsView.id) }).from(publicProjectsView).where(condition);

            return {
                data: projectList,
                total: countResult.count,
                page: page,
                limit: limit,
            } as SearchResponseDto<SelectPublicProjectsView>;
        }
        catch (error) {
            throw new BadRequestException(error.cause?.message || "Failed to fetch projects");
        }
    }

    async createProject(createProjectDto: CreateProjectDto): Promise<SelectProject> {
        const project = await this.db.insert(projects).values(createProjectDto).returning();
        return project[0];
    }
}
