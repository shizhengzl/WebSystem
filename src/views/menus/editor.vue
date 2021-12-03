
<template>
  <div class="app-container">
    <div style="margin-bottom:5px;">
      <el-button type="success" icon="el-icon-circle-plus-outline" @click="create()">添加</el-button>
      <el-input v-model="filter"
                placeholder="请输入内容"
                style="width:220px;margin-left:5px;"
                prefix-icon="el-icon-search" />
    </div> 

    <el-table :data="data">
      <el-table-column type="selection"  width="55">
      </el-table-column>

      <template v-for="(item,index) in header">
        <el-table-column v-if="item.csharpType == 'Boolean'"
                         :prop="item.columnName"
                         :label="item.columnDescription || item.columnName"
                         :formatter="boolformat"
                         :width="item.columnWidth"
                         sortable>
        </el-table-column>
        <el-table-column v-else
                         :prop="item.columnName"
                         :label="item.columnDescription || item.columnName"
                         sortable
                         :width="item.columnWidth">
        </el-table-column>

        <el-table-column label="操作" v-if="index == header.length-1">
          <template slot-scope="scope">
            <el-button type="success" size="small" @click="modify(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="modify(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </template>
    </el-table>

    <el-pagination @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="request.PageIndex" 
                   :page-sizes="[5, 10, 20, 40]"
                   :page-size="request.PageSize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="request.TotalCount">
    </el-pagination> 

    <el-dialog :title="title" :visible.sync="formdialog" :close-on-click-modal="false" :close-on-press-escape="false" @close="reset">
      <el-form id="#create" ref="create" :model="model" :rules="rules" label-width="130px">
        <template v-for="(item,index) in header">
          <el-form-item v-if="item.csharpType == 'String' "
                        :label="item.columnDescription || item.columnName" :prop="item.columnName">
            <el-input v-model="model[item.columnName]"
                      clearable></el-input>
          </el-form-item>

          <el-form-item v-if="item.csharpType == 'Int32' || item.csharpType == 'Int16' || item.csharpType == 'Int64' "
                        :label="item.columnDescription || item.columnName" :prop="item.columnName">
            <el-input v-model="model[item.columnName]" typeof="number"
                      clearable></el-input>
          </el-form-item>


          <el-form-item v-else-if="item.csharpType == 'Boolean'" :label="item.columnDescription || item.columnName">
            <el-radio-group v-model="model[item.columnName]">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formdialog=false">取 消</el-button>
        <el-button type="primary" :loading="saveLoading" @click="modifysave">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  import { GetHeader, GetList, Modify } from '@/api/common'
  export default {
    // 初始化
    mounted() {
      this.getHeader();
      this.getList();
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
        // 查询
        request : {
          TableName: 'ShowColumns',
          Model: {
            "Logic": "And",
            "Filters": [
              {
                "Field": "TableName",
                "Value": "ModifyColumns",
                "Operator": "Equals"
              }
            ]
          },
          PageSize:5,
          PageIndex: 1,
          TotalCount: 0,
          Sort:'Id'
        }
      }
    },
    // 方法
    methods: {
      create: function () {
        this.formdialog = true;
      },
      modify: function (row) {
        this.model = row;
        this.formdialog = true;
      },

      reset: function () { },
      modifysave: function () {
        const owner = this
        let saverequest = {
          TableName: owner.request.TableName,
          Model : owner.model
        } 
        Modify(saverequest).then(response => {
          if(response.success)
            this.formdialog = false;
          this.getHeader();
          //owner.header = response.data
        })
      },

      getHeader: function () {
        const owner = this
        GetHeader(owner.request.TableName).then(response => {
          owner.header = response.data
        })
      },
      getList: function () {
        const owner = this
        owner.request.Model = JSON.stringify(owner.request.Model);
        GetList(owner.request).then(response => {
          owner.request.TotalCount = response.TotalCount
          owner.data = (response.data)
          owner.request.Model = JSON.parse(owner.request.Model)
        })
      },

      boolformat: function (row, col, cell, index) {
        return row[col.property] ? "是" : "否"
      },

      showcolumn: function (row) {
        row.path
      },

      handleSizeChange: function (size) {
        this.request.PageSize = size;
        this.getList();
      },
      handleCurrentChange: function (currentPage) {
        this.request.PageIndex = currentPage;
        this.getList();
      },
    }
  }
</script>
