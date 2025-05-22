import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Setting, SettingSchema } from './settings.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Setting.name, schema: SettingSchema },
        ]),
    ],
    controllers: [SettingsController],
    providers: [SettingsService],
})
export class SettingsModule {}
