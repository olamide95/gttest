// import {
//     BadRequestException,
//     Body,
//     Controller,
//     Post,
//     UploadedFiles,
//     UseInterceptors,
// } from '@nestjs/common';
// import { ApplicationsService } from './applications.service';
// import {
//     AddSchoolApplicationDto,
//     AddVisaApplicationDto,
//     AddBookFlightDto
// } from './applications.dto';
// import { schoolApplicationFilesInterceptor } from 'src/common/interceptors';
// import { KeyGen } from 'src/common/utils/key-gen';
// import { KeyType } from 'src/common/enums';
// import { mimeToExt } from 'src/common/utils/mime-to-ext';
// import { CloudinaryService } from 'src/common/services';
// import { SCHOOL_APPLICATION_FILES_DIR } from 'src/common/constants';
// import { v2 as cloudinary } from 'cloudinary';
// import { cloudinaryConfig } from 'src/common/config'; // Import Cloudinary config
// import { Readable } from 'stream';

// @Controller('applications')
// export class ApplicationsController {
//     constructor(
//         private readonly applicationsService: ApplicationsService,
//         private readonly cloudinaryService: CloudinaryService,
//     ) {}

//     @Post('school-applications')
//     @UseInterceptors(schoolApplicationFilesInterceptor)
//     async addSchoolApplication(
//         @Body() addSchoolApplicationDto: AddSchoolApplicationDto,
//         @UploadedFiles() files: Express.Multer.File[],
//     ) {
//         console.log("🚀 ~ AddSchoolApplicationDto:", addSchoolApplicationDto);
//         console.log("Files:", files);
//         cloudinary.config(cloudinaryConfig);

//         // Initialize supporting documents if not present
//         addSchoolApplicationDto.suportingDocuments = addSchoolApplicationDto.suportingDocuments || {
//             passportPhoto: addSchoolApplicationDto.passportPhoto,
//             waecResult: addSchoolApplicationDto.waecResult,
//             waecScratchCard: addSchoolApplicationDto.waecScratchCard,
//             unofficialTranscript: addSchoolApplicationDto.unofficialTranscript,
//             aLevelResult: addSchoolApplicationDto.waecScratchCard,
//             resume: addSchoolApplicationDto.waecScratchCard,
//             others: [],
//         };

//         // Handle 'others' field separately
//         if (files['others']) {
//             for (const file of files['others']) {
//                 if (!file || file.size < 0.5 * 1024) {
//                     continue;
//                 }

//                 if (!file.mimetype.startsWith('image')) {
//                     throw new BadRequestException('Invalid images file');
//                 }

//                 const key = KeyGen.gen(20, KeyType.ALPHANUMERIC);
//                 const content = `${key}.${mimeToExt(file.mimetype)}`;

//                 try {
//                     const upload = await this.cloudinaryService.uploadMedia(
//                         file.buffer,
//                         SCHOOL_APPLICATION_FILES_DIR,
//                         key,
//                     );
// // @ts-ignore
//                     addSchoolApplicationDto.suportingDocuments.others.push({
//                         size: file.size,
//                         mimeType: file.mimetype,
//                         content,
//                         url: upload.secure_url,
//                     });
//                 } catch (error) {
//                     console.error('Error uploading file to Cloudinary:', error);
//                 }
//             }
//         }

//         // Handle other fields
//         const fields = ['passportPhoto', 'waecResult', 'waecScratchCard', 'unofficialTranscript', 'aLevelResult', 'resume'];
//         for (const field of fields) {
//             const file = files[field]?.[0];
//             if (!file || file.size < 0.5 * 1024) {
//                 addSchoolApplicationDto.suportingDocuments[field] = null;
//                 continue;
//             }

//             if (!file.mimetype.startsWith('image')) {
//                 throw new BadRequestException('Invalid image file');
//             }

//             const key = KeyGen.gen(20, KeyType.ALPHANUMERIC);
//             const content = `${key}.${mimeToExt(file.mimetype)}`;

//             try {
//                 const uploadResult = await new Promise((resolve, reject) => {
//                     const uploadStream = cloudinary.uploader.upload_stream({
//                         folder: 'Schools',
//                         public_id: field,
//                         access_mode: 'authenticated',
//                     }, (error, result) => {
//                         if (error) reject(error);
//                         else resolve(result);
//                     });

//                     Readable.from(file.buffer).pipe(uploadStream);
//                 });
// // @ts-ignore
//                 addSchoolApplicationDto.suportingDocuments[field] = uploadResult.url;
//             } catch (error) {
//                 console.error('Error uploading file to Cloudinary:', error);
//             }
//         }

//         const supportingDocuments = addSchoolApplicationDto.suportingDocuments;
//         console.log("🚀 ~ ApplicationsController ~ supportingDocuments:", supportingDocuments);

//         if (
//             !supportingDocuments.passportPhoto ||
//             !supportingDocuments.waecResult ||
//             !supportingDocuments.unofficialTranscript
//         ) {
//             throw new BadRequestException(
//                 'Attaching passport-photo, waec-result, and unofficial transcript is compulsory',
//             );
//         }

//         // Adjust contact information
//         if (addSchoolApplicationDto.contactInformation.isMailingAddress) {
//             addSchoolApplicationDto.contactInformation.mailingAddress = null;
//         }

//         // Remove expected graduation dates if already graduated
//         addSchoolApplicationDto.academicInformation.previousHighSchoolHistory.forEach(
//             (value) =>
//                 value?.hasGraduatedFromInstitution == true
//                     ? (value.expectedDateOfGraduation = null)
//                     : '',
//         );
//         addSchoolApplicationDto.academicInformation.previousCollegeHistory.forEach(
//             (value) =>
//                 value?.hasGraduatedFromInstitution == true
//                     ? (value.expectedDateOfGraduation = null)
//                     : '',
//         );

//         return await this.applicationsService.addSchoolApplication(
//             addSchoolApplicationDto,
//         );
//     }

//     @Post('visa-applications')
//     async addVisaApplication(
//         @Body() addVisaApplicationDto: AddVisaApplicationDto,
//     ) {
//         return await this.applicationsService.addVisaApplication(
//             addVisaApplicationDto,
//         );
//     }

//     @Post('book-flight')
//     async addBookFlight(
//         @Body() addBookFlightDto: AddBookFlightDto,
//     ) {
//         return await this.applicationsService.addBookFlight(
//             addBookFlightDto,
//         );
//     }
// }

import {
    BadRequestException,
    Body,
    Controller,
    Post,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import {
    AddSchoolApplicationDto,
    AddVisaApplicationDto,
    AddBookFlightDto,
} from './applications.dto';
import { schoolApplicationFilesInterceptor } from 'src/common/interceptors';
import { KeyGen } from 'src/common/utils/key-gen';
import { KeyType } from 'src/common/enums';
import { mimeToExt } from 'src/common/utils/mime-to-ext';
import { CloudinaryService } from 'src/common/services';
import { SCHOOL_APPLICATION_FILES_DIR } from 'src/common/constants';
import { v2 as cloudinary } from 'cloudinary';
import { cloudinaryConfig } from 'src/common/config'; // Import Cloudinary config
import { Readable } from 'stream';

@Controller('applications')
export class ApplicationsController {
    constructor(
        private readonly applicationsService: ApplicationsService,
        private readonly cloudinaryService: CloudinaryService,
    ) {}

    @Post('school-applications')
    @UseInterceptors(schoolApplicationFilesInterceptor)
    async addSchoolApplication(
        @Body() addSchoolApplicationDto: AddSchoolApplicationDto,
        @UploadedFiles() files: Express.Multer.File[],
    ) {
        console.log('🚀 ~ AddSchoolApplicationDto:', addSchoolApplicationDto);
        console.log('Files:', files);
        cloudinary.config(cloudinaryConfig);

        // Initialize supporting documents if not present
        addSchoolApplicationDto.suportingDocuments =
            addSchoolApplicationDto.suportingDocuments || {
                passportPhoto: addSchoolApplicationDto.passportPhoto,
                waecResult: addSchoolApplicationDto.waecResult,
                waecScratchCard: addSchoolApplicationDto.waecScratchCard,
                unofficialTranscript:
                    addSchoolApplicationDto.unofficialTranscript,
                aLevelResult: addSchoolApplicationDto.waecScratchCard,
                resume: addSchoolApplicationDto.waecScratchCard,
                others: [],
            };

        // Handle 'others' field separately
        const allowedMimeTypes = [
            'application/pdf',
            'application/msword', // for .doc
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // for .docx
            'image/png',
            'image/jpeg',
            'image/jpg',
        ];

        if (files['others']) {
            for (const file of files['others']) {
                if (!file || file.size < 0.5 * 1024) {
                    continue;
                }

                if (
                    !allowedMimeTypes.includes(file.mimetype) &&
                    !file.mimetype.startsWith('image')
                ) {
                    throw new BadRequestException('Invalid file type');
                }

                const key = KeyGen.gen(20, KeyType.ALPHANUMERIC);
                const content = `${key}.${mimeToExt(file.mimetype)}`;

                try {
                    const upload = await this.cloudinaryService.uploadMedia(
                        file.buffer,
                        SCHOOL_APPLICATION_FILES_DIR,
                        key,
                    );
                    // @ts-ignore
                    addSchoolApplicationDto.suportingDocuments.others.push({
                        size: file.size,
                        mimeType: file.mimetype,
                        content,
                        url: upload.secure_url,
                    });
                } catch (error) {
                    console.error('Error uploading file to Cloudinary:', error);
                }
            }
        }

        // Handle other fields
        const fields = [
            'passportPhoto',
            'waecResult',
            'waecScratchCard',
            'unofficialTranscript',
            'aLevelResult',
            'resume',
        ];
        for (const field of fields) {
            const file = files[field]?.[0];
            if (!file || file.size < 0.5 * 1024) {
                addSchoolApplicationDto.suportingDocuments[field] = null;
                continue;
            }

            if (
                !allowedMimeTypes.includes(file.mimetype) &&
                !file.mimetype.startsWith('image')
            ) {
                throw new BadRequestException('Invalid file type');
            }

            const key = KeyGen.gen(20, KeyType.ALPHANUMERIC);
            const content = `${key}.${mimeToExt(file.mimetype)}`;

            try {
                const uploadResult = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            folder: 'Schools',
                            public_id: field,
                            access_mode: 'authenticated',
                        },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        },
                    );

                    Readable.from(file.buffer).pipe(uploadStream);
                });
                // @ts-ignore
                addSchoolApplicationDto.suportingDocuments[field] = (
                    uploadResult as { url: string }
                ).url;
            } catch (error) {
                console.error('Error uploading file to Cloudinary:', error);
            }
        }

        const supportingDocuments = addSchoolApplicationDto.suportingDocuments;
        console.log(
            '🚀 ~ ApplicationsController ~ supportingDocuments:',
            supportingDocuments,
        );

        // Uploading documents is no longer compulsory

        // if (
        //     !supportingDocuments.passportPhoto ||
        //     !supportingDocuments.waecResult ||
        //     !supportingDocuments.unofficialTranscript
        // ) {
        //     throw new BadRequestException(
        //         'Attaching passport-photo, waec-result, and unofficial transcript is compulsory',
        //     );
        // }

        // Adjust contact information
        if (addSchoolApplicationDto.contactInformation.isMailingAddress)
            addSchoolApplicationDto.contactInformation.mailingAddress = null;

        // Remove expected graduation dates if already graduated
        addSchoolApplicationDto.academicInformation.previousHighSchoolHistory.forEach(
            (value) =>
                value?.hasGraduatedFromInstitution == true
                    ? (value.expectedDateOfGraduation = null)
                    : '',
        );
        addSchoolApplicationDto.academicInformation.previousCollegeHistory.forEach(
            (value) =>
                value?.hasGraduatedFromInstitution == true
                    ? (value.expectedDateOfGraduation = null)
                    : '',
        );

        return await this.applicationsService.addSchoolApplication(
            addSchoolApplicationDto,
        );
    }

    @Post('visa-applications')
    async addVisaApplication(
        @Body() addVisaApplicationDto: AddVisaApplicationDto,
    ) {
        return await this.applicationsService.addVisaApplication(
            addVisaApplicationDto,
        );
    }

    @Post('book-flight')
    async addBookFlight(@Body() addBookFlightDto: AddBookFlightDto) {
        return await this.applicationsService.addBookFlight(addBookFlightDto);
    }
}
