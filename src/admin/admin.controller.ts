import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { RoomsService } from './rooms/rooms.service';
import {
    AddAdminDto,
    AddTeamMemberDto,
    // UpdateAdminDto,
    UpdateAdminPasswordDto, // Add this DTO for password update
    UpdateTeamMemberDto,
    GetTeamMember,
} from './admin.dto';
import { TokenHandler } from 'src/common/utils/token-handler';
import {
    EmailAlreadyExistsException,
    TeamMemberNotFoundException,
    AdminNotFoundException,
    InvalidPasswordException,
} from 'src/common/exceptions'; // Add InvalidPasswordException
import { GetRoomsDto } from './rooms/rooms.dto';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Get('team-members')
    async getAllTeamMembers(): Promise<GetTeamMember[]> {
        return this.adminService.getTeam();
    }

    @Get('admins')
    async getAllUsers(): Promise<any[]> {
        return this.adminService.getAdmins();
    }

    @Post()
    async addAdmin(@Body() addAdminDto: AddAdminDto) {
        const admin = await this.adminService.getAdmin(
            'email',
            addAdminDto.email,
        );
        if (admin) {
            throw EmailAlreadyExistsException();
        }
        addAdminDto.password = await TokenHandler.hashKey(addAdminDto.password);
        const _admin = (await this.adminService.addAdmin(addAdminDto)).toJSON();
        delete _admin.password;
        return _admin;
    }

    @Post('add-teammember')
    async addTeamMember(@Body() body: AddTeamMemberDto) {
        const teamMember = await this.adminService.getTeamMember(
            'email',
            body.email,
        );
        if (teamMember) throw EmailAlreadyExistsException();
        body.password = await TokenHandler.hashKey(body.password);
        const _teamMember = (
            await this.adminService.addTeamMember(body)
        ).toJSON();
        delete _teamMember.password;
        return _teamMember;
    }

    @Delete('team-member/:memberId')
    async deleteMember(@Param('memberId') memberId: string) {
        return await this.adminService.deleteMember(memberId);
    }

    @Patch('update-teammember/:id')
    async updateTeamMember(
        @Param('id') teamMemberId: string,
        @Body() body: UpdateTeamMemberDto,
    ) {
        const teamMember = await this.adminService.getTeamMember(
            '_id',
            teamMemberId,
        );
        if (!teamMember) {
            throw TeamMemberNotFoundException();
        }

        if (body.password) {
            body.password = await TokenHandler.hashKey(body.password);
        }

        await this.adminService.updateTeamMember(teamMemberId, body);
        return { message: 'Team member updated successfully' };
    }

    @Get('get-all-rooms')
    async getAllRooms(): Promise<GetRoomsDto[]> {
        return this.adminService.getRooms();
    }

    @Patch('update-admin-password/:id')
    async updateAdminPassword(
        @Param('id') adminId: string,
        @Body() body: UpdateAdminPasswordDto,
    ) {
        try {
            await this.adminService.updateAdminPassword(
                adminId,
                body.currentPassword,
                body.newPassword,
            );
            return { message: 'Password updated successfully' };
        } catch (err) {
            console.log('🚀 ~ AdminController ~ err:', err);
        }
    }
}

// @Patch('update-admin/:id')
// async updateAdmin(
//     @Param('id') adminId: string,
//     @Body() body: UpdateAdminDto,
// ) {
//     const admin = await this.adminService.getAdmin('id', adminId);
//     if (!admin) {
//         throw new AdminNotFoundException();
//     }

//     if (body.password) {
//         body.password = await TokenHandler.hashKey(body.password);
//     }

//     await this.adminService.updateAdmin(adminId, body);
//     return { message: 'Admin updated successfully' };
// }
