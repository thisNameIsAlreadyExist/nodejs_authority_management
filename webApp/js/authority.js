"use strict";

layui.use(['layer','myExtend','form'],()=>{
    let layer = layui.layer,
        form = layui.form,
        jq = layui.jquery,
        mx = layui.myExtend;

    new Vue({
        el:"#role-list",
        data:{
            list_role:[],
            list_ctr_handle:[],
            list_ctr_menu:[],
            list_ctr:[],
            current_role:0,
            panel:0
        },
        methods:{
            authority(item,type){
                let _this = this,
                    authority = (item[type] || "0").split("");
                //切换当前操作角色
                this.current_role = item.id;
                for(let i=0,l=this[type].length;i<l;i++){
                    let item_h = this[type];
                    if(authority[i] && +authority[i] === 1)
                        item_h[i].checked = 1;
                    else
                        item_h[i].checked = 0;
                }
                this.list_ctr = this[type];

                console.log(this.list_ctr,this[type]);

                //弹出修改区域
                let lay_t = layer.open({
                    type:1,
                    title:"修改权限",
                    area:["400px","220px"],
                    offset:"auto",
                    content:jq("#form-list"),
                    btn:"确认",
                    btnAlign:"c",
                    yes(){
                        _this.update(lay_t);
                    },
                    id:new Date().getTime().toString()
                });
                //重新渲染form组件
                this.$nextTick(function () {
                    form.render('checkbox',"form-list");
                });
            },
            update(lay_t){
                console.log("确认更新!");
                layer.close(lay_t);
            }
        },
        components:{
            "my-role":{
                props:["item"],
                template:"<tr>" +
                            "<td v-text='item.name'></td>" +
                            "<td><button class='layui-btn layui-btn-sm' @click='authority(\"list_ctr_handle\")'>修改</button></td>" +
                            "<td><button class='layui-btn layui-btn-sm' @click='authority(\"list_ctr_menu\")'>修改</button></td>"+
                         "</tr>",
                methods:{
                    authority(type){
                        this.$emit("authority",this.item,type);
                    }
                }
            },
            "form-list":{
                props:["handle"],
                data(){
                    return {
                        checkboxs:[]
                    }
                },
                template:'<input type="checkbox" v-model="handle.checked" lay-skin="primary" ' +
                ' @change="handle.checked=!handle.checked" :title="handle.name">'
            },
            "menu-list":{
                props:["menu"],
                data(){
                    return {
                        checkboxs:[]
                    }
                },
                template:'<input type="checkbox" v-model="checkboxs" lay-skin="primary" :title="menu.name">',

            }
        },
        mounted(){
            let _this = this;
            mx.http_post({
                url:"/system/admin/role_list",
                callback(res){
                    let data = res.data.data;
                    //角色列表
                    _this.list_role = data.role;
                    //需加权限控制的操作接口列表
                    _this.list_ctr_handle = data.handle.map(item=>{
                        item.checked = 0; //默认不选中
                        return item;
                    });
                    //需加权限控制的操作菜单列表
                    _this.list_ctr_menu = data.menu.map(item=>{
                        item.checked = 0; //默认不选中
                        return item;
                    });
                }
            });
        }
    });
});
