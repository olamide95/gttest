import {
    Body,
    Controller,
    Get,
    Patch,
    UseGuards,
    UseInterceptors,
    Req,
    ForbiddenException,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './settings.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ResponseInterceptor } from 'src/common/interceptors';
import { TeamRole } from 'src/common/enums';
import { AdminService } from '../admin.service';

@Controller('admin/settings')
@UseGuards(JwtAuthGuard)
@UseInterceptors(new ResponseInterceptor())
export class SettingsController {
    constructor(
        private readonly settingsService: SettingsService,
        private readonly adminService: AdminService, // Inject AdminService
    ) {}

    private async checkAdminRole(req: any) {
        const user = req.user;
        const teamMember = await this.adminService.getTeamMember('adminId', user.adminId);
        
        if (!teamMember || teamMember.role !== TeamRole.ADMIN) {
            throw new ForbiddenException('Only administrators can perform this action');
        }
    }

    @Get()
    async getSettings(@Req() req) {
        // Allow viewing settings for all authenticated users
        return await this.settingsService.getSettings();
    }

    @Patch('')
    async updateNotificationSetting(
        @Req() req,
        @Body() updateSettingsDto: UpdateSettingsDto,
    ) {
        await this.checkAdminRole(req); // Check if user is ADMIN
        return await this.settingsService.updateSettings(updateSettingsDto);
    }
}