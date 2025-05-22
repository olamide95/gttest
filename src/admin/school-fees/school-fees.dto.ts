import {
    IsEmail,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';
import { ApplicationStatus } from 'src/applications/applications.enum';

export class AddSchoolFeesDto {
    @IsOptional()
    @IsString()
    readonly studentFirstName: string;

    @IsOptional()
    @IsString()
    readonly studentLastName: string;

    @IsOptional()
    @IsString()
    readonly dateOfBirth: string;

    @IsOptional()
    @IsString()
    readonly phone: string;

    @IsOptional()
    @IsEmail()
    readonly emailAddress: string;

    @IsOptional()
    @IsString()
    readonly countryName: string;

    @IsOptional()
    @IsString()
    readonly universityName: string;

    @IsOptional()
    @IsString()
    readonly bankName: string;

    @IsOptional()
    @IsNumber()
    readonly applicationFee: number;

    @IsOptional()
    @IsNumber()
    readonly programmeFee: number;

    @IsOptional()
    @IsNumber()
    readonly otherPayment: number;

    @IsOptional()
    @IsNumber()
    readonly total: number;
}
export class GetSchoolFeesDto {
    readonly studentFirstName?: string;

    readonly studentLastName?: string;

    readonly dateOfBirth?: string;

    readonly phone?: string;

    readonly emailAddress?: string;

    readonly countryName?: string;

    readonly universityName?: string;

    readonly bankName?: string;

    readonly applicationFee?: number;

    readonly programmeFee?: number;

    readonly otherPayment?: number;

    readonly total?: number;

    readonly status: ApplicationStatus;
}
export class UpdateSchoolFeesDto {
    @IsOptional()
    @IsString()
    readonly studentFirstName: string;

    @IsOptional()
    @IsString()
    readonly studentLastName: string;

    @IsOptional()
    @IsString()
    readonly dateOfBirth: string;

    @IsOptional()
    @IsString()
    readonly phone: string;

    @IsOptional()
    @IsEmail()
    readonly emailAddress: string;

    @IsOptional()
    @IsString()
    readonly countryName: string;

    @IsOptional()
    @IsString()
    readonly universityName: string;

    @IsOptional()
    @IsString()
    readonly bankName: string;

    @IsOptional()
    @IsNumber()
    readonly applicationFee: number;

    @IsOptional()
    @IsNumber()
    readonly programmeFee: number;

    @IsOptional()
    @IsNumber()
    readonly otherPayment: number;

    @IsOptional()
    @IsNumber()
    readonly total: number;

    @IsOptional()
    @IsEnum(ApplicationStatus)
    readonly status: ApplicationStatus;
}
