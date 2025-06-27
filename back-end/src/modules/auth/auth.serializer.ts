import { Expose } from 'class-transformer';

export class AuthSerializer {
    @Expose()
    id: string;

    @Expose()
    firstName: string;

    @Expose()
    lastName: string;

    @Expose()
    email: string;
}
