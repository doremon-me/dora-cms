import { sql } from "drizzle-orm";
import { boolean, pgEnum, pgTable, pgView, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const TypesEnum = pgEnum("types_enum", [
    "ECOMMERCE",
    "BLOG",
    "LMS",
    "EDUCATION",
    "RESEARCH"
]);

export const publicProjectsView = pgView("public_projects_view", {
    id: uuid("id"),
    name: text("name"),
    description: text("description"),
    type: text("type"),
    origin: text("origin"),
}).as(sql`  
        SELECT id, 
        name, 
        description, 
        type, 
        origin
        FROM projects 
        WHERE is_deleted = false
    `);

export const projects = pgTable("projects", {
    id: uuid("id").defaultRandom().primaryKey(),

    // Project details
    name: text("name").notNull(),
    description: text("description").notNull(),
    type: text("type"),
    origin: text("origin"),

    // Soft Delete
    isDeleted: boolean("is_deleted").default(false),
    deletedAt: timestamp("deleted_at"),
});

export type SelectProject = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;
export type SelectPublicProjectsView = typeof publicProjectsView.$inferSelect;