import { jsonb, pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./users.schema";

export const logsActionsEnum = pgEnum("logs_actions", [
    "CREATED",
    "UPDATED",
    "DELETED",
    "OTHER"
])

export const logs = pgTable("logs", {
    id: uuid("id").primaryKey().defaultRandom(),
    action: logsActionsEnum("action").notNull().default("CREATED"),
    targetTable: varchar("target_table", { length: 100 }).notNull(),
    targetId: varchar("target_id").notNull(),
    field: varchar("field", { length: 100 }),
    oldValue: jsonb("old_value"),
    newValue: jsonb("new_value"),
    doneBy: uuid("done_by").references(() => users.id, { onDelete: "set null" }),
    doneAt: timestamp("done_at", { withTimezone: true }).defaultNow(),
    meta: jsonb("meta")
});