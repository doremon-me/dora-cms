import { DRIZZLE } from '@/db/db.module';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { projects, SelectProject, SelectPublicProjectsView, publicProjectsView } from '@/db/schemas/projects.schema';
import { and, asc, count, desc, eq, ilike, sql } from 'drizzle-orm';
import { SearchDto, SearchResponseDto } from '@/common/dtos/search.dto';
import { CreateProjectDto } from './projects.dto';
import { logs } from '@/db/schemas/logs.schema';
import { User } from '@/common/decorators/user.decorator';

@Injectable()
export class ProjectsService {
    constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase) { }

    async getProjects(params: SearchDto) {
        const page = parseInt(params.page || "1", 10);
        const limit = parseInt(params.limit || "10", 10);
        const offset = (page - 1) * limit;

        const condition = params.search ? ilike(publicProjectsView.name, `%${params.search}%`) : undefined;

        try {
            const projects = await this.db.select({
                id: publicProjectsView.id,
                name: publicProjectsView.name,
                description: publicProjectsView.description,
                type: publicProjectsView.type,
                origin: publicProjectsView.origin,
                createdAt: sql<Date>`min(case when ${logs.action} = 'CREATE' then ${logs.doneAt} end)`.as('created_at'),
                updatedAt: sql<Date>`max(${logs.doneAt})`.as('updated_at'),
            })
                .from(publicProjectsView)
                .leftJoin(logs, sql`${logs.targetId}::uuid = ${publicProjectsView.id}`)
                .where(condition)
                .groupBy(
                    publicProjectsView.id,
                    publicProjectsView.name,
                    publicProjectsView.description,
                    publicProjectsView.type,
                    publicProjectsView.origin
                )
                .orderBy(desc(sql`max(${logs.doneAt})`))
                .limit(limit)
                .offset(offset);
            const [countResult] = await this.db.select({ count: count(publicProjectsView.id) }).from(publicProjectsView).where(condition);

            return {
                data: projects,
                total: countResult.count,
                page: page,
                limit: limit,
            } as SearchResponseDto<SelectPublicProjectsView & { createdAt: Date | null, updatedAt: Date | null }>;
        }
        catch (error) {
            throw new BadRequestException(error.cause?.message || "Failed to fetch projects");
        }
    }

    async createProject(createProjectDto: CreateProjectDto, user: User): Promise<SelectProject> {
        const project = await this.db.insert(projects).values(createProjectDto).returning();
        await this.db.insert(logs).values({
            action: "CREATED",
            targetTable: "projects",
            targetId: project[0].id,
            doneBy: user?.id || "unknown"
        })
        return project[0];
    }
}
