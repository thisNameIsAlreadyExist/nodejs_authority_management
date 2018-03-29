"use strict";
layui.use(["layer","myExtend"], function () {
    let layer = layui.layer,
        mx = layui.myExtend;

    /*获取用户发帖*/
    new Vue({
        el:"#article-list",
        data:{
            list:[]
        },
        methods:{
            remove(item,index){
                //新建一个确认删除弹窗
                let layer_confirm = mx.normal_open(
                    "确认删除吗?",
                    "layer-delete-article",
                    ()=>{
                        //关闭确认删除弹窗
                        layer.close(layer_confirm);
                        /*新建一个loading弹窗*/
                        let layer_load = layer.load(2);

                        axios({
                            url:"/system/user/delete_article",
                            method:"post",
                            data:{
                                article_id:item.id
                            }
                        }).then(res=>{
                            //关闭加载弹窗
                            layer.close(layer_load);

                            console.log(res);
                            /*删除失败*/
                            if(res.data.errcode){
                                mx.normal_open(
                                    res.data.errmsg,
                                    "layer-delete-article"
                                );
                            }
                            /*删除成功*/
                            else{
                                this.list.splice(index,1);
                            }
                        }).catch(err=>{
                            layer.close(layer_load);
                            mx.normal_open(
                                "发生错误: "+err,
                                "layer-delete-article"
                            );
                        });
                    },
                    ["确认","取消"]
                );
            }
        },
        mounted(){
            let that = this;
            axios({
                url:"/system/article_list",
                method:"post",
                data:{
                    user:1 //获取单个用户的发帖
                }
            }).then(
                res=>{
                    if(res.data.errcode){
                        mx.normal_open(
                            res.data.errmsg,
                            "layer-article-list"
                        );
                    }else{
                        that.list = res.data.data;
                    }
                }
            ).catch(err=>{
                mx.normal_open(
                    "发生错误: "+err,
                    "layer-article-list"
                );
            });
        },
        components:{
            "my-article":{
                props:["article"],
                template:"<li>" +
                "<h2>{{article.title}}  <button @click='$emit(\"remove\")'>删除</button></h2>"+
                "<article>{{article.content}}</article>"+
                "</li>"
            }
        }
    });
});