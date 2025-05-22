import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { TokenHandler } from 'src/common/utils/token-handler';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from '../admin.service';
import {
    AdminNotFoundException,
    LoginCredentialsException,
} from 'src/common/exceptions';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly adminService: AdminService,
        private readonly jwtService: JwtService,
    ) {
        super({
            usernameField: 'email',
            passReqToCallback: true,
        });
    }

    async validate(
        req: Record<string, any>,
        email: string,
        password: string,
    ): Promise<any> {
        // const [email, deviceToken] = email.split('|');

        const admin = await this.adminService.getAdmin(
            'email',
            email.toLocaleLowerCase(),
        );

        if (!admin) {
            throw AdminNotFoundException();
        }

        if (!(await TokenHandler.verifyKey(admin.password, password))) {
            throw LoginCredentialsException();
        }

        const payload = {
            email: admin.email,
            sub: admin.adminId,
        };

        const expiresIn = req?.body?.rememberMe == true ? '7d' : '1d';

        return {
            adminId: admin.adminId,
            email,
            fullName: admin.fullName,
            jwt: this.jwtService.sign(payload, { expiresIn }),
        };
    }
}
