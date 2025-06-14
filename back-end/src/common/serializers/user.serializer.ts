import { Expose } from 'class-transformer';

export class UserSerializer {
    @Expose()
    id: number;

    @Expose()
    firstName: string;

    @Expose()
    lastName: string;

    @Expose()
    email: string;

    @Expose()
    role: string;
}
