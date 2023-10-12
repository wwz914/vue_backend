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
          v-model="queryInfo.query"
          clearable
          @clear="clearInput"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getUsersList()"
          ></el-button>
        </el-input>
        <el-button type="primary" @click="addUserDialogVisible=true">添加用户</el-button>
      </div>
      <el-table :data="usersList.users" border stripe="">
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#409dfd"
              inactive-color="#dfe3e5"
              @change="areYouOk(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" @click="editUsersBtn(scope.row)"><i class="el-icon-edit"></i></el-button>
            <el-button type="danger" @click="deleteUsersBtn(scope.row)"><i class="el-icon-delete"></i></el-button>
            <el-button type="warning" @click="setUsersBtn(scope.row)"
              ><i class="el-icon-setting"></i
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-pagination
        background
        layout="prev, pager, next"
        :total="dataTotal"
        @next-click="nextPage"
        @prev-click="prevPage"
        @current-change="changePage"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户添加弹窗 -->
    <el-dialog title="添加用户" :visible.sync="addUserDialogVisible" @close="closeAddForm">
      <!-- 主体内容 -->
      <el-form :model="addUserInfo" :rules="addFormRules" ref="ruleFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username"><el-input v-model="addUserInfo.username"></el-input></el-form-item>       
        <el-form-item label="密码" prop="password"><el-input v-model="addUserInfo.password"></el-input></el-form-item>       
        <el-form-item label="邮箱" prop="email"><el-input v-model="addUserInfo.email"></el-input></el-form-item>       
        <el-form-item label="手机" prop="mobile"><el-input v-model="addUserInfo.mobile"></el-input></el-form-item>       
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserBtn()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加用户修改弹窗 -->
    <el-dialog title="修改用户信息" :visible.sync="editUserDialogVisible" @close="closeEditForm">
      <!-- 主体内容 -->
      <el-form :model="editUserInfo" :rules="editFormRules" ref="editFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username"><el-input v-model="editUserInfo.username" disabled :placeholder="findUserById.username"></el-input></el-form-item>       
        <el-form-item label="邮箱" prop="email"><el-input v-model="editUserInfo.email" :placeholder="findUserById.email"></el-input></el-form-item>       
        <el-form-item label="手机" prop="mobile"><el-input v-model="editUserInfo.mobile" :placeholder="findUserById.mobile"></el-input></el-form-item>       
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUsers(findUserById.id)">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加用户删除弹窗 -->
    <el-dialog title="删除用户信息" :visible.sync="deleteUserDialogVisible" width="30%">
      <!-- 主体内容 -->
      <span>你确定要删除这个用户吗???</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteUsers(findUserById.id)">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加用户分配权限弹窗 -->
    <el-dialog title="删除用户信息" :visible.sync="setUserDialogVisible" width="30%">
      <!-- 主体内容 -->
      <div>用户名:{{findUserById.username}}</div>
      <div>用户角色:{{findUserById.role_name}}</div>
      <el-select v-model="CharId" placeholder="请选择角色">
        <el-option
          v-for="item in Characters"
          :key="item.id"
          :label="item.roleName"
          :value="item.id">
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setUsers(findUserById.id)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    var checkEmail=(rule,value,cb)=>{
      // 验证邮箱的规则
      var regEmail=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0_9-]{2,}$/
      if(regEmail.test(value))return cb()
      return cb('请输入格式正确的邮箱')
    }
      // 验证手机号的规则
    var checkMobile=(rule,value,cb)=>{
      var regMobile=/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
      if(regMobile.test(value))return cb()
      return cb('请输入格式正确的手机号')
    }
    return {
      // 获取用户列表的参数
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      // 添加用户请求的参数
      addUserInfo:{},
      // 修改用户信息请求的参数
      editUserInfo:{},
      //全部用户列表信息
      usersList: {},
      // 用户信息总页数
      dataTotal: 0,
      //各种弹窗的出现状态
      addUserDialogVisible: false,
      editUserDialogVisible:false,
      deleteUserDialogVisible:false,
      setUserDialogVisible:false,
      // 添加-输入框规则
      addFormRules:{
        username:[
          { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        password:[
          { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        email:[
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {validator:checkEmail}
        ],
        mobile:[
          { required: true, message: '请输入手机', trigger: 'blur' },
          {validator:checkMobile}
        ]
      },
      // 编辑-输入框规则
      editFormRules:{
        email:[
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {validator:checkEmail}
        ],
        mobile:[
          { required: true, message: '请输入手机', trigger: 'blur' },
          {validator:checkMobile}
        ]
      },
      // 按id查询所获的角色信息
      findUserById:{},
      Characters:[],
      CharId:0
    };
  },
  methods: {
    // 获取用户列表信息
    async getUsersList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      });
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      // console.log(res.data);
      this.usersList = res.data;
      this.dataTotal = res.data.total * 10;
    }, 


    // 添加用户
    addUserBtn(){
      // 表单预验证
      this.$refs.ruleFormRef.validate(async valid=>{
        // 若预验证失败就直接返回，不执行添加请求
        if(!valid)return;
        // 发送添加用户请求
        const {data:res}= await this.$http.post('users',this.addUserInfo)
        // console.log(res);
        if(res.meta.status!=201)return this.$message.error('添加用户失败')
        this.$message.success('添加用户成功')
        // 更新视图
        this.getUsersList()
        // 隐藏弹窗
        this.addUserDialogVisible = false
      })
    },


    // 编辑
    // 打开用户编辑弹窗并请求获取该用户原始信息
    async editUsersBtn(node){
      const {data:res}=await this.$http.get(`users/${node.id}`)
      // console.log(res);
      this.editUserDialogVisible=true
      this.findUserById=res.data
    },
    // 确定编辑用户信息
    editUsers(id) {
      this.$refs.editFormRef.validate(async valid=>{
        if(!valid)return;
      const {data:res}=await this.$http.put(`users/${id}`,this.editUserInfo)
      console.log(res);
      if(res.meta.status!=200)return this.$message.error('用户信息修改失败')
      this.$message.success('用户信息修改成功')
      // 更新视图
      this.getUsersList();
      // 关闭弹窗
      this.editUserDialogVisible=false
      })
    },


    
    //删除
    // 打开用户删除弹窗并请求获取该用户原始id
    async deleteUsersBtn(node){
      // 以id查询用户请求
      const {data:res}=await this.$http.get(`users/${node.id}`)
      this.deleteUserDialogVisible=true
      this.findUserById=res.data
      console.log(this.findUserById);
    },
    // 确定删除用户信息
    async deleteUsers(id){
      // 根据id删除用户请求
      const {data:res}=await this.$http.delete(`users/${id}`)
      console.log(res);
      if(res.meta.status!=200)return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      // 更新视图
      this.getUsersList()
      // 隐藏删除弹窗
      this.deleteUserDialogVisible=false
    },



    // 配权
    // 打开用户分配弹窗
    async setUsersBtn(node){
      console.log(node);
      this.findUserById=node
      this.setUserDialogVisible=true
      const {data:res} =await this.$http.get('roles')
      this.Characters=res.data
    },
    // 在弹窗中设置用户角色
    async setUsers(id){
      const {data:res}=await this.$http.put(`users/${id}/role`,{rid:this.CharId})
      console.log(res);
      if(res.meta.status!=200)return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
    // 更新视图
      this.getUsersList();
      // 关闭弹窗
      this.setUserDialogVisible=false;
    },


    // 状态
    // 修改用户状态
    async areYouOk(node) {
      const {data:res}=await this.$http.put(`users/${node.id}/state/${node.mg_state}`)
      console.log(res);
    },
    // 以下为分页栏组件函数
    changePage(newPage) {
      this.queryInfo.pagenum = newPage;
      // 更新页面数据，相当于重新发送一遍请求
      this.getUsersList();
    },
    prevPage(prevPage) {
      this.queryInfo.pagenum = prevPage;
      this.getUsersList();
    },
    nextPage(nextPage) {
      this.queryInfo.pagenum = nextPage;
      this.getUsersList();
    },
    //清除输入框更新列表数据
    clearInput() {
      this.getUsersList();
    },
    // 以下为关闭弹窗重置弹窗内容函数
    closeAddForm(){
      this.$refs.ruleFormRef.resetFields()
    },
    closeEditForm(){
      this.$refs.editFormRef.resetFields()
    }
  },
  mounted() {
    this.getUsersList();
  },
};
</script>
<style scoped>
.box-card {
  margin-top: 16px;
}
.input-with-select {
  width: 400px;
  margin-right: 20px;
}
.el-pagination {
  margin-top: 20px;
}
</style>