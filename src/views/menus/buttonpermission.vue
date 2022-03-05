<template>
  <div class="app-container"> 
    <el-container>
      <el-aside width="480px">

        <el-input v-model="filterText"
                  placeholder="输入关键字进行过滤" />

        <el-tree ref="tree" 
                 class="filter-tree"
                 :data="treedata"
                 node-key="id"
                 :props="defaultProps"
                 :filter-node-method="filterNode"
                 @node-click="handleNodeClick">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span style="color:orangered;font-weight:600;">{{ node.menuName }}</span>
            <span>
              <el-link type="primary" round @click="() => showbuttons(node, data)"
                       size="mini">
                {{data.menuName}}
              </el-link> &nbsp; &nbsp;
             
            </span>
          </span>
        </el-tree>

      </el-aside>
      <el-main>
        <commongrid v-if="ParentValue" IsRight="true" :ParentValue="ParentValue"></commongrid>
      </el-main>
    </el-container> 

  </div>
</template>
<script>
  import { GetCompanyMenus } from '@/api/menus'
  import commongrid from '@/views/snippet/grid.vue'
  export default {
    components: {
      commongrid
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val)
      }
    },
    // 初始化
    mounted() {
      this.GetCompanyMenus()
    },
    data() {
      return {
        ParentValue:'d',
        filterText: '',
        treedata: [],
        defaultProps: {
          children: 'children',
          label: 'menuName',
          id: 'id'
        }
      }
    },
    methods: {
      showbuttons: function (node, data) { },
      GetCompanyMenus: function () {
        const owner = this
        GetCompanyMenus().then(response => {
          owner.treedata = response.data
        })
      },
      handleNodeClick(data) {
        var owner = this
        this.ParentValue = ''; 
        this.$nextTick(() => {
          this.ParentValue = data.id
        })
      },
      filterNode(value, data) {
        if (!value)
          return true
        return data.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
          || (data.description && data.description.indexOf(value.toLowerCase()) !== -1)
      },
    }
  } 
</script>
