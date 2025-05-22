import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { AccommodationService } from './accommodation.service';
import {
    AddAccommodationDto,
    GetAccomodationsDto,
    UpdateAccommodationDto,
} from './accommodation.dto';

@Controller('accommodation')
export class AccommodationController {
    constructor(private readonly accommodationService: AccommodationService) {}

    @Get('accomodations')
    async getAccomodations(): Promise<GetAccomodationsDto[]> {
        return this.accommodationService.getAccomodations();
    }

    @Post('add-accommodation')
    async addAccommodation(@Body() addAccommodationDto: AddAccommodationDto) {
        return await this.accommodationService.addAccommodation(
            addAccommodationDto,
        );
    }

    @Delete('delete-accomodation/:id')
    async deleteAccomodation(@Param('id') id: string) {
        return await this.accommodationService.deleteAccomodation(id);
    }

    @Patch('update-accomodation/:id')
    async updateAccomodation(
        @Param('id') id: string,
        @Body() updateAccomodationDto: UpdateAccommodationDto, // Use UpdateBookFlightDto here
    ) {
        return await this.accommodationService.updateAccomodation(
            id,
            updateAccomodationDto,
        );
    }
}
