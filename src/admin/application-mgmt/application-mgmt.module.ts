import { Module } from '@nestjs/common';
import { ApplicationMgmtController } from './application-mgmt.controller';
import { ApplicationMgmtService } from './application-mgmt.service';
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
} from 'src/applications/applications.schema';
import { CloudinaryService } from 'src/common/services';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: SchoolApplication.name, schema: SchoolApplicationSchema },
            { name: VisaApplication.name, schema: VisaApplicationSchema },
            { name: BookFlight.name, schema: BookflightSchema },
            { name: Application.name, schema: ApplicationSchema },
        ]),
    ],
    controllers: [ApplicationMgmtController],
    providers: [ApplicationMgmtService, CloudinaryService],
})
export class ApplicationMgmtModule {}
