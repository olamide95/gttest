import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Setting, SettingDocument } from './settings.schema';
import { Model } from 'mongoose';
import { UpdateSettingsDto } from './settings.dto';

@Injectable()
export class SettingsService {
    constructor(
        @InjectModel(Setting.name)
        private readonly settingModel: Model<SettingDocument>,
    ) {}

    async getSettings() {
        const settings = await this.settingModel.findOne();
        if (
            !settings ||
            typeof settings.schoolProgramPermissions == undefined
        ) {
            return await this.settingModel.create({
                notification: {
                    application: {
                        pushNotification: false,
                        sms: false,
                        email: false,
                    },
                    consultation: {
                        pushNotification: false,
                        sms: false,
                        email: false,
                    },
                    reminder: {
                        pushNotification: false,
                        sms: false,
                        email: false,
                    },
                },
                schoolProgramPermissions: {
                    add_school: {
                        manager: false,
                        admin: false,
                        staff: false,
                    },
                    view_school: {
                        manager: false,
                        admin: false,
                        staff: false,
                    },
                    edit_school: {
                        manager: false,
                        admin: false,
                        staff: false,
                    },
                    delete_school: {
                        manager: false,
                        admin: false,
                        staff: false,
                    },
                    add_program: {
                        manager: false,
                        admin: false,
                        staff: false,
                    },
                    view_program: {
                        manager: false,
                        admin: false,
                        staff: false,
                    },
                    edit_program: {
                        manager: false,
                        admin: false,
                        staff: false,
                    },
                    delete_program: {
                        manager: false,
                        admin: false,
                        staff: false,
                    },
                },
                schoolApplicationPermissions: {
                    add_school_application: {
                        manager: false,
                        admin: false,
                        staff: false,
                    },
                    view_school_application: {
                        manager: false,
                        admin: false,
                        staff: false,
                    },
                    edit_school_application: {
                        manager: false,
                        admin: false,
                        staff: false,
                    },
                    delete_school_application: {
                        manager: false,
                        admin: false,
                        staff: false,
                    },
                    change_school_application_status: {
                        manager: false,
                        admin: false,
                        staff: false,
                    },
                },
                visaApplicationPermissions: {
                    add_visa_application: {
                        manager: false,
                        admin: false,
                        staff: false,
                    },
                    view_visa_application: {
                        manager: false,
                        admin: false,
                        staff: false,
                    },
                    edit_visa_application: {
                        manager: false,
                        admin: false,
                        staff: false,
                    },
                    delete_visa_application: {
                        manager: false,
                        admin: false,
                        staff: false,
                    },
                    change_visa_application_status: {
                        manager: false,
                        admin: false,
                        staff: false,
                    },
                },
                userManagementPermissions: {
                    add_staff: {
                        manager: false,
                        admin: false,
                        staff: false,
                    },
                    remove_staff: {
                        manager: false,
                        admin: false,
                        staff: false,
                    },
                    add_manager_staff: {
                        manager: false,
                        admin: false,
                        staff: false,
                    },
                    remove_manager_staff: {
                        manager: false,
                        admin: false,
                        staff: false,
                    },
                },
            });
        }
        return settings;
    }

    async updateSettings(updateSettingsDto: UpdateSettingsDto) {
        const settings = await this.settingModel.findOne();
        if (!settings) {
            return await this.settingModel.create(updateSettingsDto);
        }
        return await this.settingModel.findOneAndUpdate({}, updateSettingsDto, {
            new: true,
            lean: true,
        });
    }
}
