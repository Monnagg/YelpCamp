//1、引入mongoose
const mongoose = require('mongoose');
//2.为mongoose.Schema创建简写模式Schema
const Scheme = mongoose.Schema;

//3.创建schema实例（sechema相当于表的constraint）
//如果没有简写需要用new moongoose.Schema()来创建
const CampgroundSchema= new Scheme({
    title:String,
    image:String,
    price:Number,
    description:String,
    location:String
})

//4.创建一个名为Campground的model（集合）并添加到CampgroundSchema里
//mongodb会创建一个名为campground（首字母小写）的collection（表table）
//并通过模块化暴漏方便其他文件使用
module.exports = mongoose.model('Campground',CampgroundSchema);