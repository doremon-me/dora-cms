import { Expose } from "class-transformer";

export class UsersSerializer {
    constructor(partial: Partial<UsersSerializer>) {
        Object.assign(this, partial);
    }

    @Expose()
    id: string;

    @Expose()
    firstName: string;

    @Expose()
    lastName: string;

    @Expose()
    email: string;

    @Expose()
    isActive: boolean;

    @Expose()
    userRoles: Array<{ roles: { role: string } }>;
}