import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Accommodation, AccommodationDocument } from './accommodation.schema';
import { Model } from 'mongoose';
import {
    AddAccommodationDto,
    UpdateAccommodationDto,
} from './accommodation.dto';

@Injectable()
export class AccommodationService {
    constructor(
        @InjectModel(Accommodation.name)
        private readonly accommodationModel: Model<AccommodationDocument>,
    ) {}

    async addAccommodation(addAccommodationDto: AddAccommodationDto) {
        return await this.accommodationModel.create(addAccommodationDto);
    }

    async getAccomodations() {
        return await this.accommodationModel.find();
    }
    async deleteAccomodation(id: string) {
        return await this.accommodationModel.findOneAndDelete({ _id: id });
    }

    async updateAccomodation(
        id: string,
        updateAccomodationDto: UpdateAccommodationDto,
    ) {
        const session = await this.accommodationModel.db.startSession();
        session.startTransaction();

        try {
            const visaApplication =
                await this.accommodationModel.findOneAndUpdate(
                    { _id: id },
                    { $set: updateAccomodationDto },
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
}
