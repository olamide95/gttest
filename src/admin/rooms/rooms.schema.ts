import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { File, FileSchema } from 'src/common/schemas';
import { KeyGen } from 'src/common/utils/key-gen';
import { Document } from 'mongoose';

export type RoomsDocument = Rooms & Document;

@Schema()
export class Rooms {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    roomType: string;

    @Prop({ required: true })
    accommodationType: string;

    @Prop({ required: true })
    availability: string;

    @Prop({ required: true })
    facilities: string[];

    @Prop({ required: true })
    location1: string;

    @Prop({ required: true })
    location2: string;

    @Prop({ required: true })
    about: string;

    @Prop({ required: true })
    image?: string;
}

export const RoomsSchema = SchemaFactory.createForClass(Rooms);
