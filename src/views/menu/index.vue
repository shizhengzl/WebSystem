
<template>
  <div class="app-container">
    <div class="dialog-toolbar">
      <LinkButton iconCls="icon-add" :plain="true">添加</LinkButton>
      <LinkButton iconCls="icon-edit" :plain="true">修改</LinkButton>
      <LinkButton iconCls="icon-remove" :plain="true">删除</LinkButton>
      <LinkButton iconCls="icon-help" :plain="true">Help</LinkButton>
    </div>

    <el-button type="primary" icon="el-icon-edit"></el-button>
    <el-button type="primary" icon="el-icon-share"></el-button>
    <el-button type="primary" icon="el-icon-delete"></el-button>
    <el-button type="primary" icon="el-icon-search">搜索</el-button>

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
        header:[],
        data: []
      }
    },
    // 方法
    methods: {
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
