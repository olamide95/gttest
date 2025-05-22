import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { KeyGen } from 'src/common/utils/key-gen';

@Schema({ timestamps: true })
export class ContactUs {
    @Prop({ unique: true, default: () => `CU${KeyGen.gen(13)}` })
    contactUsId: string;

    @Prop({ required: true })
    fullName: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    phone: string;

    @Prop({ required: true })
    country: string;

    @Prop({ required: true })
    question: string;
}

export type ContactUsDocument = ContactUs & Document;
export const ContactUsSchema = SchemaFactory.createForClass(ContactUs);

@Schema({ timestamps: true })
export class Consultation {
    @Prop({ unique: true, default: () => `CO${KeyGen.gen(13)}` })
    consultationId: string;

    @Prop({ required: true })
    fullName: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    phone: string;

    @Prop({ required: true })
    topic: string;

    @Prop({ required: true })
    date: Date;

    @Prop({ required: true })
    time: string;

    @Prop({ required: true })
    hour: number;

    @Prop({ required: true })
    minute: number;
}
export type ConsultationDocument = Consultation & Document;
export const ConsultationSchema = SchemaFactory.createForClass(Consultation);

@Schema({ timestamps: true })
export class VisaConsultation {
    @Prop({ unique: true, default: () => `VC${KeyGen.gen(13)}` })
    visaConsultationId: string;

    @Prop({ required: true })
    fullName: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    phone: string;

    @Prop({ required: true })
    nationality: string;

    @Prop({ required: true })
    travelDestination: string;

    @Prop({ required: true })
    travelReason: string;

    @Prop({ required: true })
    visaType: string;
}
export type VisaConsultationDocument = VisaConsultation & Document;
export const VisaConsultationSchema =
    SchemaFactory.createForClass(VisaConsultation);
