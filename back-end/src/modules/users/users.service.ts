import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { and, count, desc, eq, ilike, or, sql } from "drizzle-orm";
import { InsertUser, SelectUser, userRoles, users } from '@db/schemas/users.schema';
import { DRIZZLE } from '@db/db.module';
import { logs } from '@/db/schemas/logs.schema';
import { SearchDto } from '@/common/dtos/search.dto';
import { roles } from '@/db/schemas/roles.schema';
import { hash } from 'bcrypt';
import * as schema from "@db/schemas"

@Injectable()
export class UsersService {
    constructor(
        @Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>
    ) { }

    async getUsers(params: SearchDto, currentUserId?: string) {
        const page = parseInt(params.page || "1", 10);
        const limit = parseInt(params.limit || "10", 10);
        const offset = (page - 1) * limit;

        const searchCondition = params.search ? or(
            ilike(users.firstName, `%${params.search}%`),
            ilike(users.lastName, `%${params.search}%`),
            ilike(users.email, `%${params.search}%`)
        ) : undefined;

        const excludeCurrentUser = currentUserId ? sql`${users.id} != ${currentUserId}` : undefined;

        const condition = and(searchCondition, excludeCurrentUser, eq(users.isDeleted, false));

        try {
            const usersLists = await this.db.select({
                id: users.id,
                firstName: users.firstName,
                lastName: users.lastName,
                email: users.email,
                isActive: users.isActive,
                role: sql<string>`COALESCE(${roles.role}, 'No Role')`.as('role'),
                createdAt: logs.doneAt,
                isDeleted: users.isDeleted,
            })
                .from(users)
                .leftJoin(userRoles, eq(userRoles.userId, users.id))
                .leftJoin(roles, eq(roles.id, userRoles.roleId))
                .leftJoin(logs, and(
                    sql`${logs.targetId}::uuid = ${users.id}`,
                    eq(logs.action, 'CREATED'),
                    eq(logs.targetTable, 'users')
                ))
                .where(condition)
                .groupBy(
                    users.id,
                    users.firstName,
                    users.lastName,
                    users.email,
                    roles.role,
                    users.isActive,
                    logs.doneAt
                )
                .orderBy(desc(logs.doneAt))
                .limit(limit)
                .offset(offset);
            const [countResult] = await this.db.select({ count: count(users.id) }).from(users).where(condition);
            return {
                data: usersLists,
                total: countResult.count,
                page: page,
                limit: limit,
            };
        } catch (error) {
            throw new BadRequestException(error.cause?.message || "Failed to fetch projects");
        }
    }

    async getUserDetails(params: {
        id?: SelectUser['id'];
        email?: SelectUser['email'];
    }) {
        if (!params.id && !params.email) {
            return null;
        }

        let whereCondition;
        if (params.id) {
            whereCondition = and(eq(users.id, params.id), eq(users.isDeleted, false));
        } else if (params.email) {
            whereCondition = and(eq(users.email, params.email), eq(users.isDeleted, false));
        }

        const userDetails = await this.db.query.users.findFirst({
            where: whereCondition,
            columns: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                isActive: true,
                isDeleted: true,
                deletedAt: true
            },
            with: {
                userRoles: {
                    columns: {},
                    with: {
                        roles: {
                            columns: {
                                role: true
                            }
                        }
                    }
                }
            }
        });

        if (!userDetails) {
            return null;
        }

        return userDetails || null;
    }

    async getUser(params: {
        id?: SelectUser['id'];
        email?: SelectUser['email'];
    }) {
        if (!params.id && !params.email) {
            return null;
        }

        let whereCondition;
        if (params.id) {
            whereCondition = and(eq(users.id, params.id), eq(users.isDeleted, false));
        } else if (params.email) {
            whereCondition = and(eq(users.email, params.email), eq(users.isDeleted, false));
        }

        try {
            const user = await this.db.select().from(users).where(whereCondition).limit(1);
            return user[0] || null;
        } catch (error) {
            throw new BadRequestException(error.cause?.message || "Failed to fetch user");
        }
    }

    async createUser(params: InsertUser, doneBy: string): Promise<SelectUser> {
        params.password = await hash(params.password, 6);
        const user = await this.db.insert(users).values(params).returning();
        await this.db.insert(logs).values({
            action: "CREATED",
            targetTable: "users",
            targetId: user[0].id,
            doneBy
        });
        return user[0];
    }
}
