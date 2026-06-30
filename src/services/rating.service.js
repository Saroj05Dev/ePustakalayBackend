const ratingRepo = require("../repositories/rating.repository");


exports.addRating= async (bookId,userId,rating,review,orderId) => {

  const existingRating = await ratingRepo.findUserRating(
    bookId,
    userId
  );

  if (existingRating) {
    return await ratingRepo.updateRating(
      existingRating._id,
      rating,
      review
    );
  }

  return await ratingRepo.createRating({
    bookId,
    userId,
    rating,
    review,
    orderId
  });
};

exports.getRating = async (bookId,userId) => {
  const ratings = await ratingRepo.getRatings(bookId);

  const userRating = await ratingRepo.findUserRating(bookId,userId);

  if (!ratings.length) {
    return {
      averageRating: 0,
      totalRatings: 0,
      userRating:null,
      reviews: []
    };
  }

  const total = ratings.reduce(
    (sum, item) => sum + item.rating,
    0
  );

  const reviewsList = ratings.map(r => ({
    _id: r._id,
    rating: r.rating,
    review: r.review || "",
    createdAt: r.createdAt,
    userName: r.userId?.name || "Anonymous Reader"
  }));

  return {
    averageRating:
      total / ratings.length,
    totalRatings: ratings.length,
    userRating,
    reviews: reviewsList
  };
};

exports.updateRating = async(id,rating,review)=>{

  return await ratingRepo.updateRating(id,rating,review);
};