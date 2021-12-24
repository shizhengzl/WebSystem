
<template>
  <div class="app-container">
    <el-container>
      <aside width="400px">
        <div style="margin-bottom:5px;">
          <el-button type="success" icon="el-icon-circle-plus-outline" @click="create()" v-if="menus.showCreate">添加</el-button>
          <el-input v-model="filter"
                    placeholder="请输入内容"
                    style="width:220px;margin-left:5px;"
                    prefix-icon="el-icon-search" />
        </div>
        <el-table :data="data" @sort-change="Sort" highlight-current-row @current-change="handleTableChange" ref="fathertable">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <template v-for="(item,index) in header">
            <el-table-column :prop="item.columnName"
                             :label="item.columnDescription || item.columnName"
                             sortable
                             :align="item.postion"
                             :formatter="globalformat"
                             show-overflow-tooltip
                             :width="item.columnWidth">
            </el-table-column>

            <el-table-column label="操作" v-if="index == header.length-1">
              <template slot-scope="scope">
                <el-button type="success" v-if="menus.showModify" size="small" @click="modify(scope.row)">编辑</el-button>
                <el-button type="danger" v-if="menus.showRemove" size="small" @click="remove(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </template>
        </el-table>
      </aside>
      <el-main> 
          <commongrid v-if="ParentValue" IsRight="true" ></commongrid>
      </el-main>
    </el-container>



  </div>
</template>
<script>
  import { GetHeader, GetList, Save, Remove } from '@/api/common'
  import { IsPhone, IsEmail } from '@/utils/validate'
  import { formatTimeToStr } from '@/utils/dateformat'
  import commongrid from '@/views/snippet/grid.vue'
  export default {
    components: {
      commongrid
    },
    watch: {
      filter: function (searchvalue) {
        if (!searchvalue)
          return;
        var owner = this;
        this.request.Model.Filters = [];
        this.request.Model.Filters.push({
          "Field": "CompanysId",
          "Value": owner.$store.getters.company,
          "Operator": "Equals"
        });


        this.request.Model.Filters.push({
          "Logic": "Or",
          "Filters": [],
        });

        owner.header.filter(x => { return x.isLike == true }).forEach(p => {
          owner.request.Model.Filters[1].Filters.push({
            "Field": p.columnName,
            "Value": searchvalue,
            "Operator": "Contains"
          });

        });
        owner.getList();
      }
    },
    // 初始化
    mounted() {
      if (!this.TableName) {
        this.request.TableName = this.$route.meta.menusettins.sourceValue
      }
      else {
        this.request.TableName = this.TableName
      }
      this.menus = this.$route.meta.menusettins;
      this.request.PageSize = this.menus.showPage ? this.menus.pageSize : 100000;
       
      this.request.filter = this.menus.id;
      this.getHeader();
      this.getList();
    },
    data() {
      return {
        ParentValue:'d',
        menus: {},  
        validfun: {
          IsPhone: IsPhone,
          IsEmail: IsEmail
        },
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
        request: { 
          TableName: "",
          Model: {
            "Logic": "And",
            "Filters": [
              {
                "Field": "CompanysId",
                "Operator": "Equals"
              }
            ]
          },
          PageSize: 1,
          PageIndex: 1,
          TotalCount: 0,
          Sort: 'Id'
        }
      }
    },
    // 方法
    methods: {
      handleTableChange: function (row) {
        this.fatherrow = row;
        this.$refs.fathertable.clearSelection();
        this.$refs.fathertable.toggleRowSelection(row);
        this.ParentValue = '';
        this.$nextTick(() => {
          this.ParentValue = row.id
        })
      },
      remove: function (row) {
        const owner = this
        let saverequest = {
          TableName: owner.request.TableName,
          Model: row
        }
        Remove(saverequest).then(response => {
          if (response.success) {
            owner.getList();
          }
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
        this.formdialog = true;
      },
      save: function () {
        const owner = this
        this.$refs.create.validate((valid) => {
          if (valid) {
            let saverequest = {
              TableName: owner.request.TableName,
              Model: owner.model
            }
            Save(saverequest).then(response => {
              if (response.success) {
                this.formdialog = false;
                owner.getList();
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

      getHeader: function () {
        const owner = this
        GetHeader(owner.request).then(response => {
          owner.header = response.data;
          if (response.rules) {

            owner.rules = JSON.parse(response.rules)
            for (var s in owner.rules) {
              var rule = owner.rules[s];
              if (rule && rule.length > 0) {
                rule.forEach(x => {
                  if (x.validator) {
                    x.validator = owner.validfun[x.validator]
                  }
                });
              }
            }
          }

        })
      },
      getList: function () {
        const owner = this 
        owner.request.Model.Filters[0].Value = owner.$store.getters.company;
        owner.request.Model = JSON.stringify(owner.request.Model);

        GetList(owner.request).then(response => {
          owner.data = (response.data)
          owner.request.Model = JSON.parse(owner.request.Model)
          owner.request.TotalCount = response.totalCount;
        })
      },

      globalformat: function (row, col, cell, index) {
        var owner = this;
        var val = row[col.property];
        var response = val;
        var item = owner.header.filter(o => { return o.columnName == col.property })[0];
        if (item.sourceValue) {
          var arr = JSON.parse(item.json);
          if (arr.length > 0) {
            if (item.csharpType == "Boolean") {
              var res = arr.filter(p => { return p.code == (val ? '1' : '0') });
              if (res.length > 0) {
                response = res[0].name;
              }
            }

          }
        }
        else {

          if (item.csharpType == "DateTime") {
            response = formatTimeToStr(val, "yyyy-MM-dd hh:mm:ss");
          }
        }
        return response;
      },


      handleSizeChange: function (size) {
        this.request.PageSize = size;
        this.getList();
      },
      handleCurrentChange: function (currentPage) {
        this.request.PageIndex = currentPage;
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
