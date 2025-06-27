import { User } from "@/common/decorators/user.decorator";

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            readonly ENV: "development" | "production";
            readonly PORT: number;
            readonly JWT_SECRET: string;
            readonly CORS_ORIGIN: string;
            readonly DATABASE_URL: string;

            readonly ADMIN_MAIL: string;
            readonly ADMIN_PASSWORD: string;

            readonly MAIL_HOST: string;
            readonly MAIL_PORT: number;
            readonly MAIL_USER: string;
            readonly MAIL_PASSWORD: string;
            readonly MAIL_SSL: boolean;

        }
    }

    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

export { };