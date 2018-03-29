"use strict";
const express = require("express"),
      app = express(),
      morgan = require("morgan"),
      bodyParser = require("body-parser"),
      ejs = require("ejs"),
      expressSession = require("express-session"),
      path = require("path"),
      fs = require("fs"),
      router_base = require("./controllers/base"),
      router_admin = require("./controllers/admin"),
      inter_base = require("./controllers/inter-base"),
      inter_user = require("./controllers/inter-user"),
      inter_admin = require("./controllers/inter-admin"),
      config = require("./controllers/configs");

//服务器监听端口
const port = 8080;

/*
开发模式日志打印
*/
app.use(morgan("dev"));
/*
序列化post请求中的数据项
*/
app.use(bodyParser.json());
/*
序列化get请求中的数据项
*/
app.use(bodyParser.urlencoded({extended:true}));
/*
设置视图模板目录为views
*/
app.set("views",path.join(__dirname,"views"));
/*
设置.html为模板
*/
app.engine(".html",ejs.__express);
/*
初始化session
*/
app.use(expressSession({
    secret: 'authorityManagement',
    resave: false,
    saveUninitialized: true, //需要初始化
    cookie: {
        //https请求设置为true
    }
}));
/*
设置静态资源路径
*/
app.use(express.static(__dirname+"/webApp"));
/*
监听端口
*/
app.listen(port, function (err) {
    if(!err) console.log(`server running on port ${port}...`);
});

/*权限配置及路由拦截*/
app.use(function (req,res,next) {
    /*请求html页面或接口做访问控制*/
    if(
        req.url.match(/^\/html/) ||
        req.method === 'POST'
    ){
        /*用户未登录,添加默认权限*/
        if(!req.session.user)
            config.defaultAuthority(req,res,next);
        /*用户已登录,根据用户角色分配权限*/
        else
            config.isUserLogin(req,res,next);
    }else
        next();
});

//首页
app.get("/",(req,res)=>{
    res.redirect("/html/index")
});
//公共界面
app.use('/html', router_base);
//管理员界面
app.use('/html/admin', router_admin);

/*基础级操作,所有用户均可操作*/
app.post("/system/login",inter_base.login);
app.post("/system/logout",inter_base.logout);
app.post("/system/article_list",inter_base.article_list);

/*用户级操作,只允许用户自身操作*/
app.post("/system/user/delete_article",inter_user.delete_article);
app.post("/system/user/add_article",inter_user.add_article);

/*管理员级操作,只有管理员可操作*/
app.post("/system/admin/delete_article",inter_admin.delete_article);
app.post("/system/admin/add_article",inter_admin.add_article);
app.post("/system/admin/user_list",inter_admin.user_list);
app.post("/system/admin/set_freeze",inter_admin.set_freeze);
app.post("/system/admin/role_list",inter_admin.role_list);

/*请求资源未找到*/
app.get("*",(req,res)=>{
    res.render("404.html");
});
app.post("*",(req,res)=>{
    res.send({
        errcode:1,
        errmsg:"请求路径未找到!",
        data:[]
    });
});
