const {
    addChapterService,
    getChapterByIdService,
    getChaptersByBookService,
    updateChapterService,
} = require("../services/chapter.service");
const { extractTextFromPDF, splitIntoChapters } = require("../utils/pdfExtractor");
const Book = require("../schemas/Book");

const addChapter = async (req, res) => {

    try {

        const result = await addChapterService(req.body);

        return res.status(201).json({
            success: true, 
            message: "Chapter added successfully",
            data: result,
            error: {},
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message,
            data: {},
            error: error,
        });
    }
};

/**
 * Bulk import chapters (metadata only - for PDF direct approach)
 * POST /api/chapters/bulk-import
 * Body: { bookId, chapters: [{chapter_number, chapter_title, description, start_page, end_page}] }
 */
const bulkImportChapters = async (req, res) => {
    try {
        const { bookId, chapters } = req.body;
        
        if (!bookId || !chapters || !Array.isArray(chapters)) {
            return res.status(400).json({
                success: false,
                message: "bookId and chapters array are required",
                data: {},
                error: {},
            });
        }
        
        // Verify book exists
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found",
                data: {},
                error: {},
            });
        }
        
        const savedChapters = [];
        
        for (const chapterData of chapters) {
            // Calculate duration based on page count (avg 2 min per page)
            const pageCount = chapterData.end_page - chapterData.start_page + 1;
            const estimatedDuration = Math.ceil(pageCount * 2);
            
            const saved = await addChapterService({
                book: bookId,
                chapter_title: chapterData.chapter_title,
                chapter_number: chapterData.chapter_number,
                description: chapterData.description || '',
                start_page: chapterData.start_page,
                end_page: chapterData.end_page,
                duration_minutes: chapterData.duration_minutes || estimatedDuration,
            });
            savedChapters.push(saved);
        }
        
        return res.status(201).json({
            success: true,
            message: `${savedChapters.length} chapters imported successfully`,
            data: savedChapters,
            error: {},
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            data: {},
            error: error,
        });
    }
};

const getChapterById = async (req, res) => {

    try {

        const result = await getChapterByIdService(
            req.params.chapterId
        );

        return res.status(200).json({
            success: true,
            message: "Chapter fetched successfully",
            data: result,
            error: {},
        });

    } catch (error) {

        return res.status(404).json({
            success: false,
            message: error.message,
            data: {},
            error: error,
        });
    }
};

const getChaptersByBook = async (req, res) => {

    try {

        const result = await getChaptersByBookService(
            req.params.bookId
        );

        return res.status(200).json({
            success: true,
            message: "Book chapters fetched successfully",
            data: result,
            error: {},
        });

    } catch (error) {

        return res.status(404).json({
            success: false,
            message: error.message,
            data: {},
            error: error,
        });
    }
};

const updateChapter = async (req, res) => {

    try {

        const result = await updateChapterService(
            req.params.chapterId,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Chapter updated successfully",
            data: result,
            error: {},
        });

    } catch (error) {

        return res.status(404).json({
            success: false,
            message: error.message,
            data: {},
            error: error,
        });
    }
};

module.exports = {
    addChapter,
    getChapterById,
    getChaptersByBook,
    updateChapter,
    bulkImportChapters,
};