import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PAGINATION_COUNT } from 'src/common/constants';
import { PaginationParams } from 'src/common/dtos';
import { ProgramInterface } from 'src/common/types';
import { Paginator } from 'src/common/utils/paginator';
import {
    AddSchoolDto,
    SearchSchoolDto,
    UpdateSchoolDto,
} from 'src/schools/schools.dto';
import { School, SchoolDocument } from 'src/schools/schools.schema';
import { Rooms, RoomsDocument } from './rooms.schema';
import { AddRoomsDto, UpdateRoomsDto } from './rooms.dto';
import { title } from 'process';

@Injectable()
export class RoomsService {
    private readonly logger = new Logger(RoomsService.name);
    constructor(
        @InjectModel(Rooms.name)
        private readonly roomModel: Model<RoomsDocument>,
    ) {}

    async createRoom(addRoom: AddRoomsDto) {
        return await this.roomModel.create({
            ...addRoom,
            image: addRoom.image,
        });
    }

    async getRooms() {
        return await this.roomModel.find();
    }

    async deleteRoom(id: string) {
        return await this.roomModel.findOneAndDelete({ _id: id });
    }

    async updateRoom(id: string, updateRoomDto: UpdateRoomsDto) {
        const session = await this.roomModel.db.startSession();
        session.startTransaction();

        try {
            const roomSta = await this.roomModel.findOneAndUpdate(
                { _id: id },
                { $set: updateRoomDto },
                { session, new: true, lean: true },
            );

            // if (!visaApplication) {
            //     throw new ApplicationNotFoundException();
            // }

            await session.commitTransaction();
            return roomSta;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        }
    }
}
