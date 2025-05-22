import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { File, FileSchema } from 'src/common/schemas';
import { ApplicationCategory, ApplicationStatus } from './applications.enum';
import { Document } from 'mongoose';
import { KeyGen } from 'src/common/utils/key-gen';

@Schema()
export class PersonalInformation {
    @Prop({ required: true, text: true })
    firstName: string;

    @Prop({ required: true, text: true })
    lastName: string;

    @Prop({ required: true, text: true })
    middleName: string;

    @Prop({ required: true })
    dob: Date;

    @Prop({ required: true })
    gender: string;

    @Prop({ required: true })
    nationality: string;
}
export const PersonalInformationSchema =
    SchemaFactory.createForClass(PersonalInformation);

@Schema()
export class MailingAddress {
    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    phone: string;

    @Prop({ required: true })
    streetAddress: string;

    @Prop({ required: true })
    city: string;

    @Prop({ required: true })
    state: string;

    @Prop({ required: true })
    zipCode: string;

    @Prop({ required: true })
    country: string;
}
const MailingAddressSchema = SchemaFactory.createForClass(MailingAddress);

@Schema()
export class ContactInformation {
    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    phone: string;

    @Prop({ required: true })
    streetAddress: string;

    @Prop({ required: true })
    city: string;

    @Prop({ required: true })
    state: string;

    @Prop({ required: true })
    zipCode: string;

    @Prop({ required: true })
    country: string;

    @Prop({ required: true })
    isMailingAddress: boolean;

    @Prop({ default: null, type: MailingAddressSchema })
    mailingAddress: MailingAddress;
}
export const ContactInformationSchema =
    SchemaFactory.createForClass(ContactInformation);

@Schema()
export class Sponsor {
    // @Prop({ required: true })
    firstName: string;

    // @Prop({ required: true })
    lastName: string;

    // @Prop({ required: true })
    email: string;

    // @Prop({ required: true })
    phone: string;

    // @Prop({ required: true })
    streetAddress: string;

    // @Prop({ required: true })
    city: string;

    // @Prop({ required: true })
    state: string;

    // @Prop({ required: true })
    zipCode: string;

    // @Prop({ required: true })
    country: string;
}
export const SponsorSchema = SchemaFactory.createForClass(Sponsor);

@Schema()
export class SponsorInformation {
    @Prop({ required: true })
    isSelfSponsored: boolean;

    @Prop({ default: [], type: [Sponsor] })
    sponsors: Sponsor[];
}
export const SponsorInformationSchema =
    SchemaFactory.createForClass(SponsorInformation);

@Schema()
export class HighSchoolHistory {
    @Prop({ required: true })
    previousInstitutionAttended: string;

    @Prop({ required: true })
    hasGraduatedFromInstitution: boolean;

    @Prop({ default: null })
    expectedDateOfGraduation: Date;
}
export const HighSchoolHistorySchema =
    SchemaFactory.createForClass(HighSchoolHistory);

@Schema()
export class CollegeHistory {
    @Prop({ default: null })
    previousInstitutionAttended: string;

    @Prop({ default: null })
    major: string;

    @Prop({ default: null })
    hasGraduatedFromInstitution: boolean;

    @Prop({ default: null })
    degreeEarnedOnOrExpected: string;

    @Prop({ default: null })
    expectedDateOfGraduation: Date;
}
export const CollegeHistorySchema =
    SchemaFactory.createForClass(CollegeHistory);

@Schema()
export class AcademicInformation {
    @Prop({ required: true })
    prospectiveUniversity: string;

    @Prop({ required: true })
    intendedProgramOfStudy: string;

    @Prop({ required: true })
    degree: string;

    @Prop({ required: true })
    startTermAndYear: string;

    @Prop({ required: true })
    intendToStudyFullTime: boolean;

    @Prop({ required: true })
    interestedInFinancialAid: boolean;

    @Prop({ required: true })
    isEnglishNativeLanguage: boolean;

    @Prop({ required: true })
    hasTakenEnglishProficiencyTest: boolean;

    @Prop({ default: null })
    typeOfTestTaken: string;

    @Prop({ default: null })
    testScore: string;

    @Prop({ required: true, type: [HighSchoolHistorySchema] })
    previousHighSchoolHistory: HighSchoolHistory[];

    @Prop({ default: [], type: [CollegeHistorySchema] })
    previousCollegeHistory: CollegeHistory[];
}
export const AcademicInformationSchema =
    SchemaFactory.createForClass(AcademicInformation);

@Schema()
export class SupportingDocuments {
    @Prop({ default: null, type: 'string' })
    passportPhoto: string;

    @Prop({ default: null, type: 'string' })
    waecResult: string;

    @Prop({ default: null, type: 'string' })
    waecScratchCard: string;

    @Prop({ default: null, type: 'string' })
    unofficialTranscript: string;

    @Prop({ default: null, type: 'string' })
    aLevelResult: string;

    @Prop({ default: null, type: 'string' })
    resume: string;

    @Prop({ default: [], type: ['string'] })
    others: string[];
}
export const SupportingDocumentsSchema =
    SchemaFactory.createForClass(SupportingDocuments);

@Schema({ timestamps: true })
export class SchoolApplication {
    @Prop({ unique: true, default: () => `SA${KeyGen.gen(13)}` })
    schoolApplicationId: string;

    @Prop({ required: true, type: PersonalInformationSchema })
    personalInformation: PersonalInformation;

    @Prop({ required: true, type: ContactInformationSchema })
    contactInformation: ContactInformation;

    @Prop({ type: SponsorInformationSchema })
    sponsorInformation: SponsorInformation;

    @Prop({ required: true, type: AcademicInformationSchema })
    academicInformation: AcademicInformation;

    @Prop({ required: true, type: SupportingDocumentsSchema })
    suportingDocuments: SupportingDocuments;

    @Prop({ enum: ApplicationStatus, default: ApplicationStatus.IN_PROGRESS })
    status: ApplicationStatus;

    @Prop({ default: null, type: 'string' })
    passportPhoto: string;

    @Prop({ default: null, type: 'string' })
    waecResult: string;

    @Prop({ default: null, type: 'string' })
    waecScratchCard: string;

    @Prop({ default: null, type: 'string' })
    unofficialTranscript: string;
}
export type SchoolApplicationDocument = SchoolApplication & Document;
export const SchoolApplicationSchema =
    SchemaFactory.createForClass(SchoolApplication);

@Schema({ timestamps: true })
export class VisaApplication {
    @Prop({ unique: true, default: () => `VA${KeyGen.gen(13)}` })
    visaApplicationId: string;

    @Prop({ required: true, text: true })
    fullName: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    phone: string;

    @Prop({ required: true })
    nationality: string;

    @Prop({ required: true })
    destinationCountry: string;

    @Prop({ required: true })
    visaType: string;

    @Prop({ enum: ApplicationStatus, default: ApplicationStatus.IN_PROGRESS })
    status: ApplicationStatus;
}
export type VisaApplicationDocument = VisaApplication & Document;
export const VisaApplicationSchema =
    SchemaFactory.createForClass(VisaApplication);

@Schema({ timestamps: true })
export class BookFlight {
    @Prop({ unique: true, default: () => `BF${KeyGen.gen(13)}` })
    bookFlightId: string;

    @Prop({ required: true, text: true })
    returnType: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    phone: string;

    @Prop({ required: true })
    flyingFrom: string;

    @Prop({ required: true })
    flyingTo: string;

    @Prop({ required: true })
    deparutureDate: string;

    @Prop({ required: false })
    returnDate: string;

    @Prop({ required: true })
    adult: string;

    @Prop({ required: true })
    child: string;

    @Prop({ required: true })
    infant: string;

    @Prop({ enum: ApplicationStatus, default: ApplicationStatus.IN_PROGRESS })
    status: ApplicationStatus;
}
export type BookflightDocument = BookFlight & Document;
export const BookflightSchema = SchemaFactory.createForClass(BookFlight);

@Schema({ timestamps: true })
export class Application {
    @Prop({ required: true })
    applicationId: string;

    @Prop({ required: true })
    fullName: string;

    @Prop({ enum: ApplicationCategory })
    category: ApplicationCategory;

    @Prop({ enum: ApplicationStatus, default: ApplicationStatus.IN_PROGRESS })
    status: ApplicationStatus;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    phone: string;
}

export type ApplicationDocument = Application & Document;
export const ApplicationSchema = SchemaFactory.createForClass(Application);
