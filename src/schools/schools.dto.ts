import { Transform, Type } from 'class-transformer';
import {
    ArrayNotEmpty,
    IsArray,
    IsBoolean,
    IsDate,
    IsISO4217CurrencyCode,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUrl,
    ValidateNested,
} from 'class-validator';

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
export class Program {
    @IsOptional()
    @IsString()
    readonly _id: string;

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
    // @Type(() => Date)
    // @IsDate()
    readonly startDate: string;

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
    // @IsISO4217CurrencyCode()
    readonly currency: string;

    @IsOptional()
    // @IsNumber()
    // @Type(() => Number)
    // @Transform(({ value }) => Number.parseFloat(value.toFixed(2)))
    readonly otherFee: string;

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

export class AddSchoolDto {
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsOptional()
    @IsString()
    readonly schoolType: string;

    @IsNotEmpty()
    @IsString()
    readonly state: string;

    @IsNotEmpty()
    @IsString()
    readonly country: string;

    @IsNotEmpty()
    @IsUrl()
    readonly url: string;

    @IsNotEmpty()
    @IsString()
    readonly about: string;

    @IsOptional()
    @Type(() => Program)
    @ValidateNested()
    readonly programs?: Program[];

    @IsOptional()
    image: string;
}

export class UpdateSchoolDto {
    @IsOptional()
    @IsString()
    readonly _id: string;

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
    @Type(() => Program)
    @ValidateNested()
    readonly program?: Program;

    @IsOptional()
    image: string;
}

export class SearchSchoolDto {
    @IsOptional()
    @IsString()
    readonly isProgramListing: boolean; // Study abroad page

    @IsOptional()
    @IsString()
    readonly name: string; // School Name

    @IsOptional()
    readonly location: string; // School or program location

    @IsOptional()
    @IsString()
    readonly program: string; // Program Type OR (program.programType)

    @IsOptional()
    @IsString()
    readonly programName: string; // Program Name

    @IsOptional()
    @IsString()
    readonly programType: string; // Program Type

    @IsOptional()
    @IsString()
    readonly duration: string; // Program Duration

    @IsOptional()
    @IsString()
    readonly degreeType: string; // Degree type or field of study

    @IsOptional()
    @IsString()
    readonly startDate: string; // Academic Semester or start Date

    @IsOptional()
    @IsString()
    readonly tuitionFee: string;

    @IsOptional()
    @IsString()
    accomodationType: string;

    @IsOptional()
    @IsString()
    readonly scholarshipType: string;
}
