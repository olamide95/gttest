import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SchoolFees, SchoolFeesDocument } from './school-fees.schema';
import { AddSchoolFeesDto, UpdateSchoolFeesDto } from './school-fees.dto';

@Injectable()
export class SchoolFeesService {
    constructor(
        @InjectModel(SchoolFees.name)
        private readonly schoolFeesModel: Model<SchoolFeesDocument>,
    ) {}

    async createSchoolFees(schoolFees: AddSchoolFeesDto) {
        return await this.schoolFeesModel.create({
            ...schoolFees,
        });
    }
    async getSchoolFees() {
        return await this.schoolFeesModel.find();
    }
    async deleteSchoolFee(id: string) {
        return await this.schoolFeesModel.findOneAndDelete({ _id: id });
    }

    async updateSchoolFee(
        id: string,
        updateAccomodationDto: UpdateSchoolFeesDto,
    ) {
        const session = await this.schoolFeesModel.db.startSession();
        session.startTransaction();

        try {
            const scchoolFeeApllication =
                await this.schoolFeesModel.findOneAndUpdate(
                    { _id: id },
                    { $set: updateAccomodationDto },
                    { session, new: true, lean: true },
                );

            // if (!visaApplication) {
            //     throw new ApplicationNotFoundException();
            // }

            await session.commitTransaction();
            return scchoolFeeApllication;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        }
    }
}
