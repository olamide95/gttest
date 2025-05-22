import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { School, SchoolDocument } from './schools.schema';
import { Model } from 'mongoose';
import { PAGINATION_COUNT } from 'src/common/constants';
import { PaginationParams } from 'src/common/dtos';
import { Paginator } from 'src/common/utils/paginator';
import { SearchSchoolDto } from './schools.dto';
import {
    ProgramInterface,
    SchoolInfoInterface,
    SchoolInterface,
} from 'src/common/types';
import { schools } from './schools';

const arrangeData = (schools: any) => {
    let schoolPrograms: any[] = [];

    schools?.forEach(
        (school: {
            programs: any[];
            state: any;
            country: any;
            name: any;
            image: any;
            schoolId: any;
        }) => {
            school?.programs.forEach((program: any, index: number) => {
                schoolPrograms.push({
                    state: school.state,
                    country: school.country,
                    schoolName: school.name,
                    image: school.image,
                    schoolId: school.schoolId,
                    href: `${school.schoolId}-${index}`,
                    ...program,
                });
            });
        },
    );
    return schoolPrograms;
};

@Injectable()
export class SchoolsService {
    private readonly logger = new Logger(SchoolsService.name);
    constructor(
        @InjectModel(School.name)
        private readonly schoolModel: Model<SchoolDocument>,
    ) {}

    async getSchools(
        paginationParams: PaginationParams,
        query?: {
            school?: string;
            program?: string;
            schoolId?: string;
            isProgramListing?: string;
        },
    ) {
        console.log('query?.schoolId', query?.schoolId);
        const { page = 1, limit = 10, cursor, direction } = paginationParams;
        const skip = (page - 1) * limit;

        let filterQuery: any = {};

        if (query?.school) {
            filterQuery.schoolId = { $regex: query.school, $options: 'i' };
        }

        if (query?.schoolId) {
            filterQuery.schoolId = query.schoolId;
        }

        if (cursor) {
            filterQuery.createdAt =
                direction === 'forward' ? { $gt: cursor } : { $lt: cursor };
        }

        try {
            if (query?.schoolId) {
                const school = await this.schoolModel
                    .findOne(filterQuery)
                    .lean();
                if (!school) {
                    throw new Error('School not found');
                }

                return { school };
            }

            if (query?.isProgramListing) {
                const [programs, countResult] = await Promise.all([
                    this.schoolModel
                        .aggregate([
                            {
                                $unwind: {
                                    path: '$programs',
                                    includeArrayIndex: 'programIndex',
                                },
                            },
                            { $match: filterQuery },
                            // { $addFields: { schoolName: '$name' } },
                            // { $sort: { schoolName: 1, _id: 1 } },
                            { $sort: { name: 1 } },
                            { $skip: skip },
                            { $limit: limit },
                            {
                                $project: {
                                    _id: '$programs._id',
                                    name: '$programs.name',
                                    programType: '$programs.programType',
                                    duration: '$programs.duration',
                                    degreeType: '$programs.degreeType',
                                    classType: '$programs.classType',
                                    startDate: '$programs.startDate',
                                    about: '$programs.about',
                                    requiredDocuments:
                                        '$programs.requiredDocuments',
                                    tuitionFee: '$programs.tuitionFee',
                                    otherFee: '$programs.otherFee',
                                    currency: '$programs.currency',
                                    onCampus: '$programs.onCampus',
                                    offCampus: '$programs.offCampus',
                                    needBasedScholarship:
                                        '$programs.needBasedScholarship',
                                    meritBasedScholarship:
                                        '$programs.meritBasedScholarship',

                                    // School details
                                    state: '$state',
                                    country: '$country',
                                    schoolName: '$name',
                                    image: '$image',
                                    schoolId: '$schoolId',
                                    href: {
                                        $concat: [
                                            '$schoolId',
                                            '-',
                                            { $toString: '$programIndex' },
                                        ],
                                    },
                                },
                            },
                        ])
                        .allowDiskUse(true)
                        .exec(),

                    this.schoolModel
                        .aggregate([
                            { $unwind: '$programs' },
                            { $match: filterQuery },
                            { $count: 'total' },
                        ])
                        .allowDiskUse(true)
                        .exec(),
                ]);

                const total = countResult.length ? countResult[0].total : 0;
                const totalPages = Math.ceil(total / limit);
                const nextCursor =
                    programs.length > 0
                        ? programs[programs.length - 1].createdAt
                        : null;

                return {
                    programs,
                    meta: {
                        total,
                        page,
                        limit,
                        totalPages,
                        nextCursor,
                    },
                };
            } else {
                const [schools, countResult] = await Promise.all([
                    this.schoolModel
                        .aggregate([
                            { $match: filterQuery },
                            { $sort: { name: 1 } },
                            { $skip: skip },
                            { $limit: limit },
                        ])
                        .allowDiskUse(true),
                    this.schoolModel
                        .aggregate([
                            { $match: filterQuery },
                            { $group: { _id: null, count: { $sum: 1 } } },
                        ])
                        .allowDiskUse(true),
                ]);

                const total = countResult.length ? countResult[0].count : 0;
                const totalPages = Math.ceil(total / limit);
                const nextCursor =
                    schools.length > 0
                        ? schools[schools.length - 1].createdAt
                        : null;

                return {
                    [query?.isProgramListing ? 'programs' : 'schools']:
                        query?.isProgramListing
                            ? arrangeData(schools)
                            : schools,
                    meta: {
                        total,
                        page,
                        limit,
                        totalPages,
                        nextCursor,
                    },
                };
            }
        } catch (error) {
            this.logger.error(`Error fetching schools: ${error.message}`);
            throw error;
        }
    }

    // async searchSchool(
    //     paginationParams: PaginationParams,
    //     {
    //         name,
    //         location,
    //         duration,
    //         startDate,
    //         degreeType,
    //         tuitionFee,
    //         programName,
    //         programType,
    //         scholarshipType,
    //         accomodationType,
    //         isProgramListing,
    //     }: SearchSchoolDto,
    // ) {
    //     const { page = 1, limit = 10, cursor, direction } = paginationParams;
    //     const skip = (page - 1) * limit;

    //     const filter: any = {};

    //     if (name) filter['name'] = { $regex: name, $options: 'i' };

    //     if (location) filter['country'] = { $regex: location, $options: 'i' };

    //     if (programName)
    //         filter['programs.name'] = { $regex: new RegExp(programName, 'i') };
    //     if (programType)
    //         filter['programs.programType'] = {
    //             $regex: programType,
    //             $options: 'i',
    //         };
    //     if (degreeType)
    //         filter['programs.degreeType'] = {
    //             $regex: degreeType,
    //             $options: 'i',
    //         };
    //     if (startDate)
    //         filter['programs.startDate'] = { $regex: startDate, $options: 'i' };
    //     if (duration)
    //         filter['programs.duration'] = { $regex: duration, $options: 'i' };

    //     if (accomodationType) {
    //         if (accomodationType === 'On Campus')
    //             filter['programs.onCampus'] = true;
    //         if (accomodationType === 'Off Campus')
    //             filter['programs.offCampus'] = true;
    //     }
    //     if (scholarshipType) {
    //         if (scholarshipType === 'Need Based Scholarship')
    //             filter['programs.needBasedScholarship'] = true;
    //         if (scholarshipType === 'Merit Based Scholarship')
    //             filter['programs.meritBasedScholarship'] = true;
    //     }

    //     if (tuitionFee) {
    //         filter['programs.tuitionFee'] = {
    //             $gt: tuitionFee?.toString()?.split('-')[0],
    //             $lt: tuitionFee?.toString()?.split('-')[1],
    //         };
    //     }
    //     if (cursor) {
    //         const dateFilter =
    //             direction === 'forward' ? { $gt: cursor } : { $lt: cursor };
    //         filter['createdAt'] = dateFilter;
    //     }

    //     console.log({ filter, isProgramListing });

    //     const [schools, total] = await Promise.all([
    //         this.schoolModel
    //             .find(filter)
    //             .skip(skip)
    //             .limit(limit)
    //             .sort({ name: direction === 'forward' ? 1 : -1 })
    //             .lean(),
    //         this.schoolModel.countDocuments(filter),
    //     ]);

    //     const totalPages = Math.ceil(total / limit);
    //     const nextCursor =
    //         schools.length > 0 ? schools[schools.length - 1].createdAt : null;

    //     const filteredSchools = schools
    //         .map((school) => {
    //             const filteredPrograms = school.programs.filter((program) => {
    //                 const programNameMatch =
    //                     program.name &&
    //                     new RegExp(programName, 'i').test(program.name);
    //                 const degreeTypeMatch = degreeType
    //                     ? program.degreeType === degreeType
    //                     : true;
    //                 const programTypeMatch = programType
    //                     ? program.programType &&
    //                       new RegExp(programType, 'i').test(program.programType)
    //                     : true;
    //                 const durationMatch = duration
    //                     ? program.duration &&
    //                       new RegExp(duration, 'i').test(program.duration)
    //                     : true;
    //                 const startDateMatch = startDate
    //                     ? program.startDate &&
    //                       new RegExp(startDate, 'i').test(
    //                           String(program.startDate),
    //                       )
    //                     : true;
    //                 const tuitionFeeMatch = tuitionFee
    //                     ? program.tuitionFee >=
    //                           Number(tuitionFee?.toString()?.split('-')[0]) &&
    //                       program.tuitionFee <=
    //                           Number(tuitionFee?.toString()?.split('-')[1])
    //                     : true;
    //                 const accomodationMatch = accomodationType
    //                     ? accomodationType === 'On Campus'
    //                         ? program.onCampus === true
    //                         : accomodationType === 'Off Campus' &&
    //                           program.offCampus === true
    //                     : true;
    //                 const scholarshipMatch = scholarshipType
    //                     ? scholarshipType === 'Need Based Scholarship'
    //                         ? program.needBasedScholarship === true
    //                         : scholarshipType === 'Merit Based Scholarship' &&
    //                           program.meritBasedScholarship === true
    //                     : true;
    //                 return (
    //                     programNameMatch &&
    //                     degreeTypeMatch &&
    //                     programTypeMatch &&
    //                     durationMatch &&
    //                     startDateMatch &&
    //                     tuitionFeeMatch &&
    //                     accomodationMatch &&
    //                     scholarshipMatch
    //                 );
    //             });

    //             return { ...school, programs: filteredPrograms };
    //         })
    //         .filter((school) => school.programs.length > 0);

    //     const allPrograms = filteredSchools
    //         .map((school) =>
    //             school.programs.map((program, index) => ({
    //                 ...program,
    //                 state: school.state,
    //                 country: school.country,
    //                 schoolName: school.name,
    //                 image: school.image,
    //                 schoolId: school.schoolId,
    //                 href: `${school.schoolId}-${index}`,
    //             })),
    //         )
    //         .flat();

    //     const totalPrograms = allPrograms.length;
    //     const totalProgramsPages = Math.ceil(totalPrograms / limit);

    //     const paginatedPrograms = allPrograms.slice(skip, skip + limit);

    //     return {
    //         [isProgramListing ? 'programs' : 'schools']: isProgramListing
    //             ? paginatedPrograms
    //             : filteredSchools,
    //         meta: {
    //             total: isProgramListing ? totalPrograms : total,
    //             page,
    //             limit,
    //             totalPages: isProgramListing ? totalProgramsPages : totalPages,
    //             nextCursor: isProgramListing
    //                 ? paginatedPrograms.length > 0
    //                     ? paginatedPrograms[paginatedPrograms.length - 1]._id
    //                     : null
    //                 : nextCursor,
    //         },
    //     };
    // }

    async searchSchool(
        paginationParams: PaginationParams,
        {
            name,
            location,
            duration,
            startDate,
            degreeType,
            tuitionFee,
            programName,
            programType,
            scholarshipType,
            accomodationType,
            isProgramListing,
        }: SearchSchoolDto,
    ) {
        const { page = 1, limit = 10, cursor, direction } = paginationParams;
        const skip = (page - 1) * limit;

        const filter: any = {};

        if (name) filter['name'] = { $regex: name, $options: 'i' };
        if (location) filter['country'] = { $regex: location, $options: 'i' };

        if (isProgramListing) {
            if (programName)
                filter['programs.name'] = {
                    $regex: new RegExp(programName, 'i'),
                };
            if (programType)
                filter['programs.programType'] = {
                    $regex: programType,
                    $options: 'i',
                };
            if (degreeType)
                filter['programs.degreeType'] = {
                    $regex: degreeType,
                    $options: 'i',
                };
            if (startDate)
                filter['programs.startDate'] = {
                    $regex: startDate,
                    $options: 'i',
                };
            if (duration)
                filter['programs.duration'] = {
                    $regex: duration,
                    $options: 'i',
                };
        }

        if (accomodationType) {
            if (accomodationType === 'On Campus')
                filter['programs.onCampus'] = true;
            if (accomodationType === 'Off Campus')
                filter['programs.offCampus'] = true;
        }
        if (scholarshipType) {
            if (scholarshipType === 'Need Based Scholarship')
                filter['programs.needBasedScholarship'] = true;
            if (scholarshipType === 'Merit Based Scholarship')
                filter['programs.meritBasedScholarship'] = true;
        }

        if (tuitionFee) {
            filter['programs.tuitionFee'] = {
                $gt: tuitionFee?.toString()?.split('-')[0],
                $lt: tuitionFee?.toString()?.split('-')[1],
            };
        }
        if (cursor) {
            const dateFilter =
                direction === 'forward' ? { $gt: cursor } : { $lt: cursor };
            filter['createdAt'] = dateFilter;
        }

        console.log({ filter, isProgramListing });

        const [schools, totalSchools] = await Promise.all([
            this.schoolModel
                .find(filter)
                .skip(isProgramListing ? 0 : skip)
                .limit(isProgramListing ? 0 : limit)
                .sort({ name: direction === 'forward' ? 1 : -1 })
                .lean(),
            this.schoolModel.countDocuments(filter),
        ]);

        const totalPages = Math.ceil(totalSchools / limit);
        const nextCursor =
            schools.length > 0 ? schools[schools.length - 1].createdAt : null;

        if (!isProgramListing) {
            return {
                schools,
                meta: {
                    total: totalSchools,
                    page,
                    limit,
                    totalPages,
                    nextCursor,
                },
            };
        }

        const allPrograms = schools
            .flatMap((school) =>
                school.programs.map((program, index) => ({
                    ...program,
                    state: school.state,
                    country: school.country,
                    schoolName: school.name,
                    image: school.image,
                    schoolId: school.schoolId,
                    href: `${school.schoolId}-${index}`,
                })),
            )
            .filter((program) => {
                const programNameMatch =
                    program.name &&
                    new RegExp(programName, 'i').test(program.name);
                const degreeTypeMatch = degreeType
                    ? program.degreeType === degreeType
                    : true;
                const programTypeMatch = programType
                    ? program.programType &&
                      new RegExp(programType, 'i').test(program.programType)
                    : true;
                const durationMatch = duration
                    ? program.duration &&
                      new RegExp(duration, 'i').test(program.duration)
                    : true;
                const startDateMatch = startDate
                    ? program.startDate &&
                      new RegExp(startDate, 'i').test(String(program.startDate))
                    : true;
                const tuitionFeeMatch = tuitionFee
                    ? program.tuitionFee >=
                          Number(tuitionFee?.toString()?.split('-')[0]) &&
                      program.tuitionFee <=
                          Number(tuitionFee?.toString()?.split('-')[1])
                    : true;
                const accomodationMatch = accomodationType
                    ? accomodationType === 'On Campus'
                        ? program.onCampus === true
                        : accomodationType === 'Off Campus' &&
                          program.offCampus === true
                    : true;

                const scholarshipMatch = scholarshipType
                    ? scholarshipType === 'Need Based Scholarship'
                        ? program.needBasedScholarship === true
                        : scholarshipType === 'Merit Based Scholarship' &&
                          program.meritBasedScholarship === true
                    : true;
                return (
                    programNameMatch &&
                    degreeTypeMatch &&
                    programTypeMatch &&
                    durationMatch &&
                    startDateMatch &&
                    tuitionFeeMatch &&
                    accomodationMatch &&
                    scholarshipMatch
                );
            });

        const totalPrograms = allPrograms.length;
        const totalProgramsPages = Math.ceil(totalPrograms / limit);

        const paginatedPrograms = allPrograms.slice(skip, skip + limit);

        return {
            programs: paginatedPrograms,
            meta: {
                total: totalPrograms,
                page,
                limit,
                totalPages: totalProgramsPages,
                nextCursor:
                    paginatedPrograms.length > 0
                        ? paginatedPrograms[paginatedPrograms.length - 1]._id
                        : null,
            },
        };
    }

    async getPrograms(schoolId?: string) {
        const filter = {};

        schoolId ? (filter['schoolId'] = schoolId) : '';
        return await this.schoolModel
            .find(filter, null, {
                lean: true,
                sort: { createdAt: -1 },
                limit: 50,
            })
            .allowDiskUse(true);
    }

    async createNewSchoolsRecord() {
        schools.forEach(async (school) => {
            const result = await this.schoolModel.findOne({
                name: school.name,
            });

            if (!result) await this.schoolModel.create(school);
        });
    }
}
