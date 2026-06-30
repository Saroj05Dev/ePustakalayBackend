
const ratingService = require("../services/rating.service");

// controllers/rating.controller.js

exports.addRating = async (req, res) => {
    try {

        const { bookId, rating, review, orderId } = req.body;

        const userId = req.user.id;

        const result = await ratingService.addRating(
            bookId,
            userId,
            rating,
            review,
            orderId
        );

        res.status(200).json({
            success: true,
            message: "Rating added successfully",
            data: result,
            error: {}
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            data: {},
            error: {
                statusCode: error.statusCode || 409,
                isOperational: true
            }
        });
    }
};

exports.getRating = async (req, res) => {
    try {

        const { bookId } = req.params;
        const userId = req.user ? req.user.id : null;

        const result =
            await ratingService.getRating(
                bookId,userId
            );

        res.status(200).json({
            success: true,
            message:"rating fetched successfully",
            data: result,
            error:{}
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            data:{},
            error:{
                statusCode: error.statusCode || 409,
                isOperational: true
            }
        });
    }
};

exports.updateRating = async(req,res)=>{
    try{
        const {id} = req.params;
        const { rating, review } = req.body;
        const data = await ratingService.updateRating(id,rating,review);
        res.status(200).json({
            success: true,
            message:"rating updated successfully",
            data: data,
            error:{}
        });
    }catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            data:{},
            error:{
                statusCode: error.statusCode || 409,
                isOperational: true
            }
        });
    }
};