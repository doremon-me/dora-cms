import { boolean, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core"
import { roles } from "./roles.schema";
import { relations } from "drizzle-orm";

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),

    // Basic user information
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    email: text("email").notNull(),

    // Authentication details
    password: varchar('password').notNull(),
    isActive: boolean('is_active').default(true),

    // Soft Delete
    isDeleted: boolean("is_deleted").default(false),
    deletedAt: timestamp("deleted_at"),
});

export const userRoles = pgTable('user_roles', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    roleId: uuid('role_id').notNull().references(() => roles.id, { onDelete: 'cascade' }),
});

export const usersRelations = relations(users, ({ many }) => ({
    userRoles: many(userRoles)
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
    user: one(users, {
        fields: [userRoles.userId],
        references: [users.id],
    }),
    roles: one(roles, {
        fields: [userRoles.roleId],
        references: [roles.id],
    })
}))

export type SelectUser = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type SelectUserRole = typeof userRoles.$inferSelect;
export type InsertUserRole = typeof userRoles.$inferInsert;