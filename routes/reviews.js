const express = require('express');
const router = express.Router({mergeParams:true});
const Review =require('../models/review');
const Campground = require('../models/campground');
const { reviewSchema}=require('../schema.js');
const ExpressError = require('../utils/ExpressError');
//path.join(__dirname,'views')
const path = require("path");
const catchAsync = require(path.join(__dirname,'../utils/catchAsync.js'));

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.post('/',validateReview, catchAsync(async (req,res)=>{
    const campground= await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground.id}`);
 }))
 
 router.delete('/:reviewID',catchAsync(async (req,res)=>{
     const {id,reviewID} =req.params;
     await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewID}});
     await Review.findByIdAndDelete(reviewID);
     res.redirect(`/campgrounds/${id}`);
 }))

 module.exports = router;