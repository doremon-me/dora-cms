import { z } from "zod"

export const projectSchema = z.object({
    name: z.string().min(4, "Project name must be at least 4 characters long"),
    description: z.string().min(30, "Project description must be at least 30 characters long"),
});

export const getProjectsSchema = z.object({
    search: z.string().optional(),
    limit: z.number().min(1).max(100).default(10),
    sort: z.string().default("desc"),
    sortBy: z.string().default("createdAt"),
    page: z.number().min(1).default(1),
});

export const getUsersSchema = z.object({
    search: z.string().optional(),
    limit: z.number().min(1).max(100).default(10),
    sort: z.string().default("desc"),
    sortBy: z.string().default("createdAt"),
    page: z.number().min(1).default(1),
});

export const createUserSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
});

export const createRoleSchema = z.object({
    role: z.string().min(1, "Role is required")
})

export type GetProjectsSchema = z.infer<typeof getProjectsSchema>;
export type ProjectSchema = z.infer<typeof projectSchema>;
export type CreateUserSchema = z.infer<typeof createUserSchema>;
export type GetUsersSchema = z.infer<typeof getUsersSchema>;
export type CreateRoleSchema = z.infer<typeof createRoleSchema>;