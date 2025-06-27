import { SearchDto, SearchResponseDto } from '@/common/dtos/search.dto';
import { DRIZZLE } from '@/db/db.module';
import { userRoles } from '@/db/schemas';
import { logs } from '@/db/schemas/logs.schema';
import { roles, SelectRole } from '@/db/schemas/roles.schema';
import { BadRequestException, ConflictException, Inject, Injectable } from '@nestjs/common';
import { count, desc, eq, ilike, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

@Injectable()
export class RolesService {
    constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase) { }

    async createRole(role: string, doneBy: string) {
        const checkExisting = await this.db.select().from(roles).where(eq(roles.role, role)).limit(1);
        if (checkExisting.length > 0) {
            throw new ConflictException(`Role ${role} already exits`);
        }
        const newRole = await this.db.insert(roles).values({ role }).returning();
        await this.db.insert(logs).values({
            action: "CREATED",
            targetId: newRole[0].id,
            targetTable: "roles",
            doneBy
        });
        return newRole[0];
    }

    async getRoles(params: SearchDto) {
        const page = parseInt(params.page || "1", 10);
        const limit = parseInt(params.limit || "10", 10);
        const offset = (page - 1) * limit;

        const condition = params.search ? ilike(roles.role, `%${params.search}%`) : undefined;

        try {
            const allRoles = await this.db.select({
                id: roles.id,
                role: roles.role,
                permissions: roles.permissions,
                userCount: sql<number>`COUNT(${userRoles.userId})`.as('userCount'),
                createdAt: sql<Date>`min(case when ${logs.action} = 'CREATE' then ${logs.doneAt} end)`.as('created_at'),
                updatedAt: sql<Date>`max(${logs.doneAt})`.as('updated_at'),
            })
                .from(roles)
                .leftJoin(logs, sql`${logs.targetId}::uuid = ${roles.id}`)
                .leftJoin(userRoles, eq(userRoles.roleId, roles.id))
                .where(condition)
                .groupBy(
                    roles.id,
                    roles.role,
                    roles.permissions,
                    logs.doneAt,
                    logs.doneBy
                )
                .orderBy(desc(roles.role))
                .limit(limit)
                .offset(offset);
            const [countResult] = await this.db.select({ count: count(roles.id) }).from(roles).where(condition);
            return {
                data: allRoles,
                total: countResult.count,
                page: page,
                limit: limit,
            } as SearchResponseDto<SelectRole & { userCount: number; createdAt: Date | null; updatedAt: Date | null }>;

        } catch (error) {
            throw new BadRequestException(error.cause?.message || "Failed to fetch projects");
        }
    }
}
