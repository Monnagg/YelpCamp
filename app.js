const express = require("express");
const mongoose  = require("mongoose");
const path = require("path");
const app = new express();
const ejsMate = require('ejs-mate');
const {campgroundSchema, reviewSchema}=require('./schema.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
//引入Review model
const Review =require('./models/review');

const Campground = require('./models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser:true,
   
});
const db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error:'));
db.once('open',()=>{
    console.log('Dabase connected');
});

app.engine('ejs', ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));

const validateCampground = (req,res,next) =>{
    const {error}= campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el =>el.message).join(',')
        throw new ExpressError(msg,400)
    }else{
        next();
    }
}
const validateReview =(req,res,next)=>{
    const{error} =reviewSchema.validate(req.body);
    console.log(error)

    if(error){
        const msg = error.details.map(el =>el.message).join(',')
        throw new ExpressError(msg,400)
    }else{
        next();
    }
}


app.get('/',(req,res)=>{
    res.render("home")
})
app.get('/campgrounds',async (req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds})
})

app.get('/campgrounds/new',(req,res)=>{
    res.render('campgrounds/new')
})

app.post('/campgrounds',validateCampground, catchAsync(async (req,res,next)=>{
    
        const campground = new Campground(req.body.campground);
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`);
   
}))

app.get('/campgrounds/:id',catchAsync(async (req,res)=>{
    const campground =await Campground.findById(req.params.id).populate('reviews');
    res.render('campgrounds/show',{campground});
}))

app.get('/campgrounds/:id/edit',catchAsync(async (req,res)=>{
    const campground =await Campground.findById(req.params.id);
    res.render('campgrounds/edit',{campground});
}))
app.put('/campgrounds/:id',validateCampground,catchAsync(async (req,res)=>{
    const {id}=req.params;
    const campground= await Campground.findByIdAndUpdate(id,{...req.body.campground});
    res.redirect(`/campgrounds/${campground._id}`);
}))

app.delete('/campgrounds/:id',catchAsync(async (req,res)=>{
    const {id}=req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
}))

app.post('/campgrounds/:id/reviews',validateReview, catchAsync(async (req,res)=>{
   const campground= await Campground.findById(req.params.id);
   const review = new Review(req.body.review);
   campground.reviews.push(review);
   await review.save();
   await campground.save();
   res.redirect(`/campgrounds/${campground.id}`);
}))

app.delete('/campgrounds/:id/reviews/:reviewID',catchAsync(async (req,res)=>{
    const {id,reviewID} =req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewID}});
    await Review.findByIdAndDelete(reviewID);
    res.redirect(`/campgrounds/${id}`);
}))

app.get('/makecampground',catchAsync(async (req,res)=>{
    const camp = new Campground({title:'My Backyard',
    description:'Free'
});
    await camp.save();
    res.send(camp)
}))

app.all('*',(req,res,next)=>{
    next(new ExpressError('Page not Found'),404)
})

app.use((err,req,res,next)=>{
    const {statusCode =500} = err;
    if (!err.message) err.message ="Oh, something wrong!"
    res.status(statusCode).render('error',{err});
})
app.listen(3000,()=>{
    console.log('Serving on port 3000')
})

