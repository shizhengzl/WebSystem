
<template>
  <div class="app-container">
    <div style="margin-bottom:5px;">
      <el-button type="success" icon="el-icon-circle-plus-outline" @click="create()">添加</el-button>
      <el-input v-model="filter"
                placeholder="请输入内容"
                style="width:220px;margin-left:5px;"
                prefix-icon="el-icon-search" />
    </div>
    <el-table :data="data" border max-height="800" row-key="id"
              :tree-props="{children: 'children'}">
      <!--<el-table-column type="selection" width="40"></el-table-column>-->

      <el-table-column prop="menuName"
                       label="菜单名称"
                       sortable>
      </el-table-column>
      <el-table-column prop="menuIcon"
                       label="菜单图标"
                       width="105"
                       sortable>
      </el-table-column>
      <el-table-column prop="path"
                       label="路劲"
                       sortable>
      </el-table-column>
      <el-table-column prop="component"
                       label="组件"
                       sortable>
      </el-table-column>
      <el-table-column prop="sort"
                       label="排序"
                       width="75"
                       sortable>
      </el-table-column>
      <el-table-column prop="isDefault"
                       label="默认菜单"
                       width="105"
                       sortable>
      </el-table-column>

      <el-table-column prop="isSupper"
                       label="超级菜单"
                       width="105"
                       sortable>
      </el-table-column>
      <el-table-column prop="targetSource"
                       label="数据源"
                       width="90"
                       sortable>
      </el-table-column>

      <el-table-column prop="sourceValue"
                       label="数据源值"
                       width="110">
        <template slot-scope="scope">
          <el-link icon="el-icon-edit" type="success" @click="showsetting(scope.row.sourceValue,scope.row.id)">{{scope.row.sourceValue}}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="rightTargetSource"
                       label="右数据源"
                       width="105"
                       sortable>
      </el-table-column>

      <el-table-column prop="rightSourceValue"
                       label="右数据源值"
                       width="120">
        <template slot-scope="scope">
          <el-link icon="el-icon-edit" type="success" @click="showsetting(scope.row.rightSourceValue,scope.row.id)">{{scope.row.rightSourceValue}}</el-link>
        </template>
      </el-table-column>
      <!--<el-table-column label="设置" width="120">
      <template slot-scope="scope">
        <el-link icon="el-icon-edit" type="success" @click="showsetting(scope.row)">设置</el-link>
      </template>
    </el-table-column>-->

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="success" size="small" @click="modify(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="remove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--菜单编辑!-->
    <el-dialog :title="title" :visible.sync="formdialog" :close-on-click-modal="false" :close-on-press-escape="false" @close="reset">
      <el-form id="#create" ref="create" :model="model" :rules="rules" label-width="130px">
        <el-row>
          <el-col :span="10">
            <el-form-item label="菜单名称">
              <el-input v-model="model.menuName"
                        clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="路劲">
              <el-input v-model="model.path"
                        clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item label="组件">
              <!--<el-input v-model="model.component"
              clearable></el-input>-->


              <el-select v-model="model.component" filterable placeholder="请选择">
                <el-option v-for="item in componentoptions"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>


          </el-col>
          <el-col :span="10">
            <el-form-item label="排序">
              <el-input v-model="model.sort"
                        clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>



        <el-row>
          <el-col :span="10">
            <el-form-item label="数据源配置">
              <el-select v-model="model.targetSource" clearable placeholder="请选择" style="width:100%;">
                <el-option v-for="item in tragetsource"
                           :key="item.keys"
                           :label="item.name"
                           :value="item.keys">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="10">
            <el-form-item label="数据源值">
              <el-select v-model="model.sourceValue" clearable placeholder="请选择" style="width:100%;">
                <el-option v-for="item in tables"
                           :key="item.code"
                           :label="item.name"
                           :value="item.code">
                </el-option>
              </el-select>

              <el-link type="success" round v-if="model.sourceValue" @click="setlist(model.id,model.sourceValue)"
                       size="mini">{{model.sourceValue}}</el-link>
            </el-form-item>


          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="右数据源配置">
              <el-select v-model="model.rightTargetSource" clearable placeholder="请选择" style="width:100%;" @change="showmodelchange">
                <el-option v-for="item in tragetsource"
                           :key="item.keys"
                           :label="item.name"
                           :value="item.keys">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="10">
            <el-form-item label="右数据源值">
              <el-select v-model="model.rightSourceValue" clearable placeholder="请选择" style="width:100%;" @change="shoucolumns">
                <el-option v-for="item in tables"
                           :key="item.code"
                           :label="item.name"
                           :value="item.code">
                </el-option>
              </el-select>
              <el-link type="success" round v-if="model.rightSourceValue" @click="setlistright(model.id,model.rightSourceValue)"
                       size="mini">{{model.rightSourceValue}}</el-link>
            </el-form-item>


          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="父级菜单">
              <el-select v-model="model.menusId" clearable placeholder="请选择" style="width:100%;">
                <el-option v-for="item in parentdata"
                           :key="item.id"
                           :label="item.menuName"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="10">
            <el-form-item label="菜单图标">
              <el-input v-model="model.menuIcon"
                        clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="5">
            <el-form-item label="默认菜单">
              <el-switch v-model="model.isDefault"
                         active-color="#13ce66"
                         inactive-color="#ff4949">
              </el-switch>

            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="超级菜单">

              <el-switch v-model="model.isSupper"
                         active-color="#13ce66"
                         inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
          </el-col>


          <el-col :span="10">

          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formdialog=false">取 消</el-button>
        <el-button type="primary" :loading="saveLoading" @click="save">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" customClass="customWidth" :visible.sync="showdialog" :close-on-click-modal="false" :close-on-press-escape="false" @close="reset">
      <el-table :data="showColumnData" @sort-change="showSort">
        <el-table-column type="selection" width="55">
        </el-table-column>

        <template v-for="(item,index) in showColumnHeader">
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
                           sortable="custom"
                           :width="item.columnWidth">
          </el-table-column>

          <el-table-column label="操作" v-if="index == showColumnHeader.length-1">
            <template slot-scope="scope">
              <el-button type="success" size="small" @click="showmodify(scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="showremove(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </template>
      </el-table>

      <el-pagination @size-change="show_handleSizeChange"
                     @current-change="show_handleCurrentChange"
                     :current-page="request.PageIndex"
                     :page-sizes="[8, 10, 20, 40]"
                     :page-size="request.PageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="request.TotalCount">
      </el-pagination>

    </el-dialog>

    <!--显示编辑!-->
    <el-dialog :title="showtitle" :visible.sync="showformdialog" :close-on-click-modal="false" :close-on-press-escape="false" @close="reset">
      <el-form id="#showcreate" ref="showcreate" :model="showmodel" :rules="rules" label-width="130px">

        <el-tabs tab-position="left" style="height: 100%">
          <el-tab-pane label="公用设置">
            <el-row>
              <el-col :span="10">
                <el-form-item label="绑定名称">
                  <el-input v-model="showmodel.columnName" :disabled="true">
                    clearable>
                  </el-input>
                </el-form-item>
              </el-col>

              <el-col :span="10">
                <el-form-item label="显示名称">
                  <el-input v-model="showmodel.columnDescription"
                            clearable></el-input>
                </el-form-item>
              </el-col>

            </el-row>

            <el-row>
              <el-col :span="10">

                <el-form-item label="类型">
                  <el-input v-model="showmodel.csharpType" :disabled="true" clearable>
                  </el-input>
                </el-form-item>

              </el-col>

              <el-col :span="10">
                <el-form-item label="排序">
                  <el-input v-model="showmodel.sort"
                            clearable></el-input>
                </el-form-item>
              </el-col>

            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item label="数据源配置">
                  <el-select v-model="showmodel.targetSource" clearable placeholder="请选择" style="width:100%;" @change="showmodelchange">
                    <el-option v-for="item in tragetsource"
                               :key="item.keys"
                               :label="item.name"
                               :value="item.keys">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="10">
                <el-form-item label="数据源值">
                  <el-select v-model="showmodel.sourceValue" clearable placeholder="请选择" style="width:100%;" @change="shoucolumns">
                    <el-option v-for="item in tables"
                               :key="item.code"
                               :label="item.name"
                               :value="item.code">
                    </el-option>
                  </el-select>
                </el-form-item>


              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item label="绑定键">
                  <el-select v-model="showmodel.bindKey" clearable placeholder="请选择" style="width:100%;">
                    <el-option v-for="item in columnsdata"
                               :key="item.columnName"
                               :label="item.columnDescription"
                               :value="item.columnName">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="10">
                <el-form-item label="绑定值">
                  <el-select v-model="showmodel.bindValue" clearable placeholder="请选择" style="width:100%;">
                    <el-option v-for="item in columnsdata"
                               :key="item.columnName"
                               :label="item.columnDescription"
                               :value="item.columnName">
                    </el-option>
                  </el-select>
                </el-form-item>


              </el-col>
            </el-row>

          </el-tab-pane>
          <el-tab-pane label="列表设置">
            <el-row>
              <el-col :span="10">
                <el-form-item label="显示宽度">
                  <el-input v-model="showmodel.columnWidth"
                            clearable></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="10">
                <el-form-item label="显示位置">

                  <el-select v-model="showmodel.postion" placeholder="请选择" style="width:100%;">
                    <el-option v-for="item in showoptions"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                  </el-select>

                  <!--<el-input v-model="showmodel.postion"
                clearable></el-input>-->
                </el-form-item>
              </el-col>

            </el-row>
          </el-tab-pane>
          <el-tab-pane label="新增设置">
            <el-row>
              <el-col :span="10">
                <el-form-item label="长度">
                  <el-input v-model="showmodel.maxLength" :disabled="true" clearable>
                  </el-input>
                </el-form-item>
              </el-col>

              <el-col :span="10">
                <el-form-item label="数据验证">
                  <el-select v-model="showmodel.validType" clearable placeholder="请选择" style="width:100%;">
                    <el-option v-for="item in basedatadetail"
                               :key="item.code"
                               :label="item.name"
                               :value="item.code">
                    </el-option>
                  </el-select>
                </el-form-item>


              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item label="">
                  <el-switch style="display: block"
                             v-model="showmodel.isShow"
                             active-color="#13ce66"
                             inactive-color="#ff4949"
                             active-text="显示"
                             inactive-text="隐藏">
                  </el-switch>
                </el-form-item>
              </el-col>

              <el-col :span="10">
                <el-form-item label="">
                  <el-switch style="display: block"
                             v-model="showmodel.isRequired"
                             active-color="#13ce66"
                             inactive-color="#ff4949"
                             active-text="必填"
                             inactive-text="非必填">
                  </el-switch>
                </el-form-item>
              </el-col>

            </el-row>
          </el-tab-pane>
          <el-tab-pane label="编辑设置">
            <el-row>
              <el-col :span="10">
                <el-form-item label="">
                  <el-switch style="display: block"
                             v-model="showmodel.isReadyOnly"
                             active-color="#13ce66"
                             inactive-color="#ff4949"
                             active-text="只读"
                             inactive-text="读写">
                  </el-switch>
                </el-form-item>
              </el-col>

              <el-col :span="10">
                <el-form-item label="">
                  <el-switch style="display: block"
                             v-model="showmodel.isEditShow"
                             active-color="#13ce66"
                             inactive-color="#ff4949"
                             active-text="编辑显示"
                             inactive-text="编辑隐藏">
                  </el-switch>
                </el-form-item>
              </el-col>

            </el-row>
          </el-tab-pane>
          <el-tab-pane label="查询设置">
            <el-row>
              <el-col :span="10">

                <el-form-item label="">
                  <el-switch style="display: block"
                             v-model="showmodel.isLike"
                             active-color="#13ce66"
                             inactive-color="#ff4949"
                             active-text="启用模糊"
                             inactive-text="禁用模糊">
                  </el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="10"></el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>



      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showformdialog=false">取 消</el-button>
        <el-button type="primary" @click="showsave">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="formdialoglist"
               :close-on-click-modal="false"
               :close-on-press-escape="false">
      <el-form id="#createlist" ref="createlist" :model="model" label-width="130px">
        <el-row style="margin-top:10px;">
          <el-col :span="10">

            <el-switch style="display: block"
                       v-model="model.showCreate"
                       active-color="#13ce66"
                       inactive-color="#ff4949"
                       active-text="显示添加按钮"
                       inactive-text="隐藏添加按钮">
            </el-switch>
          </el-col>
          <el-col :span="10">

            <el-switch style="display: block"
                       v-model="model.showModify"
                       active-color="#13ce66"
                       inactive-color="#ff4949"
                       active-text="显示修改按钮"
                       inactive-text="隐藏修改按钮">
            </el-switch>
          </el-col>
        </el-row>
        <el-row style="margin-top:10px;">
          <el-col :span="10">
            <el-switch style="display: block"
                       v-model="model.showRemove"
                       active-color="#13ce66"
                       inactive-color="#ff4949"
                       active-text="显示删除按钮"
                       inactive-text="隐藏删除按钮">
            </el-switch>
          </el-col>
          <el-col :span="10">
            <el-switch style="display: block"
                       v-model="model.showPage"
                       active-color="#13ce66"
                       inactive-color="#ff4949"
                       active-text="显示分页"
                       inactive-text="隐藏分页">
            </el-switch>
          </el-col>
        </el-row>
        <el-row style="margin-top:10px;">
          <el-col :span="10">
            <el-form-item label="每页大小">
              <el-input v-model="model.pageSize"
                        clearable></el-input>
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formdialoglist=false">取 消</el-button>
        <el-button type="primary" @click="save('left')">确 定</el-button>
      </div>
    </el-dialog>





    <el-dialog :title="title" :visible.sync="formdialoglistright"
               :close-on-click-modal="false"
               :close-on-press-escape="false">
      <el-form id="#createlistright" ref="createlistright" :model="model" label-width="130px">
        <el-row style="margin-top:10px;">
          <el-col :span="10">

            <el-switch style="display: block"
                       v-model="model.rightShowCreate"
                       active-color="#13ce66"
                       inactive-color="#ff4949"
                       active-text="显示添加按钮"
                       inactive-text="隐藏添加按钮">
            </el-switch>
          </el-col>
          <el-col :span="10">

            <el-switch style="display: block"
                       v-model="model.rightShowModify"
                       active-color="#13ce66"
                       inactive-color="#ff4949"
                       active-text="显示修改按钮"
                       inactive-text="隐藏修改按钮">
            </el-switch>
          </el-col>
        </el-row>
        <el-row style="margin-top:10px;">
          <el-col :span="10">
            <el-switch style="display: block"
                       v-model="model.rightShowRemove"
                       active-color="#13ce66"
                       inactive-color="#ff4949"
                       active-text="显示删除按钮"
                       inactive-text="隐藏删除按钮">
            </el-switch>
          </el-col>
          <el-col :span="10">
            <el-switch style="display: block"
                       v-model="model.rightShowPage"
                       active-color="#13ce66"
                       inactive-color="#ff4949"
                       active-text="显示分页"
                       inactive-text="隐藏分页">
            </el-switch>
          </el-col>
        </el-row>
        <el-row style="margin-top:10px;">
          <el-col :span="10">
            <el-form-item label="每页大小">
              <el-input v-model="model.rightPageSize"
                        clearable></el-input>
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formdialoglistright=false">取 消</el-button>
        <el-button type="primary" @click="save('','right')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { GetSupperMenus, GetParentMenus } from '@/api/menus'
  import { Loading } from 'element-ui';
  import { GetHeader, GetTables, Save, Remove, GetList, GetCurrentColumns, GetEnums } from '@/api/common'
  export default {
    // 初始化
    mounted() {

      this.GetSupperMenus();
      this.GetTables();
      this.GetParentMenus();
      this.getBaseData();
    },
    data() {
      return {
        formdialoglist: false,
        formdialoglistright:false,
        componentoptions: [
          { label: '列表组件', value: '/snippet/grid' },
          { label: '分页列表组件', value: '/snippet/pagegrid' },
          { label: '树形列表组件', value: '/snippet/treeegrid' },
          { label: '左右列表', value: '/snippet/gridgrid' }
        ],
        columnsdata: [],
        showtitle: '',
        showColumnHeader: [
          { columnName: 'columnName', columnDescription: '名称', columnWidth: 105, csharpType: 'String' }
          , { columnName: 'columnDescription', columnDescription: '列头', columnWidth: 95, csharpType: 'String' }
          , { columnName: 'columnWidth', columnDescription: '宽度', columnWidth: 75, csharpType: 'String' }
          , { columnName: 'postion', columnDescription: '位置', columnWidth: 75, csharpType: 'String' }
          , { columnName: 'isShow', columnDescription: '显示', columnWidth: 75, csharpType: 'Boolean' }
          , { columnName: 'sort', columnDescription: '排序', columnWidth: 75, csharpType: 'Int32' }
          , { columnName: 'csharpType', columnDescription: '类型', columnWidth: 75, csharpType: 'String' }
          , { columnName: 'targetSource', columnDescription: '数据源', columnWidth: 95, csharpType: 'String' }
          , { columnName: 'sourceValue', columnDescription: '数据值', columnWidth: 95, csharpType: 'String' }
          , { columnName: 'isRequired', columnDescription: '必填', columnWidth: 75, csharpType: 'Boolean' }
          , { columnName: 'isReadyOnly', columnDescription: '只读', columnWidth: 75, csharpType: 'Boolean' }
          , { columnName: 'isEditShow', columnDescription: '编辑显示', columnWidth: 100, csharpType: 'Boolean' }
          , { columnName: 'maxLength', columnDescription: '长度', columnWidth: 75, csharpType: 'Int32' }
          , { columnName: 'validType', columnDescription: '数据验证', columnWidth: 100, csharpType: 'String' }
          , { columnName: 'isLike', columnDescription: '模糊查询', columnWidth: 100, csharpType: 'Boolean' }
        ],
        showoptions: [{ value: 'left', label: '居左' }, { value: 'center', label: '居中' }, { value: 'right', label: '居右' }],
        showColumnData: [],
        tragetsource: [
          {
            keys: '0', name: '无'
          },
          {
            keys: 'Enum', name: '枚举'
          },
          {
            keys: 'Table', name: '表'
          },
          {
            keys: 'SQL', name: 'SQL'
          },
          {
            keys: 'BaseData', name: '基础数据'
          },
          {
            keys: 'External', name: '外部数据源'
          }
        ],
        parentdata: [],
        tables: [],
        basedata: [],
        basedatadetail: [],
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

        showdialog: false,
        showformdialog: false,
        showmodel: {},
        request: {
          TableName: 'ShowColumns',
          Model: {
            "Logic": "And",
            "Filters": [
              {
                "Field": "CompanysId",
                //"Value": this.company,
                "Operator": "Equals"
              },
              {
                "Field": "TableName",
                //"Value": this.company,
                "Operator": "Equals"
              },
              {
                "Field": "MenusId",
                //"Value": this.company,
                "Operator": "Equals"
              }
            ]
          },
          PageSize: 8,
          PageIndex: 1,
          TotalCount: 0,
          Sort: 'IsShow',
          Asc: false
        }
      }
    },
    // 方法
    methods: {
      setlist: function (menuid, table) {
        this.formdialoglist = true;
      },
      setlistright: function (menuid, table) {
        this.formdialoglistright = true;
      },
      shoucolumns: function (row) {
        var owner = this;
        var req = { TableName: row };
        GetCurrentColumns(req).then(response => {

          owner.columnsdata = response.data;
        })
      },
      showmodelchange: function (row) {
        
        if (row == "BaseData")
          this.tables = this.basedata;
        if (row == "Table")
          this.GetTables();
        if (row == "Enum") { 
          this.GetEnums();
        }
          
      },
      showSort: function (col, desc) {
        this.request.Sort = col.prop;
        this.request.Asc = col.order == "ascending";
        this.getList();
      }
      ,
      show_handleSizeChange: function (size) {
        this.request.PageSize = size;
        this.getList();
      },
      show_handleCurrentChange: function (currentPage) {
        this.request.PageIndex = currentPage;
        this.getList();
      },
      boolformat: function (row, col, cell, index) {
        return row[col.property] ? "是" : "否"
      },
      getBaseData: function () {
        const owner = this;
        let req = {
          TableName: 'BaseData',
          Model: {
            "Logic": "And",
            "Filters": [
              {
                "Field": "CompanysId",
                "Value": owner.$store.getters.company,
                "Operator": "Equals"
              }
            ]
          },
          PageSize: 100000,
          PageIndex: 1
        };
        req.Model = JSON.stringify(req.Model);
        GetList(req).then(response => {
          owner.basedata = response.data;
          var basevalidtype = owner.basedata.filter(x => { return x.name == "数据验证" });
          this.getBaseDataDetail(basevalidtype[0].id);
        })
      },
      getBaseDataDetail: function (basedataid) {
        const owner = this;
        let req = {
          TableName: 'BaseDataDetail',
          Model: {
            "Logic": "And",
            "Filters": [
              {
                "Field": "BaseDataId",
                "Value": basedataid,
                "Operator": "Equals"
              }
            ]
          },
          PageSize: 100000,
          PageIndex: 1
        };
        req.Model = JSON.stringify(req.Model);
        GetList(req).then(response => {
          owner.basedatadetail = response.data;
        })
      },
      getList: function (table, menuid) {
        const owner = this
        owner.request.Model.Filters[0].Value = owner.$store.getters.company;
        if (table) {
          owner.request.Model.Filters[1].Value = table;
          owner.request.Model.Filters[2].Value = menuid;
          this.getHeader(table);
        }
        owner.request.Model = JSON.stringify(owner.request.Model);
        GetList(owner.request).then(response => {
          owner.showColumnData = (response.data)

          owner.request.Model = JSON.parse(owner.request.Model)
          owner.request.TotalCount = response.totalCount;

          if (owner.showColumnData.length == 0) {
            owner.initheader(table, menuid);
          }
        })
      },
      showsetting: function (table, menuid) {
        this.showdialog = true;
        this.getList(table, menuid);
      },

      initheader: function (table, menuid) {
        const owner = this

        let rq = {
          TableName: table,
          Filter: menuid,
          Model: {
            "Logic": "And",
            "Filters": [
              {
                "Field": "BaseDataId",
                "Value": owner.$store.getters.company,
                "Operator": "Equals"
              }
            ]
          },
          PageSize: 100000,
          PageIndex: 1
        };
        rq.Model = JSON.stringify(rq.Model);
        GetHeader(rq).then(response => {
          owner.getList(table, menuid)
        })
      },

      reset: function () {
        this.model = {};
      },
      create: function () {
        this.model = {};
        this.formdialog = true;
      },
      modify: function (row) {
        this.model = row;
        this.formdialog = true;
      },
      showmodify: function (row) {
        this.showmodel = row;
        this.showformdialog = true;
      },
      showsave: function () {
        const owner = this
        let saverequest = {
          TableName: 'ShowColumns',
          Model: owner.showmodel
        }
        Save(saverequest).then(response => {
          if (response.success)
            this.showformdialog = false;
          owner.GetSupperMenus();
        })
      },
      save: function (left,right) {
        const owner = this
        let saverequest = {
          TableName: 'Menus',
          Model: owner.model
        }
        Save(saverequest).then(response => {
          if (response.success) {
            if (left)
              this.formdialoglist = false;
            if (right)
              this.formdialoglistright = false;
            if (!left && !right)
              this.formdialog = false;
          }
            
         // owner.getList();
        })
      },

      remove: function (row) {
        const owner = this
        let saverequest = {
          TableName: 'Menus',
          Model: row
        }
        Remove(saverequest).then(response => {
          if (response.success) {
            owner.GetSupperMenus();
          }
        })
      },
      getHeader: function () {
        const owner = this
        GetHeader(owner.request).then(response => {
          owner.header = response.data
        })
      },
      GetSupperMenus: function () {
        const owner = this
        GetSupperMenus().then(response => {
          owner.data = response.data
        })
      },
      GetParentMenus: function () {
        const owner = this
        GetParentMenus().then(response => {
          owner.parentdata = response.data
        })
      },
      GetTables: function () {
        const owner = this
        GetTables().then(response => {
          owner.tables = response.data
        })
      },
      GetEnums: function () { 
        const owner = this 
        GetEnums({}).then(response => {
          owner.tables = response.data
        })
      },

    }
  }
</script>
<style>
  .customWidth {
    width: 85%;
  }
</style>
