import { Pool } from "pg";
import * as dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { roles } from "./schemas/roles.schema";
import { eq } from "drizzle-orm";
import { userRoles, users } from "./schemas/users.schema";
import { hash } from "bcrypt";
import { Logger } from "@nestjs/common";

dotenv.config();

async function seed() {
    const adminEmail = process.env.ADMIN_MAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const databaseUrl = process.env.DATABASE_URL;
    const logger = new Logger("Seed");

    if (!adminEmail) {
        throw new Error("ADMIN_MAIL environment variable is required");
    }
    if (!adminPassword) {
        throw new Error("ADMIN_PASSWORD environment variable is required");
    }
    if (!databaseUrl) {
        throw new Error("DATABASE_URL environment variable is required");
    }

    const pool = new Pool({
        connectionString: databaseUrl,
    });

    const db = drizzle(pool);

    try {
        const existingUser = await db.select().from(users).where(eq(users.email, adminEmail)).limit(1);
        if (existingUser.length > 0) {
            logger.log("Admin user already exists. Skipping seed.");
            return;
        }

        let administratorRole;
        const existingRole = await db.select().from(roles).where(eq(roles.role, "ADMINISTRATOR")).limit(1);

        if (existingRole.length > 0) {
            administratorRole = existingRole[0];
            logger.log("ADMINISTRATOR role already exists.");
        } else {
            const [newRole] = await db.insert(roles).values({ role: "ADMINISTRATOR" }).returning();
            administratorRole = newRole;
            logger.log("ADMINISTRATOR role created.");
        }

        const [adminUser] = await db.insert(users).values({
            email: adminEmail,
            password: await hash(adminPassword, 10),
            firstName: "Admin",
            lastName: "User",
        }).returning();

        await db.insert(userRoles).values({
            userId: adminUser.id,
            roleId: administratorRole.id,
        });

        logger.log("Admin user seeded successfully!");

    } catch (error) {
        logger.error("Error during seeding:", error);
    } finally {
        await pool.end();
    }
}

seed().catch(console.error);