import { Model } from 'mongoose';
import { PAGINATION_COUNT } from '../constants';
import { PaginationParams } from '../dtos';
import { NumberRounder } from './number-rounder';

export class Paginator {
    static async paginate(
        data: any[],
        model: Model<any>,
        paginationParams: PaginationParams,
        filter?: Record<string, any>,
    ) {
        const { direction, cursor } = paginationParams;
        let sort = direction == 'forward' ? 'desc' : 'asc';

        let nextCursor = null;
        let previousCursor = null;

        //define opposite modifier which is the inverse of the normal operation
        const oppositeModifier = direction == 'forward' ? '$gt' : '$lt';
        sort = direction == 'forward' ? 'asc' : 'desc';

        //retrieve next/previous doc if it exists
        const doc = await model.findOne(
            { createdAt: { [oppositeModifier]: cursor }, ...filter },
            {
                createdAt: 1,
            },
            { sort: { createdAt: sort }, limit: 1, lean: true },
        );

        if (direction == 'forward') {
            // assert createdAt field in object and assign as next cursor
            nextCursor = (<any>data[PAGINATION_COUNT])?.createdAt || null;

            //assign previous cursor
            previousCursor = (<any>doc)?.createdAt || null;
        } else {
            // assert createdAt field in object and assign as previous cursor
            previousCursor = (<any>data[PAGINATION_COUNT])?.createdAt || null;

            //assign next cursor
            nextCursor = (<any>doc)?.createdAt || null;
        }

        if (data.length > PAGINATION_COUNT) {
            data.pop();
        }
        direction == 'backward' ? data.reverse() : '';
        return { nextCursor, previousCursor, data };
    }

    static async paginateSubDoc(
        data: any[],
        model: Model<any>,
        paginationParams: PaginationParams,
        docFilterField: string,
        docFilterValue: string,
        subDocField: string,
    ) {
        const { direction, cursor } = paginationParams;
        const sort: -1 | 1 = direction == 'forward' ? -1 : 1;

        const oppositeModifier = direction == 'forward' ? '$gt' : '$lt';
        let nextCursor = null;
        let previousCursor = null;

        //retrieve next/previous doc if it exists
        const doc = (
            await model.aggregate([
                { $match: { [docFilterField]: docFilterValue } },
                { $unwind: `$${subDocField}` },
                { $sort: { [`${subDocField}.createdAt`]: sort } },
                {
                    $match: {
                        [`${subDocField}.createdAt`]: {
                            [oppositeModifier]: cursor,
                        },
                    },
                },
                { $limit: 1 },
                {
                    $group: {
                        _id: '$_id',
                        messages: { $push: `$${subDocField}` },
                    },
                },
            ])
        )[0]?.[`${subDocField}`][0];

        if (direction == 'forward') {
            // assert createdAt field in object and assign as next cursor
            nextCursor = (<any>data[PAGINATION_COUNT])?.createdAt || null;

            //assign previous cursor
            previousCursor = (<any>doc)?.createdAt || null;
        } else {
            // assert createdAt field in object and assign as previous cursor
            previousCursor = (<any>data[PAGINATION_COUNT])?.createdAt || null;

            //assign next cursor
            nextCursor = (<any>doc)?.createdAt || null;
        }

        if (data.length > PAGINATION_COUNT) {
            data.pop();
        }
        direction == 'backward' ? data.reverse() : '';
        return { nextCursor, previousCursor, data };
    }

    static async getPaginationStats(
        model: Model<any>,
        filter: object,
        paginationParams: PaginationParams,
    ) {
        const { direction, cursor } = paginationParams;
        const modifier = direction == 'forward' ? '$gte' : '$gte';
        const sort = direction == 'forward' ? 'asc' : 'asc';

        const count = await model.find(filter).countDocuments();

        const docIndex = await model
            .find(
                {
                    ...filter,
                    createdAt: {
                        [modifier]: cursor ?? new Date().toISOString(),
                    },
                },
                {},
                { sort: { createdAt: sort } },
            )
            .countDocuments();

        let topIndex = 0;
        let bottomIndex = 0;

        if (direction == 'forward') {
            topIndex = count > 0 ? (docIndex == 0 ? 1 : docIndex) : count;
            bottomIndex =
                topIndex + PAGINATION_COUNT - 1 < count
                    ? topIndex + PAGINATION_COUNT - 1
                    : count;
        } else {
            bottomIndex = count > 0 ? (docIndex == 0 ? 1 : docIndex) : count;
            topIndex =
                bottomIndex - PAGINATION_COUNT + 1 < count
                    ? bottomIndex - PAGINATION_COUNT + 1
                    : count;
        }
        const monthNumber = new Date().getUTCMonth();
        const monthLimit =
            monthNumber < 2
                ? 0
                : new Date(
                      Date.now() - 61 * 60 * 60 * 24 * 1000,
                  ).getUTCMonth() + 1;
        const monthsData = await model.aggregate([
            {
                $match: {
                    $expr: {
                        $and: [
                            // {
                            //     $eq: [
                            //         { $year: new Date() },
                            //         { $year: '$createdAt' },
                            //     ],
                            // },
                            {
                                $gte: [
                                    { $month: '$createdAt' },
                                    monthLimit,
                                    // {
                                    //     $month: new Date(
                                    //         Date.now() -
                                    //             61 * 60 * 60 * 24 * 1000,
                                    //     ),
                                    // },
                                ],
                            },
                        ],
                    },
                },
            },
            {
                $project: {
                    createdAtMonth: { $month: '$createdAt' },
                },
            },
            {
                $group: {
                    _id: '$createdAtMonth',
                    month: { $first: '$createdAtMonth' },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: -1 } },
            { $limit: 2 },
        ]);

        const monthDifference =
            (monthsData[0]?.count || 0) - (monthsData[1]?.count || 0) || 0;

        const thisMonth = monthsData[0]?.count || 1;
        const lastMonth = monthsData[1]?.count || 1;
        const monthCountDifference =
            thisMonth > lastMonth
                ? NumberRounder.round((monthDifference / lastMonth) * 100)
                : NumberRounder.round((monthDifference / thisMonth) * 100);

        return {
            count,
            numPages: Math.ceil(count / PAGINATION_COUNT),
            topIndex,
            bottomIndex,
            monthCountDifference,
            currPage: Math.ceil(bottomIndex / PAGINATION_COUNT),
            paginationCount: PAGINATION_COUNT,
        };
    }
}
