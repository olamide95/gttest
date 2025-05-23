import { SchoolMgmtController } from './school-mgmt.controller';
import { SchoolMgmtService } from './school-mgmt.service';
import { MongooseModule } from '@nestjs/mongoose';
import { School, SchoolSchema } from 'src/schools/schools.schema';
import { CloudinaryService } from 'src/common/services';
import { Module, forwardRef } from '@nestjs/common';


import { AdminModule } from '../admin.module'; // Add this import

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: School.name, schema: SchoolSchema },
    ]),
    forwardRef(() => AdminModule), // Use forwardRef here
  ], 
  controllers: [SchoolMgmtController],
  providers: [SchoolMgmtService, CloudinaryService],
  exports: [SchoolMgmtService], // Export if needed by other modules

})
export class SchoolMgmtModule {}