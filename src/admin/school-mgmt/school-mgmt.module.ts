import { Module } from '@nestjs/common';
import { SchoolMgmtController } from './school-mgmt.controller';
import { SchoolMgmtService } from './school-mgmt.service';
import { MongooseModule } from '@nestjs/mongoose';
import { School, SchoolSchema } from 'src/schools/schools.schema';
import { CloudinaryService } from 'src/common/services';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: School.name, schema: SchoolSchema },
        ]),
    ],
    controllers: [SchoolMgmtController],
    providers: [SchoolMgmtService, CloudinaryService],
})
export class SchoolMgmtModule {}
