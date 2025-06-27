import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type User = {
    role: string;
    email: string;
    id: string;
    firstName: string;
    lastName: string;
} | undefined;

export const GetUser = createParamDecorator((data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as User;
})
