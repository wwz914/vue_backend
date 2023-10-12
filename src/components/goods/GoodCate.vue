<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card class="box-card">
      <!-- 添加按钮 -->
      <el-button type="primary">添加分类</el-button>
      <!-- 商品表格 -->
      <el-table :data="goodsList" border style="width: 100%">
        <el-table-column type="index">
        </el-table-column>
        <el-table-column prop="cat_name" label="分类名称" width="25%">
        </el-table-column>
        <el-table-column prop="cat_deleted" label="是否有效" width="25%">
        </el-table-column>
        <el-table-column prop="cat_level" label="排序" width="25%">
          <el-tag>一级</el-tag>
          <el-tag type="success">二级</el-tag>
          <el-tag type="warning">三级</el-tag>
        </el-table-column>
        <el-table-column label="操作" width="25%">
          <el-button type="primary"><i class="el-icon-edit"></i>编辑</el-button>
          <el-button type="danger"><i class="el-icon-delete"></i>删除</el-button>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      goodsList: [],
      catesInfo:{
        type:[1,2,3],
        pagenum:1,
        pagesize:5
      }
    };
  },
  methods:{
    async getGoodLists(){
        const {data:res}=await this.$http.get('categories',{params:this.catesInfo})
        if(res.meta.status!=200)return this.$message.error(res.meta.msg)
        console.log(res);
    }
  },
  created(){
    this.getGoodLists()
  }
};
</script>
<style scoped>
</style>