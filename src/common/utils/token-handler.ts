import * as argon2 from 'argon2';

export class TokenHandler {
    static async hashKey(key: string): Promise<string> {
        try {
            return await argon2.hash(key);
        } catch (error) {
            /* istanbul ignore next */
            console.error(error);
            throw new Error('Password hashing failed');
        }
    }

    static async verifyKey(hash: string, plain: string): Promise<boolean> {
        try {
            return await argon2.verify(hash, plain);
        } catch (error) {
            /* istanbul ignore next */
            console.log(error);
            throw new Error('Password verification failed');
        }
    }
}
