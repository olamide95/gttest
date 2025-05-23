import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Setting, SettingSchema } from './settings.schema';
import { Module, forwardRef } from '@nestjs/common';
import { AdminModule } from '../admin.module';
 
@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Setting.name, schema: SettingSchema },
        ]),
            forwardRef(() => AdminModule), // Use forwardRef here

    ],
    controllers: [SettingsController],
    providers: [SettingsService],
    exports: [SettingsService],
})
export class SettingsModule {}
