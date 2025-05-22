import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Admin } from '../admin.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: {
        sub: string;
        email: string;
        phone: string;
        phoneVerified: boolean;
        emailVerified: boolean;
    }): Promise<Partial<Admin>> {
        return {
            adminId: payload.sub,
            email: payload.email,
        };
    }
}
