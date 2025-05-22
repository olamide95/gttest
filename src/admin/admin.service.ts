import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, AdminDocument } from './admin.schema';
import { Model } from 'mongoose';
import {
    AddAdminDto,
    AddTeamMemberDto,
    UpdateTeamMemberDto,
} from './admin.dto';
import { TeamMember, TeamMemberDocument } from './teammember.schema';
import { TokenHandler } from 'src/common/utils/token-handler';
import { Rooms, RoomsDocument } from './rooms/rooms.schema';

@Injectable()
export class AdminService {
    constructor(
        @InjectModel(Admin.name)
        private readonly adminModel: Model<AdminDocument>,
        @InjectModel(TeamMember.name)
        private readonly teamMemberModel: Model<TeamMemberDocument>,
        @InjectModel(Rooms.name)
        private readonly roomModel: Model<RoomsDocument>,
    ) {}

    async addAdmin(addAdminDto: AddAdminDto) {
        return await this.adminModel.create(addAdminDto);
    }

    async getAdmin(field: string, value: string) {
        return await this.adminModel.findOne({ [field]: value });
    }
    async getAdmins() {
        return await this.adminModel.find();
    }

    async getTeamMember(field: string, value: string) {
        return await this.teamMemberModel
            .findOne({ [field]: value })
            .select('-password');
    }

    async getTeam() {
        return await this.teamMemberModel.find();
    }

    async getRooms() {
        return await this.roomModel.find();
    }

    async updateField(
        foo: string,
        bar: string,
        field: string,
        value: string | boolean | object,
    ) {
        return await this.adminModel.findOneAndUpdate(
            { [foo]: bar },
            { $set: { [field]: value } },
            { lean: true, new: true },
        );
    }

    async addTeamMember(payload: AddTeamMemberDto) {
        return await this.teamMemberModel.create(payload);
    }

    async deleteMember(memberId: string) {
        const teamMember = await this.teamMemberModel.findOneAndDelete({
            memberId,
        });
        await this.adminModel.findOneAndDelete({ adminId: teamMember.adminId });
        return teamMember;
    }

    async updateTeamMember(
        memberId: string,
        updateTeamMemberDto: UpdateTeamMemberDto,
    ) {
        return this.teamMemberModel.findByIdAndUpdate(
            memberId,
            updateTeamMemberDto,
            { new: true },
        );
    }

    // async updateAdmin(adminId: string, updateAdminDto: UpdateAdminDto) {
    //     return this.adminModel.findByIdAndUpdate(adminId, updateAdminDto, { new: true });
    // }

    async updateAdminPassword(
        adminId: string,
        currentPassword: string,
        newPassword: string,
    ) {
        const admin = await this.adminModel.findOne({ adminId: adminId });
        console.log('🚀 ~ AdminService ~ updateAdminPassword ~ admin:', admin);
        if (!admin) {
            throw new NotFoundException('Admin not found');
        }

        const isPasswordValid = await TokenHandler.verifyKey(
            admin.password,
            currentPassword,
        );
        console.log(
            '🚀 ~ AdminService ~ updateAdminPassword ~ isPasswordValid:',
            isPasswordValid,
        );
        if (!isPasswordValid) {
            throw new Error('Invalid current password');
        }

        const hashedPassword = await TokenHandler.hashKey(newPassword);
        console.log(
            '🚀 ~ AdminService ~ updateAdminPassword ~ hashedPassword:',
            hashedPassword,
        );
        admin.password = hashedPassword;
        await admin.save();
        return { message: 'Password updated successfully' };
    }
}
