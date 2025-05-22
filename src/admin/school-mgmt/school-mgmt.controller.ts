import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
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

@Controller('admin/school-mgmt')
@UseGuards(JwtAuthGuard)
export class SchoolMgmtController {
    constructor(
        private readonly schoolMgmtService: SchoolMgmtService,
        private readonly cloudinaryService: CloudinaryService,
    ) {}

    @Post('schools')
    async addSchool(@Body() addSchoolDto: AddSchoolDto) {
        if (addSchoolDto.image) {
            //gen file name
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
    async deleteSchool(@Param('schoolId') schoolId: string) {
        return await this.schoolMgmtService.deleteSchool(schoolId);
    }

    @Delete('schools/:schoolId/:programId')
    async deleteProgram(
        @Param('schoolId') schoolId: string,
        @Param('programId') programId: string,
    ) {
        return await this.schoolMgmtService.deleteProgram(schoolId, programId);
    }

    @Get('schools')
    async getSchoolApplications(
        @Query() paginationParams: PaginationParams,
        @Query('school') school?: string,
        @Query('program') program?: string,
        @Query('isProgramListing') isProgramListing?: string,
        @Query('schoolId') schoolId?: string,
    ) {
        const query =
            school || program || isProgramListing || schoolId
                ? { school, program, isProgramListing, schoolId }
                : undefined;
        return await this.schoolMgmtService.getSchools(paginationParams, query);
    }

    @Get('schools/stats')
    async getSchoolStats(@Query() paginationParams: PaginationParams) {
        return await this.schoolMgmtService.getSchoolStats(paginationParams);
    }

    @Patch('schools/:schoolId')
    async updateSchool(
        @Param('schoolId') schoolId: string,
        @Body() updateSchoolDto: UpdateSchoolDto,
    ) {
        if (updateSchoolDto.image) {
            //gen file name
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
        @Param('schoolId') schoolId: string,
        @Param('programId') programId: string,
        @Body() updateSchoolDto: UpdateSchoolDto,
    ) {
        return await this.schoolMgmtService.updateProgram(
            schoolId,
            programId,
            updateSchoolDto.program,
        );
    }

    @Get('schools/search')
    async searchSchoolApplication(
        @Query() searchSchoolDto: SearchSchoolDto,
        @Query() paginationParams: PaginationParams,
    ) {
        return await this.schoolMgmtService.searchSchool(
            searchSchoolDto,
            paginationParams,
        );
    }
}
