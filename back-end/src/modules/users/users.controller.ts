import { Body, ConflictException, Controller, Get, NotFoundException, Post, Query, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@/common/guards/auth.guard';
import { CreateUserDto } from './users.dto';
import { MailUtility } from '@/utils/mail.utility';
import { SearchDto } from '@/common/dtos/search.dto';
import { GetUser, User } from '@/common/decorators/user.decorator';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { plainToInstance } from 'class-transformer';
import { UsersSerializer } from './users.serializer';
import { RoleGuard } from '@/common/guards/role.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService, private readonly mailUtility: MailUtility, private readonly jwtService: JwtService) { }

    @UseGuards(AuthGuard)
    @Get('list')
    async getUsers(@Query() search: SearchDto, @GetUser() user: User) {
        return await this.userService.getUsers(search, user?.id);
    }

    @UseGuards(AuthGuard)
    @Post('create')
    async createUser(@Body() createUserDto: CreateUserDto, @GetUser() user: User) {
        if (!user) {
            throw new ConflictException('User not authenticated');
        }
        const { firstName, lastName, email } = createUserDto;
        const checkExisting = await this.userService.getUser({ email });
        if (checkExisting) {
            throw new ConflictException('User already exists');
        }
        const password = (Math.random().toString(36).slice(-8));
        const newUser = this.userService.createUser({ firstName, lastName, email, password }, user.id);
        this.mailUtility.sendMail(email, 'Welcome to Our Service', `Your account has been created. Your password is: ${password}`);
        return newUser;
    }

    @UseGuards(AuthGuard)
    @Get('getUser')
    async getUser(@Query("userId") userId: string, @GetUser() user: User, @Res() res: Response) {
        if (!user) {
            throw new NotFoundException('User not authenticated');
        }

        const userDetails = await this.userService.getUserDetails({ id: user.id });

        if (!userDetails)
            res.clearCookie("__admin_code_token", {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
            });

        if (!userDetails?.userRoles.length) {
            throw new UnauthorizedException('You do not have the app access');
        }

        const token = await this.jwtService.signAsync({ roles: userDetails.userRoles.map(role => role.roles.role) });
        if (userDetails.id === user.id && user.id === userId) {
            res.cookie("__access_code_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: undefined,
            });
        }
        const serializedUser = plainToInstance(UsersSerializer, userDetails, {
            excludeExtraneousValues: true
        });
        res.json({ user: serializedUser });
    }
}
