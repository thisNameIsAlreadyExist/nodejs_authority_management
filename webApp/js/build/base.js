"use strict";layui.config({base:"/plugin/"}).extend({myExtend:"myExtend"}),layui.use(["element","layer","myExtend"],function(){var n=layui.layer,t=layui.myExtend,o=layui.jquery;if(t.pageHeight(o),window.onresize=t.pageHeight(o),o("#login").length&&new Vue({el:"#login",methods:{show_login:function(){n.open({type:1,btn:["登录","取消"],btnAlign:"c",title:"登录",content:'<div style=\'padding: 20px 100px;\'><div><input type="text" name="username"></div><div><input type="password" name="password"></div></div>',id:"login-pop",yes:function(){var e=o("#login-pop input[name=username]").val(),n=o("#login-pop input[name=password]").val();axios({url:"/system/login",method:"post",data:{username:e,password:n}}).then(function(e){e.data.errcode?t.normal_open(e.data.errmsg,"layer-login"):location.href="/html/index"}).catch(function(e){t.normal_open("发生错误: "+e,"layer-login")})}})}}}),o("#logout").length)new Vue({el:"#logout",methods:{logout:function(){axios({url:"/system/logout",method:"post"}).then(function(e){n.msg(e.data.errmsg,{icon:1,id:"layer-logout",time:1500,shade:1},function(){location.href="/html/index"})}).catch(function(e){t.normal_open("发生错误: "+e,"layer-logout")})}}})});