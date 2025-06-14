import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { and, eq } from "drizzle-orm";

import { InsertUser, SelectUser, users } from '@db/schemas/users.schema';
import { DRIZZLE } from '@db/db.module';

@Injectable()
export class UsersService {
    constructor(
        @Inject(DRIZZLE) private readonly db: NodePgDatabase
    ) { }

    async getUser(params: {
        id?: SelectUser['id'];
        role?: SelectUser['role'];
        email?: SelectUser['email'];
    }): Promise<SelectUser | null> {
        if (!params.id && !params.role && !params.email) {
            return null;
        }

        let whereCondition;
        if (params.id) {
            whereCondition = and(eq(users.id, params.id), eq(users.isDeleted, false));
        } else if (params.email) {
            whereCondition = and(eq(users.email, params.email), eq(users.isDeleted, false));
        } else if (params.role) {
            whereCondition = and(eq(users.role, params.role), eq(users.isDeleted, false));
        }

        const user = await this.db.select().from(users).where(whereCondition).limit(1);

        return user[0] || null;
    }

    async createUser(params: InsertUser): Promise<SelectUser> {
        const user = await this.db.insert(users).values(params).returning();
        return user[0];
    }
}
