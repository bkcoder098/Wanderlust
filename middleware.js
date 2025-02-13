const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");
const { reviewSchema} = require("./schema.js");

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error"," you must be logged in to create listing!");
         return res.redirect("/login");
      }
      next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

//for listing 
module.exports.isOwner = async (req,res,next)=>{
    let { id } = req.params;
    let listing =  await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","you are not owner of this listing ");
         return res.redirect(`/listings/${id}`);
      }
      next();
  
};

//For listing validation
module.exports.validateListing = (req,res,next) => {
    let {error} =listingSchema.validate(req.body);
     console.log(error);
     if(error){
       let errMsg = error.details.map((el) => el.message).join(",");
       throw new ExpressError(400,errMsg);
     }else{
       next();
     }
 
  }

 // For review validation
  module.exports.validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
     console.log(error);
     if(error){
       let errMsg = error.details.map((el) => el.message).join(",");
       throw new ExpressError(400,errMsg);
     }else{
       next();
     }
  
  };


  //for review 
  module.exports.isReviewAuthor = async (req,res,next)=>{
    let {id, reviewId } = req.params;
    let review =  await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","you are not author of this review ");
         return res.redirect(`/listings/${id}`);
      }
      next();
  
};
