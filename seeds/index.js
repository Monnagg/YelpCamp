//1.连接并测试数据库
const mongoose  = require("mongoose");
//2.引入Campground Model
const Campground = require('../models/campground');
//引入cities
const cities = require("./cities");
//引入places and descriptor
const {places, descriptors} = require('./seedHelper');

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser:true,
   
});
const db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error:'));
db.once('open',()=>{
    console.log('Dabase connected');
});

const title= array=> array[Math.floor(Math.random()*array.length)];

//3.向数据库插入50个campground的信息
const seedDB = async() =>{
    await Campground.deleteMany({});
    for(let i=0; i<50;i++){
        //array里有1000个city，从中随机抽取
        const rand = Math.floor(Math.random()*1000);
        
        const camp = new Campground({
            location:`${cities[rand].city}, ${cities[rand].state}`,
            //descriptors和places是两个数组
            title:`${title(descriptors)} ${title(places)}`
        })
        await camp.save();
    }
    
}

seedDB().then(()=>{
    mongoose.connection.close();
});