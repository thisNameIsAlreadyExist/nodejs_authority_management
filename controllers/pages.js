"use strict";
function render(req,res,url,acs_type){
    let user = req.session.user,
        list = (()=>{
            let m_l = user ? user.menu_ath_list : [],
                m_c = user ? user.menu_c :[];
            return m_c.concat(m_l);
        })();

    list.map((item,i)=>{
        let req_path = "/html"+(acs_type ? "/"+acs_type : "")+req.url;
        if(req_path === item.path){
            item.current = 1;
        }else item.current = 0;
    });
    res.render(url,{
        list:list,
        user:user || {}
    });
}

exports.index = (req,res)=>{
    render(req,res,"./index/index.html");
};

exports.admin_user = (req,res)=>{
    render(req,res,"./user/user.html","admin");
};

exports.admin_article = (req,res)=>{
    render(req,res,"./article/article.html","admin");
};

exports.admin_authority = (req,res)=>{
    render(req,res,"./authority/authority.html","admin");
};

exports.myblog = (req,res)=>{
    render(req,res,"./user/myblog.html","admin");
};

exports.layui = (req,res)=>{
    render(req,res,"./layui.html");
};