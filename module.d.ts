declare namespace NodeJS {
    export interface ProcessEnv {
        MONGO_URI: string;
        MAIL_HOST: string;
        MAIL_PORT: number;
        MAIL_USER: string;
        MAIL_PASSWORD: string;
        MAIL_FROM: string;
        PORT: number;
        JWT_SECRET: string;
        JWT_REFRESH: string;
        JWT_EXPIRES_IN: string;
        CLOUDINARY_CLOUD_NAME: string;
        CLOUDINARY_KEY: string;
        CLOUDINARY_SECRET: string;
    }
}
