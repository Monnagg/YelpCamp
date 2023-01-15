const express = require("express");
const mongoose  = require("mongoose");
const path = require("path");
const app = new express();

const Campground = require('./models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser:true,
   
});
const db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error:'));
db.once('open',()=>{
    console.log('Dabase connected');
});

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))

//5、添加middleware解析req.body
app.use(express.urlencoded({ extended: true }))

app.get('/',(req,res)=>{
    res.render("home")
})
//1、创建campgrounds的get route
app.get('/campgrounds',async (req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds})
})

//3、实现campgrounds/new route
//要把这route放在campgrounds/show 之前，不然new会被认为是id
app.get('/campgrounds/new',(req,res)=>{
    res.render('campgrounds/new',{})
})
//4、为campgrounds/new里的form设置相应的post route
//campgrounds接受表单信息
app.post('/campgrounds',async (req,res)=>{
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
})

//2、实现campgrounds/show route来显示campground的详细信息
app.get('/campgrounds/:id',async (req,res)=>{
    //findById通过_id查询document，
    //params获取url链接上传递的数据参数
    const campground =await Campground.findById(req.params.id);
    res.render('campgrounds/show',{campground});
})



app.get('/makecampground',async (req,res)=>{
    const camp = new Campground({title:'My Backyard',
    description:'Free'
});
    await camp.save();
    res.send(camp)
})
app.listen(3000,()=>{
    console.log('Serving on port 3000')
})

