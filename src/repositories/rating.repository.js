const Rating = require("../schemas/Rating");

exports.createRating =async(data)=>{
    return await Rating.create(data);
};

exports.findUserRating=async(bookId,userId)=>{
    return await Rating.findOne({bookId,userId});
};

exports.updateRating=async(id,rating,review)=>{
    const updateData = { rating };
    if (review !== undefined) {
        updateData.review = review;
    }
    return await Rating.findByIdAndUpdate(
        id,
        updateData,
        {returnDocument:'after'}
    );
};

exports.getRatings = async(bookId)=>{
    return await Rating.find({bookId}).populate("userId", "name");
};