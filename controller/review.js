const Review=require("../models/review.js");
const ExpressError =require("../utils/expressError");
const Listing = require('../models/listing.js');
const {listingSchema,reviewSchema} = require("../schema.js");


module.exports.addReview=async (req, res) => {
    
    // console.log("🔥🔥 REVIEW ROUTE HIT 🔥🔥");
    // console.log("PARAMS:", req.params);
    // console.log("BODY:", req.body);
    
    let listing = await Listing.findById(req.params.id);
    let newReview =  new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview.author.username)
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    // console.log(req.body.review);

    // console.log("new Review Added");
    

    req.flash("success","Review Added SucessFully !!!")
    res.redirect(`/listings/${listing._id}`);
    // res.redirect("/listing/:id");
  }


module.exports.deleteReview=async (req,res)=>{
  let {id,reviewId}=req.params;
  await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted Successfully !!!");
  res.redirect(`/listings/${id}`)
}