import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { ConfigService } from "@nestjs/config";
import { Module } from "@nestjs/common";
import { Pool } from "pg";

const schema = {};

export const DRIZZLE = Symbol("db_connection");
@Module({
    providers: [
        {
            provide: DRIZZLE,
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const dbUrl = configService.get<string>('DATABASE_URL');
                const pool = new Pool({
                    connectionString: dbUrl,
                    ssl: false,
                    max: 20,
                    idleTimeoutMillis: 3000,
                    connectionTimeoutMillis: 2000
                });
                return drizzle(pool, { schema }) as NodePgDatabase<typeof schema>;
            }
        }
    ],
    exports: [DRIZZLE]
})
export class DBModule { }