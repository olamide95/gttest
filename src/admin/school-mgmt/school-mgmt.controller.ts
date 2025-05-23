import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
    ForbiddenException,
} from '@nestjs/common';
import { SchoolMgmtService } from './school-mgmt.service';
import {
    AddSchoolDto,
    SearchSchoolDto,
    UpdateSchoolDto,
} from 'src/schools/schools.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PaginationParams } from 'src/common/dtos';
import { KeyGen } from 'src/common/utils/key-gen';
import { KeyType } from 'src/common/enums';
import { CloudinaryService } from 'src/common/services';
import { SCHOOL_IMAGES_DIR } from 'src/common/constants';
import { SchoolNotFoundException } from 'src/common/exceptions';
import { AdminService } from '../admin.service';
import { TeamRole } from 'src/common/enums';

@Controller('admin/school-mgmt')
@UseGuards(JwtAuthGuard)
export class SchoolMgmtController {
    constructor(
        private readonly schoolMgmtService: SchoolMgmtService,
        private readonly cloudinaryService: CloudinaryService,
        private readonly adminService: AdminService,
    ) {}

  private async checkPermission(req: any, permissionKey: string) {
    const user = req.user;
    
    // Use the AdminService's checkPermission method
    const hasPermission = await this.adminService.checkPermission(
        user.adminId,
        permissionKey
    );

    if (!hasPermission) {
        throw new ForbiddenException('Insufficient permissions');
    }
}

    @Post('schools')
    async addSchool(@Req() req, @Body() addSchoolDto: AddSchoolDto) {
        await this.checkPermission(req, 'add_school');

        if (addSchoolDto.image) {
            const key = KeyGen.gen(20, KeyType.ALPHANUMERIC);
            const upload = await this.cloudinaryService.uploadMedia(
                addSchoolDto.image,
                SCHOOL_IMAGES_DIR,
                key,
            );
            addSchoolDto.image = upload.secure_url;
        } else {
            addSchoolDto.image = '';
        }
        return await this.schoolMgmtService.addSchool(addSchoolDto);
    }

    @Delete('schools/:schoolId')
    async deleteSchool(@Req() req, @Param('schoolId') schoolId: string) {
        await this.checkPermission(req, 'delete_school');
        return await this.schoolMgmtService.deleteSchool(schoolId);
    }

    @Delete('schools/:schoolId/:programId')
    async deleteProgram(
        @Req() req,
        @Param('schoolId') schoolId: string,
        @Param('programId') programId: string,
    ) {
        await this.checkPermission(req, 'delete_program');
        return await this.schoolMgmtService.deleteProgram(schoolId, programId);
    }

    @Get('schools')
    async getSchoolApplications(
        @Req() req,
        @Query() paginationParams: PaginationParams,
        @Query('school') school?: string,
        @Query('program') program?: string,
        @Query('isProgramListing') isProgramListing?: string,
        @Query('schoolId') schoolId?: string,
    ) {
        await this.checkPermission(req, 'view_school');
        const query =
            school || program || isProgramListing || schoolId
                ? { school, program, isProgramListing, schoolId }
                : undefined;
        return await this.schoolMgmtService.getSchools(paginationParams, query);
    }

    @Get('schools/stats')
    async getSchoolStats(@Req() req, @Query() paginationParams: PaginationParams) {
        await this.checkPermission(req, 'view_school');
        return await this.schoolMgmtService.getSchoolStats(paginationParams);
    }

    @Patch('schools/:schoolId')
    async updateSchool(
        @Req() req,
        @Param('schoolId') schoolId: string,
        @Body() updateSchoolDto: UpdateSchoolDto,
    ) {
        await this.checkPermission(req, 'edit_school');

        if (updateSchoolDto.image) {
            const key = KeyGen.gen(20, KeyType.ALPHANUMERIC);
            const upload = await this.cloudinaryService.uploadMedia(
                updateSchoolDto.image,
                SCHOOL_IMAGES_DIR,
                key,
            );
            updateSchoolDto.image = upload.secure_url;
        }

        const school = await this.schoolMgmtService.updateSchool(
            schoolId,
            updateSchoolDto,
        );
        if (!school) {
            throw SchoolNotFoundException();
        }
        return school;
    }

    @Patch('schools/:schoolId/programs/:programId')
    async updateSchoolProgram(
        @Req() req,
        @Param('schoolId') schoolId: string,
        @Param('programId') programId: string,
        @Body() updateSchoolDto: UpdateSchoolDto,
    ) {
        await this.checkPermission(req, 'edit_program');
        return await this.schoolMgmtService.updateProgram(
            schoolId,
            programId,
            updateSchoolDto.program,
        );
    }

    @Post('schools/:schoolId/programs')
    async addProgram(
        @Req() req,
        @Param('schoolId') schoolId: string,
        @Body() updateSchoolDto: UpdateSchoolDto,
    ) {
        await this.checkPermission(req, 'add_program');
        return await this.schoolMgmtService.updateSchool(
            schoolId,
            updateSchoolDto,
        );
    }

    @Get('schools/search')
    async searchSchoolApplication(
        @Req() req,
        @Query() searchSchoolDto: SearchSchoolDto,
        @Query() paginationParams: PaginationParams,
    ) {
        await this.checkPermission(req, 'view_school');
        return await this.schoolMgmtService.searchSchool(
            searchSchoolDto,
            paginationParams,
        );
    }
}