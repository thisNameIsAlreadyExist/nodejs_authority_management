"use strict";

layui.define(function(exports){
    let object = {
        /**
         * @desc 调用一个自定义弹窗
         * @author liduowei
         * @date 2018-03-29 15:43:07
         * @param msg {String}:提示信息
         * @param id {String}:弹窗id(避免弹窗重复)
         * @param callback {Function}:确认回调
         * @param btns {Array | String}:按钮文字
         * @returns {*}
         */
        normal_open(msg,id,callback=null,btns="确认"){
            return layui.layer.open({
                type:1,
                btn:btns,
                btnAlign:"c",
                title:"提示",
                content:"<div style='padding: 20px 100px;'>"+msg+"</div>",
                id:id,
                yes:callback
            });
        },
        /**
         * @desc 设置页面高度
         * @author liduowei
         * @date 2018-03-29 15:45:06
         * @param jq {Object}:jquery
         */
        pageHeight(jq){
            let win_h = window.innerHeight;
            jq("#content").height(win_h-90);
        },
        /**
         * @desc post请求方式的http请求模板
         * @author liduowei
         * @date 2018-03-29 15:45:31
         * @param params {Object}:请求配置参数
         */
        http_post(params){
            let _this = this;
            axios({
                url:params.url,
                method:"post",
                data:params.data || {}
            }).then(res=>{
                //请求失败
                if(res.data.errcode){
                    _this.normal_open(
                        res.data.errmsg,
                        new Date().getTime().toString()
                    );
                }
                //请求成功
                else{
                    params.callback(res);
                }
            }).catch(err=>{
                _this.normal_open(
                    "发生错误: "+err,
                    new Date().getTime().toString()
                );
            });
        }
    };

    exports("myExtend",object);
});