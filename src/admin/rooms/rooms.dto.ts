import { Transform, Type } from 'class-transformer';
import {
    ArrayNotEmpty,
    IsArray,
    IsBoolean,
    IsDate,
    IsISO31661Alpha2,
    IsISO4217CurrencyCode,
    IsNotEmpty,
    IsNotEmptyObject,
    IsNumber,
    IsOptional,
    IsString,
    IsUrl,
    ValidateNested,
} from 'class-validator';
import { ObjectId } from 'mongoose';
import { File } from 'src/common/dtos';

class AcommodationObject {
    onCampus: boolean;
    offCampus: boolean;
}

export class Other {
    @IsOptional()
    @IsString()
    readonly availableInternshipOpportunities: string;

    @IsOptional()
    @IsBoolean()
    readonly needBasedScholarship: boolean;

    @IsOptional()
    @IsBoolean()
    readonly meritBasedScholarship: boolean;

    @IsOptional()
    @IsString()
    readonly formOfAssement: string;

    @IsOptional()
    @IsString()
    readonly availableInternationalStudentSupport: string;

    @IsOptional()
    @IsString()
    readonly availableStudentArrivalSupport: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    readonly academicRequirements: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    readonly requiredDocuments: string[];
}

export class Rooms {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    readonly programType: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    readonly duration: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    readonly degreeType: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    readonly classType: string;

    @IsOptional()
    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    readonly startDate: Date;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    readonly about: string;

    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    @Transform(({ value }) => Number.parseFloat(value.toFixed(2)))
    readonly tuitionFee: number;

    @IsOptional()
    @IsNotEmpty()
    @IsISO4217CurrencyCode()
    readonly currency: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @Transform(({ value }) => Number.parseFloat(value.toFixed(2)))
    readonly otherFee: number;

    @IsOptional()
    @IsString()
    readonly otherInformation: string;

    @IsOptional()
    @ArrayNotEmpty()
    @IsString({ each: true })
    readonly requiredDocuments: string[];

    @IsOptional()
    @IsBoolean()
    onCampus: boolean;

    @IsOptional()
    @IsBoolean()
    offCampus: boolean;

    @IsOptional()
    @IsBoolean()
    readonly needBasedScholarship: boolean;

    @IsOptional()
    @IsBoolean()
    readonly meritBasedScholarship: boolean;
}

export class AddRoomsDto {
    @IsNotEmpty()
    @IsString()
    readonly title: string;

    @IsOptional()
    @IsString()
    readonly roomType: string;

    @IsNotEmpty()
    @IsString()
    readonly location1: string;

    @IsNotEmpty()
    @IsString()
    readonly location2: string;

    @IsNotEmpty()
    @IsString()
    readonly about: string;

    @IsOptional()
    @IsString()
    readonly availability?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    readonly facilities?: string[];

    @IsOptional()
    @IsString()
    readonly accommodationType?: string;

    @IsOptional()
    image: string;
}
export class UpdateRoomsDto {
    @IsNotEmpty()
    @IsString()
    readonly title: string;

    @IsOptional()
    @IsString()
    readonly roomType: string;

    @IsNotEmpty()
    @IsString()
    readonly location1: string;

    @IsNotEmpty()
    @IsString()
    readonly location2: string;

    @IsNotEmpty()
    @IsString()
    readonly about: string;

    @IsOptional()
    @IsString()
    readonly availability?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    readonly facilities?: string[];

    @IsOptional()
    @IsString()
    readonly accommodationType?: string;

    @IsOptional()
    image: string;
}
export class GetRoomsDto {
    readonly title: string;

    readonly roomType: string;

    readonly facilities: string[];

    readonly availability: string;

    readonly accommodationType: string;

    readonly location1: string;

    readonly location2: string;

    readonly about: string;

    image?: string;
}

export class UpdateSchoolDto {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsOptional()
    @IsString()
    readonly schoolType: string;

    @IsOptional()
    @IsString()
    readonly state: string;

    @IsOptional()
    @IsString()
    readonly country: string;

    @IsOptional()
    @IsUrl()
    readonly url: string;

    @IsOptional()
    @IsString()
    readonly about: string;

    @IsOptional()
    image: string;
}

export class SearchSchoolDto {
    @IsOptional()
    @IsString()
    readonly name: string;

    @IsOptional()
    // @IsISO31661Alpha2()
    readonly location: string;

    @IsOptional()
    @IsString()
    readonly program: string;
}
