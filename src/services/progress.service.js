
const {
    createReadingProgressRepository,
    getBookProgressRepository,
    updateReadingProgressRepository,
    getAllUserProgressRepository
} = require("../repositories/progress.repository");

const createReadingProgressService =
    async (
        userId,
        data
    ) => {

        const isCompleted =
            data.progress >= 100;

        const progressData = {
            user: userId,
            book: data.book,
            chapter: data.chapter,
            progress: data.progress,
            last_read_at: new Date(),
            is_completed: isCompleted,
        };

        if (isCompleted) {

            progressData.completed_at =
                new Date();
        }

        return await createReadingProgressRepository(
            progressData
        );
    };

const getBookProgressService =
    async (
        userId,
        bookId
    ) => {

        return await getBookProgressRepository(
            userId,
            bookId
        );
    };

const updateReadingProgressService =
    async (
        progressId,
        userId,
        data
    ) => {

        const updateData = {

            progress:
                data.progress,

            current_page:
                data.current_page,

            reading_time:
                data.reading_time,

            is_completed:
                data.progress >= 100,

            last_read_at:
                new Date(),
        };

        if (data.progress >= 100) {

            updateData.completed_at =
                new Date();
        }

        return await updateReadingProgressRepository(
            progressId,
            userId,
            updateData
        );
    };

const getAllUserProgressService =
    async (
        userId
    ) => {

        return await getAllUserProgressRepository(
            userId
        );
    };

module.exports = {
    createReadingProgressService,
    getBookProgressService,
    updateReadingProgressService,
    getAllUserProgressService,
};