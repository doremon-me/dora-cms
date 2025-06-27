import { Body, Controller, Get, Post, Query, UnauthorizedException, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { SearchDto } from '@/common/dtos/search.dto';
import { AuthGuard } from '@/common/guards/auth.guard';
import { RoleGuard } from '@/common/guards/role.guard';
import { GetUser, User } from '@/common/decorators/user.decorator';
import { plainToInstance } from 'class-transformer';
import { RolesSerializer } from './roles.serializer';
import { CreateRoleDto } from './roles.dto';
import { Roles } from '@/common/decorators/role.decorator';

@Controller('roles')
@UseGuards(AuthGuard, RoleGuard)
export class RolesController {
    constructor(private readonly rolesService: RolesService) { }

    @Roles("ADMINISTRATOR")
    @Get("/")
    async getRoles(@Query() search: SearchDto, @GetUser() user: User) {
        if (!user) throw new UnauthorizedException("User not authenticated");
        const roles = await this.rolesService.getRoles(search);
        return plainToInstance(RolesSerializer, roles, {
            excludeExtraneousValues: true,
        })
    }

    @UseGuards(AuthGuard)
    @Get("/all")
    async getAllRoles(@Query() search: SearchDto, @GetUser() user: User) {
        if (!user) throw new UnauthorizedException("User not authenticated");
        const roles = await this.rolesService.getRoles(search);
        console.log(roles);
        return plainToInstance(RolesSerializer, roles, {
            excludeExtraneousValues: true,
        });
    }

    @UseGuards(AuthGuard)
    @Post("/create")
    async addRole(@Body() createRoleDto: CreateRoleDto, @GetUser() user: User) {
        if (!user) throw new UnauthorizedException("User not authenticated")
        const role = await this.rolesService.createRole(createRoleDto.role.toUpperCase(), user.id);
        return plainToInstance(RolesSerializer, role, {
            excludeExtraneousValues: true,
        });
    }
}
