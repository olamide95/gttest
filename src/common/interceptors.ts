import {
    BadRequestException,
    CallHandler,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import {
    FileFieldsInterceptor,
    FileInterceptor,
    FilesInterceptor,
} from '@nestjs/platform-express';
import { map } from 'rxjs/operators';
import { MIME_TYPES } from './constants';

const localOptions = {
    limits: {
        fileSize: 1024 * 1024 * 20, //20MB
    },
    fileFilter: (req, file, callback) => {
        if (file.size < 1) {
            return callback(new BadRequestException('empty file'), false);
        }
        if (!MIME_TYPES.includes(file.mimetype)) {
            return callback(new ForbiddenException('invalid file type'), false);
        }
        callback(null, true);
    },
};

export const fileInterceptor = FileInterceptor('file', localOptions);

export const filesInterceptor = FilesInterceptor('files', 5, localOptions);

export const SchoolImagesInterceptor = FilesInterceptor(
    'image',
    1,
    localOptions,
);

export interface Response<T> {
    status: boolean;
    statusCode: number;
    data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, next: CallHandler) {
        return next.handle().pipe(
            map((data) => ({
                status:
                    context.switchToHttp().getResponse().statusCode == 200 ||
                    context.switchToHttp().getResponse().statusCode == 201
                        ? true
                        : false,
                statusCode: context.switchToHttp().getResponse().statusCode,
                data: data || null,
            })),
        );
    }
}

export const schoolApplicationFilesInterceptor = FileFieldsInterceptor(
    [
        { name: 'passportPhoto', maxCount: 1 },
        { name: 'waecResult', maxCount: 1 },
        { name: 'waecScratchCard', maxCount: 1 },
        { name: 'unofficialTranscript', maxCount: 1 },
        { name: 'aLevelResult', maxCount: 1 },
        { name: 'resume', maxCount: 1 },
        { name: 'others', maxCount: 10 },
    ],
    localOptions,
);
