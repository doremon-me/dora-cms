import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();
        const token = request.cookies?.__admin_code_token;

        if (!token) {
            throw new UnauthorizedException("User is not authenticated");
        }
        try {
            const payload = this.jwtService.verify(token);
            request.user = {
                id: payload.id,
                email: payload.email,
                role: payload.role,
                firstname: payload.firstname,
                lastName: payload.lastName,
            };
            return true;
        } catch (error) {
            throw new UnauthorizedException("User is not authenticated");
        }
    }
}