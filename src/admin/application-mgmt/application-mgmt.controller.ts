import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Query,
    UseGuards,
    Req,
    ForbiddenException,
} from '@nestjs/common';
import { ApplicationMgmtService } from './application-mgmt.service';
import { PaginationParams } from 'src/common/dtos';
import {
    GetBookFlightDto,
    SearchApplicationDto,
    UpdateBookFlightDto,
    UpdateSchoolApplicationDto,
    UpdateVisaApplicationDto,
} from 'src/applications/applications.dto';
import { ApplicationCategory } from 'src/applications/applications.enum';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SCHOOL_APPLICATION_FILES_DIR } from 'src/common/constants';
import { KeyType } from 'src/common/enums';
import { KeyGen } from 'src/common/utils/key-gen';
import { CloudinaryService } from 'src/common/services';
import { ApplicationNotFoundException } from 'src/common/exceptions';
import { AdminService } from '../admin.service';
import { AdminModule } from '../admin.module'; // Add this import


@Controller('admin/application-mgmt')
@UseGuards(JwtAuthGuard)
export class ApplicationMgmtController {
    constructor(
        private readonly applicationMgmtService: ApplicationMgmtService,
        private readonly cloudinaryService: CloudinaryService,
        private readonly adminService: AdminService, // Add AdminService
    ) {}

    private async checkPermission(req: any, permissionKey: string) {
        const user = req.user;
        const teamMember = await this.adminService.getTeamMember('adminId', user.adminId);
        
        if (!teamMember) {
            throw new ForbiddenException('User not found in team members');
        }
 
        const settings = await this.adminService.getSettings();
        const permissions = settings.schoolApplicationPermissions;

        switch (teamMember.role) {
            case 'ADMIN':
                if (!permissions[permissionKey].admin) {
                    throw new ForbiddenException('Insufficient permissions');
                }
                break;
            case 'MANAGER':
                if (!permissions[permissionKey].manager) {
                    throw new ForbiddenException('Insufficient permissions');
                }
                break;
            case 'STAFF':
                if (!permissions[permissionKey].staff) {
                    throw new ForbiddenException('Insufficient permissions');
                }
                break;
            default:
                throw new ForbiddenException('Invalid user role');
        }
    }

    @Get('school-applications')
    async getSchoolApplications(@Req() req, @Query() paginationParams: PaginationParams) {
        await this.checkPermission(req, 'view_school_application');
        return await this.applicationMgmtService.getSchoolApplications(
            paginationParams,
        );
    }

    @Get('visa-applications')
    async getVisaApplications(@Req() req, @Query() paginationParams: PaginationParams) {
        await this.checkPermission(req, 'view_visa_application');
        return await this.applicationMgmtService.getVisaApplications(
            paginationParams,
        );
    }

    @Get('book-flights')
    async getBookFlihgts(
        @Req() req,
        @Query() paginationParams: PaginationParams,
    ): Promise<GetBookFlightDto[]> {
        await this.checkPermission(req, 'view_visa_application'); // Assuming flight booking is part of visa process
        return this.applicationMgmtService.getBookFlights();
    }

    @Delete('delete-bookflight/:id')
    async deleteAccomodation(@Req() req, @Param('id') id: string) {
        await this.checkPermission(req, 'delete_visa_application');
        return await this.applicationMgmtService.deleteFlightRecord(id);
    }

    @Patch('update-bookflight/:id')
    async updateFlightApplication(
        @Req() req,
        @Param('id') id: string,
        @Body() updateBookFlightDto: UpdateBookFlightDto,
    ) {
        await this.checkPermission(req, 'edit_visa_application');
        return await this.applicationMgmtService.updateFlightApplication(
            id,
            updateBookFlightDto,
        );
    }

    @Get('applications')
    async getApplications(@Req() req, @Query() paginationParams: PaginationParams) {
        await this.checkPermission(req, 'view_school_application');
        return await this.applicationMgmtService.getApplications(
            paginationParams,
        );
    }

    @Get('visa-applications/stats')
    async getVisaApplicationStats(@Req() req, @Query() paginationParams: PaginationParams) {
        await this.checkPermission(req, 'view_visa_application');
        return await this.applicationMgmtService.getVisaApplicationStats(
            paginationParams,
        );
    }

    @Get('school-applications/stats')
    async getSchoolApplicationStats(
        @Req() req,
        @Query() paginationParams: PaginationParams,
    ) {
        await this.checkPermission(req, 'view_school_application');
        return await this.applicationMgmtService.getSchoolApplicationStats(
            paginationParams,
        );
    }

    @Get('applications/stats')
    async getApplicationStats(@Req() req, @Query() paginationParams: PaginationParams) {
        await this.checkPermission(req, 'view_school_application');
        return await this.applicationMgmtService.getApplicationStats(
            paginationParams,
        );
    }

    @Delete('visa-applications/:visaApplicationId')
    async deleteVisaAplication(
        @Req() req,
        @Param('visaApplicationId') visaApplicationId: string,
    ) {
        await this.checkPermission(req, 'delete_visa_application');
        return await this.applicationMgmtService.deleteVisaApplication(
            visaApplicationId,
        );
    }

    @Delete('school-applications/:schoolApplicationId')
    async deleteSchoolApplication(
        @Req() req,
        @Param('schoolApplicationId') schoolApplicationId: string,
    ) {
        await this.checkPermission(req, 'delete_school_application');
        return await this.applicationMgmtService.deleteSchoolApplication(
            schoolApplicationId,
        );
    }

    @Get('school-applications/search')
    async searchSchoolApplication(
        @Req() req,
        @Query() searchSchoolApplicationDto: SearchApplicationDto,
    ) {
        await this.checkPermission(req, 'view_school_application');
        return await this.applicationMgmtService.searchApplication(
            searchSchoolApplicationDto,
            ApplicationCategory.SCHOOL_APPLICATION,
        );
    }

    @Get('visa-applications/search')
    async searchVisaApplication(
        @Req() req,
        @Query() searchApplicationDto: SearchApplicationDto,
    ) {
        await this.checkPermission(req, 'view_visa_application');
        return await this.applicationMgmtService.searchApplication(
            searchApplicationDto,
            ApplicationCategory.VISA_APPLICATION,
        );
    }

    @Patch('visa-applications/:visaApplicationId')
    async updateVisaApplication(
        @Req() req,
        @Param('visaApplicationId') visaApplicationId: string,
        @Body() updateVisaApplicationDto: UpdateVisaApplicationDto,
    ) {
        await this.checkPermission(req, 'edit_visa_application');
        updateVisaApplicationDto.visaApplicationId = visaApplicationId;
        return await this.applicationMgmtService.updateVisaApplication(
            updateVisaApplicationDto,
        );
    }

    @Patch('school-applications/:schoolApplicationId')
    async updateSchoolApplication(
        @Req() req,
        @Param('schoolApplicationId') schoolApplicationId: string,
        @Body() updateSchoolApplicationDto: UpdateSchoolApplicationDto,
    ) {
        await this.checkPermission(req, 'edit_school_application');
        
        console.log('🚀 ~ ApplicationMgmtController ~ updateSchoolApplicationDto:', updateSchoolApplicationDto);
        updateSchoolApplicationDto.schoolApplicationId = schoolApplicationId;
        console.log('🚀 ~ ApplicationMgmtController ~ updateSchoolApplicationDto:', updateSchoolApplicationDto);

        return await this.applicationMgmtService.updateSchoolApplication(
            updateSchoolApplicationDto,
        );
    }
}