const { createNoteRepository, getAllNotesRepository, getNotesByBookAndChapterIdRepository, deleteNotesRepository, updateNotesRepository } = require("../repositories/notes.repository");
const { findBookByIdRepository } = require("../repositories/book.repository");
const { findChapterByIdRepository } = require("../repositories/chapter.repository");

exports.createNoteService = async (noteData) => {

    const book = await findBookByIdRepository(noteData.book);
    if (!book) {
        const error = new Error('Book not found');
        error.statusCode = 404;
        throw error;
    }

    const chapter = await findChapterByIdRepository(noteData.chapter);
    if (!chapter) {
        const error = new Error('Chapter not found');
        error.statusCode = 404;
        throw error;
    }

    const note = await createNoteRepository(noteData);
    return note;
}

exports.getAllNotesService = async (userId) => {
    return await getAllNotesRepository(userId);
}

exports.getNotesByBookAndChapterIdService = async (userId, bookId, chapterId) => {
    const book = await findBookByIdRepository(bookId);
    if (!book) {
        const error = new Error('Book not found');
        error.statusCode = 404;
        throw error;
    }

    const chapter = await findChapterByIdRepository(chapterId);
    if (!chapter) {
        const error = new Error('Chapter not found');
        error.statusCode = 404;
        throw error;
    }

    if (String(chapter.book) !== String(bookId)) {
        const error = new Error('Chapter does not belong to the specified book');
        error.statusCode = 400;
        throw error;
    }

    return await getNotesByBookAndChapterIdRepository(userId, bookId, chapterId);
}

exports.updateNotesService = async (noteId, noteData, userId) => {
    const updatedNote = await updateNotesRepository(noteId, noteData, userId);
    if (!updatedNote) {
        const error = new Error('Note not found or user not authorized');
        error.statusCode = 404;
        throw error;
    }
    return updatedNote;
}

exports.deleteNotesService = async (noteId, userId) => {
    const deletedNote = await deleteNotesRepository(noteId, userId);
    if (!deletedNote) {
        const error = new Error('Note not found or user not authorized');
        error.statusCode = 404;
        throw error;
    }
    return deletedNote;
}