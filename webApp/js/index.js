"use strict";
layui.use(['element','layer','myExtend','carousel'], function () {
    let layer = layui.layer,
        mx = layui.myExtend,
        carousel = layui.carousel;

    /*轮播*/
    carousel.render({
        elem:"#banner",
        arrow:"hover",
        width:"100%"
    });

    let article_list = new Vue({
        el:"#article-list",
        data:{
            list:[],
            searchCard:[
                {id:0,name:"最新",active:true},
                {id:1,name:"最热",active:false}
            ]
        },
        methods:{
            toggle_search_type(index){
                this.searchCard.map((item,idx)=>{
                    item.active = (index === idx);
                });
            }
        },
        mounted: function () {
            let that = this;
            axios({
                url:"/system/article_list",
                method:"post"
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
                template:"<fieldset class='layui-elem-field'>" +
                "<legend>" +
                    "<img :src='article.avatar' alt=''>" +
                    "<span>{{article.account}}</span>" +
                "</legend>"+
                "<div class='layui-field-box'>" +
                    "<h4>{{article.title}}</h4>"+
                    "<p>{{article.content}}</p>"+
                "</div>"+
                "</fieldset>"
            },
            "search-card":{
                props:["item"],
                template:"<li :class='{active:item.active}' @click='$emit(\"toggle\")'>{{item.name}}</li>"
            }
        }
    });
});