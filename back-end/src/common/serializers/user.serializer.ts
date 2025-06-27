import { Expose } from 'class-transformer';

export class UserSerializer {
    @Expose()
    id: string;

    @Expose()
    firstName: string;

    @Expose()
    lastName: string;

    @Expose()
    email: string;

    @Expose()
    role: string;
}
