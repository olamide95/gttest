import {
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    Param,
    Patch,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { RoomsService } from './rooms/rooms.service';
import {
    AddAdminDto,
    AddTeamMemberDto,
    UpdateAdminPasswordDto,
    UpdateTeamMemberDto,
    GetTeamMember,
} from './admin.dto';
import { TokenHandler } from 'src/common/utils/token-handler';
import {
    EmailAlreadyExistsException,
    TeamMemberNotFoundException,
    AdminNotFoundException,
    InvalidPasswordException,
} from 'src/common/exceptions';
import { GetRoomsDto } from './rooms/rooms.dto';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { TeamRole } from 'src/common/enums';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    private async checkPermission(req: any, permissionKey: string) {
        const user = req.user;
        const teamMember = await this.adminService.getTeamMember('adminId', user.adminId);
        
        if (!teamMember) {
            throw new ForbiddenException('User not found in team members');
        }

        const settings = await this.adminService.getSettings();
        const permissions = settings.userManagementPermissions;

        switch (teamMember.role) {
            case TeamRole.ADMIN:
                if (!permissions[permissionKey].admin) {
                    throw new ForbiddenException('Insufficient permissions');
                }
                break;
            case TeamRole.MANAGER:
                if (!permissions[permissionKey].manager) {
                    throw new ForbiddenException('Insufficient permissions');
                }
                break;
            case TeamRole.STAFF:
                if (!permissions[permissionKey].staff) {
                    throw new ForbiddenException('Insufficient permissions');
                }
                break;
            default:
                throw new ForbiddenException('Invalid user role');
        }
    }

    @Get('team-members')
    async getAllTeamMembers(@Req() req): Promise<GetTeamMember[]> {
        
        return this.adminService.getTeam();
    }

    @Get('admins')
    async getAllUsers(@Req() req): Promise<any[]> {
        await this.checkPermission(req, 'view_staff');
        return this.adminService.getAdmins();
    }

    @Post()
    async addAdmin(@Req() req, @Body() addAdminDto: AddAdminDto) {
        await this.checkPermission(req, 'add_staff');
        
        const admin = await this.adminService.getAdmin('email', addAdminDto.email);
        if (admin) {
            throw EmailAlreadyExistsException();
        }
        addAdminDto.password = await TokenHandler.hashKey(addAdminDto.password);
        const _admin = (await this.adminService.addAdmin(addAdminDto)).toJSON();
        delete _admin.password;
        return _admin;
    }

    @Post('seed-first-admin')
    async seedInitialAdmin() {
        // This is a special endpoint that doesn't need permission checks
        // as it's meant to be used only once during initial setup
        const existingAdmins = await this.adminService.getAdmins();
        if (existingAdmins.length > 0) {
            throw new ForbiddenException('System already has admins');
        }

        const initialAdmin = {
            fullName: 'Super Admin',
            email: 'super.admin@example.com',
            password: 'ChangeThis123!'
        };

        initialAdmin.password = await TokenHandler.hashKey(initialAdmin.password);
        const admin = await this.adminService.addAdmin(initialAdmin);
        
        return {
            message: 'FIRST ADMIN CREATED! IMPORTANT:',
            instructions: [
                '1. IMMEDIATELY change this password in the system',
                '2. Remove this endpoint after setup',
                '3. Create regular admin accounts through protected routes'
            ],
            admin: {
                email: admin.email,
                fullName: admin.fullName
            }
        };
    }

    @Post('add-teammember')
    async addTeamMember(@Req() req, @Body() body: AddTeamMemberDto) {
        await this.checkPermission(req, 'add_staff');
        
        const teamMember = await this.adminService.getTeamMember('email', body.email);
        if (teamMember) throw EmailAlreadyExistsException();
        body.password = await TokenHandler.hashKey(body.password);
        const _teamMember = (await this.adminService.addTeamMember(body)).toJSON();
        delete _teamMember.password;
        return _teamMember;
    }

    @Delete('team-member/:memberId')
    async deleteMember(@Req() req, @Param('memberId') memberId: string) {
        await this.checkPermission(req, 'remove_staff');
        return await this.adminService.deleteMember(memberId);
    }

    @Patch('update-teammember/:id')
    async updateTeamMember(
        @Req() req,
        @Param('id') teamMemberId: string,
        @Body() body: UpdateTeamMemberDto,
    ) {
        await this.checkPermission(req, 'edit_staff');
        
        const teamMember = await this.adminService.getTeamMember('_id', teamMemberId);
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
    async getAllRooms(@Req() req): Promise<GetRoomsDto[]> {
        await this.checkPermission(req, 'view_staff');
        return this.adminService.getRooms();
    }

    @Patch('update-admin-password/:id')
    async updateAdminPassword(
        @Req() req,
        @Param('id') adminId: string,
        @Body() body: UpdateAdminPasswordDto,
    ) {
        try {
            // Allow users to update their own password without special permissions
            if (req.user.adminId !== adminId) {
                await this.checkPermission(req, 'edit_staff');
            }
            
            await this.adminService.updateAdminPassword(
                adminId,
                body.currentPassword,
                body.newPassword,
            );
            return { message: 'Password updated successfully' };
        } catch (err) {
            console.log('🚀 ~ AdminController ~ err:', err);
            throw err;
        }
    }
}