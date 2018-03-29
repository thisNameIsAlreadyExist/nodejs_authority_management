"use strict";layui.use(["layer","myExtend","form"],function(){layui.layer;var i=layui.form,n=(layui.jquery,layui.myExtend);new Vue({el:"#role-list",data:{list:[],handle:[],menu:[],user_id:0,update_handle:0,update_menu:0},methods:{handle_authority:function(e){var t=[],n=(null===e.handle?"0":e.handle).split("");this.update_handle=1;for(var a=0,l=this.handle.length;a<l;a++)t.push(this.handle[a]),n[a]&&1==+n[a]?t[a].checked=1:t[a].checked=0;this.handle=t,this.$nextTick(function(){i.render("checkbox","handle-list")})},menu_authority:function(e){this.update_menu=1}},components:{"my-role":{props:["role","handle"],template:"<li>{{role.name}} <button @click='$emit(\"handle_authority\")'>配置操作权限</button><button @click='$emit(\"menu_authority\")'>配置菜单权限</button></li>"},"handle-list":{props:["handle"],data:function(){return{checkboxs:[]}},template:'<input type="checkbox" v-model="handle.checked" lay-skin="primary"  @change="handle.checked=!handle.checked" :title="handle.name">'},"menu-list":{props:["menu"],data:function(){return{checkboxs:[]}},template:'<input type="checkbox" v-model="checkboxs" lay-skin="primary" :title="menu.name">'}},mounted:function(){var t=this;axios({url:"/system/admin/role_list",method:"post"}).then(function(e){e.data.errcode?n.normal_open(e.data.errmsg,"layer-role-list"):(t.list=e.data.data.role,t.handle=e.data.data.handle.map(function(e){return e.checked=0,e}),t.menu=e.data.data.menu.map(function(e){return e.checked=0,e}))}).catch(function(e){n.normal_open("发生错误: "+e,"layer-role-list")})}})});