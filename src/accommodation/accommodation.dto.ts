import {
    IsEmail,
    IsEnum,
    IsISO31661Alpha2,
    IsNotEmpty,
    IsOptional,
    IsPhoneNumber,
    IsString,
} from 'class-validator';
import { ApplicationStatus } from 'src/applications/applications.enum';

export class AddAccommodationDto {
    @IsNotEmpty()
    @IsString()
    readonly fullName: string;

    @IsNotEmpty()
    @IsString()
    readonly roomName: string;

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    @IsPhoneNumber()
    readonly phone: string;

    @IsNotEmpty()
    @IsString()
    readonly roomCountry: string;

    @IsNotEmpty()
    @IsString()
    readonly moveInDate: string;

    @IsNotEmpty()
    @IsString()
    readonly moveOutDate: string;

    @IsNotEmpty()
    @IsString()
    readonly roomState: string;

    @IsNotEmpty()
    @IsString()
    readonly gender: string;

    @IsNotEmpty()
    @IsString()
    readonly dob: string;

    @IsNotEmpty()
    @IsString()
    readonly roomType: string;

    @IsNotEmpty()
    @IsISO31661Alpha2()
    readonly nationality: string;
}

export class UpdateAccommodationDto {
    @IsNotEmpty()
    @IsString()
    readonly fullName: string;

    @IsNotEmpty()
    @IsString()
    readonly roomName: string;

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    @IsPhoneNumber()
    readonly phone: string;

    @IsNotEmpty()
    @IsString()
    readonly roomCountry: string;

    @IsNotEmpty()
    @IsString()
    readonly moveInDate: string;

    @IsNotEmpty()
    @IsString()
    readonly moveOutDate: string;

    @IsNotEmpty()
    @IsString()
    readonly roomState: string;

    @IsNotEmpty()
    @IsString()
    readonly gender: string;

    @IsNotEmpty()
    @IsString()
    readonly dob: string;

    @IsNotEmpty()
    @IsString()
    readonly roomType: string;

    @IsNotEmpty()
    @IsISO31661Alpha2()
    readonly nationality: string;

    @IsOptional()
    @IsEnum(ApplicationStatus)
    readonly status: ApplicationStatus;
}
export class GetAccomodationsDto {
    readonly fullName: string;

    readonly roomName: string;

    readonly email: string;

    readonly phone: string;

    readonly roomCountry: string;

    readonly roomState: string;

    readonly moveOutDate: string;

    readonly moveInDate: string;

    readonly gender: string;

    readonly dob: string;

    readonly roomType: string;

    readonly nationality: string;
}
