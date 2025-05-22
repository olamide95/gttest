import { Type } from 'class-transformer';
import {
    IsBoolean,
    IsNotEmpty,
    IsNotEmptyObject,
    ValidateNested,
} from 'class-validator';

class NotificationObject {
    @IsNotEmpty()
    @IsBoolean()
    pushNotification: boolean;

    @IsNotEmpty()
    @IsBoolean()
    email: boolean;

    @IsNotEmpty()
    @IsBoolean()
    sms: boolean;
}

class PermissionsObject {
    @IsNotEmpty()
    @IsBoolean()
    manager: boolean;

    @IsNotEmpty()
    @IsBoolean()
    admin: boolean;

    @IsNotEmpty()
    @IsBoolean()
    staff: boolean;
}

class SchoolProgramPermissionsSettings {
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => PermissionsObject)
    add_school: PermissionsObject;

    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => PermissionsObject)
    view_school: PermissionsObject;

    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => PermissionsObject)
    edit_school: PermissionsObject;

    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => PermissionsObject)
    delete_school: PermissionsObject;

    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => PermissionsObject)
    add_program: PermissionsObject;

    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => PermissionsObject)
    view_program: PermissionsObject;

    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => PermissionsObject)
    edit_program: PermissionsObject;

    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => PermissionsObject)
    delete_program: PermissionsObject;
}

class SchoolApplicationPermissionsSettings {
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => PermissionsObject)
    add_school_application: PermissionsObject;

    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => PermissionsObject)
    view_school_application: PermissionsObject;

    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => PermissionsObject)
    edit_school_application: PermissionsObject;

    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => PermissionsObject)
    delete_school_application: PermissionsObject;

    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => PermissionsObject)
    change_school_application_status: PermissionsObject;
}

class VisaApplicationPermissionsSettings {
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => PermissionsObject)
    add_visa_application: PermissionsObject;

    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => PermissionsObject)
    view_visa_application: PermissionsObject;

    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => PermissionsObject)
    edit_visa_application: PermissionsObject;

    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => PermissionsObject)
    delete_visa_application: PermissionsObject;

    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => PermissionsObject)
    change_visa_application_status: PermissionsObject;
}

class UserManagementPermissionsSettings {
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => PermissionsObject)
    add_staff: PermissionsObject;

    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => PermissionsObject)
    remove_staff: PermissionsObject;

    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => PermissionsObject)
    add_manager_staff: PermissionsObject;

    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => PermissionsObject)
    remove_manager_staff: PermissionsObject;
}

class NotificationSettings {
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => NotificationObject)
    application: NotificationObject;

    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => NotificationObject)
    consultation: NotificationObject;

    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => NotificationObject)
    reminder: NotificationObject;
}

export class UpdateSettingsDto {
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => NotificationSettings)
    notification: NotificationSettings;

    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => SchoolProgramPermissionsSettings)
    schoolProgramPermissions: SchoolProgramPermissionsSettings;

    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => SchoolApplicationPermissionsSettings)
    schoolApplicationPermissions: SchoolApplicationPermissionsSettings;

    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => VisaApplicationPermissionsSettings)
    visaApplicationPermissions: VisaApplicationPermissionsSettings;

    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => UserManagementPermissionsSettings)
    userManagementPermissions: UserManagementPermissionsSettings;
}
