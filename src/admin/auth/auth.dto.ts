import { Transform } from 'class-transformer';
import {
    IsNotEmpty,
    IsString,
    IsStrongPassword,
    IsEmail,
    MaxLength,
    Length,
    MinLength,
} from 'class-validator';
import { EmailTokenUsage } from './auth.enum';

export class LoginDto {
    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => value.toLowerCase())
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    @IsStrongPassword()
    password: string;
}

export class AccountRecoveryDto {
    @IsNotEmpty()
    @IsEmail()
    @MaxLength(255)
    @Transform(({ value }) => value.toLowerCase())
    readonly email: string;
}

export class ResetPasswordDto {
    @IsEmail()
    @MaxLength(255)
    @Transform(({ value }) => value.toLowerCase())
    readonly email: string;

    @IsString()
    @Length(6, 6)
    readonly token: string;

    @MinLength(8)
    @IsString()
    readonly password: string;
}

export type UpdateEmailTokenParams = Readonly<{
    email: string;
    usage: EmailTokenUsage;
    tokenHash: string;
}>;

export type GetEmailTokenParams = Readonly<{
    email: string;
    usage: EmailTokenUsage;
}>;

export type AddEmailTokenParams = Readonly<{
    email: string;
    userId: string;
    tokenHash: string;
    usage: EmailTokenUsage;
}>;

export type DeleteEmailTokenParams = Readonly<{
    email: string;
    usage: EmailTokenUsage;
}>;
