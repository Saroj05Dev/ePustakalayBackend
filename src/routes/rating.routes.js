
const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/rating.controller");
const {auth, optionalAuth} = require("../middlewares/auth.middleware");


router.post("/",auth,ratingController.addRating);
router.get("/:bookId",optionalAuth,ratingController.getRating);
router.put("/:id",auth,ratingController.updateRating);

module.exports= router;

