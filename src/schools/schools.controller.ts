import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { SchoolsService } from './schools.service';
import { PaginationParams } from 'src/common/dtos';
import { SearchSchoolDto } from './schools.dto';
import { Response } from 'express';

@Controller('schools')
export class SchoolsController {
    constructor(private readonly schoolsService: SchoolsService) {}

    @Get()
    async getSchools(
        @Query() paginationParams: PaginationParams,
        @Query('school') school?: string,
        @Query('program') program?: string,
        @Query('isProgramListing') isProgramListing?: string,
    ) {
        const query =
            school || program || isProgramListing
                ? { school, program, isProgramListing }
                : undefined;
        return await this.schoolsService.getSchools(paginationParams, query);
    }

    @Get('search')
    async searchSchoolApplication(
        @Query() paginationParams: PaginationParams,
        @Query() searchParams: SearchSchoolDto,
        @Query('cursor') cursor?: string,
        @Query('location') location?: string,
        @Query('program') program?: string,
        @Query('name') name?: string,
    ) {
        const time = cursor ? { cursor: new Date(cursor) } : {};
        // I will need to extend this functionality to get the schools in the location, then the programs
        return await this.schoolsService.searchSchool(
            { ...paginationParams, ...time },
            {
                location,
                program,
                name,
                ...searchParams,
            },
        );
    }

    @Get('programs')
    async getPrograms(@Query() query?: { schoolId: string }) {
        const result = await this.schoolsService.getPrograms(query?.schoolId);

        return result.map(({ schoolId, programs }) => {
            return {
                schoolId,
                programs: programs.map((program) => {
                    if (program !== null) return program.name;
                }),
            };
        });
    }

    @Get('seed')
    async insertSchoolsData(@Res() res: Response) {
        try {
            await this.schoolsService.createNewSchoolsRecord();

            return res.status(HttpStatus.CREATED).json({
                success: true,
                message: 'School data inserted successfully',
            });
        } catch (e: any) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: e.message,
            });
        }
    }
}
