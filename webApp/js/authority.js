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
            handle:[],
            menu:[],
            current_role:0,
            panel:0
        },
        methods:{
            /**
             * @desc 当前操作权限
             * @author liduowei
             * @date 2018-03-30 13:51:33
             * @param item {Object}:当前选择数据项
             * @param type {String}:当前操作类型
             */
            authority(item,type){
                let authority = (item[type] || "0").split("");
                //切换当前操作角色
                this.current_role = item.id;
                for(let i=0,l=this[type].length;i<l;i++){
                    let item_h = this[type];
                    if(authority[i] && +authority[i] === 1)
                        item_h[i].checked = 1;
                    else{
                        authority[i] = 0;
                        item_h[i].checked = 0;
                    }
                }
                //组合权限,防止出现权限空位
                item[type] = authority.join("");
                this.list_ctr = this[type];
                //弹出修改区域
                this.showModal(item,type);
                //重新渲染form组件
                this.$nextTick(function () {
                    form.render('checkbox',"form-list");
                });
            },
            /**
             * @desc 显示修改权限弹窗
             * @author liduowei
             * @date 2018-03-30 15:04:23
             * @param item {Object}:当前选择数据项
             * @param type {String}:当前操作类型
             */
            showModal(item,type){
                let _this = this,
                    lay_t = layer.open({
                    type:1,
                    title:"修改权限",
                    area:"400px",
                    content:(()=>{
                        let type_arr = _this[type],
                            form = `<form id="form-list" class="layui-form layui-hidden" lay-filter="form-list">
                                        <div class="layui-item">
                                            <div class="layui-input-block">`;
                        //checkbox组
                        for(let i=0,l=type_arr.length;i<l;i++){
                            form += `<input type="checkbox" lay-skin="primary"
                                    ${type_arr[i].checked?"checked":""} title="${type_arr[i].name}">`;
                        }
                        form += `</div></div></form>`;
                        return form;
                    })(),
                    btn:"确认",
                    btnAlign:"c",
                    yes(){
                        _this.update(lay_t,item,type);
                    },
                    id:new Date().getTime().toString()
                });
            },
            /**
             * @desc 更新权限并更新vue data
             * @author liduowei
             * @date 2018-03-30 15:05:41
             * @param lay_t {Number}:layer弹窗索引
             * @param item {Object}:当前选择数据项
             * @param type {String}:当前操作类型
             */
            update(lay_t,item,type){
                let inputs = jq("#form-list .layui-input-block > input"),
                    r_item = item[type].split(""),
                    data = {
                        role:this.current_role
                    };
                //对应vue data
                inputs.map((idx,item_ips)=>{
                    let h_item = this[type][idx],
                        name = jq(item_ips).attr("title");
                    if(name === h_item.name){
                        let i_checked = item_ips.checked ? 1 : 0;
                        h_item.checked = i_checked;
                        r_item[idx] = i_checked;
                    }
                });
                //上传数据
                data[type] = r_item.join("");
                mx.http_post({
                    url:"/system/admin/update_role_authority",
                    data:data,
                    callback(res){
                        layer.close(lay_t);
                        //更新vue data
                        mx.normal_open(
                            res.data.errmsg,
                            new Date().getTime().toString()
                        );
                        item[type] = r_item.join("");
                    }
                });
            }
        },
        components:{
            "my-role":{
                props:["item"],
                template:"<tr>" +
                            "<td v-text='item.name'></td>" +
                            "<td><button class='layui-btn layui-btn-sm' @click='authority(\"handle\")'>修改</button></td>" +
                            "<td><button class='layui-btn layui-btn-sm' @click='authority(\"menu\")'>修改</button></td>"+
                         "</tr>",
                methods:{
                    authority(type){
                        this.$emit("authority",this.item,type);
                    }
                }
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
                    _this.handle = data.handle.map(item=>{
                        item.checked = 0; //默认不选中
                        return item;
                    });
                    //需加权限控制的操作菜单列表
                    _this.menu = data.menu.map(item=>{
                        item.checked = 0; //默认不选中
                        return item;
                    });
                }
            });
        }
    });
});
