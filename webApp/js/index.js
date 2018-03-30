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
                {id:0,name:"最新",sort:"create_time",active:true},
                {id:1,name:"最热",sort:"heat",active:false}
            ]
        },
        methods:{
            /**
             * @desc 切换排序选项卡
             * @author liduowei
             * @date 2018-03-30 17:15:23
             * @param item {Object}:当前选择排序项
             */
            toggle_search_type(item){
                this.searchCard.map(item_s=>{
                    item_s.active = (item.id === item_s.id);
                });
                this.sortByCol(item);
            },
            /**
             * @desc 排序
             * @author liduowei
             * @date 2018-03-30 17:40:46
             * @param item {Object}:当前选择排序项
             */
            sortByCol(item){
                //默认最新排序
                item = item || this.searchCard[0];
                //排序
                this.list  = this.list.sort((a,b)=>{
                    return b[item.sort] > a[item.sort];
                });
            }
        },
        mounted: function () {
            let that = this,
                load = layer.load(2);
            mx.http_post({
                url:"/system/article_list",
                layer:load,
                callback(res){
                    that.list = res.data.data;
                    that.sortByCol();
                }
            });
        },
        components:{
            "my-article":{
                props:["article"],
                template:"<fieldset class='layui-elem-field'>" +
                "<legend>" +
                    "<img :src='article.avatar' alt=''>" +
                    "<span>{{article.account}}</span>" +
                    "<span style='margin-left: 15px'>收获点赞: {{article.heat}}</span>" +
                "</legend>"+
                "<div class='layui-field-box'>" +
                    "<h4>{{article.title}}</h4>"+
                    "<p>{{article.content}}</p>"+
                    "<p>{{article.create_time}}</p>"+
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