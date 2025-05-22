import { Module } from '@nestjs/common';
import { SchoolsController } from './schools.controller';
import { SchoolsService } from './schools.service';
import { MongooseModule } from '@nestjs/mongoose';
import { School, SchoolSchema } from './schools.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: School.name, schema: SchoolSchema },
        ]),
    ],
    controllers: [SchoolsController],
    providers: [SchoolsService],
})
export class SchoolsModule {}
