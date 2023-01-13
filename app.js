//1. 引入express
const express = require("express");
//2.创建server 实例
const app = new express();
//4.为port 3000/根目录/入口文件创建route处理get请求
app.get('/',(res,rep)=>{
    //发送string
    rep.send("Hello, this is yelpCamp")
})

//3、开启监听器
app.listen(3000,()=>{
    console.log('Serving on port 3000')
})

