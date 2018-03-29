"use strict";
const config = require("./configs"),
      m_user = require("./menus/user"),
      _toString = Object.prototype.toString;


/*登录*/
exports.login = (req,res)=>{
    let username = req.body.username,
        password = req.body.password;
    /*参数有误*/
    if(!username || !password) return res.send(config.params_error);
    let sql = ` select
                asu.id, asu.account, asu.password, asu.user_role role,
                aua.handle_authority handle, aua.menu_authority menu
                FROM am_sys_user asu
                LEFT JOIN am_user_roles aur ON asu.user_role = aur.id
                LEFT JOIN am_user_authority aua ON aur.role_authority = aua.id
                WHERE asu.status=0 and asu.account = ?`,
        sql_menu = `select menu_name name,menu_path path from am_menus_config`,
        sql_handle = `select interface_name name,interface_path path from am_interfaces_config`,
        pro_menu = config.getPromise(sql_menu,[]), //菜单列表
        pro_handle = config.getPromise(sql_handle,[]), //操作接口列表
        pro_user = config.getPromise(sql,username); //登录用户

    Promise.all([pro_user,pro_handle,pro_menu]).then(
        ([data_user,data_handle,data_menu])=>{
            let res_err = {
                    errcode:1,
                    data:[]
                };
            /*有该用户*/
            if(data_user.length){
                let password_encrypt = config.encrypt(password), //加密密码
                    user = data_user[0], //*防止有多位账户相同的用户*/
                    password_sql = user.password;

                /*密码正确,登录成功*/
                if(password_encrypt === password_sql){
                    let user_role = +user.role || 0,
                        menu = [],
                        handle = [],
                        rs_user = req.session.user;
                    /*超级管理员*/
                    if(user_role === 1){
                        menu = data_menu;
                        handle = data_handle;
                    }else{
                        menu = config.authority(data_menu,user.menu);
                        handle = config.authority(data_handle,user.handle);
                    }
                    req.session.user = Object.assign({},rs_user,{
                        name:user.account,
                        id:user.id,
                        role:user_role,
                        handle_ctr_list:data_handle,  //操作权限控制列表
                        menu_ctr_list:data_menu,  //菜单权限控制列表
                        handle_ath_list:handle, //有权限的操作权限列表  user.handle
                        menu_ath_list:menu //有权限的菜单访问权限列表   user.menu
                    });
                    return res.send({
                        errcode:0,
                        errmsg:"登录成功!",
                        data:[]
                    });
                }else{
                    res_err.errmsg = "密码错误!";
                    return res.send(res_err);
                }
            }else{
                res_err.errmsg = "无该用户!";
                return res.send(res_err);
            }
        }
    ).catch(err=> {
        config.pro_error("login",err,res);
    });
};

/*退出登录*/
exports.logout = (req,res)=>{
    req.session.user = null;
    return res.send({
        errcode:0,
        errmsg:"退出成功!",
        data:[]
    });
};

/*帖子列表*/
exports.article_list = (req,res)=>{
    let user = req.body.user || 0,
        user_id = req.session.user.id,
        condition = [];
    let sql = ` select aua.id,aua.user_id,aua.article_title title,aua.article_content content,asu.avatar,asu.account
                from am_user_article aua left join am_sys_user asu on aua.user_id=asu.id where aua.status=1`;  //只获取状态正常的帖子
    if(user) {
        sql += " and user_id=?";
        condition.push(user_id);
    }
    config.getPromise(sql,condition).then(
        data=>{
            return res.send({
                errcode:0,
                errmsg:"获取列表成功!",
                data:data
            });
        }
    ).catch(err=>{
        config.pro_error("article_list",err,res);
    });
};
