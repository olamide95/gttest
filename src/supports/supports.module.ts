import { Module } from '@nestjs/common';
import { SupportsController } from './supports.controller';
import { SupportsService } from './supports.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
    Consultation,
    ConsultationSchema,
    ContactUs,
    ContactUsSchema,
    VisaConsultation,
    VisaConsultationSchema,
} from './supports.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: ContactUs.name, schema: ContactUsSchema },
            { name: Consultation.name, schema: ConsultationSchema },
            { name: VisaConsultation.name, schema: VisaConsultationSchema },
        ]),
    ],
    controllers: [SupportsController],
    providers: [SupportsService],
})
export class SupportsModule {}
