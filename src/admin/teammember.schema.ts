import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TeamRole } from 'src/common/enums';
import { KeyGen } from 'src/common/utils/key-gen';

@Schema({ timestamps: true })
export class TeamMember {
    @Prop({ unique: true, default: () => `AD${KeyGen.gen(13)}` })
    memberId: string;

    @Prop({ required: true })
    fullName: string;

    @Prop({ required: true })
    adminId: string;

    @Prop({ required: true, unique: true, sparse: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true, type: 'string', enum: TeamRole })
    role: TeamRole;

    @Prop({ required: true })
    branchLocation: string;
}
export type TeamMemberDocument = TeamMember & Document;
export const TeamMemberSchema = SchemaFactory.createForClass(TeamMember);
