import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryService } from 'src/common/services';
import { Rooms, RoomsSchema } from './rooms.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Rooms.name, schema: RoomsSchema }]),
    ],
    controllers: [RoomsController],
    providers: [RoomsService, CloudinaryService],
})
export class RoomsModule {}
