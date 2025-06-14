import { IsBoolean, IsEmail, IsString } from "class-validator";

export class SigninDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsBoolean()
    rememberMe: boolean;
}