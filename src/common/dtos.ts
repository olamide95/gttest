import { Type } from 'class-transformer';
import {
    IsOptional,
    IsDate,
    IsString,
    IsIn,
    IsNumber,
    Min,
    Max,
} from 'class-validator';
import { PAGINATION_COUNT } from './constants';

export class File {
    content: string;
    size: number;
    mimeType: string;
    url: string;
}

export class PaginationParams {
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    readonly cursor?: Date | undefined = undefined;

    @IsOptional()
    @IsString()
    @IsIn(['forward', 'backward'])
    readonly direction?: 'forward' | 'backward' = 'forward';

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @Max(Infinity) // To enable schools search on the landing page
    limit?: number = PAGINATION_COUNT;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page?: number = 1;
}
