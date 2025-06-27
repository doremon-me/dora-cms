import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { userRoles } from "./users.schema";

export const roles = pgTable("roles", {
    id: uuid("id").primaryKey().defaultRandom(),
    role: varchar("role").notNull().unique(),
    permissions: text("permissions").array(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at"),
});

export const rolesRelations = relations(roles, ({ many }) => ({
    userRoles: many(userRoles)
}))

export type SelectRole = typeof roles.$inferSelect;
export type InsertRole = typeof roles.$inferInsert;