const mongoose = require('mongoose');
const review = require('./review');
const Scheme = mongoose.Schema;

const CampgroundSchema= new Scheme({
    title:String,
    image:String,
    price:Number,
    description:String,
    location:String,
    reviews:[{
        type:Scheme.Types.ObjectId,
        ref:'Review'
    }
    ]
})


module.exports = mongoose.model('Campground',CampgroundSchema);