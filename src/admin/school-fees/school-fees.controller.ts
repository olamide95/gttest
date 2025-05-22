import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { SchoolFeesService } from './school-fees.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
    AddSchoolFeesDto,
    GetSchoolFeesDto,
    UpdateSchoolFeesDto,
} from './school-fees.dto';

@Controller('admin/fees')
@UseGuards(JwtAuthGuard)
export class SchoolFeesController {
    constructor(private readonly schoolFeesService: SchoolFeesService) {}

    @Get('get-all-schoolFees')
    async getAllSchoolFees(): Promise<GetSchoolFeesDto[]> {
        return this.schoolFeesService.getSchoolFees();
    }
    @Post('school-fees')
    async addSchoolFees(@Body() addSchoolFeesDto: AddSchoolFeesDto) {
        return await this.schoolFeesService.createSchoolFees(addSchoolFeesDto);
    }

    @Delete('school-fees/:id')
    async deleteSchoolFee(@Param('id') id: string) {
        return await this.schoolFeesService.deleteSchoolFee(id);
    }

    @Patch('update-schoolfees/:id')
    async updateAccomodation(
        @Param('id') id: string,
        @Body() updateAccomodationDto: UpdateSchoolFeesDto, // Use UpdateBookFlightDto here
    ) {
        return await this.schoolFeesService.updateSchoolFee(
            id,
            updateAccomodationDto,
        );
    }
}
