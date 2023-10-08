<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card class="box-card">
      <div style="margin: 15px 0">
        <el-input
          placeholder="请输入搜索内容"
          class="input-with-select"
        >
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="primary">添加用户</el-button>
      </div>
      <el-table :data="usersList" border stripe="">
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="roleName" label="用户名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="用户职责"> </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
    data(){
        return{
            // 获取用户列表的参数
            queryInfo:{
                query:'',
                pagenum:-1,
                pagesize:2
            },
            usersList:[]
        }
    },
    methods:{
        async getUsersList(){
            const res=await this.$http.get('users',{
                params:this.queryInfo
            })
            console.log(res.data);
        }
    },
    mounted(){
        this.getUsersList()
    }
};
</script>
<style>
.box-card {
  margin-top: 16px;
}
.input-with-select {
  width: 400px;
  margin-right: 20px;
}
</style>