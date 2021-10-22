
<template>
  <div class="app-container">
    <div class="dialog-toolbar">
      <LinkButton iconCls="icon-add" :plain="true" @click="create()">添加</LinkButton>
      <LinkButton iconCls="icon-edit" :plain="true" @click="modify()">修改</LinkButton>
      <LinkButton iconCls="icon-remove" :plain="true">删除</LinkButton>
      <SearchBox style="width:300px"
                 placeholder="搜索"
                 v-model="searchvalue"
                 @search="onSearch($event)">
      </SearchBox>
      <LinkButton iconCls="icon-help" :plain="true">Help</LinkButton>
    </div>

    <TreeGrid :data="data" style="height:250px" idField="id"
              checkbox
              cascadeCheck ="false"
              treeField="menuName" ref="grids">
      <template v-for="(item,index) in header">
        <GridColumn :field="item.columnName"
                    :title="item.columnDescription || item.columnName"></GridColumn>
      </template>
    </TreeGrid>

    <Dialog :title="'添加菜单'" ref="dialogs"
            :dialogStyle="{width:'550px',height:'350px'}"
            :modal="true"
             closed
            :draggable="true"
            :resizable="true"> 
      <Form ref="form" :model="menus" :rules="rules" @validate="errors=$event">
        <div style="margin:20px">
          <TextBox inputId="menuName" name="menuName" v-model="menus.menuName" v-Tooltip="getTipOpts('menuName')" style="width:200px">
            <Addon align="left">
              <LinkButton :btnStyle="{borderRadius:0,borderWidth:'0 1px 0 0',width:'70px',height:'30px'}">菜单名称</LinkButton>
            </Addon>
          </TextBox>
          <span style="margin-left:30px;"></span>

          <ComboTree style="width:200px"
                     v-model="menus.menuId"
                     :data="data"
                     :multiple="false"
                     valueField="id"
                     textField="menuName" >
            <Tree slot="tree">
              <template slot-scope="{node}">
                <span> {{node.menuName}}</span> 
              </template>

            </Tree>
          </ComboTree>
          <!--<TextBox inputId="menuId" name="menuId" v-model="menus.menuId" v-Tooltip="getTipOpts('menuId')" style="width:200px">
    <Addon align="left">
      <LinkButton :btnStyle="{borderRadius:0,borderWidth:'0 1px 0 0',width:'70px',height:'30px'}">父级菜单</LinkButton>
    </Addon>
  </TextBox>-->
        </div>
        <div style="margin:20px">
          <TextBox inputId="path" name="path" v-model="menus.path"    style="width:200px">
            <Addon align="left">
              <LinkButton :btnStyle="{borderRadius:0,borderWidth:'0 1px 0 0',width:'70px',height:'30px'}">菜单路劲</LinkButton>
            </Addon>
          </TextBox>
          <span style="margin-left:30px;"></span>
          <TextBox inputId="component" name="component" v-model="menus.component"   style="width:200px">
            <Addon align="left">
              <LinkButton :btnStyle="{borderRadius:0,borderWidth:'0 1px 0 0',width:'70px',height:'30px'}">菜单组件</LinkButton>
            </Addon>
          </TextBox>
        </div>
        <div style="margin:20px">
          <TextBox inputId="menuIcon" name="menuIcon" v-model="menus.menuIcon"  style="width:200px">
            <Addon align="left">
              <LinkButton :btnStyle="{borderRadius:0,borderWidth:'0 1px 0 0',width:'70px',height:'30px'}">菜单图标</LinkButton>
            </Addon>
          </TextBox>
          <span style="margin-left:30px;"></span>
          <TextBox inputId="sort" name="sort" v-model="menus.sort" style="width:200px">
            <Addon align="left">
              <LinkButton :btnStyle="{borderRadius:0,borderWidth:'0 1px 0 0',width:'70px',height:'30px'}">菜单排序</LinkButton>
            </Addon>
          </TextBox>
        </div>
        <div style="margin:20px">
          <SwitchButton inputId="isDefault" v-model="menus.isDefault" onText="默认菜单" offText="非默认菜单" style="width:200px;">
          </SwitchButton>
          <span style="margin-left:30px;"></span>
          <SwitchButton inputId="isSupper" name="isSupper" v-model="menus.isSupper" onText="超级管理员菜单" offText="非超级管理员菜单" style="width:200px;">
          </SwitchButton>
        </div>
      </Form>
      <template slot="footer">
        <div class="dialog-button">
          <LinkButton style="width:80px" iconCls="icon-cancel" @click="$refs.dialogs.close()">Close</LinkButton>
          <LinkButton style="width:80px" iconCls="icon-save" @click="">Save</LinkButton>
        </div>
      </template>
    </Dialog>
  </div>
</template>
<script>
  import { GetListHeader, GetSupperMenus } from '@/api/menus'
  export default {
    // 初始化
    mounted() {
      this.getHeader();
      this.GetSupperMenus();
    },
    data() {
      return {
        searchvalue: "",
        rules: {
          menuName: {
            required: true,
            length:[5,10] 
          }
        },
        errors: {},
        menus: {},
        header:[],
        data: []
      }
    },
    // 方法
    methods: {
      create: function () {
        this.$refs.dialogs.open();
      },
      modify: function () {
        this.$refs.dialogs.open();
        debugger
        var selected = this.$refs.grids.getSelectedRows('checked');
        debugger
      },
      getTipOpts(name) {
        return {
          content: this.getError(name),
          closed: !!!this.hasError(name),
          position: "right"
        };
      },
      getError(name) {
        return this.errors[name] && this.errors[name].length
          ? this.errors[name][0]
          : null;
      },
      hasError(name) { 
        return !!this.getError(name);
      },
      getHeader: function () {
        const owner = this
        GetListHeader().then(response => {
          owner.header = response.data
        })
      },
      GetSupperMenus: function () {
        const owner = this
        GetSupperMenus().then(response => {
          owner.data = response.data
        })
      },
    }
  }
</script>
