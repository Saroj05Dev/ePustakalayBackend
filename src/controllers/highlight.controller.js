const { getHighlightsByChapterIdService, deleteHighlightService } = require('../services/highlight.service');

const createHighlightService = require('../services/highlight.service').createHighlightService;

exports.createHighlight = async (req, res) => {
    const highlightData = {
        user: req.user.id,
        book: req.body.book,
        chapter: req.body.chapter,
        text: req.body.text,
        color: req.body.color || 'yellow',
        pageNumber: req.body.pageNumber
    };

    try {
        const highlight = await createHighlightService(highlightData);
        res.status(201).json({
            success: true,
            message: 'Highlight created successfully',
            data: highlight,
            error: null
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            sucess: false,
            message: 'Failed to create highlight',
            data: null,
            error: error.message
        });
    }
}

exports.getHighlightsByChapterId = async (req, res) => {
    const highlightData = {
        user: req.user.id,
        book: req.params.bookId,
        chapter: req.params.chapterId,
    };

    try {
        const highlights = await getHighlightsByChapterIdService(highlightData);
        res.status(200).json({
            success: true,
            message: 'Highlights retrieved successfully',
            data: highlights,
            error: null
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: 'Failed to retrieve highlights',
            data: null,
            error: error.message
        });
    }
}

exports.deleteHighlight = async (req, res) => {
    const userId = req.user.id;
    const highlightId = req.params.highlightId;

    try {
        const deletedHighlight = await deleteHighlightService(userId, highlightId);
        res.status(200).json({
            success: true,
            message: 'Highlight deleted successfully',
            data: deletedHighlight,
            error: null
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: 'Failed to delete highlights',
            data: null,
            error: error.message
        });
    }
}