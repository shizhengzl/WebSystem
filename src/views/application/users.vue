
<template>
  <div class="app-container">

    <div style="margin-bottom:5px;">
      <el-button type="success" icon="el-icon-circle-plus-outline" @click="create()">添加</el-button>
      <el-input v-model="filter"
                placeholder="请输入内容"
                style="width:220px;margin-left:5px;"
                prefix-icon="el-icon-search" /> 
    </div>

    <!--<el-collapse accordion>
      <el-collapse-item>
        <template slot="title"> 
          <span style="display:inline-block;float:right;margin-right:25px;margin-top:5px;">高级查询</span>
        </template>
        <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
        <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
      </el-collapse-item>

    </el-collapse>-->

    <el-table :data="data" @sort-change="Sort">
      <el-table-column type="selection" width="55">
      </el-table-column>

      <template v-for="(item,index) in header">
        <el-table-column v-if="item.csharpType == 'Boolean'"
                         :prop="item.columnName"
                         :label="item.columnDescription || item.columnName"
                         :formatter="globalformat"
                         :width="item.columnWidth"
                         :align="item.postion"
                         sortable>
        </el-table-column>
        <el-table-column v-else
                         :prop="item.columnName"
                         :label="item.columnDescription || item.columnName"
                         sortable
                         :align="item.postion"
                         :width="item.columnWidth">
        </el-table-column>

        <el-table-column label="操作" v-if="index == header.length-1">
          <template slot-scope="scope">
            <el-button type="success" size="small" @click="modify(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="remove(scope.row)">删除</el-button>
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
  import { IsPhone, IsEmail } from '@/utils/validate'
  export default {
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
      this.getHeader();
      this.getList();
    },
    data() {
      return {
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
        request : {
          TableName: 'Users',
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
          PageSize:8,
          PageIndex: 1,
          TotalCount: 0,
          Sort:'Id'
        }
      }
    },
    // 方法
    methods: { 
      remove: function (row) {
        const owner = this
        let saverequest = {
          TableName: 'Users',
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
        GetHeader(owner.request.TableName).then(response => {
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
        var response = "";
        owner.header.forEach(function (item) {
              if (col.property == item.columnName) {
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
              }
        }); 
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
