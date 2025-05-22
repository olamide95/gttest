import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import {
    SearchApplicationDto,
    UpdateBookFlightDto,
    UpdateSchoolApplicationDto,
    UpdateVisaApplicationDto,
} from 'src/applications/applications.dto';
import { ApplicationCategory } from 'src/applications/applications.enum';
import {
    Application,
    ApplicationDocument,
    BookFlight,
    BookflightDocument,
    SchoolApplication,
    SchoolApplicationDocument,
    VisaApplication,
    VisaApplicationDocument,
} from 'src/applications/applications.schema';
import { PAGINATION_COUNT } from 'src/common/constants';
import { PaginationParams } from 'src/common/dtos';
import { ApplicationNotFoundException } from 'src/common/exceptions';
import { Paginator } from 'src/common/utils/paginator';

@Injectable()
export class ApplicationMgmtService {
    constructor(
        @InjectModel(SchoolApplication.name)
        private readonly schoolApplicationModel: Model<SchoolApplicationDocument>,
        @InjectModel(VisaApplication.name)
        private readonly visaApplicationModel: Model<VisaApplicationDocument>,
        @InjectModel(BookFlight.name)
        private readonly bookFlightModel: Model<BookflightDocument>,
        @InjectModel(Application.name)
        private readonly applicationModel: Model<ApplicationDocument>,
        @InjectConnection() private connection: mongoose.Connection,
    ) {}

    async getSchoolApplications(paginationParams: PaginationParams) {
        const { direction, cursor } = paginationParams,
            sort = direction == 'forward' ? 'desc' : 'asc',
            modifier = direction == 'forward' ? '$lte' : '$gte';
        const data = await this.schoolApplicationModel.find(
            { createdAt: { [modifier]: cursor ?? new Date().toISOString()} },
            {},
            {
                limit: PAGINATION_COUNT + 1,
                sort: { createdAt: sort },
                lean: true,
            },
        );
        return await Paginator.paginate(
            data,
            this.schoolApplicationModel,
            paginationParams,
        );
    }

    async _getSchoolApplication(schoolApplicationId: string) {
        return await this.schoolApplicationModel.findOne(
            { schoolApplicationId },
            {},
            {
                lean: true,
            },
        );
    }

    async getVisaApplications(paginationParams: PaginationParams) {
        const { direction, cursor } = paginationParams,
            sort = direction == 'forward' ? 'desc' : 'asc',
            modifier = direction == 'forward' ? '$lte' : '$gte';
        const data = await this.visaApplicationModel.find(
            { createdAt: { [modifier]: cursor ?? new Date().toISOString()} },
            {},
            {
                limit: PAGINATION_COUNT + 1,
                sort: { createdAt: sort },
                lean: true,
            },
        );

        return await Paginator.paginate(
            data,
            this.visaApplicationModel,
            paginationParams,
        );
    }

    async getBookFlights() {
        const data = await this.bookFlightModel.find();

        return data;
    }

    async deleteFlightRecord(id: string) {
        return await this.bookFlightModel.findOneAndDelete({ _id: id });
    }

    async updateFlightApplication(
        id: string,
        updateBookFlightDto: UpdateBookFlightDto,
    ) {
        const session = await this.bookFlightModel.db.startSession();
        session.startTransaction();

        try {
            const visaApplication = await this.bookFlightModel.findOneAndUpdate(
                { _id: id },
                { $set: updateBookFlightDto },
                { session, new: true, lean: true },
            );
            console.log(
                '🚀 ~ ApplicationMgmtService ~ updateFlightApplication ~ visaApplication:',
                visaApplication,
            );

            // if (!visaApplication) {
            //     throw new ApplicationNotFoundException();
            // }

            await session.commitTransaction();
            return visaApplication;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        }
    }

    async getApplications(paginationParams: PaginationParams) {
        const { direction, cursor } = paginationParams,
            sort = direction == 'forward' ? 'desc' : 'asc',
            modifier = direction == 'forward' ? '$lte' : '$gte';
        const data = await this.applicationModel.find(
            { createdAt: { [modifier]: cursor ?? new Date().toISOString() } },
            {},
            {
                limit: PAGINATION_COUNT + 1,
                sort: { createdAt: sort },
                lean: true,
            },
        );
        return await Paginator.paginate(
            data,
            this.applicationModel,
            paginationParams,
        );
    }

    async getVisaApplicationStats(paginationParams: PaginationParams) {
        return Paginator.getPaginationStats(
            this.visaApplicationModel,
            {},
            paginationParams,
        );
    }

    async getSchoolApplicationStats(paginationParams: PaginationParams) {
        return Paginator.getPaginationStats(
            this.schoolApplicationModel,
            {},
            paginationParams,
        );
    }

    async getApplicationStats(paginationParams: PaginationParams) {
        return Paginator.getPaginationStats(
            this.applicationModel,
            {},
            paginationParams,
        );
    }

    async deleteVisaApplication(visaApplicationId: string) {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            await this.applicationModel.findOneAndDelete(
                { applicationId: visaApplicationId },
                { session },
            );

            const visaApplication =
                await this.visaApplicationModel.findOneAndDelete(
                    {
                        visaApplicationId,
                    },
                    { session },
                );
            await session.commitTransaction();
            return visaApplication;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        }
    }

    async deleteSchoolApplication(schoolApplicationId: string) {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            await this.applicationModel.findOneAndDelete(
                { applicationId: schoolApplicationId },
                { session },
            );

            const schoolApplication =
                await this.schoolApplicationModel.findOneAndDelete(
                    {
                        schoolApplicationId,
                    },
                    { session },
                );

            await session.commitTransaction();
            return schoolApplication;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        }
    }

    async searchApplication(
        { fullName, status, from, to }: SearchApplicationDto,
        applicationCategory: ApplicationCategory,
    ) {
        const pipeline = [];
        fullName
            ? pipeline.push({ $match: { $text: { $search: fullName } } })
            : '';
        status ? pipeline.push({ $match: { status } }) : '';
        from && to
            ? pipeline.push({
                  $match: {
                      createdAt: {
                          $gte: new Date(new Date(from).setHours(0, 0, 0)),
                          $lte: new Date(
                              new Date(to).setHours(23, 59, 59, 999),
                          ),
                      },
                  },
              })
            : '';
        fullName
            ? pipeline.push(
                  { $sort: { score: { $meta: 'textScore' } } },
                  { $limit: PAGINATION_COUNT },
              )
            : '';
        if (pipeline.length == 0) {
            return [];
        }
        const model =
            applicationCategory == ApplicationCategory.SCHOOL_APPLICATION
                ? this.schoolApplicationModel
                : this.visaApplicationModel;
        return await model.aggregate(pipeline);
    }

    async updateVisaApplication({
        visaApplicationId,
        ...updateVisaApplicationDto
    }: UpdateVisaApplicationDto) {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            const visaApplication =
                await this.visaApplicationModel.findOneAndUpdate(
                    { visaApplicationId },
                    { $set: updateVisaApplicationDto },
                    { session, new: true, lean: true },
                );

            if (!visaApplication) {
                throw ApplicationNotFoundException();
            }

            await this.applicationModel.findOneAndUpdate(
                { applicationId: visaApplicationId },
                {
                    $set: {
                        fullName: visaApplication.fullName,
                        email: visaApplication.email,
                        phone: visaApplication.phone,
                        status: visaApplication.status,
                    },
                },
                { session, new: true, lean: true },
            );
            await session.commitTransaction();
            return visaApplication;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        }
    }

    async updateSchoolApplication({
        schoolApplicationId,
        ...updateSchoolApplicationDto
    }: UpdateSchoolApplicationDto) {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            const schoolApplication =
                await this.schoolApplicationModel.findOneAndUpdate(
                    { schoolApplicationId },
                    { $set: updateSchoolApplicationDto },
                    { session, new: true, lean: true },
                );
            if (!schoolApplication) {
                throw ApplicationNotFoundException();
            }
            await this.applicationModel.findOneAndUpdate(
                { applicationId: schoolApplicationId },
                {
                    $set: {
                        fullName: `${schoolApplication.personalInformation.firstName} ${schoolApplication.personalInformation.lastName}`,
                        email: schoolApplication.contactInformation.email,
                        phone: schoolApplication.contactInformation.phone,
                        status: schoolApplication.status,
                    },
                },
                { session, new: true, lean: true },
            );
            await session.commitTransaction();
            return schoolApplication;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        }
    }
}
