import { GetUser, User } from '@/common/decorators/user.decorator';
import { AuthGuard } from '@/common/guards/auth.guard';
import { Body, ClassSerializerInterceptor, Controller, Get, HttpCode, HttpStatus, NotFoundException, Post, Query, Res, UnauthorizedException, UseGuards, UseInterceptors } from '@nestjs/common';
import { SigninDto } from './auth.dto';
import { Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthSerializer } from './auth.serializer';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly jwtService: JwtService) { }

    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @Get('verifyuser')
    async verifyUser(@GetUser() user: User) {
        return plainToInstance(AuthSerializer, user, {
            excludeExtraneousValues: true
        });
    }

    @HttpCode(HttpStatus.OK)
    @UseInterceptors(ClassSerializerInterceptor)
    @Post("signin")
    async signin(@Body() signinDto: SigninDto, @Res() res: Response) {
        const user = await this.authService.singin(signinDto);
        if (!user) {
            throw new NotFoundException("User not found");
        }
        const jwtToken = await this.jwtService.signAsync({ email: user.email, id: user.id, firstName: user.firstName, lastName: user.lastName });
        res.cookie("__admin_code_token", jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: signinDto.rememberMe ? 2 * 60 * 60 * 1000 : undefined,
        });
        const serializedUser = plainToInstance(AuthSerializer, user, {
            excludeExtraneousValues: true
        });
        res.json(serializedUser);
    }

    @HttpCode(HttpStatus.OK)
    @Get('google')
    async google(@Res() res: Response) {
        const redirectUrl = this.authService.getGoogleRedirectUrl();
        return res.redirect(redirectUrl);
    }

    @HttpCode(HttpStatus.OK)
    @UseInterceptors(ClassSerializerInterceptor)
    @Get("google/callback")
    async googleCallback(@Query('code') code: string, @Res() res: Response) {
        const token = await this.authService.getTokenFromCode(code);
        const userInfo: { email: string, name: string, picture: string } = await this.authService.getUserInfo(token.access_token);
        const user = await this.authService.getUser({ email: userInfo.email });
        const jwtToken = await this.jwtService.signAsync({ email: user.email, id: user.id, firstName: user.firstName, lastName: user.lastName });
        res.cookie("__admin_code_token", jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 2 * 60 * 60 * 1000,
        });
        const serializedUser = plainToInstance(AuthSerializer, user, {
            excludeExtraneousValues: true
        });
        res.json(serializedUser);
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @Post('logout')
    async logout(@Res() res: Response, @GetUser() user: User) {
        if (!user) {
            throw new UnauthorizedException("You are not logged in");
        }
        res.clearCookie("__admin_code_token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        });
        res.json({ message: "Logged out successfully" });
    }
}
