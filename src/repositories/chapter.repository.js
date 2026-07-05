const Chapter = require("../schemas/Chapter");

const addChapterRepository = async (data) => {

    return await Chapter.create(data);
};

const findChapterByIdRepository = async (chapterId) => {

    return await Chapter.findById(chapterId);
};

const getChaptersByBookRepository = async (bookId) => {

    return await Chapter.find({
        book: bookId,
    })
        .sort({ chapter_number: 1 })
        .select("chapter_title chapter_number context description start_page end_page duration_minutes");
};

const updateChapterRepository = async (chapterId, data) => {

    return await Chapter.findByIdAndUpdate(
        chapterId,
        data,
        {
            returnDocument: "after",
            runValidators: true,
        }
    );
};

module.exports = {
    addChapterRepository,
    findChapterByIdRepository,
    getChaptersByBookRepository,
    updateChapterRepository
};