import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EmailToken, EmailTokenDocument } from './email-token.schema';
import { Model } from 'mongoose';
import {
    AddEmailTokenParams,
    DeleteEmailTokenParams,
    GetEmailTokenParams,
    UpdateEmailTokenParams,
} from './auth.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(EmailToken.name)
        private readonly emailTokenModel: Model<EmailTokenDocument>,
    ) {}

    async getEmailToken({
        email,
        usage,
    }: GetEmailTokenParams): Promise<EmailToken | null> {
        return await this.emailTokenModel.findOne({
            email,
            usage,
        });
    }

    async updateEmailToken({
        email,
        usage,
        tokenHash,
    }: UpdateEmailTokenParams) {
        return await this.emailTokenModel.findOneAndUpdate(
            { email, usage },
            { $set: { tokenHash } },
            { new: true },
        );
    }

    async addEmailToken(addEmailTokenParams: AddEmailTokenParams) {
        return await this.emailTokenModel.create(addEmailTokenParams);
    }

    async deleteEmailTokens({
        email,
        usage,
    }: DeleteEmailTokenParams): Promise<any> {
        return await this.emailTokenModel.deleteMany({
            email: email,
            usage: usage,
        });
    }
}
