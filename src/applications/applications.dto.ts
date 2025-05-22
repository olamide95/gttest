import { ApplicationStatus } from './applications.enum';
import {
    ArrayNotEmpty,
    IsBoolean,
    IsDate,
    IsEmail,
    IsEnum,
    IsISO31661Alpha2,
    IsNotEmpty,
    IsNotEmptyObject,
    IsOptional,
    IsString,
    ValidateIf,
    ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { File } from 'src/common/dtos';

export class PersonalInformation {
    @IsNotEmpty()
    @IsString()
    readonly firstName: string;

    @IsNotEmpty()
    @IsString()
    readonly lastName: string;

    @IsNotEmpty()
    @IsString()
    readonly middleName: string;

    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    readonly dob: Date;

    @IsNotEmpty()
    readonly gender: string;

    @IsNotEmpty()
    @IsISO31661Alpha2()
    readonly nationality: string;
}

export class MailingAddress {
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    readonly phone: string;

    @IsNotEmpty()
    @IsString()
    readonly streetAddress: string;

    @IsNotEmpty()
    @IsString()
    readonly city: string;

    @IsNotEmpty()
    @IsString()
    readonly state: string;

    @IsNotEmpty()
    @IsString()
    readonly zipCode: string;

    @IsNotEmpty()
    @IsString()
    readonly country: string;
}

export class ContactInformation {
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    readonly phone: string;

    @IsNotEmpty()
    @IsString()
    readonly streetAddress: string;

    @IsNotEmpty()
    @IsString()
    readonly city: string;

    @IsNotEmpty()
    @IsString()
    readonly state: string;

    @IsNotEmpty()
    @IsString()
    readonly zipCode: string;

    @IsNotEmpty()
    @IsISO31661Alpha2()
    readonly country: string;

    @IsBoolean()
    @Transform(({ value }) => value === 'true')
    readonly isMailingAddress: boolean;

    // @ValidateIf((o) => o.isMailingAddress === false)
    // @IsNotEmpty()
    @Type(() => MailingAddress)
    // @ValidateNested()
    mailingAddress: MailingAddress;
}

export class Sponsor {
    // @IsNotEmpty()
    @IsString()
    readonly firstName: string;

    // @IsNotEmpty()
    @IsString()
    readonly lastName: string;

    // @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    // @IsNotEmpty()
    @IsString()
    readonly phone: string;

    // @IsNotEmpty()
    @IsString()
    readonly streetAddress: string;

    // @IsNotEmpty()
    @IsString()
    readonly city: string;

    // @IsNotEmpty()
    @IsString()
    readonly state: string;

    // @IsNotEmpty()
    @IsString()
    readonly zipCode: string;

    // @IsNotEmpty()
    @IsString()
    readonly country: string;
}

export class SponsorInformation {
    // @IsNotEmpty()
    @IsBoolean()
    @Transform(({ value }) => value === 'true')
    readonly isSelfSponsored: boolean;

    @ValidateIf((o) => o.isSelfSponsored === false)
    // @ArrayNotEmpty()
    @Type(() => Sponsor)
    @ValidateNested({ each: true })
    sponsors: Sponsor[];
}

export class HighSchoolHistory {
    @IsNotEmpty()
    @IsString()
    readonly previousInstitutionAttended: string;

    @IsNotEmpty()
    @IsBoolean()
    @Transform(({ value }) => value === 'true')
    readonly hasGraduatedFromInstitution: boolean;

    @ValidateIf((o) => o.hasGraduatedFromInstitution === false)
    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    expectedDateOfGraduation: Date;
}

export class CollegeHistory {
    @IsOptional()
    @IsString()
    readonly previousInstitutionAttended: string;

    @IsOptional()
    @IsString()
    readonly major: string;

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true')
    readonly hasGraduatedFromInstitution: boolean;

    @IsOptional()
    @IsString()
    readonly degreeEarnedOnOrExpected: string;

    @ValidateIf((o) => o.hasGraduatedFromInstitution === false)
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    expectedDateOfGraduation: Date;
}

export class AcademicInformation {
    @IsNotEmpty()
    @IsString()
    readonly prospectiveUniversity: string;

    @IsNotEmpty()
    @IsString()
    readonly intendedProgramOfStudy: string;

    @IsNotEmpty()
    @IsString()
    readonly degree: string;

    @IsNotEmpty()
    @IsString()
    readonly startTermAndYear: string;

    @IsNotEmpty()
    @IsBoolean()
    @Transform(({ value }) => value === 'true')
    readonly intendToStudyFullTime: boolean;

    @IsNotEmpty()
    @IsBoolean()
    @Transform(({ value }) => value === 'true')
    readonly interestedInFinancialAid: boolean;

    @IsNotEmpty()
    @IsBoolean()
    @Transform(({ value }) => value === 'true')
    readonly isEnglishNativeLanguage: boolean;

    @IsNotEmpty()
    @IsBoolean()
    @Transform(({ value }) => value === 'true')
    readonly hasTakenEnglishProficiencyTest: boolean;

    @ValidateIf((o) => o.hasTakenEnglishProficiencyTest === true)
    @IsNotEmpty()
    @IsString()
    readonly typeOfTestTaken: string;

    @ValidateIf((o) => o.hasTakenEnglishProficiencyTest === true)
    @IsNotEmpty()
    @IsString()
    readonly testScore: string;

    @ArrayNotEmpty()
    @Type(() => HighSchoolHistory)
    @ValidateNested({ each: true })
    readonly previousHighSchoolHistory: HighSchoolHistory[];

    @IsOptional()
    @Type(() => CollegeHistory)
    @ValidateNested({ each: true })
    readonly previousCollegeHistory: CollegeHistory[];
}

export class SupportingDocuments {
    passportPhoto: string;

    waecResult: string;

    waecScratchCard: string;

    unofficialTranscript: string;

    aLevelResult: string;

    resume: string;

    others: string[];
}

export class AddSchoolApplicationDto {
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => PersonalInformation)
    readonly personalInformation: PersonalInformation;

    @IsNotEmptyObject()
    @Type(() => ContactInformation)
    @ValidateNested()
    readonly contactInformation: ContactInformation;

    @IsNotEmptyObject()
    @Type(() => SponsorInformation)
    @ValidateNested()
    readonly sponsorInformation: SponsorInformation;

    @IsNotEmptyObject()
    @Type(() => AcademicInformation)
    @ValidateNested()
    readonly academicInformation: AcademicInformation;

    // @Type(() => SupportingDocuments)
    // @ValidateNested()
    suportingDocuments: SupportingDocuments;
    passportPhoto: any;
    waecResult: any;
    waecScratchCard: any;
    unofficialTranscript: any;
}

export class AddVisaApplicationDto {
    @IsNotEmpty()
    @IsString()
    readonly fullName: string;

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    readonly phone: string;

    @IsNotEmpty()
    @IsISO31661Alpha2()
    readonly nationality: string;

    @IsNotEmpty()
    @IsISO31661Alpha2()
    readonly destinationCountry: string;

    @IsNotEmpty()
    @IsString()
    readonly visaType: string;
}

export class AddBookFlightDto {
    @IsNotEmpty()
    @IsString()
    readonly returnType: string;

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    readonly phone: string;

    @IsNotEmpty()
    @IsString()
    readonly flyingFrom: string;

    @IsNotEmpty()
    @IsString()
    readonly flyingTo: string;

    @IsNotEmpty()
    @IsString()
    readonly deparutureDate: string;

    @IsString()
    readonly returnDate: string;

    @IsNotEmpty()
    @IsString()
    readonly adult: string;

    @IsNotEmpty()
    @IsString()
    readonly child: string;

    @IsNotEmpty()
    @IsString()
    readonly infant: string;
}
export class GetBookFlightDto {
    @IsNotEmpty()
    @IsString()
    readonly returnType: string;

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    readonly phone: string;

    @IsNotEmpty()
    @IsString()
    readonly flyingFrom: string;

    @IsNotEmpty()
    @IsString()
    readonly flyingTo: string;

    @IsNotEmpty()
    @IsString()
    readonly deparutureDate: string;

    @IsString()
    readonly returnDate: string;

    @IsNotEmpty()
    @IsString()
    readonly adult: string;

    @IsNotEmpty()
    @IsString()
    readonly child: string;

    @IsNotEmpty()
    @IsString()
    readonly infant: string;

    @IsOptional()
    @IsEnum(ApplicationStatus)
    readonly status: ApplicationStatus;
}

export class SearchApplicationDto {
    @IsOptional()
    @IsString()
    readonly fullName: string;

    @IsOptional()
    @IsEnum(ApplicationStatus)
    readonly status: ApplicationStatus;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    readonly from: Date;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    readonly to: Date;
}

export class UpdateVisaApplicationDto {
    @IsOptional()
    @IsString()
    readonly fullName: string;

    @IsOptional()
    @IsEmail()
    readonly email: string;

    @IsOptional()
    @IsString()
    readonly phone: string;

    @IsOptional()
    @IsISO31661Alpha2()
    readonly nationality: string;

    @IsOptional()
    @IsISO31661Alpha2()
    readonly destinationCountry: string;

    @IsOptional()
    @IsString()
    readonly visaType: string;

    @IsOptional()
    @IsEnum(ApplicationStatus)
    readonly status: ApplicationStatus;

    visaApplicationId: string;
}

export class UpdateBookFlightDto {
    @IsNotEmpty()
    @IsString()
    readonly returnType: string;

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    readonly phone: string;

    @IsNotEmpty()
    @IsString()
    readonly flyingFrom: string;

    @IsNotEmpty()
    @IsString()
    readonly flyingTo: string;

    @IsNotEmpty()
    @IsString()
    readonly deparutureDate: string;

    @IsString()
    readonly returnDate: string;

    @IsNotEmpty()
    @IsString()
    readonly adult: string;

    @IsNotEmpty()
    @IsString()
    readonly child: string;

    @IsNotEmpty()
    @IsString()
    readonly infant: string;

    @IsOptional()
    @IsEnum(ApplicationStatus)
    readonly status: ApplicationStatus;
}

export class UpdateSchoolApplicationDto {
    @IsOptional()
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => PersonalInformation)
    readonly personalInformation: PersonalInformation;

    @IsOptional()
    @IsNotEmptyObject()
    @Type(() => ContactInformation)
    @ValidateNested()
    readonly contactInformation: ContactInformation;

    @IsOptional()
    // @Type(() => SponsorInformation)
    // @ValidateNested()
    readonly sponsorInformation: SponsorInformation;

    @IsOptional()
    @IsNotEmptyObject()
    @Type(() => AcademicInformation)
    @ValidateNested()
    readonly academicInformation: AcademicInformation;

    // @Type(() => SupportingDocuments)
    // @ValidateNested()
    suportingDocuments: SupportingDocuments;

    @IsOptional()
    @IsEnum(ApplicationStatus)
    readonly status: ApplicationStatus;

    schoolApplicationId: string;
}
