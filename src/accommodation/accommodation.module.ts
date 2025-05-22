import { Module } from '@nestjs/common';
import { AccommodationController } from './accommodation.controller';
import { AccommodationService } from './accommodation.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Accommodation, AccommodationSchema } from './accommodation.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Accommodation.name, schema: AccommodationSchema },
        ]),
    ],
    controllers: [AccommodationController],
    providers: [AccommodationService],
})
export class AccommodationModule {}
