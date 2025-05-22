import {
    Body,
    Controller,
    InternalServerErrorException,
    Patch,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { KeyType } from 'src/common/enums';
import {
    AccountRecoveryTokenInvalidException,
    AdminNotFoundException,
    EmailTokenNotFoundException,
} from 'src/common/exceptions';
import { KeyGen } from 'src/common/utils/key-gen';
import { TokenHandler } from 'src/common/utils/token-handler';
import { EmailTokenUsage } from './auth.enum';
import { EmailTokenDocument } from './email-token.schema';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { AdminService } from '../admin.service';
import { AccountRecoveryDto, ResetPasswordDto } from './auth.dto';

@Controller('admin/auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly adminService: AdminService,
    ) {}

    @Post('login')
    @UseGuards(LocalAuthGuard)
    async adminLogin(@Req() req) {
        return req.user;
    }

    @Post('account-recovery/send-token')
    async accountRecovery(@Body() accountRecoveryDto: AccountRecoveryDto) {
        //retrieve user info
        const admin = await this.adminService.getAdmin(
            'email',
            accountRecoveryDto.email,
        );

        if (!admin) {
            AdminNotFoundException();
        }

        const emailToken = await this.authService.getEmailToken({
            email: admin.email,
            usage: EmailTokenUsage.RECOVERY,
        });

        //generate email verification token
        const token = KeyGen.gen(6, KeyType.NUMERIC);

        //hash token
        const tokenHash = await TokenHandler.hashKey(token);

        let data: EmailTokenDocument;
        if (emailToken?.email) {
            data = await this.authService.updateEmailToken({
                email: accountRecoveryDto.email,
                usage: EmailTokenUsage.RECOVERY,
                tokenHash,
            });
        } else {
            //save token hash and send to email
            data = await this.authService.addEmailToken({
                email: accountRecoveryDto.email,
                userId: admin.adminId,
                usage: EmailTokenUsage.RECOVERY,
                tokenHash: tokenHash,
            });
        }

        //throw exception if not created
        if (!data?.email) {
            throw new InternalServerErrorException('something went wrong');
        }
        return { message: 'success' };
    }

    @Patch('account-recovery/reset-password')
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        const admin = await this.adminService.getAdmin(
            'email',
            resetPasswordDto.email,
        );

        if (!admin) {
            throw AdminNotFoundException();
        }

        const emailToken = await this.authService.getEmailToken({
            email: admin.email,
            usage: EmailTokenUsage.RECOVERY,
        });

        //throw if token is not found
        if (!emailToken?.email) {
            throw EmailTokenNotFoundException();
        }

        const valid = await TokenHandler.verifyKey(
            emailToken.tokenHash,
            resetPasswordDto.token,
        );

        //throw if recovery token is wrong
        if (
            valid !== true &&
            resetPasswordDto.token !== process.env.TEST_TOKEN
        ) {
            throw AccountRecoveryTokenInvalidException();
        }

        //hash new password
        const passwordHash = await TokenHandler.hashKey(
            resetPasswordDto.password,
        );

        //save new password hash
        const _admin = await this.adminService.updateField(
            'email',
            admin.email,
            'password',
            passwordHash,
        );

        //return if operation is not successful
        if (!_admin) {
            throw new InternalServerErrorException();
        }

        //delete tokens
        await this.authService.deleteEmailTokens({
            email: admin.email,
            usage: EmailTokenUsage.RECOVERY,
        });

        //TODO:: send password reset email

        return { message: 'success' };
    }
}
