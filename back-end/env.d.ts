import { User } from "@/common/decorators/user.decorator";

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            readonly ENV: "development" | "production";
            readonly PORT: number;
            readonly JWT_SECRET: string;
            readonly CORS_ORIGIN: string;
            readonly DATABASE_URL: string;
        }
    }

    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

export { };