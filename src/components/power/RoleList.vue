<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:15px">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card class="box-card">
      <el-button type="primary" style="margin-bottom:10px" @click="addRoleBtn">添加角色</el-button>
      <el-table :data="rolesList" border stripe="">
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <el-row
              :class="['tagBottom', index1 == 0 ? 'tagTop' : '', 'vcenter']"
              v-for="(i1, index1) in scope.row.children"
              :key="i1.id"
              style="margin:0 46px"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5"
                ><el-tag closable @close="removeRights(scope.row, i1.id)">{{
                  i1.authName
                }}</el-tag
                ><i class="el-icon-caret-right"></i
              ></el-col>
              <!-- -->
              <el-col :span="19">
                <!-- 渲染二级权限 -->
                <el-row
                  :class="[index2 == 0 ? '' : 'tagTop', 'vcenter']"
                  v-for="(i2, index2) in i1.children"
                  :key="i2.id"
                >
                  <el-col :span="6"
                    ><el-tag
                      type="success"
                      closable
                      @close="removeRights(scope.row, i2.id)"
                      >{{ i2.authName }}</el-tag
                    ><i class="el-icon-caret-right"></i
                  ></el-col>
                  <!-- 渲染三级权限 -->
                  <el-col :span="18"
                    ><el-tag
                      type="warning"
                      v-for="i3 in i2.children"
                      :key="i3.id"
                      closable
                      @close="removeRights(scope.row, i3.id)"
                      >{{ i3.authName }}</el-tag
                    ></el-col
                  >
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 数字列 -->
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色职责"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" @click="editRoleBtn(scope.row)"
              ><i class="el-icon-edit"></i>编辑</el-button
            >
            <el-button type="danger" @click="deleteRoleBtn(scope.row)"
              ><i class="el-icon-delete"></i>删除</el-button
            >
            <el-button type="warning" @click="allotRightsBtn(scope.row)"
              ><i class="el-icon-setting"></i>分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 弹框区 -->
    <!-- 角色添加弹窗 -->
    <el-dialog title="添加角色" :visible.sync="addRoleDialogVisible" @close="closeAddRoleForm">
      <!-- 主体内容 -->
      <el-form :model="RoleInfo" :rules="addRoleFormRules" ref="addRoleFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="角色名" prop="roleName"><el-input v-model="RoleInfo.roleName"></el-input></el-form-item>       
        <el-form-item label="角色描述" prop="roleDesc"><el-input v-model="RoleInfo.roleDesc"></el-input></el-form-item>       
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 角色修改弹窗 -->
    <el-dialog title="修改用户信息" :visible.sync="editRoleDialogVisible" @close="closeEditRoleForm">
      <!-- 主体内容 -->
      <el-form :model="editRoleInfo" :rules="editFormRules" ref="editFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="角色ID" prop="id"><el-input v-model="editRoleInfo.id" disabled :placeholder="RoleInfo.id"></el-input></el-form-item>       
        <el-form-item label="角色名称" prop="roleName"><el-input v-model="editRoleInfo.roleName" :placeholder="RoleInfo.roleName"></el-input></el-form-item>       
        <el-form-item label="角色描述" prop="roleDesc"><el-input v-model="editRoleInfo.roleDesc" :placeholder="RoleInfo.roleDesc"></el-input></el-form-item>       
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole(RoleInfo.id)">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除弹窗 -->
    <el-dialog title="删除角色信息" :visible.sync="deleteRoleDialogVisible" width="30%">
      <!-- 主体内容 -->
      <span>你确定要删除这个角色吗???</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteRole(RoleId)">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 角色授权弹窗 -->
    <el-dialog title="提示" :visible.sync="isRightsVisible" @close="defaultRightsArr=[]">
      <el-tree
        :data="dataTree"
        :props="treeProps"
        show-checkbox
        default-expand-all
        node-key="id"
        :default-checked-keys="defaultRightsArr"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isRightsVisible = false;defaultRightsArr=[]">取 消</el-button>
        <el-button type="primary" @click="allotRights"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 角色对象数据
      rolesList: [],
      // tree组件的数据来源
      dataTree: [],
      // tree组件的定制数据规则属性对象
      treeProps: {
        children: "children",
        label: "authName",
      },
      // 该角色原始权限
      defaultRightsArr: [],
      // 新增角色信息
      RoleInfo:{},
      editRoleInfo:{},
      // 新增角色输入规则
      addRoleFormRules:{
        roleName:[
          { required: true, message: '请输入角色名', trigger: 'blur' },
            { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        roleDesc:[
          { required: true, message: '请输入角色描述', trigger: 'blur' },
            { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
      },
      //修改角色输入规则
      editFormRules:{
        roleName:[
          { required: true, message: '请输入角色名', trigger: 'blur' },
            { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        roleDesc:[
          { required: true, message: '请输入角色描述', trigger: 'blur' },
            { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
      },
      // 角色id
      RoleId:0,
      // 各弹窗的出现与否
      isRightsVisible: false,
      addRoleDialogVisible:false,
      deleteRoleDialogVisible:false,
      editRoleDialogVisible:false
    };
  },
  methods: {
    // 获取角色对象
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      console.log(res);
      this.rolesList = res.data;
    },
    // 确认弹窗删除权限
    async removeRights(role, rightId) {
      const removeRes = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (removeRes != "confirm") {
        return this.$message.info("取消删除");
      } else {
        const res = this.$http.delete(`roles/${role.id}/rights/${rightId}`);
        console.log(res);
        if (res.meta.status != 200) {
          return this.$message.error("删除权限失败！");
        }
        // 通过vue响应式实时更新删除权限后的界面，不用重新加载整个页面，提高用户体验
        // role就是该角色的所有权限的对象引用，与响应的res.data一样
        role.children = res.data;
      }
    },
    // 获取系统所有权限，返回数据为树状结构
    async getRightsList() {
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status != 200) {
        return this.$message.error(res.meta.msg);
      }
      return res.data;
    },
    // 获取原始权限数组
    getDefaultArr(node){
      if(!node.children){
        return this.defaultRightsArr.push(node.id)
      }
      node.children.forEach(i=>this.getDefaultArr(i))
    },


    // 添加
    // 打开添加角色弹窗
    addRoleBtn(){
      this.addRoleDialogVisible=true
    },
    // 添加角色，关闭弹窗(有Bug，记得改)
    async addRole(){
      const {data:res} =await this.$http.post('roles',this.RoleInfo);
      console.log(res);
      if(res.meta.status!=201)return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      // 更新列表
      this.getRolesList()
      // 关闭弹窗
      this.addRoleDialogVisible=false
    },
    

    //编辑
    //打开编辑弹窗
    editRoleBtn(node){
      this.editRoleDialogVisible=true
      this.RoleInfo=node
    },
    //编辑角色，关闭弹窗
    editRole(id){
      this.$refs.editFormRef.validate(async valid=>{
        if(!valid)return; 
        const {data:res}=await this.$http.put(`roles/${id}`,this.editRoleInfo)
        console.log(res);
        if(res.meta.status!=200)return this.$message.error(res.meta.msg)
        this.$message.success('编辑成功')
        // 更新列表
        this.getRolesList()
        // 关闭弹窗
        this.editRoleDialogVisible=false
      })
    },


    // 删除
    // 打开删除弹窗
    deleteRoleBtn(node){
      this.deleteRoleDialogVisible=true
      this.RoleId=node.id
    },
    //删除角色，关闭弹窗
    async deleteRole(id){
      const {data:res}=await this.$http.delete(`roles/${id}`)
      console.log(res);
      if(res.meta.status!=200)this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      // 更新列表
      this.getRolesList()
      // 关闭弹窗
      this.deleteRoleDialogVisible=false
    },


    // 授权
    // 弹出编辑框，分配角色权限
    async allotRightsBtn(node) {
      console.log(node);
      // 给该角色赋值id
      this.RoleId=node.id
      this.getDefaultArr(node);
      // 弹框出现
      this.isRightsVisible = true;
      // 给tree组件添加源数据
      this.dataTree = await this.getRightsList();
    },
    // 分配权限,然后关闭弹窗(记住一定要加async和await解决promise返回问题！)
    async allotRights(){
      // 收集权限id
      let keys=[
        ...this.$refs.treeRef.getHalfCheckedKeys(),
        ...this.$refs.treeRef.getCheckedKeys(),
      ];
      keys=keys.join(',')
      const {data:res}=await this.$http.post(`roles/${this.RoleId}/rights`,{rids:keys})
      console.log(res);
      if(res.meta.status!=200)return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getRolesList()
      this.isRightsVisible = false
    },
    closeAddRoleForm(){
      this.$refs.addRoleFormRef.resetFields()
    },
    closeEditRoleForm(){
      this.$refs.editFormRef.resetFields()
    }
  },
  created() {
    // 执行methods中的函数
    this.getRolesList();
  },
};
</script>
<style scoped>
* {
  border-collapse: collapse;
}
.el-tag {
  margin: 7px;
}
.tagBottom {
  border-bottom: 1px solid rgb(231, 229, 229);
  /* padding:0 20px */
}
.tagTop {
  border-top: 1px solid rgb(228, 227, 227);
  /* padding:0 20px */
}
</style>
