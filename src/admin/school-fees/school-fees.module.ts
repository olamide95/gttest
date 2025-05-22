import { Module } from '@nestjs/common';
import { SchoolFeesController } from './school-fees.controller';
import { SchoolFeesService } from './school-fees.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SchoolFees, SchoolFeesSchema } from './school-fees.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: SchoolFees.name, schema: SchoolFeesSchema },
        ]),
    ],
    controllers: [SchoolFeesController],
    providers: [SchoolFeesService],
})
export class SchoolFeesModule {}
