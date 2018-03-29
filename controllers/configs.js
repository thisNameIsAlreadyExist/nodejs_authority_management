"use strict";

const mysql = require("mysql"),
      crypto = require("crypto"),
      fs = require("fs"),
      m_base = require("./menus/base");

/*promise处理函数*/
exports.getPromise = (sql,condition)=>{
    let connect = mysql.createConnection({
        host:"127.0.0.1",
        user:"root",
        password:"Zw9930827",
        database:"authorityManagement",
        port:"3306"
    });
    return new Promise((resolve,reject)=>{
        connect.connect();
        connect.query(sql,condition,(err,data)=>{
            /*查询失败*/
            if(err){
                reject(err);
            }else{
                resolve(data);
            }
        });
        connect.end();
    });
};

/*用户密码加密*/
exports.encrypt = (origin) => {
    //20次MD5加密
    let pass_md5 = origin;
    for(let i=0;i<20;i++){
        let md5 = crypto.createHash("md5");
        pass_md5 = md5.update(pass_md5).digest("hex");
    }
    return pass_md5;
};

//错误处理
/*
 * params name: 接口名
 * params err: 错误信息
 * params time: 发生错误时间
 * */
exports.interfaceError = (name,err,time) => {
    fs.appendFileSync("./logs/interface-err.txt",
        `接口: ${name} 于: ${time} 发生错误,错误信息: ${err} \n`);
};

/*参数错误*/
exports.params_error = {
    errcode:1,
    errmsg:"请传入正确的参数!",
    data:[]
};

/*promise出现未捕获错误
 * params inter:接口名
 * params err:错误信息
 * params res:返回体
 * */
exports.pro_error = (inter,err,res)=>{
    exports.interfaceError(inter,err,new Date().toLocaleString());
    res.send({
        errcode:1,
        errmsg:"发生错误!",
        data:[]
    });
};

/*promise reject
 * params inter:接口名
 * params err:错误信息
 * params res:返回体
 * params msg:返回错误信息
 * */
exports.pro_reject = (inter,err,res,msg)=>{
    exports.interfaceError(inter,err,new Date().toLocaleString());
    res.send({
        errcode:1,
        errmsg:msg,
        data:[]
    });
};

exports.authority = (orilist,authority)=>{
    let authority_arr = (authority === null ? "0" : authority).split(""),
        authority_list = []; //有权限访问的列表

    /*筛选出有权限访问的列表*/
    orilist.map((item,index)=>{
        if(authority_arr[index] && +authority_arr[index] === 1){
            authority_list.push(item);
        }
    });

    return authority_list;
};


/*菜单权限管理*/
exports.menu_authority = (req,res,next)=>{
    let url = req.url,
        menu = req.session.user.menu_ath_list,
        menu_list = req.session.user.menu_ctr_list,
        is_in_menu_list = menu_list.filter(item=>{
            return item.path === url;
        });

    /*不在访问控制名单内*/
    if(!is_in_menu_list.length){
        next();
    }else{
        let is_in_menu = menu.filter(item=>{
            return item.path === url;
        });
        /*无权限返回返回404*/
        if(!is_in_menu.length) return res.render("404.html");
        /*有权限访问*/
        else next();
    }
};

/*操作权限管理*/
exports.handle_authority = (req,res,next)=>{
    let url = req.url,
        handle = req.session.user.handle_ath_list,
        handle_list = req.session.user.handle_ctr_list,
        is_in_handle_list = handle_list.filter(item=>{
            return item.path === url;
        });

    /*不在访问控制名单内*/
    if(!is_in_handle_list.length){
        next();
    }else{
        let is_in_handle = handle.filter(item=>{
            return item.path === url;
        });
        /*无权限返回返回404*/
        if(!is_in_handle.length){
            return res.send({
                errcode:1,
                errmsg:"您没有该操作的权限!",
                data:[]
            });
        }
        /*有权限访问*/
        else next();
    }
};

/*用户是否已登录*/
exports.isUserLogin = (req,res,next)=>{
    if(req.method === 'GET'){
        let user = req.session.user;
        /*用户已登录,需按角色权限展示相应内容*/
        if(user && user.role !== undefined){
            exports.menu_authority(req,res,next);
        }
        /*用户未登录*/
        else {
            /*未登录还想看其他,-_-||,不给看*/
            if(req.url !== "/html/index") return res.redirect("/html/index");
            else next();
        }
    }
    /*操作接口*/
    else{
        exports.handle_authority(req,res,next);
    }
};


/*用户未登录时配置默认权限*/
exports.defaultAuthority = (req,res,next)=>{
    req.session.user = {
        handle_ctr_list:[], //操作接口列表
        menu_ctr_list:[], //菜单列表
        menu_ath_list:[], //菜单权限,未登录设为null
        handle_ath_list:[], //操作接口权限,未登录设为null
        menu_c:m_base.menu
    };
    exports.isUserLogin(req,res,next);
};