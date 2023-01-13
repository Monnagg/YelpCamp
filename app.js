const express = require("express");
const app = new express();
//2.引入path模块
const path = require("path");

//1.把ejs设为view engine
app.set('view engine','ejs');
//3.设置 views 文件夹为存放view文件的目录, 即存放模板文件的地方,
//__dirname 为全局变量,存储当前正在执行的脚本所在的目录
app.set('views',path.join(__dirname,'views'))


app.get('/',(req,res)=>{
    //4、渲染并发送页面,send里面填views文件夹下的ejs文件，这里可以省略文件类型ejs
    res.render("home")
})

app.listen(3000,()=>{
    console.log('Serving on port 3000')
})

