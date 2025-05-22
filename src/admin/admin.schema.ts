import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { KeyGen } from 'src/common/utils/key-gen';

@Schema({ timestamps: true })
export class Admin {
    @Prop({ unique: true, default: () => `AD${KeyGen.gen(13)}` })
    adminId: string;

    @Prop({ required: true })
    fullName: string;

    @Prop({ required: true, unique: true, sparse: true })
    email: string;

    @Prop({ required: true })
    password: string;
}
export type AdminDocument = Admin & Document;
export const AdminSchema = SchemaFactory.createForClass(Admin);
