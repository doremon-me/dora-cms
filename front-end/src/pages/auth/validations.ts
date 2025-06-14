import { z } from "zod";

export const signinSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, { message: "Password must be at least 6 characters long." }),
    rememberMe: z.boolean().optional().default(false),
});

export type SigninSchema = z.infer<typeof signinSchema>;