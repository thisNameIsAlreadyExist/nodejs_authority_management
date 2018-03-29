"use strict";
const config = require("./configs"),
      _toString = Object.prototype.toString;

/*模拟添加文章*/
exports.add_article = (req,res)=>{
    res.send({
        errcode:0,
        errmsg:"操作成功!",
        data:[]
    });
};

/*模拟删除文章*/
exports.delete_article = (req,res)=>{
    let user_id = req.session.user.id || 0,
        article_id = req.body.article_id || 0;
    /*参数有误*/
    if(!user_id || !article_id) return res.send(config.params_error);
    let sql = 'update am_user_article set status=2,handled_by=? where id=?',
        pro = config.getPromise(sql,[user_id,article_id]);
    pro.then(
        data=>{
            if(data.affectedRows === 1){
                res.send({
                    errcode:0,
                    errmsg:"操作成功!",
                    data:[]
                });
            }else{
                res.send({
                    errcode:1,
                    errmsg:"操作失败!",
                    data:[]
                });
            }
        }
    ).catch(err=>{
        config.pro_error("delete_article",err,res);
    });
};

/*用户列表*/
exports.user_list = (req,res)=>{
    let sql = `select id,account name,status from am_sys_user where user_role<>1`;
    config.getPromise(sql,[]).then(
        data=>{
            return res.send({
                errcode:0,
                errmsg:"获取列表成功!",
                data:data
            });
        }
    ).catch(err=>{
        config.pro_error("user_list",err,res);
    });
};

/*将用户加入小黑屋*/
exports.set_freeze = (req,res)=>{
    let handle_user_id = req.session.user.id,
        user_id = req.body.user_id || 0,
        handle_type = req.body.type || 0;

    /*参数有误*/
    if(!handle_user_id || !user_id) return res.send(config.params_error);

    let sql = "update am_sys_user asu set asu.status=?,asu.handled_by=? where id=?";
    config.getPromise(sql,[handle_type,handle_user_id,user_id]).then(
        data=>{
            if(data.affectedRows === 1){
                res.send({
                    errcode:0,
                    errmsg:"操作成功!",
                    data:[]
                });
            } else{
                res.send({
                    errcode:1,
                    errmsg:"操作失败!",
                    data:[]
                });
            }
        }
    ).catch(err=>{
        config.pro_error("set_freeze",err,res);
    });
};


/*获取角色列表*/
exports.role_list = (req,res)=>{
    let sql = "select " +
            "aur.id,role_name name,aua.handle_authority handle,aua.menu_authority menu " +
            "from am_user_roles aur LEFT JOIN am_user_authority aua " +
            "on aur.role_authority=aua.id where aur.id>1",
        pro = config.getPromise(sql,[]);

    pro.then(
        data=>{
            res.send({
                errcode:0,
                errmsg:"获取角色列表成功!",
                data:{
                    role:data,
                    handle:req.session.user.handle_ctr_list,
                    menu:req.session.user.menu_ctr_list
                }
            });
        }
    ).catch(err=>{
        config.pro_error("role_list",err,res);
    });
};

/*更改角色权限*/
exports.update_role_authority = (req,res)=>{

};