
<template>
  <div class="app-container">

    <div style="margin-bottom:5px;">
      <el-button type="success" icon="el-icon-circle-plus-outline" @click="create()" v-if="IsRight ? menus.rightShowCreate: menus.showCreate">添加</el-button>
      <el-input v-model="filter"
                placeholder="请输入内容"
                style="width:220px;margin-left:5px;"
                prefix-icon="el-icon-search" />
    </div>

    <el-table :data="data" @sort-change="Sort">
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
            <el-button type="success" v-if="IsRight ? menus.rightShowModify : menus.showModify" size="small" @click="modify(scope.row)">编辑</el-button>
            <el-button type="danger" v-if="IsRight ? menus.rightShowRemove : menus.showRemove" size="small" @click="remove(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </template>
    </el-table>

    <el-pagination @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="request.PageIndex"
                   :page-sizes="[8, 10, 20, 40]" v-if="IsRight ? menus.rightShowPage : menus.showPage"
                   :page-size="request.PageSize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="request.TotalCount">
    </el-pagination>

    <el-dialog :title="title" :visible.sync="formdialog" :close-on-click-modal="false" :close-on-press-escape="false" @close="reset">
      <el-form id="#create" ref="create" :model="model" :rules="rules" label-width="130px">
        <template v-for="(item,index) in header">
          <el-row v-if="index % 2 == 0">
            <el-col :span="10">
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
                <el-switch v-model="model[item.columnName]"
                           active-color="#13ce66"
                           inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
              <el-form-item v-else-if="item.csharpType == 'Guid' && !!item.json" :label="item.columnDescription || item.columnName">
                <el-select v-model="model[item.columnName]" placeholder="请选择" filterable>
                  <el-option v-for="t in headerfilter[item.columnName].json"
                             :key="t[firstToLowwer(item.bindKey)]"
                             :label="t[firstToLowwer(item.bindValue)]"
                             :value="t[firstToLowwer(item.bindKey)]">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10" v-if="index < header.length -1 ">
              <el-form-item v-if="header[index+1].csharpType == 'String' "
                            :label="header[index+1].columnDescription || header[index+1].columnName" :prop="header[index+1].columnName">
                <el-input v-model="model[header[index+1].columnName]"
                          clearable></el-input>
              </el-form-item>
              <el-form-item v-if="header[index+1].csharpType == 'Int32' || header[index+1].csharpType == 'Int16' || header[index+1].csharpType == 'Int64' "
                            :label="header[index+1].columnDescription || header[index+1].columnName" :prop="header[index+1].columnName">
                <el-input v-model="model[header[index+1].columnName]" typeof="number"
                          clearable></el-input>
              </el-form-item>
              <el-form-item v-else-if="header[index+1].csharpType == 'Boolean'" :label="header[index+1].columnDescription || header[index+1].columnName">
                <el-switch v-model="model[header[index+1].columnName]"
                           active-color="#13ce66"
                           inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
              <el-form-item v-else-if="header[index+1].csharpType == 'Guid' && !!header[index+1].json" :label="header[index+1].columnDescription || header[index+1].columnName">
                <el-select v-model="model[header[index+1].columnName]" placeholder="请选择" filterable>
                  <el-option v-for="t in headerfilter[header[index+1].columnName].json"
                             :key="t[firstToLowwer(header[index+1].bindKey)]"
                             :label="t[firstToLowwer(header[index+1].bindValue)]"
                             :value="t[firstToLowwer(header[index+1].bindKey)]">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>


        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formdialog=false">取 消</el-button>
        <el-button type="primary" :loading="saveLoading" @click="save">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  import { GetHeader, GetList, Save, Remove } from '@/api/common'
  import { IsPhone, IsEmail, firstToLowwer } from '@/utils/validate'
  import { formatTimeToStr } from '@/utils/dateformat'
  export default {
    props: {
      IsRight: {
        Type: Boolean,
        default: false,
      },
      ParentKey: {
        Type: String,
        default: ''
      },
      ParentValue: {
        Type: String,
        default: ''
      },
    },
    watch: {
      filter: function (searchvalue) {
        if (!searchvalue)
          return;
        var owner = this;
     
        var index = 0;
        if (owner.ParentKey && owner.ParentValue) {
          index++;
          this.request.Model.Filters.push({
            "Field": owner.ParentKey,
            "Value": owner.ParentValue,
            "Operator": "Equals"
          });
        }

        this.request.Model.Filters.push({
          "Logic": "Or",
          "Filters": [],
        });

        owner.header.filter(x => { return x.isLike == true }).forEach(p => {
          owner.request.Model.Filters[index].Filters.push({
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
      this.menus = this.$route.meta.menusettins;
      if (!this.IsRight) {
        this.request.TableName = this.menus.sourceValue
        this.request.PageSize = this.menus.showPage ? this.menus.pageSize : 100000;
      }

      else {
        this.request.TableName = this.menus.rightSourceValue
        this.ParentKey = this.menus.sourceValue + 'Id'
        this.request.PageSize = this.menus.rightShowPage ? this.menus.rightPageSize : 100000;
      }
      this.request.filter = this.menus.id;
      this.getHeader();
      this.getList();

    },
    data() {
      return {
        validfun: {
          IsPhone: IsPhone,
          IsEmail: IsEmail
        },
        menus: {},
        headerfilter: {},
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
          TableName: '',
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
          PageSize: 8,
          PageIndex: 1,
          TotalCount: 0,
          Sort: 'Id'
        }
      }
    },
    // 方法
    methods: {
      firstToLowwer: function (str) {
        return firstToLowwer(str)
      },
      remove: function (row) {
        const owner = this
        let saverequest = {
          TableName: owner.TableName,
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
          owner.header.forEach(x => {
            if (x.json) {
              owner.headerfilter[x.columnName] = { bindKey: x.bindKey, bindValue: x.bindValue, json: JSON.parse(x.json) };
            }
          });
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

        if (owner.ParentKey && owner.ParentValue) {
          owner.request.Model.Filters.push({
            "Field": owner.ParentKey,
            "Value": owner.ParentValue,
            "Operator": "Equals"
          });
        }
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
            // 处理绑定的
            if (item.csharpType == "Guid") {
              if (item.bindKey && item.bindValue) {
                var key = firstToLowwer(item.bindKey);
                var name = firstToLowwer(item.bindValue);
                var res = arr.filter(p => { return p[key].toUpperCase() == val.toUpperCase() });
                if (res.length > 0) {
                  response = res[0][name];
                }
                else
                  response = "";
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
