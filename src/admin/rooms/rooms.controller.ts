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
import { RoomsService } from './rooms.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PaginationParams } from 'src/common/dtos';
import { KeyGen } from 'src/common/utils/key-gen';
import { KeyType } from 'src/common/enums';
import { CloudinaryService } from 'src/common/services';
import { ROOMS_IMAGES_DIR } from 'src/common/constants';
import { AddRoomsDto, GetRoomsDto, UpdateRoomsDto } from './rooms.dto';

@Controller('admin/rooms')
@UseGuards(JwtAuthGuard)
export class RoomsController {
    constructor(
        private readonly roomService: RoomsService,
        private readonly cloudinaryService: CloudinaryService,
    ) {}

    @Get('get-all-rooms')
    async getAllRooms(@Query() paginationParams: PaginationParams) {
        return this.roomService.getRooms();
    }

    @Delete('room/:id')
    async deleteSchool(@Param('id') id: string) {
        return await this.roomService.deleteRoom(id);
    }

    @Post('create-room')
    async addRoom(@Body() addRoomDto: AddRoomsDto) {
        if (addRoomDto.image) {
            //gen file name
            const key = KeyGen.gen(20, KeyType.ALPHANUMERIC);

            const upload = await this.cloudinaryService.uploadMedia(
                addRoomDto.image,
                ROOMS_IMAGES_DIR,
                key,
            );

            addRoomDto.image = upload.secure_url;
        } else {
            addRoomDto.image = '';
        }
        return await this.roomService.createRoom(addRoomDto);
    }

    @Patch('update-room/:id')
    async updateAccomodation(
        @Param('id') id: string,
        @Body() updateRoomDto: UpdateRoomsDto, // Use UpdateBookFlightDto here
    ) {
        return await this.roomService.updateRoom(id, updateRoomDto);
    }
}
