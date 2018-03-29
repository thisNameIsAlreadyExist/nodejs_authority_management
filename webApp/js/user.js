"use strict";
layui.use(['layer','myExtend'], function () {
    let layer = layui.layer,
        mx = layui.myExtend;

    new Vue({
        el:"#user-list",
        data:{
            list:[]
        },
        methods:{

        },
        components:{
            "my-user":{
                props:["user"],
                template:"<li>" +
                "<span class='user-name'>{{user.name}}</span>" +
                "<button class='layui-btn layui-btn-xs' v-if='!user.status' @click='setfreeze(1)'>加入小黑屋</button>" +
                "<button class='layui-btn layui-btn-xs' v-if='user.status' @click='setfreeze(0)'>释放他</button>" +
                "</li>",
                methods:{
                    setfreeze: function (type) {
                        let _this = this,
                            handle_type = type || 0,
                            item = this.$props.user,
                            user_id = item.id;

                        /*loading*/
                        let load = layer.load(2);
                        axios({
                            url:"/system/admin/set_freeze",
                            method:"post",
                            data:{
                                user_id:user_id,
                                type:handle_type
                            }
                        }).then(
                            res=>{
                                layer.close(load);
                                if(!res.data.errcode){
                                    item.status = handle_type;
                                }
                                mx.normal_open(
                                    res.data.errmsg,
                                    "layer-set-freeze"
                                );
                            }
                        ).catch(err=>{
                            layer.close(load);
                            mx.normal_open(
                                "发生错误: "+err,
                                "layer-set-freeze"
                            );
                        });
                    }
                }
            }
        },
        created: function () {
            let that = this;
            axios({
                url:"/system/admin/user_list",
                method:"post"
            }).then(
                res=>{
                    if(res.data.errcode){
                        mx.normal_open(
                            res.data.errmsg,
                            "layer-user-list"
                        );
                    }else{
                        that.list = res.data.data;
                    }
                }
            ).catch(err=>{
                mx.normal_open(
                    "发生错误: "+err,
                    "layer-user-list"
                );
            });
        }
    });

});