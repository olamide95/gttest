import {
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsStrongPassword,
} from 'class-validator';
import { TeamRole } from 'src/common/enums';

export class AddAdminDto {
    @IsNotEmpty()
    @IsString()
    readonly fullName: string;

    @IsNotEmpty()
    @IsString()
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    @IsStrongPassword()
    password: string;
}

export class AddTeamMemberDto {
    @IsNotEmpty()
    @IsString()
    readonly fullName: string;

    @IsNotEmpty()
    @IsString()
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    readonly adminId: string;

    @IsNotEmpty()
    @IsString()
    @IsStrongPassword()
    password: string;

    @IsNotEmpty()
    @IsString()
    branchLocation: string;

    @IsNotEmpty()
    @IsString()
    @IsEnum(TeamRole)
    role: string;
}
export class GetTeamMember {
    readonly fullName: string;

    readonly email: string;

    readonly adminId: string;

    // password: string;

    branchLocation: string;

    role: string;
}

export class UpdateAdminPasswordDto {
    @IsNotEmpty()
    @IsString()
    readonly currentPassword: string;

    @IsNotEmpty()
    @IsString()
    readonly newPassword: string;
}

export class UpdateTeamMemberDto {
    @IsOptional()
    @IsString()
    readonly fullName: string;

    @IsOptional()
    @IsString()
    readonly email: string;

    @IsOptional()
    @IsString()
    password: string;

    @IsOptional()
    @IsString()
    branchLocation: string;

    @IsOptional()
    @IsString()
    @IsEnum(TeamRole)
    role: string;
}
