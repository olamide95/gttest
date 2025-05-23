import { Module, forwardRef } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { ApplicationMgmtModule } from './application-mgmt/application-mgmt.module';
import { SchoolMgmtModule } from './school-mgmt/school-mgmt.module';
import { RoomsModule } from './rooms/rooms.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from './admin.schema';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './auth/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/jwt.strategy';
import { AuthModule } from './auth/auth.module';
import { SettingsModule } from './settings/settings.module';
import { TeamMember, TeamMemberSchema } from './teammember.schema';
import { Rooms, RoomsSchema } from './rooms/rooms.schema';

@Module({
    imports: [
        ApplicationMgmtModule,
        SchoolMgmtModule,
        RoomsModule, // Ensure RoomsModule is imported
        PassportModule,
        SettingsModule,
        MongooseModule.forFeature([
            { name: Admin.name, schema: AdminSchema },
            { name: TeamMember.name, schema: TeamMemberSchema },
            { name: Rooms.name, schema: RoomsSchema },
        ]),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '1d' },
        }),
        forwardRef(() => AuthModule),
        
    ],
    controllers: [AdminController],
    providers: [AdminService, LocalStrategy, JwtStrategy],
    exports: [AdminService],
})
export class AdminModule {}
