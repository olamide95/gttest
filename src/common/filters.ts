import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';

function statusMessage(statusCode: number) {
    switch (statusCode) {
        case 400:
            return 'Bad Request';

        case 401:
            return 'Unauthorized';

        case 402:
            return 'Payment Required';

        case 403:
            return 'Forbidden';

        case 404:
            return 'Not Found';

        case 405:
            return 'Method Not Allowed';

        case 406:
            return 'Not Acceptable';

        case 408:
            return 'Request Timeout';

        case 409:
            return 'Conflict';

        default:
            return 'Internal Server Error';
    }
}

@Catch()
export class GenericExceptionFilter extends BaseExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const response = context.getResponse<Response>();
        let status;

        const message =
            exception?.status >= 500 || typeof exception?.status != 'number'
                ? 'something went wrong'
                : exception?.response?.message || exception?.message;
        if (
            isNaN(exception?.status) ||
            !Number.isInteger(exception?.status) ||
            exception?.status < 100 ||
            exception?.status > 599
        ) {
            status = 500;
            console.error(exception);
        } else {
            status = exception?.status;
        }

        response.status(status).json({
            status: false,
            statusCode: status,
            message,
            error:
                exception?.response?.error || statusMessage(exception?.status),
        });

        return null;
    }
}
