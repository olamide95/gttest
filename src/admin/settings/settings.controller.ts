import {
    Body,
    Controller,
    Get,
    Patch,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './settings.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ResponseInterceptor } from 'src/common/interceptors';

@Controller('admin/settings')
@UseGuards(JwtAuthGuard)
@UseInterceptors(new ResponseInterceptor())
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) {}

    @Get()
    async getSettings() {
        return await this.settingsService.getSettings();
    }

    @Patch('')
    async updateNotificationSetting(
        @Body() updateSettingsDto: UpdateSettingsDto,
    ) {
        return await this.settingsService.updateSettings(updateSettingsDto);
    }
}
