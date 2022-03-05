
<template>
  <div class="app-container">

    <el-tabs v-model="activeName" type="grant" @tab-click="changemode">
      <el-tab-pane label="角色授权" name="rolegrant">
        <el-container>
          <el-aside width="300px">
            <el-input v-model="filterrole"
                      placeholder="输入关键字进行过滤" /> 
            <el-tree  ref="roletree"
                      class="filter-tree"
                     :data="roledata"
                      node-key="id"
                     :props="defaultroleProps"
                     :filter-node-method="filterRoleNode"
                      @node-click="handleNodeRoleClick">
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span style="color:orangered;font-weight:600;">{{ data.name }}</span>
                <span>
                  <el-link type="primary" round @click="() => showbuttons(node, data)"
                           size="mini"> 
                  </el-link> &nbsp; &nbsp; 
                </span>
              </span>
            </el-tree>

          </el-aside>
          <el-main> 
            <el-button type="primary" @click="SaveRole">保存</el-button>

            <el-tree :props="menuroleprops"
                     show-checkbox
                       ref="rolechosetree"
                     :data="menuroledata">
            </el-tree> 
          </el-main>
        </el-container>

      </el-tab-pane>
      <el-tab-pane label="机构授权" name="organizationgrant">
        <el-container>
          <el-aside width="300px">
            <el-input v-model="filterorganization"
                      placeholder="输入关键字进行过滤" />
            <el-tree  ref="organizationtree"
                      class="filter-tree"
                     :data="organizationdata"
                      node-key="id"
                     :props="defaultorganizationProps"
                     :filter-node-method="filterOrganizationNode"
                      @node-click="handleNodeOrganizationClick">
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span style="color:orangered;font-weight:600;">{{ data.name }}</span>
                <span>
                  <el-link type="primary" round @click="() => showbuttons(node, data)"
                           size="mini">
                  </el-link> &nbsp; &nbsp;
                </span>
              </span>
            </el-tree>

          </el-aside>
          <el-main>
            <el-button type="primary" @click="SaveOrganization">保存</el-button>
            <el-tree :props="menuorganizationprops"
                      show-checkbox
                      node-key="id"
                      ref="organizationchosetree"
                     :data="menuorganizationdata">
            </el-tree>
          </el-main>
        </el-container>
      </el-tab-pane>
      <el-tab-pane label="用户授权" name="usergrant">
        <el-container>
          <el-aside width="300px">
            <el-input v-model="filteruser"
                      placeholder="输入关键字进行过滤" />
            <el-tree ref="usertree"
                     class="filter-tree"
                     :data="userdata"
                     node-key="id"
                     :props="defaultuserProps"
                     :filter-node-method="filterUserNode"
                     @node-click="handleNodeUserClick">
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span style="color:orangered;font-weight:600;">{{ data.userName }}({{data.nikeName}})</span>
                <span>
                  <el-link type="primary" round @click="() => showbuttons(node, data)"
                           size="mini">
                  </el-link> &nbsp; &nbsp;
                </span>
              </span>
            </el-tree>

          </el-aside>
          <el-main>
            <el-button type="primary" @click="SaveUser">保存</el-button>
            <el-tree :props="menuuserprops"
                      show-checkbox
                      ref="userchosetree"
                     :data="menuuserdata">
            </el-tree>
          </el-main>
        </el-container>

      </el-tab-pane> 
    </el-tabs>

  </div>
</template>
<script>
  import { GetHeader, GetList, Save, Remove } from '@/api/common'
  import { GetCompanyMenus } from '@/api/menus'
  
  import { IsPhone, IsEmail, firstToLowwer } from '@/utils/validate'
  import { formatTimeToStr } from '@/utils/dateformat'


  import { SaveOrganizationPermission, SaveRolePermission, SaveUserPermission } from '@/api/permission'
  export default { 
    watch: {
      filterrole(val) {
        this.$refs.roletree.filter(val)
      },
      filterorganization(val) {
        this.$refs.organizationtree.filter(val)
      },
      filteruser(val) {
        this.$refs.usertree.filter(val)
      }
    },
    // 初始化
    mounted() { 
      this.getCompanyRole();
      this.getCompanyUser();
      this.getCompanyOrganization();
       
      this.getCompanyMenus();
    },
    data() {
      return {
        activeName: 'rolegrant',
        filterrole: '',
        filterorganization: '',
        filteruser: '',
        defaultroleProps: {
          children: 'children',
          label: 'name',
          id: 'id'
        },
        menuroleprops: {
          children: 'children',
          label: 'menuName',
          id: 'id'
        },
        roledata: [{ name: '超级管理员', id: '1', children: [] }, { name: '系统管理员', id: '2', children: [] }],
        menuroledata: [{ menuName: '系统管理', id: '1', children: [{ menuName: '角色管理', id: '3', children: [] }] }, { menuName: '开发工具', id: '2', children: [] }],


        defaultorganizationProps: {
          children: 'children',
          label: 'name',
          id: 'id'
        },
        menuorganizationprops: {
          children: 'children',
          label: 'menuName',
          id: 'id'
        },
        organizationdata: [{ name: '销售部', id: '1', children: [] }, { name: '研发部', id: '2', children: [] }],
        menuorganizationdata: [{ menuName: '系统管理', id: '1', children: [{ menuName: '角色管理', id: '3', children: [] }] }, { menuName: '开发工具', id: '2', children: [] }],



        defaultuserProps: {
          children: 'children',
          label: 'name',
          id: 'id'
        },
        menuuserprops: {
          children: 'children',
          label: 'menuName',
          id: 'id'
        },
        userdata: [{ name: '超级管理员', id: '1', children: [] }, { name: '系统管理员', id: '2', children: [] }],
        menuuserdata: [],//[{ menuName: '系统管理', id: '1', children: [{ menuName: '角色管理', id: '3', children: [] }] }, { menuName: '开发工具', id: '2', children: [] }],
        buttons: [],
        menus:[]
      }
    },
    // 方法
    methods: {

      SaveOrganization: function () { 
        var oraganizationsId = this.$refs.roletree.getCurrentKey();
        if (!oraganizationsId) {
          this.$message({
            message: '请选择机构',
            type: 'warning'
          });
          return;
        }
        var oms = [];
        var obs = [];
        var node = this.$refs.organizationchosetree.getCheckedNodes(false,true);
        if (node.length > 0) {
          for (var i = 0; i < node.length; i++) {
            if (!node[i].hasButton) {
              oms.push({ OrganizationId: oraganizationsId, MenuId: node[i].id })
            } else {
              obs.push({ OrganizationId: oraganizationsId, ButtonId: node[i].id })
            }
          }
          SaveOrganizationPermission({ Model: { OrganizationMenus: oms, OrganizationButtons: obs } })
        }
      },

      SaveRole: function () {
        var roleid = this.$refs.roletree.getCurrentKey();
        if (!roleid) {
          this.$message({
            message: '请选择角色',
            type: 'warning'
          });
          return;
        }
        var oms = [];
        var obs = [];
        var node = this.$refs.rolechosetree.getCheckedNodes(false, true);
        if (node.length > 0) {
          for (var i = 0; i < node.length; i++) {
            if (!node[i].hasButton) {
              oms.push({ RoleId: roleid, MenuId: node[i].id })
            } else {
              obs.push({ RoleId: roleid, ButtonId: node[i].id })
            }
          }
          SaveRolePermission({ Model: { RoleMenus: oms, RoleButtons: obs } })
        }
      },
      SaveUser: function () {
        var userid = this.$refs.usertree.getCurrentKey();
        if (!userid) {
          this.$message({
            message: '请选择角色',
            type: 'warning'
          });
          return;
        }
        var oms = [];
        var obs = [];
        var node = this.$refs.userchosetree.getCheckedNodes(false, true);
        if (node.length > 0) {
          for (var i = 0; i < node.length; i++) {
            if (!node[i].hasButton) {
              oms.push({ UserId: userid, MenuId: node[i].id })
            } else {
              obs.push({ UserId: userid, ButtonId: node[i].id })
            }
          }
          SaveUserPermission({ Model: { UserMenus: oms, UserButtons: obs } })
        }
      },


      changemode: function (t) {
        if (t.name == 'rolegrant') {
          this.getCompanyRole();
        }
        if (t.name == 'organizationgrant') {
          this.getCompanyOrganization();
        }
        if (t.name == 'usergrant') {
          this.getCompanyUser();
        }
     
      },

      SaveOrganizationPermission: function (data) {
        var owner = this;
        SaveOrganizationPermission(data).then(response => {
          
        })
      },


      SaveRolePermission: function (data) {
        var owner = this;
        SaveRolePermission(data).then(response => {

        })
      },


      SaveUserPermission: function (data) {
        var owner = this;
        SaveUserPermission(data).then(response => {

        })
      },

      // 获取单位角色
      getCompanyRole: function () {
        var owner = this; 
        GetList(null, "Roles", owner.$store.getters.company,true).then(response => {
          owner.roledata = (response.data) 
        })
      },

      // 获取单位用户
      getCompanyUser: function () {
        var owner = this;
        GetList(null, "Users", owner.$store.getters.company, true).then(response => {
          owner.userdata = (response.data)
        })
      },

      // 获取单位机构
      getCompanyOrganization: function () {
        var owner = this;
        GetList(null, "Organizations", owner.$store.getters.company, true).then(response => {
          owner.organizationdata = (response.data)
        })
      },
 
      // 获取单位按钮
      getCompanyMenus: function () {
        var owner = this;
        GetCompanyMenus().then(response => {
          owner.menuuserdata = (response.data)
          owner.menuorganizationdata = (response.data)
          owner.menuroledata = (response.data) 
        })
      },
      handleNodeRoleClick: function () { },
      filterRoleNode(value, data) {
        if (!value)
          return true
        return data.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
      },


      handleNodeOrganizationClick: function () { },
      filterOrganizationNode(value, data) {
        if (!value)
          return true
        return data.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
      },


      handleNodeUserClick: function () { },
      filterUserNode(value, data) {
        if (!value)
          return true
        return data.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
      },
    }
  }
</script>
