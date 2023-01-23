const mongoose = require('mongoose');
const Review = require('./review');
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
//post middleware,在findOneAndDelete之后删除reviews,这里的parameter doc
//是删除的document
CampgroundSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Review.deleteMany({
            _id:{
                $in: doc.reviews
            }
        })
    }
})
module.exports = mongoose.model('Campground',CampgroundSchema);