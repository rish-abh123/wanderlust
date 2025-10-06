const Listing = require("./models/listing.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req,res,next)=>{
 if(!req.isAuthenticated()){
    let redirectUrl = req.originalUrl.replace("/reviews","");
     req.session.redirectUrl = redirectUrl;
    //    req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged in");
       return res.redirect("/login");
 }
 next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    
    //first check if listing exists
    if(!listing){
        req.flash("error","Listing you want to access does not exist");
    return res.redirect("/listings");
    }
    //then check owenership
   if(!listing.owner.equals(res.locals.currUser._id)){ 
    req.flash("error","you are not the owner of the listing");
    return res.redirect(`/listings/${id}`);
   }
   next();
}

module.exports.isReviewAuthor = async(req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","you are not the author of the review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

//  joi schema validators for Listing
module.exports.validateListing = (req,res,next)=>{
    const {error} = listingSchema.validate(req.body.listing);
    if(error){

        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}

//  joi schema validators for reviews
module.exports.validateReview = (req,res,next) =>{

    let {error} = reviewSchema.validate(req.body);
      if(error){
     let errMsg = error.details.map((el)=>el.message).join(",");
   throw new ExpressError(400,errMsg);
 }
 else{
    next();
 }
 }