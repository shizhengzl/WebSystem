
<template>
  <div class="app-container">

    <el-container>
      <el-header height="400px">

        <div style="margin-bottom:5px;">
          <el-button type="success" icon="el-icon-circle-plus-outline" @click="create()">添加</el-button>
          <el-input v-model="filter"
                    placeholder="请输入内容"
                    style="width:220px;margin-left:5px;"
                    prefix-icon="el-icon-search" />
        </div>

        <el-table :data="data"    highlight-current-row ref="fathertable"
    @current-change="handleTableChange">
          <el-table-column type="selection" width="55">
          </el-table-column>

          <template v-for="(item,index) in header">
            <el-table-column v-if="item.csharpType == 'Boolean'"
                             :prop="item.columnName"
                             :label="item.columnDescription || item.columnName"
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
            <el-button type="primary" :loading="saveLoading" @click="save">确 定</el-button>
          </div>
        </el-dialog>

      </el-header>
      <el-main>

        <div style="margin-bottom:5px;">
          <el-button type="success" icon="el-icon-circle-plus-outline" @click="detailcreate()">添加</el-button>
          <el-input v-model="detailfilter"
                    placeholder="请输入内容"
                    style="width:220px;margin-left:5px;"
                    prefix-icon="el-icon-search" />
        </div>

        <el-table :data="detaildata">
          <el-table-column type="selection" width="55">
          </el-table-column>

          <template v-for="(item,index) in detailheader">
            <el-table-column v-if="item.csharpType == 'Boolean'"
                             :prop="item.columnName"
                             :label="item.columnDescription || item.columnName"
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

            <el-table-column label="操作" v-if="index == detailheader.length-1">
              <template slot-scope="scope">
                <el-button type="success" size="small" @click="detailmodify(scope.row)">编辑</el-button>
                <el-button type="danger" size="small" @click="detailremove(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </template>
        </el-table>

        <el-pagination @size-change="detailhandleSizeChange"
                       @current-change="detailhandleCurrentChange"
                       :current-page="detailrequest.PageIndex"
                       :page-sizes="[8, 10, 20, 40]"
                       :page-size="detailrequest.PageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="detailrequest.TotalCount">
        </el-pagination>

        <el-dialog :title="title" :visible.sync="detailformdialog" :close-on-click-modal="false" :close-on-press-escape="false" @close="reset">
          <el-form id="#detailcreate" ref="detailcreate" :model="detailmodel" :rules="detailrules" label-width="130px">
            <template v-for="(item,index) in detailheader">
              <el-form-item v-if="item.csharpType == 'String' "
                            :label="item.columnDescription || item.columnName" :prop="item.columnName">
                <el-input v-model="detailmodel[item.columnName]"
                          clearable></el-input>
              </el-form-item>

              <el-form-item v-if="item.csharpType == 'Int32' || item.csharpType == 'Int16' || item.csharpType == 'Int64' "
                            :label="item.columnDescription || item.columnName" :prop="item.columnName">
                <el-input v-model="detailmodel[item.columnName]" typeof="number"
                          clearable></el-input>
              </el-form-item>


              <el-form-item v-else-if="item.csharpType == 'Boolean'" :label="item.columnDescription || item.columnName">
                <el-radio-group v-model="detailmodel[item.columnName]">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </template>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="detailformdialog=false">取 消</el-button>
            <el-button type="primary" :loading="saveLoading" @click="detailsave">确 定</el-button>
          </div>
        </el-dialog>

      </el-main>
    </el-container>


  </div>
</template>
<script>
  import { GetHeader, GetList, Save ,Remove} from '@/api/common' 
  export default {
    // 初始化
    mounted() { 
      this.getHeader();
      this.getList();

      this.getdetailHeader();
      this.getdetailList();
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
          TableName: 'BaseData',
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
          PageSize:5,
          PageIndex: 1,
          TotalCount: 0,
          Sort:'Id'
        },


        fatherrow: {},
        // 展示列表头部
        detailheader: [],
        // 展示列表数据
        detaildata: [],
        // 添加修改弹框
        detailformdialog: false,
        // 保存遮罩
        detailsaveLoading: false,
        // 保存规则
        detailrules: {},
        // 编辑实体
        detailmodel: {},
        // 编辑标题
        detailtitle: '',
        // 查询条件
        detailfilter: '',
        // 查询
        detailrequest: {
          TableName: 'BaseDataDetail',
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
          PageSize: 5,
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
  
        this.getdetailList(row.id);
      },

      reset: function () {
        this.model = {}
      },
      remove: function (row) {
        const owner = this
        let saverequest = {
          TableName: owner.request.TableName,
          Model:row
        }
        Remove(saverequest).then(response => {
          if (response.success) {
            this.formdialog = false;
            owner.getList();
          }
        })
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
      },
       
      getHeader: function () {
        const owner = this
        GetHeader(owner.request.TableName).then(response => {
          owner.header = response.data
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

      handleSizeChange: function (size) {
        this.request.PageSize = size;
        this.getList();
      },
      handleCurrentChange: function (currentPage) {
        this.request.PageIndex = currentPage;
        this.getList();
      },


      detailreset: function () {
        this.detailmodel = {}
      },
      detailremove: function (row) {
        const owner = this
        let saverequest = {
          TableName: owner.detailrequest.TableName,
          Model: row
        }
        Remove(saverequest).then(response => {
          if (response.success) {
            this.detailformdialog = false;
            owner.getdetailList();
          }
        })
      },
      detailcreate: function () { 
        if (!this.fatherrow.id) {
          this.$message({
            message: '清选择父项基础数据',
            type: 'warning'
          });
          return;
        }
        this.detailformdialog = true;
        this.detailmodel.baseDataId = this.fatherrow.id;
        
      },
      detailmodify: function (row) {
        this.detailmodel = row;
        this.detailformdialog = true;
      },
      detailsave: function () {
        const owner = this
        let saverequest = {
          TableName: owner.detailrequest.TableName,
          Model: owner.detailmodel
        }
        Save(saverequest).then(response => {
          if (response.success) {
            this.detailformdialog = false;
            owner.getdetailList();
          }
        })
      },

      getdetailHeader: function () {
        const owner = this
        GetHeader(owner.detailrequest.TableName).then(response => {
          owner.detailheader = response.data
        })
      },
      getdetailList: function (fatherid) {
        const owner = this

        if (fatherid) {
          owner.detailrequest.Model.Filters[1] = {
            "Field": 'BaseDataId',
            "Value": fatherid,
            "Operator": "Equals"
          };
        }
       

        owner.detailrequest.Model.Filters[0].Value = owner.$store.getters.company;
        owner.detailrequest.Model = JSON.stringify(owner.detailrequest.Model);

        GetList(owner.detailrequest).then(response => {
          owner.detaildata = (response.data)
          owner.detailrequest.Model = JSON.parse(owner.detailrequest.Model)
          owner.detailrequest.TotalCount = response.totalCount;
        })
      },

      detailhandleSizeChange: function (size) {
        this.detailrequest.PageSize = size;
        this.getdetailList();
      },
      detailhandleCurrentChange: function (currentPage) {
        this.detailrequest.PageIndex = currentPage;
        this.getdetailList();
      },
    }
  }
</script>
