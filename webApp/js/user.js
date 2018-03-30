"use strict";
layui.use(['layer','myExtend'], function () {
    let layer = layui.layer,
        mx = layui.myExtend;

    new Vue({
        el:"#user-list",
        data:{
            list:[]
        },
        components:{
            "my-user":{
                props:["user"],
                template:"<tr>" +
                            "<td class='user-name'>{{user.name}}</td>" +
                            "<td v-if='!user.status'><button class='layui-btn layui-btn-xs' @click='setfreeze(1)'>加入小黑屋</button></td>" +
                            "<td v-else><button class='layui-btn layui-btn-xs' @click='setfreeze(0)'>释放他</button></td>" +
                         "</tr>",
                methods:{
                    /**
                     * @desc 拉黑及释放用户操作
                     * @author liduowei
                     * @date 2018-03-30 11:13:36
                     * @param type
                     */
                    setfreeze: function (type) {
                        let handle_type = type || 0,
                            item = this.$props.user,
                            user_id = item.id;
                        //确认拉黑操作
                        layer.confirm("确认操作?",{title:"提示",icon:3}, function (index) {
                            layer.close(index);
                            /*loading*/
                            let load = layer.load(2);
                            mx.http_post({
                                url:"/system/admin/set_freeze",
                                layer:load,
                                data:{
                                    user_id:user_id,
                                    type:handle_type
                                },
                                callback(res){
                                    item.status = handle_type;
                                    mx.normal_open(
                                        res.data.errmsg,
                                        "layer-set-freeze"
                                    );
                                }
                            });
                        });
                    }
                }
            }
        },
        /**
         * @desc 获取用户列表
         * @author liduowei
         * @date 2018-03-30 11:13:04
         */
        created: function () {
            let that = this;
            mx.http_post({
                url:"/system/admin/user_list",
                callback(res){
                    that.list = res.data.data;
                }
            });
        }
    });

});