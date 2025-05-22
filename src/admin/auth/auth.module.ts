import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailToken, EmailTokenSchema } from './email-token.schema';
import { AdminModule } from '../admin.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: EmailToken.name, schema: EmailTokenSchema },
        ]),
        forwardRef(() => AdminModule),
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
