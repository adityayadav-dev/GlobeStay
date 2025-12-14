const express = require('express');
const router = express.Router({ mergeParams: true });   // ⭐ FIXED
const wrapAsync =require("../utils/asyncWrap");
const {isLoggedIn,isOwner,validateListing,isReviewAuthor,validateReview}=require("../middleware.js")
const reviewController=require('../controller/review.js')


// add review
router.post("/", isLoggedIn,validateReview,wrapAsync(reviewController.addReview)
);
// Delete review 
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview))

module.exports=router;