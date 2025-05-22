import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
    Consultation,
    ConsultationDocument,
    ContactUs,
    ContactUsDocument,
    VisaConsultation,
    VisaConsultationDocument,
} from './supports.schema';
import { Model } from 'mongoose';
import {
    AddConsultationDto,
    AddContactUsDto,
    AddVisaConsultationDto,
} from './supports.dto';

@Injectable()
export class SupportsService {
    constructor(
        @InjectModel(ContactUs.name)
        private readonly contactUsModel: Model<ContactUsDocument>,
        @InjectModel(Consultation.name)
        private readonly consultationModel: Model<ConsultationDocument>,
        @InjectModel(VisaConsultation.name)
        private readonly visaConsultationModel: Model<VisaConsultationDocument>,
    ) {}

    async addContactUs(addContactUsDto: AddContactUsDto) {
        return await this.contactUsModel.create(addContactUsDto);
    }

    async addConsultation(addConsultationDto: AddConsultationDto) {
        return await this.consultationModel.create(addConsultationDto);
    }

    async addVisaConsultation(addVisaConsultationDto: AddVisaConsultationDto) {
        return await this.visaConsultationModel.create(addVisaConsultationDto);
    }
}
