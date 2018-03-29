"use strict";
/*layui配置*/
layui.config({
    base:"/plugin/"
}).extend({
    myExtend:"myExtend"
});

/*模块最好一次性加载完,便于维护*/
layui.use(['element','layer','myExtend'], function(){
    let layer = layui.layer,
        layui_mx = layui.myExtend,  //一个自定义的扩展模块
        jq = layui.jquery;

    /*初始化页面高度*/
    layui_mx.pageHeight(jq);
    /*页面尺寸发生变化时重置页面高度*/
    window.onresize = layui_mx.pageHeight(jq);

    /*用户未登录*/
    if(jq("#login").length){
        /*登录*/
        new Vue({
            el:"#login",
            methods:{
                show_login(){
                    layer.open({
                        type:1,
                        btn:["登录","取消"],
                        btnAlign:"c",
                        title:"登录",
                        content:"<div style='padding: 20px 100px;'>" +
                        '<div><input type="text" name="username"></div>' +
                        '<div><input type="password" name="password"></div>' +
                        "</div>",
                        id:"login-pop",
                        yes(){
                            var username = jq("#login-pop input[name=username]").val(),
                                password = jq("#login-pop input[name=password]").val();
                            /*请求登录接口*/
                            axios({
                                url:"/system/login",
                                method:"post",
                                data:{
                                    username:username,
                                    password:password
                                }
                            }).then(
                                res=>{
                                    /*登录失败*/
                                    if(res.data.errcode){
                                        layui_mx.normal_open(
                                            res.data.errmsg,
                                            "layer-login"
                                        );
                                    }
                                    /*登陆成功,重载首页*/
                                    else{
                                        location.href = "/html/index";
                                    }
                                }
                            ).catch(err=>{
                                layui_mx.normal_open(
                                    "发生错误: "+err,
                                    "layer-login"
                                );
                            });
                        }
                    });
                }
            }
        });
    }

    /*用户已登录*/
    if(jq("#logout").length){
        /*退出登录*/
        let logout = new Vue({
            el:"#logout",
            methods:{
                logout(){
                    axios({
                        url:"/system/logout",
                        method:"post"
                    }).then(
                        res=>{
                            layer.msg(
                                res.data.errmsg,
                                {
                                    icon:1,
                                    id:"layer-logout",
                                    time:1500,
                                    shade:1
                                },
                                ()=>{
                                    location.href = "/html/index"
                                }
                            );
                        }
                    ).catch(err=>{
                        layui_mx.normal_open(
                            "发生错误: "+err,
                            "layer-logout"
                        );
                    });
                }
            }
        });
    }
});