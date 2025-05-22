import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PAGINATION_COUNT } from 'src/common/constants';
import { PaginationParams } from 'src/common/dtos';
import { ProgramInterface } from 'src/common/types';
import { Paginator } from 'src/common/utils/paginator';
import {
    AddSchoolDto,
    SearchSchoolDto,
    UpdateSchoolDto,
} from 'src/schools/schools.dto';
import { School, SchoolDocument } from 'src/schools/schools.schema';
import { SchoolsService } from 'src/schools/schools.service';

@Injectable()
export class SchoolMgmtService {
    constructor(
        @InjectModel(School.name)
        private readonly schoolModel: Model<SchoolDocument>,
    ) {}

    async addSchool(addSchoolDto: AddSchoolDto) {
        return await this.schoolModel.create({
            ...addSchoolDto,
            image: addSchoolDto.image,
        });
    }

    async deleteSchool(schoolId: string) {
        return await this.schoolModel.findOneAndDelete({ schoolId });
    }

    async deleteProgram(schoolId: string, programId: string) {
        return await this.schoolModel.findOneAndUpdate(
            { schoolId },
            { $pull: { programs: { _id: programId } } },
            { new: true, lean: true },
        );
    }

    async getSchools(
        paginationParams: PaginationParams,
        query?: {
            school?: string;
            program?: string;
            schoolId?: string;
            isProgramListing?: string;
        },
    ) {
        // return await this.schoolModel.find().lean();

        const schoolsService = new SchoolsService(this.schoolModel);
        return await schoolsService.getSchools(paginationParams, query);
    }

    async getSchoolStats(paginationParams: PaginationParams) {
        return Paginator.getPaginationStats(
            this.schoolModel,
            {},
            paginationParams,
        );
    }

    async updateSchool(schoolId: string, updateSchoolDto: UpdateSchoolDto) {
        const school = await this.schoolModel.findOne({
            schoolId,
        });
        console.log('updateSchoolDto', updateSchoolDto?.program);
        if (!school) {
            throw new Error('School not found');
        }

        if (updateSchoolDto.program) {
            const existingProgram = school.programs.find(
                (p) => p._id.toString() === updateSchoolDto.program._id,
            );

            if (existingProgram) {
                return await this.schoolModel.updateOne(
                    { schoolId, 'programs._id': updateSchoolDto.program._id },
                    {
                        $set: {
                            name: updateSchoolDto.name,
                            about: updateSchoolDto.about,
                            country: updateSchoolDto.country,
                            image: updateSchoolDto.image,
                            schoolType: updateSchoolDto.schoolType,
                            state: updateSchoolDto.state,
                            url: updateSchoolDto.url,

                            'programs.$': updateSchoolDto.program,
                        },
                    },
                    {
                        new: true,
                        lean: true,
                        arrayFilters: [
                            { 'program._id': updateSchoolDto.program._id },
                        ],
                    },
                );
            } else {
                return await this.schoolModel.findOneAndUpdate(
                    { schoolId },
                    {
                        $set: {
                            name: updateSchoolDto.name,
                            about: updateSchoolDto.about,
                            country: updateSchoolDto.country,
                            image: updateSchoolDto.image,
                            schoolType: updateSchoolDto.schoolType,
                            state: updateSchoolDto.state,
                            url: updateSchoolDto.url,
                        },
                        $push: { programs: updateSchoolDto.program },
                    },
                    { new: true, lean: true },
                );
            }
        } else {
            return await this.schoolModel.findOneAndUpdate(
                { schoolId },
                {
                    $set: {
                        name: updateSchoolDto.name,
                        about: updateSchoolDto.about,
                        country: updateSchoolDto.country,
                        image: updateSchoolDto.image,
                        schoolType: updateSchoolDto.schoolType,
                        state: updateSchoolDto.state,
                        url: updateSchoolDto.url,
                    },
                },
                { new: true, lean: true },
            );
        }
    }

    async searchSchool(
        { location, program, name }: SearchSchoolDto,
        paginationParams: PaginationParams,
    ) {
        const { direction, cursor } = paginationParams;

        const pipeline = [];

        if (name)
            pipeline.push({
                $match: { name: { $regex: new RegExp(name, 'i') } },
            });

        if (location) pipeline.push({ $match: { country: location } });

        program
            ? pipeline.push({ $match: { 'program.programType': program } })
            : '';
        // from
        //     ? pipeline.push({
        //         $match: {
        //             'program.startDate': {
        //                 $gte: new Date(new Date(from).setHours(0, 0, 0)),
        //             },
        //         },
        //     })
        // : '';
        if (pipeline.length == 0) {
            return [];
        }
        // name ? pipeline.push({ $sort: { score: { $meta: 'textScore' } } }) : '';
        pipeline.push({ $limit: PAGINATION_COUNT + 1 });
        const filter = {};
        name ? (filter['$text'] = { $search: name }) : '';
        location ? (filter['country'] = location) : '';
        program ? (filter['program.programType'] = program) : '';
        // from
        //     ? (filter['program.startDate'] = {
        //         $gte: new Date(new Date(from).setHours(0, 0, 0)),
        //     })
        //     : '';
        const indexes = await this.schoolModel.collection.indexes();
        let data;
        for (const index of indexes) {
            if (index.key && index.key['name'] === 'text') {
                data = await this.schoolModel.aggregate([...pipeline]);
                break;
            } else {
                await this.schoolModel.createIndexes({ name: 'text' });
                data = await this.schoolModel.aggregate([...pipeline]);
                break;
            }
        }

        return data;
    }

    async updateProgram(
        schoolId: string,
        programId: string,
        program?: UpdateSchoolDto['program'],
    ) {
        const school = await this.schoolModel
            .findOne({ schoolId })
            .populate('programs')
            .exec();

        const schoolPrograms = school.programs.filter(
            (program: any) => program._id === programId,
        );

        schoolPrograms.push(program);

        return await this.schoolModel.findOneAndUpdate(
            { schoolId },
            { $set: school },
            { new: true, lean: true },
        );
    }
}
