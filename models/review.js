const mongoose = require('mongoose');
const Scheme = mongoose.Schema;

const reviewSchema = new Scheme({
    body: String,
    rating: Number
})

module.exports = mongoose.model('Review', reviewSchema);