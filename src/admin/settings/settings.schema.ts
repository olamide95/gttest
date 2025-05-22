import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
class NotificationObject {
    @Prop({ default: false })
    pushNotification: boolean;

    @Prop({ default: false })
    email: boolean;

    @Prop({ default: false })
    sms: boolean;
}
const NotificationObjectSchema =
    SchemaFactory.createForClass(NotificationObject);

@Schema()
class PermissionObject {
    @Prop({ default: false })
    manager: boolean;

    @Prop({ default: false })
    admin: boolean;

    @Prop({ default: false })
    staff: boolean;
}
const PermissionsObjectSchema = SchemaFactory.createForClass(PermissionObject);

@Schema()
export class NotificationSettings {
    @Prop({ type: NotificationObjectSchema })
    application: NotificationObject;

    @Prop({ type: NotificationObjectSchema })
    consultation: NotificationObject;

    @Prop({ type: NotificationObjectSchema })
    reminder: NotificationObject;
}
const NotificationSettingSchema =
    SchemaFactory.createForClass(NotificationSettings);

@Schema({ timestamps: true })
export class SchoolProgramPermissions {
    @Prop({ type: PermissionsObjectSchema })
    add_school: PermissionObject;

    @Prop({ type: PermissionsObjectSchema })
    view_school: PermissionObject;

    @Prop({ type: PermissionsObjectSchema })
    edit_school: PermissionObject;

    @Prop({ type: PermissionsObjectSchema })
    delete_school: PermissionObject;

    @Prop({ type: PermissionsObjectSchema })
    add_program: PermissionObject;

    @Prop({ type: PermissionsObjectSchema })
    view_program: PermissionObject;

    @Prop({ type: PermissionsObjectSchema })
    edit_program: PermissionObject;

    @Prop({ type: PermissionsObjectSchema })
    delete_program: PermissionObject;
}
const SchoolProgramPermissionsSchema = SchemaFactory.createForClass(
    SchoolProgramPermissions,
);

@Schema({ timestamps: true })
export class SchoolApplicationPermissions {
    @Prop({ type: PermissionsObjectSchema })
    add_school_application: PermissionObject;

    @Prop({ type: PermissionsObjectSchema })
    view_school_application: PermissionObject;

    @Prop({ type: PermissionsObjectSchema })
    edit_school_application: PermissionObject;

    @Prop({ type: PermissionsObjectSchema })
    delete_school_application: PermissionObject;

    @Prop({ type: PermissionsObjectSchema })
    change_school_application_status: PermissionObject;
}
const SchoolApplicationPermissionsSchema = SchemaFactory.createForClass(
    SchoolApplicationPermissions,
);

@Schema({ timestamps: true })
export class VisaApplicationPermissions {
    @Prop({ type: PermissionsObjectSchema })
    add_visa_application: PermissionObject;

    @Prop({ type: PermissionsObjectSchema })
    view_visa_application: PermissionObject;

    @Prop({ type: PermissionsObjectSchema })
    edit_visa_application: PermissionObject;

    @Prop({ type: PermissionsObjectSchema })
    delete_visa_application: PermissionObject;

    @Prop({ type: PermissionsObjectSchema })
    change_visa_application_status: PermissionObject;
}
const VisaApplicationPermissionsSchema = SchemaFactory.createForClass(
    VisaApplicationPermissions,
);

@Schema({ timestamps: true })
export class UserManagementPermissions {
    @Prop({ type: PermissionsObjectSchema })
    add_staff: PermissionObject;

    @Prop({ type: PermissionsObjectSchema })
    remove_staff: PermissionObject;

    @Prop({ type: PermissionsObjectSchema })
    add_manager_staff: PermissionObject;

    @Prop({ type: PermissionsObjectSchema })
    remove_manager_staff: PermissionObject;
}
const UserManagementPermissionsSchema = SchemaFactory.createForClass(
    UserManagementPermissions,
);

@Schema({ timestamps: true })
export class Setting {
    @Prop({ type: NotificationSettingSchema })
    notification: NotificationSettings;

    @Prop({ type: SchoolProgramPermissionsSchema })
    schoolProgramPermissions: SchoolProgramPermissions;

    @Prop({ type: SchoolApplicationPermissionsSchema })
    schoolApplicationPermissions: SchoolApplicationPermissions;

    @Prop({ type: VisaApplicationPermissionsSchema })
    visaApplicationPermissions: VisaApplicationPermissions;

    @Prop({ type: UserManagementPermissionsSchema })
    userManagementPermissions: UserManagementPermissions;
}
export type SettingDocument = Setting & Document;
export const SettingSchema = SchemaFactory.createForClass(Setting);
