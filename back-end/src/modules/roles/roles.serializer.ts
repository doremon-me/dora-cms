import { Expose } from "class-transformer";

export class RolesSerializer {
    constructor(partial: Partial<RolesSerializer>) {
        Object.assign(this, partial);
    }

    @Expose()
    id: string;

    @Expose()
    role: string;

    @Expose()
    permissions: string[];

    @Expose()
    userCount: string;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;
}