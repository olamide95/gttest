import { Body, Controller, Post } from '@nestjs/common';
import { SupportsService } from './supports.service';
import {
    AddConsultationDto,
    AddContactUsDto,
    AddVisaConsultationDto,
} from './supports.dto';

@Controller('supports')
export class SupportsController {
    constructor(private readonly supportsService: SupportsService) {}

    @Post('contact-us')
    async addContactUs(@Body() addConctactUsDto: AddContactUsDto) {
        return await this.supportsService.addContactUs(addConctactUsDto);
    }

    @Post('consultations')
    async addConsultation(@Body() addConsultationDto: AddConsultationDto) {
        const time = addConsultationDto.time.split(':');
        addConsultationDto.hour = Number(time[0]);
        addConsultationDto.minute = Number(time[1]);
        return await this.supportsService.addConsultation(addConsultationDto);
    }

    @Post('visa-consultations')
    async addVisaConsultation(
        @Body() addVisaConsultationDto: AddVisaConsultationDto,
    ) {
        return await this.supportsService.addVisaConsultation(
            addVisaConsultationDto,
        );
    }
}
