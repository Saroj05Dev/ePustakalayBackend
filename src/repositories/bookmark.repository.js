const Bookmark = require("../schemas/Bookmark");
const Book = require("../schemas/Book");

const createBookmarkRepository = async (data) => {
    return await Bookmark.create(data);
};

const findBookmarkRepository = async (userId, bookId) => {
    return await Bookmark.findOne({
        user: userId,
        book: bookId,
    });
};

const findBookmarkByIdRepository = async (bookmarkId) => {
    return await Bookmark.findById(bookmarkId);
};

const findBookByIdRepository = async (bookId) => {
    return await Book.findById(bookId);
};

const findBookmarkByBookRepository = async (userId, bookId) => {
    return await Bookmark.findOne({
        user: userId,
        book: bookId,
    })
        .populate("chapter", "chapter_title chapter_number")
        .sort({ created_at: -1 });
};

const findAllBookmarksRepository = async (userId) => {
    return await Bookmark.find({
        user: userId,
    })
        .populate("book")
        .populate("chapter", "chapter_title chapter_number start_page end_page")
        .sort({ created_at: -1 });
};

const deleteBookmarkRepository = async (bookmarkId) => {
    return await Bookmark.findByIdAndDelete(bookmarkId);
};

module.exports = {
    createBookmarkRepository,
    findBookmarkRepository,
    findBookmarkByIdRepository,
    findBookmarkByBookRepository,
    findAllBookmarksRepository,
    deleteBookmarkRepository,
    findBookByIdRepository,
};