
<template>
  <div class="app-container">
    <div style="margin-bottom:5px;">
      <el-button type="success" icon="el-icon-circle-plus-outline" @click="create()">添加</el-button>
      <el-button type="primary" icon="el-icon-circle-plus-outline" @click="create()">修改</el-button>
      <el-button type="primary" icon="el-icon-circle-plus-outline" @click="create()">删除</el-button>
      <el-input v-model="filter"
                placeholder="请输入内容"
                style="width:220px;margin-left:5px;"
                prefix-icon="el-icon-search" />
    </div>


    <el-table :data="data" border max-height="800" row-key="id"
              default-expand-all
              :tree-props="{children: 'children'}">

      <el-table-column type="selection"
                       width="55">
      </el-table-column>

      <template v-for="(item,index) in header">
        <el-table-column :prop="item.columnName"
                         :label="item.columnDescription || item.columnName"
                         sortable
                         width="150">
        </el-table-column>
      </template>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini"
                     @click="showcolumn(scope.row)">显示设置</el-button>
        </template>
      </el-table-column>

    </el-table>

    <el-dialog :title="title" :visible.sync="formdialog" :close-on-click-modal="false" :close-on-press-escape="false" @close="reset">
      <el-form id="#create" ref="create" :model="model" :rules="rules" label-width="130px">
        <el-form id="#create" ref="create" :model="model" :rules="rules" label-width="130px">
          <template v-for="(item,index) in header">

          </template>
        </el-form>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formdialog=false">取 消</el-button>
        <el-button type="primary" :loading="saveLoading" @click="save">确 定</el-button>
      </div>
    </el-dialog> 

  </div>
</template>
<script>
  import { GetSupperMenus } from '@/api/menus'
  import { GetHeader } from '@/api/common'
  export default {
    // 初始化
    mounted() {
      this.getHeader();
      this.GetSupperMenus();
    },
    data() {
      return {
 
        // 展示列表头部
        header: [],
        // 展示列表数据
        data: [],
        // 添加修改弹框
        formdialog: false,
        // 保存遮罩
        saveLoading: false,
        // 保存规则
        rules: {},
        // 编辑实体
        model: {},
        // 编辑标题
        title: '',
        // 查询条件
        filter: '',
      }
    },
    // 方法
    methods: {
      create: function () {
        this.formdialog = true;
      },

      reset: function () { },
      save: function () { },

      getHeader: function () {
        const owner = this
        GetHeader("Menus").then(response => {
          owner.header = response.data
        })
      },
      GetSupperMenus: function () {
        const owner = this
        GetSupperMenus().then(response => {
          owner.data = response.data
        })
      },


      showcolumn: function (row) {
        row.path
      }
    }
  }
</script>
