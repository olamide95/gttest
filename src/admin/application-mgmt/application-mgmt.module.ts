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
import { Module, forwardRef } from '@nestjs/common';
import { AdminModule } from '../admin.module'; // Add this import



@Module({
    imports: [
        MongooseModule.forFeature([
            { name: SchoolApplication.name, schema: SchoolApplicationSchema },
            { name: VisaApplication.name, schema: VisaApplicationSchema },
            { name: BookFlight.name, schema: BookflightSchema },
            { name: Application.name, schema: ApplicationSchema },
        ]),
            forwardRef(() => AdminModule), // Use forwardRef here
        
    ],
    controllers: [ApplicationMgmtController],
    providers: [ApplicationMgmtService, CloudinaryService],
    exports: [ApplicationMgmtService], // Export if needed by other modules
})
export class ApplicationMgmtModule {}
