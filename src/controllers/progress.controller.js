
const {
    createReadingProgressService,
    getBookProgressService,
    updateReadingProgressService,
    getAllUserProgressService,
} = require("../services/progress.service");

const createReadingProgress = async (
    req,
    res
) => {

    try {

        const userId = req.user.id;

        const result =
            await createReadingProgressService(
                userId,
                req.body
            );

        return res.status(201).json({
            success: true,
            message:
                "Reading progress added successfully",
            data: result,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


const getBookProgress = async (
    req,
    res
) => {

    try {

        const userId =
            req.user.id;

        const { bookId } =
            req.params;

        const result =
            await getBookProgressService(
                userId,
                bookId
            );

        return res.status(200).json({
            success: true,
            message:
                "Reading progress fetched successfully",
            data: result,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const updateReadingProgress = async (
    req,
    res
) => {

    try {

        const userId =
            req.user.id;

        const { progressId } =
            req.params;

        const result =
            await updateReadingProgressService(
                progressId,
                userId,
                req.body
            );

        return res.status(200).json({
            success: true,
            message:
                "Reading progress updated successfully",
            data: result,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getAllUserProgress = async (
    req,
    res
) => {

    try {

        const userId =
            req.user.id;

        const result =
            await getAllUserProgressService(
                userId
            );

        return res.status(200).json({
            success: true,
            message:
                "User progress fetched successfully",
            data: result,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createReadingProgress,
    getBookProgress,
    updateReadingProgress,
    getAllUserProgress,
};