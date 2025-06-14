import { boolean, pgEnum, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core"

export const roleEnum = pgEnum("roles", [
    "SUPER_ADMIN",
    "ADMIN",
    "USER"
]);

export const users = pgTable('users', {
    id: serial('id').primaryKey(),

    // Basic user information
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    email: text("email").notNull(),

    // Authentication details
    password: varchar('password').notNull(),
    role: roleEnum("role").default("USER"),
    isActive: boolean('is_active').default(true),

    // Soft Delete
    isDeleted: boolean("is_deleted").default(false),
    deletedAt: timestamp("deleted_at"),

    // Time stamp
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export type SelectUser = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;