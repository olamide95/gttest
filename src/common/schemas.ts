import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MimeType } from './enums';

@Schema({ _id: false })
export class File {
    @Prop({ required: true })
    content: string;

    @Prop({ required: true })
    size: number;

    @Prop({ required: true, enum: MimeType })
    mimeType: MimeType;

    @Prop()
    url: string;
}

export const FileSchema = SchemaFactory.createForClass(File);

@Schema({ _id: false })
class Point {
    @Prop({ type: String, enum: ['Point'], required: true, default: 'Point' })
    type: string;

    @Prop({ type: [Number], required: true })
    coordinates: number[];
}

const PointSchema = SchemaFactory.createForClass(Point);

@Schema({ _id: false })
export class Location {
    @Prop({ required: true })
    address: string;

    @Prop({ type: PointSchema, index: { type: '2dsphere' } })
    point: Point;
}

export const LocationSchema = SchemaFactory.createForClass(Location);
LocationSchema.index({ point: '2dsphere' });
