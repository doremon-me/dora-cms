import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { SigninDto } from './auth.dto';
import { UsersService } from '@/modules/users/users.service';
import * as OAuthKeys from "@configurations/oauth.keys.json"
import { compare } from 'bcrypt';
import { SelectUser } from '@/db/schemas/users.schema';


@Injectable()
export class AuthService {
    constructor(private readonly userService: UsersService) { }
    async singin(singin: SigninDto): Promise<SelectUser> {
        const user = await this.userService.getUser({ email: singin.email });
        if (!user) {
            throw new NotFoundException("User not found");
        }
        const isPasswordValid = await compare(singin.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException("Invalid password");
        }
        return user;
    }

    getGoogleRedirectUrl(): string {
        const clientId = OAuthKeys.web.client_id
        const redirectUri = OAuthKeys.web.redirect_uris[0]
        const scope = ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"].join(' ');
        const url = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&access_type=offline`;
        return url;
    }

    async getTokenFromCode(code: string): Promise<any> {
        const url = 'https://oauth2.googleapis.com/token';
        const values = {
            code,
            client_id: OAuthKeys.web.client_id,
            client_secret: OAuthKeys.web.client_secret,
            redirect_uri: OAuthKeys.web.redirect_uris[0],
            grant_type: 'authorization_code',
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(values).toString(),
        });

        if (!response.ok) {
            throw new InternalServerErrorException("Failed to fetch token from Google");
        }

        return response.json();
    }

    async getUserInfo(accessToken: string) {
        const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new InternalServerErrorException(`Google API error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    }

    async getUser(query: { email: string }): Promise<SelectUser> {
        const user = await this.userService.getUser(query);
        if (!user) {
            throw new NotFoundException("User not found with the provided email");
        }
        return user;
    }
}
