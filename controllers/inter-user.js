"use strict";
const config = require("./configs"),
      _toString = Object.prototype.toString;

/*添加文章*/
exports.add_article = (req,res)=>{
    res.send({
        errcode:0,
        errmsg:"操作成功!",
        data:[]
    });
};

/*删除文章*/
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