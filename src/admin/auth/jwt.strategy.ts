import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AdminService } from '../admin.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly adminService: AdminService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: {
        sub: string;
        email: string;
    }): Promise<any> {
        // We'll include the role in the payload after validating credentials
        return {
            adminId: payload.sub,
            email: payload.email,
        };
    }
}