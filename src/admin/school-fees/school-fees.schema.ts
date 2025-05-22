import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApplicationStatus } from 'src/applications/applications.enum';
export type SchoolFeesDocument = SchoolFees & Document;

@Schema()
export class SchoolFees {
    @Prop()
    studentFirstName: string;

    @Prop()
    studentLastName: string;

    @Prop()
    dateOfBirth: string;

    @Prop()
    phone: string;

    @Prop()
    emailAddress: string;

    @Prop()
    countryName: string;

    @Prop()
    universityName: string;

    @Prop()
    bankName: string;

    @Prop()
    applicationFee: number;

    @Prop()
    programmeFee: number;

    @Prop()
    otherPayment: number;

    @Prop()
    total: number;

    @Prop({ enum: ApplicationStatus, default: ApplicationStatus.IN_PROGRESS })
    status: ApplicationStatus;
}

export const SchoolFeesSchema = SchemaFactory.createForClass(SchoolFees);
