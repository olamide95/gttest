import { Type } from 'class-transformer';
import {
    IsDate,
    IsEmail,
    IsISO31661Alpha2,
    IsMilitaryTime,
    IsNotEmpty,
    IsPhoneNumber,
    IsString,
    MinDate,
} from 'class-validator';

export class AddContactUsDto {
    @IsNotEmpty()
    @IsString()
    readonly fullName: string;

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    @IsPhoneNumber()
    readonly phone: string;

    @IsNotEmpty()
    @IsISO31661Alpha2()
    readonly country: string;

    @IsNotEmpty()
    @IsString()
    readonly question: string;
}

export class AddConsultationDto {
    @IsNotEmpty()
    @IsString()
    readonly fullName: string;

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    @IsPhoneNumber()
    readonly phone: string;

    @IsNotEmpty()
    @IsString()
    readonly topic: string;

    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    @MinDate(new Date(new Date().setHours(0, 0, 0, 0)), {
        message: 'date field must be equal to or later than current date/time',
    })
    readonly date: Date;

    @IsNotEmpty()
    @IsMilitaryTime()
    readonly time: string;

    hour: number;

    minute: number;
}

export class AddVisaConsultationDto {
    @IsNotEmpty()
    @IsString()
    fullName: string;

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    @IsPhoneNumber()
    readonly phone: string;

    @IsNotEmpty()
    @IsISO31661Alpha2()
    nationality: string;

    @IsNotEmpty()
    @IsISO31661Alpha2()
    travelDestination: string;

    @IsNotEmpty()
    @IsString()
    travelReason: string;

    @IsNotEmpty()
    @IsString()
    visaType: string;
}
