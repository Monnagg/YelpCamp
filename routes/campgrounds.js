const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {campgroundSchema}=require('../schema.js');

const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');


const validateCampground = (req,res,next) =>{
    const {error}= campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el =>el.message).join(',')
        throw new ExpressError(msg,400)
    }else{
        next();
    }
}
//因为入口文件的中间件已设置为campground开头，这里把path里的campground去掉
router.get('/',async (req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds})
})

router.get('/new',(req,res)=>{
    res.render('campgrounds/new')
})

router.post('/',validateCampground, catchAsync(async (req,res,next)=>{
    
        const campground = new Campground(req.body.campground);
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`);
   
}))

router.get('/:id',catchAsync(async (req,res)=>{
    const campground =await Campground.findById(req.params.id).populate('reviews');
    res.render('campgrounds/show',{campground});
}))

router.get('/:id/edit',catchAsync(async (req,res)=>{
    const campground =await Campground.findById(req.params.id);
    res.render('campgrounds/edit',{campground});
}))
router.put('/:id',validateCampground,catchAsync(async (req,res)=>{
    const {id}=req.params;
    const campground= await Campground.findByIdAndUpdate(id,{...req.body.campground});
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:id',catchAsync(async (req,res)=>{
    const {id}=req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
}))

module.exports =router;