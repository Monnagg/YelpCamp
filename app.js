const express = require("express");
const mongoose  = require("mongoose");
const path = require("path");
const app = new express();

//4.引入campg module
const Campground = require('./models/campground');

//1、连接到mongoodb里名为yelp-camp的数据库
mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser:true,
    // useCreateIndex:true, 已弃用
    // useUnifieldTopology:true 已弃用
});
//2、为mongoose.connection创建简写db
const db = mongoose.connection;
//3、测试数据库连接，一定要先启动mongodb！！！
db.on('error',console.error.bind(console,'connection error:'));
db.once('open',()=>{
    console.log('Dabase connected');
});

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))


app.get('/',(req,res)=>{
    res.render("home")
})

//5、设置关于campground的request
app.get('/makecampground',async (req,res)=>{
    //6、创建Campground的实例
    const camp = new Campground({title:'My Backyard',
    description:'Free'
});
    //7、向campground collection添加一个对象，类似向表中添加一条record
    await camp.save();
    res.send(camp)
})
app.listen(3000,()=>{
    console.log('Serving on port 3000')
})

