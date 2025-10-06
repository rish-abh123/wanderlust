
const express = require("express");
const router = express.Router({mergeParams:true});

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {validateReview,isLoggedIn,isReviewAuthor} = require("../middleware.js");
const reviewControllers = require("../controllers/reviews.js");


// add new review route
router.post("/",
    validateReview,
    isLoggedIn,
    wrapAsync(reviewControllers.createReview)
);


//delete review route
router.delete("/:reviewId",
    isLoggedIn,isReviewAuthor,
    wrapAsync(reviewControllers.deleteReview)
);



module.exports = router;