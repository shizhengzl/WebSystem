
<template>
  <div class="app-container">

    <el-container>
      <el-aside width="480px">

        <el-input v-model="filterText"
                  placeholder="输入关键字进行过滤" />
         
          <el-tree ref="tree"
                   class="filter-tree"
                   :data="allconnection"
                   node-key="id" 
                   :props="defaultProps"
                   :filter-node-method="filterNode"
                   @node-click="handleNodeClick">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span style="color:orangered;font-weight:600;">{{ node.name }}</span>
              <span>
                <el-link type="primary" round @click="() => loadcolumn(node, data)"
                         size="mini">
                  {{data.name}}
                </el-link> &nbsp; &nbsp;
                <el-link type="success" round  v-if="data.children.length == 0"  @click="() => edittabledescription(node, data)"
                         size="mini">
                  {{data.description || '添加备注'}}
                </el-link>
              </span>
            </span>
          </el-tree>
   


      </el-aside>
      <el-main> 

        <el-table :data="data" @sort-change="Sort">
          <el-table-column type="selection" width="55">
          </el-table-column>

          <template v-for="(item,index) in header">
            <el-table-column :prop="item.columnName"
                             :label="item.columnDescription || item.columnName"
                             :formatter="globalformat"
                             :width="item.columnWidth"
                             :align="item.postion"
                             sortable>
            </el-table-column>

            <el-table-column label="操作" v-if="index == header.length-1">
              <template slot-scope="scope">
                <el-button type="success" size="small" @click="modify(scope.row)">编辑</el-button> 
              </template>
            </el-table-column>
          </template>
        </el-table>

        <el-pagination @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="request.PageIndex"
                       :page-sizes="[8, 10, 20, 40]"
                       :page-size="request.PageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="request.TotalCount">
        </el-pagination>

        <el-dialog :title="title" :visible.sync="formdialog" :close-on-click-modal="false" :close-on-press-escape="false" @close="reset">
          <el-form id="#create" ref="create" :model="model" :rules="rules" label-width="130px">
            <el-form-item  label="备注">
              <el-input v-model="model.columnDescription"
                        clearable></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="formdialog=false">取 消</el-button>
            <el-button type="primary" :loading="saveLoading" @click="save">确 定</el-button>
          </div>
        </el-dialog>
      </el-main>
    </el-container>

   

  </div>
</template>
<script>
  import {
    GetHeader, GetList, Save, Remove, GetALLConnections, GetColumns,
  AddExtendedproperty, ModifyExtendedproperty, AddTableExtendedproperty, ModifyTableExtendedproperty} from '@/api/common'
  import { IsPhone, IsEmail } from '@/utils/validate'
  export default {
    watch: {
      filterText(val) { 
        this.$refs.tree.filter(val)
      }
    },
    // 初始化
    mounted() { 
      this.getConnectionList();
    },
    data() {
      return {
        columns:[],
        filterText: '',
        allconnection:[],
        defaultProps: {
          children: 'children',
          label: 'name',
          id: 'id'
        },
        validfun: {
          IsPhone: IsPhone,
          IsEmail: IsEmail
        },
        // 展示列表头部
        header: [
          { columnName: 'tableName', columnDescription: '表名', columnWidth: 180 }
          , { columnName: 'columnName', columnDescription: '列名', columnWidth: 140 }
          , { columnName: 'sqlType', columnDescription: '类型', columnWidth: 120}
          , { columnName: 'columnDescription', columnDescription: '描述', columnWidth: 320 }
          , { columnName: 'isRequire', columnDescription: '必填', columnWidth: 80, csharpType:'Boolean' }
        ],
        hasdescription: false,
        iscolumn: false,
        connectionstr: '',
        tablename: '',
        tabledata: {},
        headerformat: {
          isRequire: [{ code: '0', name: '否' }, { code: '1', name: '是' }] 
        },
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
        request: {
          TableName: 'Column',
          Model: {
            "Logic": "And",
            "Filters": [
              {
                "Field": "CompanysId",
                //"Value": this.company,
                "Operator": "Equals"
              }
            ]
          },
          PageSize: 80,
          PageIndex: 1,
          TotalCount: 0,
          Sort: 'Id'
        }
      }
    },
    // 方法
    methods: {
      getColumns: function (connection,tablename) {
        var owner = this
        if (owner.connectionstr) {
          let pdata = { TableDescription: owner.connectionstr, TableName: owner.tablename };

          GetColumns(pdata).then(response => {
            owner.data = (response.data)
          })
        } 
      },

      edittabledescription: function (node, data) {
        var owner = this;
        owner.connectionstr = data.props
        owner.tablename = data.name
        owner.iscolumn = false;
        owner.hasdescription = data.hasDescription; 
        owner.model = { columnDescription: data.description}; 
        owner.formdialog = true;
        owner.tabledata = data;
      },
      loadcolumn: function (node, data) {
        this.connectionstr = data.props
        this.tablename = data.name
        this.getColumns();
      },
      filterNode(value, data) {
        if (!value)
          return true 
        return data.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
          || (data.description && data.description.indexOf(value.toLowerCase()) !== -1)
      },
      handleNodeClick(data) {
        var owner = this
      },
      getConnectionList: function () {
        const owner = this 
        GetALLConnections().then(response => {
          owner.allconnection = (response.data)
        })
      },
      
      reset: function () {
        this.model = {}
      },
      create: function () {
        this.formdialog = true;
      },
      modify: function (row) {
        this.model = row;
        this.iscolumn = true;
        this.hasdescription = row.columnDescription;
        this.formdialog = true;
      },
      save: function () {
        const owner = this 
        if (owner.iscolumn && !owner.hasdescription ) {
          let saverequest = {
            DefaultValue: owner.connectionstr,
            TableName: owner.model.tableName,
            ColumnName: owner.model.columnName,
            ColumnDescription: owner.model.columnDescription
          } 
          AddExtendedproperty(saverequest).then(response => {
            if (response.success) {
              this.formdialog = false;
              owner.getColumns();
            }
          })
        }

        if (owner.iscolumn && owner.hasdescription) {
          let saverequest = {
            DefaultValue: owner.connectionstr,
            TableName: owner.tablename,
            ColumnName: owner.model.columnName,
            ColumnDescription: owner.model.columnDescription
          }
          ModifyExtendedproperty(saverequest).then(response => {
            if (response.success) {
              this.formdialog = false;
              owner.getColumns();
            }
          })
        }

        if (!owner.iscolumn && !owner.hasdescription) {
           
          let saverequest = {
            DefaultValue: owner.connectionstr,
            TableName: owner.tablename,
            TableDescription: owner.model.columnDescription
          }
          AddTableExtendedproperty(saverequest).then(response => {
            if (response.success) {
              this.formdialog = false;
              owner.tabledata.description = owner.model.columnDescription
              //owner.getColumns();
            }
          })
        }

        if (!owner.iscolumn && owner.hasdescription) {
          let saverequest = {
            DefaultValue: owner.connectionstr,
            TableName: owner.tablename,
            TableDescription: owner.model.columnDescription
          }
          ModifyTableExtendedproperty(saverequest).then(response => {
            if (response.success) {
              this.formdialog = false;
              owner.tabledata.description = owner.model.columnDescription
              //owner.getColumns();
            }
          })
        }
      }, 

      globalformat: function (row, col, cell, index) {
        var owner = this;
        var val = row[col.property];
        var response = val;
        if (owner.header.filter(x => { return col.property == x.columnName }).length > 0) {
          var cols = owner.header.filter(x => { return col.property == x.columnName })[0];
          if (owner.headerformat[col.property]) {
            if (cols.csharpType == "Boolean") {
              response = owner.headerformat[col.property].filter(p => { return p.code == (val ? '1' : '0') })[0].name;
            }
            if (cols.csharpType == "Int16" || cols.csharpType == "Int32" || cols.csharpType == "Int64") {
              response = owner.headerformat[col.property].filter(p => { return p.keys == val })[0].name;
            }

          }
        }
      
        return response;
      },


      handleSizeChange: function (size) {
        this.request.PageSize = size;
        this.getList();
      },
      handleCurrentChange: function (currentPage) {
        this.request.PageIndex = currentPage; globalformat
        this.getList();
      },

      Sort: function (col, desc) {
        this.request.Sort = col.prop;
        this.request.Asc = col.order == "ascending";
        this.getList();
      }
    }
  }
</script>
