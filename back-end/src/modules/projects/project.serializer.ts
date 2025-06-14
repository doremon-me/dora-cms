import { Expose } from "class-transformer";

export class ProjectSerializer {
    constructor(partial: Partial<ProjectSerializer>) {
        Object.assign(this, partial);
    }

    @Expose()
    id: string;

    @Expose()
    name: string;

    @Expose()
    description: string;

    @Expose()
    type: string | null;

    @Expose()
    origin: string | null;

    @Expose()
    createdAt: Date | null;

    @Expose()
    updatedAt: Date | null;
}