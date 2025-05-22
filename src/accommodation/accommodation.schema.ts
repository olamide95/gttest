import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApplicationStatus } from 'src/applications/applications.enum';
import { KeyGen } from 'src/common/utils/key-gen';

@Schema({ timestamps: true })
export class Accommodation {
    @Prop({ unique: true, default: () => `CU${KeyGen.gen(13)}` })
    accommodationId: string;

    @Prop({ required: true })
    roomName: string;

    @Prop({ required: true })
    roomState: string;

    @Prop({ required: true })
    roomCountry: string;

    @Prop({ required: true })
    roomType: string;

    @Prop({ required: true })
    fullName: string;

    @Prop({ required: true })
    moveOutDate: string;

    @Prop({ required: true })
    moveInDate: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    phone: string;

    @Prop({ required: true })
    nationality: string;

    @Prop({ required: true })
    gender: string;

    @Prop({ enum: ApplicationStatus, default: ApplicationStatus.IN_PROGRESS })
    status: ApplicationStatus;

    @Prop({ required: true })
    dob: string;
}

export type AccommodationDocument = Accommodation & Document;
export const AccommodationSchema = SchemaFactory.createForClass(Accommodation);
