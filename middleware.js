const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError =require("./utils/expressError");
const {listingSchema,reviewSchema} = require("./schema");


module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
   if (req.originalUrl.includes("/reviews")) {
            // If yes, redirect them to the listing page (/listings/id) instead of the review route
            // url structure is usually: /listings/LONG_ID_HERE/reviews
            let listingId = req.originalUrl.split("/")[2]; 
            req.session.redirectUrl = `/listings/${listingId}`;
        } else {
            // For everything else (like Edit or New Listing), save the exact URL
            req.session.redirectUrl = req.originalUrl;
        }

    req.flash("error","You must be Logged in ")
    return res.redirect("/login")

  }
  next()
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
      res.locals.redirectUrl= req.session.redirectUrl
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
  const { id } = req.params;
   let listing= await Listing.findById(id)
  if(!res.locals.currUser._id.equals(listing.owner._id)){
      res.flash("error","You dont have permission to edit")
      return res.redirect(`/listings/${id}`)
  }
  next()
}

module.exports.validateListing = (req, res, next) => {
  // console.log("🧾 REQ.BODY FROM EDIT FORM:", JSON.stringify(req.body, null, 2));
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((e) => e.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    
    // Check if the logged-in user is the author
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateReview = (req, res, next) => {
  // console.log("🧾 REQ.BODY FROM EDIT FORM:", JSON.stringify(req.body, null, 2));
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((e) => e.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};