import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApplicationsModule } from './applications/applications.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminModule } from './admin/admin.module';
import { FlightBookingsModule } from './flight-bookings/flight-bookings.module';
import { SupportsModule } from './supports/supports.module';
import { SchoolsModule } from './schools/schools.module';
import { AccommodationModule } from './accommodation/accommodation.module';
import { SchoolFeesModule } from './admin/school-fees/school-fees.module';

@Module({
    imports: [
        MongooseModule.forRoot(process.env.MONGO_URI),
        ApplicationsModule,
        AdminModule,
        FlightBookingsModule,
        SupportsModule,
        SchoolsModule,
        AccommodationModule,
        SchoolFeesModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
