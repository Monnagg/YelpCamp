//1.	连接mongodb，引入Campground
const mongoose  = require("mongoose");
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser:true,
   
});
const db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error:'));
db.once('open',()=>{
    console.log('Dabase connected');
});

//2、测试是否连接数据库
const seedDB = async() =>{
    //delete all documents in Campground model（collection）
    //Modele.deleteMany({})方法
    await Campground.deleteMany({});
    const c = new Campground({title:'purple field'});
    await c.save();
}

seedDB();