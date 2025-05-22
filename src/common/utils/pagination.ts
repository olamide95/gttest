// export async function paginate(
//     record: Model<any>,
//     page: number,
//     search?: string,
// ) {
//     let options = {};

//     if (search) {
//         options = {
//             $or: [{ title: new RegExp(search.toString(), 'i') }],
//         };
//     }

//     const docs = await record
//         .find(options)
//         .skip(page - 1)
//         .limit(12)
//         .populate('tracks')
//         .sort('-yearTaught')
//         .exec();

//     const total: number = search
//         ? docs.length
//         : await record.countDocuments().exec();
//     const lastPage = Math.ceil(total / 12);
//     const nextPage = lastPage > page + 1 ? page + 1 : null;
//     const previousPage = nextPage !== null ? page - 1 : null;

//     //const newDocs = docs.forEach(doc => doc.tracks.sort((a, b) => ));

//     return {
//         docs: sort(docs),
//         page,
//         total,
//         nextPage,
//         prevPage: previousPage,
//     };
// }

// const sort = function (docs: Omit<any, never>[]) {
//     return docs.map((doc) => ({
//         ...doc._doc,
//         tracks: doc.tracks
//             .slice()
//             .sort(
//                 (a: Track, b: Track) =>
//                     new Date(a.dateUploaded).getTime() -
//                     new Date(b.dateUploaded).getTime(),
//             ),
//     }));
// };
