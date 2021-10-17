
<template>
  <div class="app-container">
    <div class="dialog-toolbar">
      <LinkButton iconCls="icon-add" :plain="true" @click="$refs.dialogs.open()">添加</LinkButton>
      <LinkButton iconCls="icon-edit" :plain="true">修改</LinkButton>
      <LinkButton iconCls="icon-remove" :plain="true">删除</LinkButton>
      <SearchBox style="width:300px"
                 placeholder="搜索"
                 v-model="value"
                 @search="onSearch($event)">

      </SearchBox>

      <LinkButton iconCls="icon-help" :plain="true">Help</LinkButton>
    </div>



    <TreeGrid :data="data" style="height:250px" idField="id" treeField="menuName">

      <template v-for="(item,index) in header">
        <GridColumn :field="item.columnName"
                    :title="item.columnDescription || item.columnName"></GridColumn>
      </template>

      <!--<GridColumn field="itemid" title="Item ID"></GridColumn>
    <GridColumn field="name" title="Name"></GridColumn>
    <GridColumn field="listprice" title="List Price" align="right"></GridColumn>
    <GridColumn field="unitcost" title="Unit Cost" align="right"></GridColumn>
    <GridColumn field="attr" title="Attribute" width="30%"></GridColumn>
    <GridColumn field="status" title="Status" align="center"></GridColumn>-->
    </TreeGrid>


    <Dialog :title="'添加菜单'" ref="dialogs"
            :dialogStyle="{width:'600px',height:'500px'}"
            :modal="true"
             closed="true"
            :draggable="true"
            :resizable="true">

      <Form ref="form" :model="menus" :rules="rules" @validate="errors=$event">
        <div style="margin:20px">
          <TextBox inputId="menuName" name="menuName" v-model="menus.menuName" v-Tooltip="getTipOpts('menuName')">
            <Addon align="left">
              <LinkButton :btnStyle="{borderRadius:0,borderWidth:'0 1px 0 0',width:'70px',height:'30px'}">菜单名称</LinkButton>
            </Addon>
          </TextBox>

          <TextBox inputId="menuId" name="menuId" v-model="menus.menuId" v-Tooltip="getTipOpts('menuId')">
            <Addon align="left">
              <LinkButton :btnStyle="{borderRadius:0,borderWidth:'0 1px 0 0',width:'70px',height:'30px'}">父级菜单</LinkButton>
            </Addon>
          </TextBox>
        </div>

        <div style="margin:20px">
          <TextBox inputId="path" name="path" v-model="menus.path" v-Tooltip="getTipOpts('path')">
            <Addon align="left">
              <LinkButton :btnStyle="{borderRadius:0,borderWidth:'0 1px 0 0',width:'70px',height:'30px'}">菜单路劲</LinkButton>
            </Addon>
          </TextBox>

          <TextBox inputId="component" name="component" v-model="menus.component" v-Tooltip="getTipOpts('component')">
            <Addon align="left">
              <LinkButton :btnStyle="{borderRadius:0,borderWidth:'0 1px 0 0',width:'70px',height:'30px'}">菜单组件</LinkButton>
            </Addon>
          </TextBox>
        </div>

        <div style="margin:20px">
          <TextBox inputId="menuIcon" name="menuIcon" v-model="menus.menuIcon" v-Tooltip="getTipOpts('menuIcon')">
            <Addon align="left">
              <LinkButton :btnStyle="{borderRadius:0,borderWidth:'0 1px 0 0',width:'70px',height:'30px'}">菜单图标</LinkButton>
            </Addon>
          </TextBox>

          <TextBox inputId="sort" name="sort" v-model="menus.sort" v-Tooltip="getTipOpts('sort')">
            <Addon align="left">
              <LinkButton :btnStyle="{borderRadius:0,borderWidth:'0 1px 0 0',width:'70px',height:'30px'}">菜单排序</LinkButton>
            </Addon>
          </TextBox>
        </div>


        <div style="margin:20px">
          <CheckBox inputId="isDefault" name="isDefault" v-model="menus.isDefault">
            <Addon align="left">
              <LinkButton :btnStyle="{borderRadius:0,borderWidth:'0 1px 0 0',width:'70px',height:'30px'}">默认菜单</LinkButton>
            </Addon>
          </CheckBox>

          <CheckBox inputId="isSupper" name="isSupper" v-model="menus.isSupper">
            <Addon align="left">
              <LinkButton :btnStyle="{borderRadius:0,borderWidth:'0 1px 0 0',width:'70px',height:'30px'}">超级管理员菜单</LinkButton>
            </Addon>
          </CheckBox>
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
        errors: {},
        menus: {},
        header:[],
        data: []
      }
    },
    // 方法
    methods: {
      getTipOpts(name) {
        return {
          content: this.getError(name),
          closed: !this.hasError(name),
          position: "right"
        };
      },
      getError(name) {
        return this.errors[name] && this.errors[name].length
          ? this.errors[name][0]
          : null;
      },
      hasError(name) {
        return this.getError(name) != null;
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
