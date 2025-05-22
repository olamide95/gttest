import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { KeyGen } from 'src/common/utils/key-gen';
import { Document } from 'mongoose';

export type SchoolDocument = School & Document;

@Schema()
export class Program {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    programType: string;

    @Prop({ required: true })
    duration: string;

    @Prop({ required: true })
    degreeType: string;

    @Prop({ required: true })
    classType: string;

    @Prop({ required: true, type: String })
    startDate: String;

    @Prop()
    about?: string;

    @Prop({ required: true })
    requiredDocuments: string[];

    @Prop({ required: true })
    tuitionFee: number;

    @Prop({ required: true, default: 0 })
    otherFee: String;

    @Prop({ required: true })
    currency: string;

    @Prop()
    otherInformation?: string;

    @Prop({ type: 'boolean', default: false })
    onCampus: boolean;

    @Prop({ type: 'boolean', default: false })
    offCampus: boolean;

    @Prop({ type: 'boolean', default: false })
    needBasedScholarship: boolean;

    @Prop({ type: 'boolean', default: false })
    meritBasedScholarship: boolean;
    _id: any;
}
const ProgramSchema = SchemaFactory.createForClass(Program);

@Schema({ timestamps: true })
export class School {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    schoolType: string;

    @Prop({ required: true })
    state: string;

    @Prop({ required: true })
    country: string;

    @Prop({ required: true })
    url: string;

    @Prop({ required: true })
    about: string;

    @Prop({ type: [ProgramSchema] })
    programs: Program[];

    @Prop({ type: 'string', default: null })
    image: string;

    @Prop({ required: true, default: () => `SC${KeyGen.gen(13)}` })
    schoolId: string;

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;
}
export const SchoolSchema = SchemaFactory.createForClass(School);
