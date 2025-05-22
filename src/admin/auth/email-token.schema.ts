import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EmailTokenUsage } from './auth.enum';

export type EmailTokenDocument = EmailToken & Document;

@Schema({ timestamps: true })
export class EmailToken {
    @Prop({ required: true })
    email!: string;

    @Prop({ required: true })
    userId!: string;

    @Prop({ required: true })
    tokenHash!: string;

    @Prop({ required: true, enum: EmailTokenUsage })
    usage!: EmailTokenUsage;
}

const EmailTokenSchema = SchemaFactory.createForClass(EmailToken);
EmailTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 5 });

export { EmailTokenSchema };
