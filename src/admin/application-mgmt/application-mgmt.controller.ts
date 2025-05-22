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

@Controller('admin/application-mgmt')
@UseGuards(JwtAuthGuard)
export class ApplicationMgmtController {
    constructor(
        private readonly applicationMgmtService: ApplicationMgmtService,
        private readonly cloudinaryService: CloudinaryService,
    ) {}

    @Get('school-applications')
    async getSchoolApplications(@Query() paginationParams: PaginationParams) {
        return await this.applicationMgmtService.getSchoolApplications(
            paginationParams,
        );
    }

    @Get('visa-applications')
    async getVisaApplications(@Query() paginationParams: PaginationParams) {
        return await this.applicationMgmtService.getVisaApplications(
            paginationParams,
        );
    }

    // @Get('book-flights')
    // async getBookFlihgts(@Query() paginationParams: PaginationParams) {
    //     return await this.applicationMgmtService.getBookFlights(
    //         paginationParams,
    //     );
    // }

    @Get('book-flights')
    async getBookFlihgts(
        @Query() paginationParams: PaginationParams,
    ): Promise<GetBookFlightDto[]> {
        return this.applicationMgmtService.getBookFlights();
    }

    @Delete('delete-bookflight/:id')
    async deleteAccomodation(@Param('id') id: string) {
        return await this.applicationMgmtService.deleteFlightRecord(id);
    }

    @Patch('update-bookflight/:id')
    async updateFlightApplication(
        @Param('id') id: string,
        @Body() updateBookFlightDto: UpdateBookFlightDto, // Use UpdateBookFlightDto here
    ) {
        return await this.applicationMgmtService.updateFlightApplication(
            id,
            updateBookFlightDto,
        );
    }

    @Get('applications')
    async getApplications(@Query() paginationParams: PaginationParams) {
        return await this.applicationMgmtService.getApplications(
            paginationParams,
        );
    }

    @Get('visa-applications/stats')
    async getVisaApplicationStats(@Query() paginationParams: PaginationParams) {
        return await this.applicationMgmtService.getVisaApplicationStats(
            paginationParams,
        );
    }

    @Get('school-applications/stats')
    async getSchoolApplicationStats(
        @Query() paginationParams: PaginationParams,
    ) {
        return await this.applicationMgmtService.getSchoolApplicationStats(
            paginationParams,
        );
    }

    @Get('applications/stats')
    async getApplicationStats(@Query() paginationParams: PaginationParams) {
        return await this.applicationMgmtService.getApplicationStats(
            paginationParams,
        );
    }

    @Delete('visa-applications/:visaApplicationId')
    async deleteVisaAplication(
        @Param('visaApplicationId') visaApplicationId: string,
    ) {
        return await this.applicationMgmtService.deleteVisaApplication(
            visaApplicationId,
        );
    }

    @Delete('school-applications/:schoolApplicationId')
    async deleteSchoolApplication(
        @Param('schoolApplicationId') schoolApplicationId: string,
    ) {
        return await this.applicationMgmtService.deleteSchoolApplication(
            schoolApplicationId,
        );
    }

    @Get('school-applications/search')
    async searchSchoolApplication(
        @Query() searchSchoolApplicationDto: SearchApplicationDto,
    ) {
        return await this.applicationMgmtService.searchApplication(
            searchSchoolApplicationDto,
            ApplicationCategory.SCHOOL_APPLICATION,
        );
    }

    @Get('visa-applications/search')
    async searchVisaApplication(
        @Query() searchApplicationDto: SearchApplicationDto,
    ) {
        return await this.applicationMgmtService.searchApplication(
            searchApplicationDto,
            ApplicationCategory.VISA_APPLICATION,
        );
    }

    @Patch('visa-applications/:visaApplicationId')
    async updateVisaApplication(
        @Param('visaApplicationId') visaApplicationId: string,
        @Body() updateVisaApplicationDto: UpdateVisaApplicationDto,
    ) {
        updateVisaApplicationDto.visaApplicationId = visaApplicationId;
        return await this.applicationMgmtService.updateVisaApplication(
            updateVisaApplicationDto,
        );
    }

    @Patch('school-applications/:schoolApplicationId')
    async updateSchoolApplication(
        @Param('schoolApplicationId') schoolApplicationId: string,
        @Body() updateSchoolApplicationDto: UpdateSchoolApplicationDto,
    ) {
        console.log(
            '🚀 ~ ApplicationMgmtController ~ updateSchoolApplicationDto:',
            updateSchoolApplicationDto,
        );
        updateSchoolApplicationDto.schoolApplicationId = schoolApplicationId;
        console.log(
            '🚀 ~ ApplicationMgmtController ~ updateSchoolApplicationDto:',
            updateSchoolApplicationDto,
        );

        return await this.applicationMgmtService.updateSchoolApplication(
            updateSchoolApplicationDto,
        );
        // if (updateSchoolApplicationDto.suportingDocuments) {
        //     const files = updateSchoolApplicationDto.suportingDocuments;
        //     const fields = Object.keys(files);
        //     if (fields.length > 0) {
        //         const application =
        //             await this.applicationMgmtService._getSchoolApplication(
        //                 schoolApplicationId,
        //             );
        //         if (!application) {
        //             throw ApplicationNotFoundException();
        //         }
        //         updateSchoolApplicationDto.suportingDocuments =
        //             application.suportingDocuments;
        //         for (const field of fields) {
        //             if (field == 'others') {
        //                 if (
        //                     !updateSchoolApplicationDto.suportingDocuments[
        //                         field
        //                     ]
        //                 ) {
        //                     updateSchoolApplicationDto.suportingDocuments[
        //                         field
        //                     ] = [];
        //                 }
        //                 for (let i = 0; i < files[field]?.length || 0; i++) {
        //                     files[field]?.length;
        //                     const file: string = files[field]?.[i];

        //                     //gen file name
        //                     const key = KeyGen.gen(20, KeyType.ALPHANUMERIC);

        //                     const upload =
        //                         await this.cloudinaryService.uploadMedia(
        //                             file,
        //                             SCHOOL_APPLICATION_FILES_DIR,
        //                             key,
        //                         );

        //                     updateSchoolApplicationDto.suportingDocuments[
        //                         field
        //                     ].push(upload.secure_url);
        //                 }
        //             } else {
        //                 const file: string = files[field]?.[0];

        //                 //gen file name
        //                 const key = KeyGen.gen(20, KeyType.ALPHANUMERIC);

        //                 const upload = await this.cloudinaryService.uploadMedia(
        //                     file,
        //                     SCHOOL_APPLICATION_FILES_DIR,
        //                     key,
        //                 );

        //                 updateSchoolApplicationDto.suportingDocuments[field] = {
        //                     url: upload.secure_url,
        //                 };
        //             }
        //         }
        //     }

        //     const supportingDocuments =
        //         updateSchoolApplicationDto.suportingDocuments;
        //     if (
        //         !supportingDocuments.passportPhoto ||
        //         !supportingDocuments.waecResult ||
        //         !supportingDocuments.unofficialTranscript
        //     ) {
        //         throw new BadRequestException(
        //             'attaching passport-photo, waec-result and unofficial transcript is compulsory',
        //         );
        //     }
        //     updateSchoolApplicationDto.schoolApplicationId =
        //         schoolApplicationId;
        //     typeof updateSchoolApplicationDto.contactInformation !==
        //         undefined &&
        //     updateSchoolApplicationDto.contactInformation?.isMailingAddress ==
        //         true
        //         ? (updateSchoolApplicationDto.contactInformation.mailingAddress =
        //               null)
        //         : '';
        //     updateSchoolApplicationDto.academicInformation?.previousHighSchoolHistory.forEach(
        //         (value) =>
        //             value?.hasGraduatedFromInstitution == true
        //                 ? (value.expectedDateOfGraduation = null)
        //                 : '',
        //     );
        //     updateSchoolApplicationDto.academicInformation?.previousCollegeHistory.forEach(
        //         (value) =>
        //             value?.hasGraduatedFromInstitution == true
        //                 ? (value.expectedDateOfGraduation = null)
        //                 : '',
        //     );

        // return await this.applicationMgmtService.updateSchoolApplication(
        //     updateSchoolApplicationDto,
        // );
        // }
    }
}
