<template>
  <el-container class="home-body">
    <!-- 头部 -->
    <el-header class="home-header">
      <div class="header-left">
        <img src="../assets/logo.png" />
        <span style="font-size: 23px; color: #fff">电商后台管理系统</span>
      </div>
      <el-button type="info" class="exitButton" @click="exit">退出</el-button>
    </el-header>
    <el-container>
    <!-- 侧边栏 -->
      <el-aside :width="isOpen?'64px':'200px'" class="home-aside">
        <!-- 展开或关闭菜单按钮 -->
        <div class="on_off_btn" @click="toggleMenu">|||</div>
        <el-row class="tac">
          <el-col :span="12" style="width: 100%;">
            <el-menu
              :default-active="activePath"
              :unique-opened="true"	
              class="el-menu-vertical-demo"
              background-color="#323743"
              text-color="#fff"
              active-text-color="#4a9cf0"
              border-right=0
              :collapse="isOpen"
              :collapse-transition="isCollapse"
              :router="true"
            >
              <!-- 一级菜单 -->
              <el-submenu :index="m.id+''" v-for="m in menuArr" :key="m.id">
                <template slot="title">
                  <i class="el-icon-location" :class="fontArr[m.id]"></i>
                  <span>{{m.authName}}</span>
                </template>
                <!-- 二级菜单 -->
                <el-menu-item-group>
                  <el-menu-item :index="'/'+i.path"  v-for="i in m.children" :key="i.id" @click="activeColor('/'+i.path)">
                    <i class="el-icon-menu"></i>{{i.authName}}</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
            </el-menu>
          </el-col>
        </el-row>
      </el-aside>
      <!-- 主体 -->
      <el-main class="home-main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data(){
    return{
      menuArr:[],
      fontArr:{
        125:'iconfont icon-users',
        103:'iconfont icon-tijikongjian',
        101:'iconfont icon-shangpin',
        102:'iconfont icon-danju',
        145:'iconfont icon-baobiao'
      },
      isOpen:false,
      isCollapse:false,
      activePath:''
    }
  },
  methods: {
    exit() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getList(){
     const {data:res}=await this.$http.get('menus');
     if(res.meta.status!=200){
       this.$message.error('列表数据获取失败！');
       return;
     }
     console.log(res);
     this.menuArr=res.data
    },
    toggleMenu(){
      this.isOpen=!this.isOpen
    },
    activeColor(activePath){
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath=activePath
    }
  },
  created(){
    this.getList()
  },
  mounted(){
    // 存储需要高亮的区域的路径
    this.activePath=window.sessionStorage.getItem('activePath')
  }
};
// @open="handleOpen"
// @close="handleClose"
</script>

<style>
.home-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #373d3f;
}
.home-aside {
  background-color: #323743;
}
.home-main {
  background-color: #e9edf0;
}
.home-body {
  height: 100%;
}
.header-left {
  display: flex;
  align-items: center;
}
.exitButton {
  width: 80px;
  height: 40px;
  text-align: center;
}
.on_off_btn{
  width: 100%;
  color: #fff;
  text-align: center;
  cursor: pointer;
  background: #485160;
}
.el-menu-vertical-demo{
  border-right: 0;
}
img {
  width: 10%;
}
</style>