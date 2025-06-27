import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) { }
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest<Request>();
        const token = request.cookies?.__access_code_token;

        if (!token) {
            throw new UnauthorizedException("You do not have permission to access this resource");
        }

        try {
            const payload = this.jwtService.verify(token);
            return true;
        } catch (error) {
            throw new UnauthorizedException("User is not authenticated");
        }
    }
}