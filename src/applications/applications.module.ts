import { Module } from '@nestjs/common';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
    Application,
    ApplicationSchema,
    BookFlight,
    BookflightSchema,
    SchoolApplication,
    SchoolApplicationSchema,
    VisaApplication,
    VisaApplicationSchema,
} from './applications.schema';
import { CloudinaryService } from 'src/common/services';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: VisaApplication.name, schema: VisaApplicationSchema },
            { name: SchoolApplication.name, schema: SchoolApplicationSchema },
            { name: Application.name, schema: ApplicationSchema },
            { name: BookFlight.name, schema: BookflightSchema },
        ]),
    ],
    controllers: [ApplicationsController],
    providers: [ApplicationsService, CloudinaryService],
})
export class ApplicationsModule {}
