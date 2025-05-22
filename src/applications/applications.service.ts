import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import {
    Application,
    ApplicationDocument,
    BookFlight,
    BookflightDocument,
    SchoolApplication,
    SchoolApplicationDocument,
    VisaApplication,
    VisaApplicationDocument,
} from './applications.schema';
import mongoose, { Model } from 'mongoose';
import {
    AddBookFlightDto,
    AddSchoolApplicationDto,
    AddVisaApplicationDto,
} from './applications.dto';
import { ApplicationCategory } from './applications.enum';

@Injectable()
export class ApplicationsService {
    constructor(
        @InjectModel(SchoolApplication.name)
        private readonly schoolApplicationModel: Model<SchoolApplicationDocument>,
        @InjectModel(VisaApplication.name)
        private readonly visaApplicationModel: Model<VisaApplicationDocument>,
        @InjectModel(BookFlight.name)
        private readonly bookflightModel: Model<BookflightDocument>,
        @InjectModel(Application.name)
        private readonly applicationModel: Model<ApplicationDocument>,
        @InjectConnection() private connection: mongoose.Connection,
    ) {}

    async addSchoolApplication(
        addSchoolApplicationDto: AddSchoolApplicationDto,
    ) {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            const schoolApplication = (
                await this.schoolApplicationModel.create(
                    [addSchoolApplicationDto],
                    { session },
                )
            )[0];
            const { personalInformation, contactInformation } =
                schoolApplication;
            // await this.applicationModel.create(
            //     [
            //         {
            //             applicationId: schoolApplication.schoolApplicationId,
            //             fullName: `${personalInformation.firstName} ${personalInformation.lastName}`,
            //             phone: contactInformation.phone,
            //             email: contactInformation.email,
            //             category: ApplicationCategory.SCHOOL_APPLICATION,
            //         },
            //     ],
            //     { session },
            // );
            await session.commitTransaction();
            return schoolApplication;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        }
    }

    async addVisaApplication(addVisaApplicationDto: AddVisaApplicationDto) {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            const visaApplication = (
                await this.visaApplicationModel.create(
                    [addVisaApplicationDto],
                    { session },
                )
            )[0];
            const { email, phone, visaApplicationId, fullName } =
                visaApplication;
            await this.applicationModel.create(
                [
                    {
                        applicationId: visaApplicationId,
                        fullName,
                        phone,
                        email,
                        category: ApplicationCategory.VISA_APPLICATION,
                    },
                ],
                { session },
            );
            await session.commitTransaction();
            return visaApplication;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        }
    }
    async addBookFlight(addBookFlightDto: AddBookFlightDto) {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            const bookFlight = (
                await this.bookflightModel.create([addBookFlightDto], {
                    session,
                })
            )[0];
            const {
                email,
                phone,
                bookFlightId,
                returnType,
                flyingFrom,
                flyingTo,
                deparutureDate,
                returnDate,
                adult,
                child,
                infant,
            } = bookFlight;
            // await this.applicationModel.create(
            //     [
            //         {
            //             applicationId: bookFlightId,
            //             email, phone, bookFlightId, returnType, flyingFrom, flyingTo, deparutureDate, returnDate, adult, child, infant
            //         },
            //     ],
            //     { session },
            // );
            await session.commitTransaction();
            return bookFlight;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        }
    }
}
