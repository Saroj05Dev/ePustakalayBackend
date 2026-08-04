
const ReadingProgress = require(
    "../schemas/Progress"
);

const createReadingProgressRepository =
    async (data) => {

        return await ReadingProgress.create(
            data
        );
    };
    

const getBookProgressRepository =
    async (
        userId,
        bookId
    ) => {

        return await ReadingProgress.find({
            user: userId,
            book: bookId,
        })
            .populate(
                "chapter",
                "chapter_title chapter_number"
            )
            .sort({
                created_at: 1,
            });
    };

const updateReadingProgressRepository =
    async (
        progressId,
        userId,
        data
    ) => {

        return await ReadingProgress.findOneAndUpdate(

            {
                _id: progressId,
                user: userId,
            },

            data,

            {
                returnDocument: "after",
            }
        );
    };

const getAllUserProgressRepository =
    async (
        userId
    ) => {

        // Group by book and get the most recent progress for each book
        const progressRecords = await ReadingProgress.aggregate([
            {
                $match: {
                    user: userId,
                    is_completed: false,
                }
            },
            // Sort by last_read_at to get most recent first
            {
                $sort: { last_read_at: -1 }
            },
            // Group by book and take the first (most recent) record for each book
            {
                $group: {
                    _id: "$book",
                    progressId: { $first: "$_id" },
                    user: { $first: "$user" },
                    book: { $first: "$book" },
                    chapter: { $first: "$chapter" },
                    progress: { $first: "$progress" },
                    current_page: { $first: "$current_page" },
                    reading_time: { $first: "$reading_time" },
                    is_completed: { $first: "$is_completed" },
                    completed_at: { $first: "$completed_at" },
                    last_read_at: { $first: "$last_read_at" },
                    created_at: { $first: "$created_at" },
                    updated_at: { $first: "$updated_at" },
                }
            },
            // Sort by last_read_at again after grouping
            {
                $sort: { last_read_at: -1 }
            },
            // Limit to 5 books
            {
                $limit: 5
            }
        ]);

        // Now populate the book and chapter details
        const populatedProgress = await ReadingProgress.populate(progressRecords, [
            {
                path: 'book',
                select: 'title author cover_image price category'
            },
            {
                path: 'chapter',
                select: 'chapter_title chapter_number'
            }
        ]);

        // Map back to original structure with _id from progressId
        return populatedProgress.map(record => ({
            _id: record.progressId,
            user: record.user,
            book: record.book,
            chapter: record.chapter,
            progress: record.progress,
            current_page: record.current_page,
            reading_time: record.reading_time,
            is_completed: record.is_completed,
            completed_at: record.completed_at,
            last_read_at: record.last_read_at,
            created_at: record.created_at,
            updated_at: record.updated_at,
        }));
    };

module.exports = {
    createReadingProgressRepository,
    getBookProgressRepository,
    updateReadingProgressRepository,
    getAllUserProgressRepository,
};