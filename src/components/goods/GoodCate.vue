<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb
      separator-class="el-icon-arrow-right"
      style="margin-bottom: 15px"
    >
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card class="box-card">
      <!-- 添加按钮 -->
      <el-button type="primary" style="margin-bottom: 15px" @click="addCateBtn">添加分类</el-button>
      <!-- 商品表格 -->
      <zk-table
        :data="goodsList"
        :columns="columns"
        tree-type
        :selection-type="false"
        show-row-hover
        show-index
        :expand-type="false"
        index-text='#'
        border
      >
      <template slot="isok" slot-scope="scope">
        <i class="el-icon-success" v-if="scope.row.cat_deleted==false" style="color:green"></i>
        <i class="el-icon-error"  v-if="scope.row.cat_deleted!=false" style="color:red"></i>
      </template>
      <template slot="goodLevel" slot-scope="scope">
        <el-tag v-if="scope.row.cat_level == 0">一级</el-tag>
        <el-tag type="success" v-if="scope.row.cat_level == 1">二级</el-tag>
        <el-tag type="info" v-if="scope.row.cat_level == 2">三级</el-tag>
      </template>
      <template slot="operations" slot-scope="scope">
          <el-button type="primary" @click="editCateBtn(scope.row)"><i class="el-icon-edit"></i>编辑</el-button>
          <el-button type="danger" @click="deleteCateBtn(scope.row)"><i class="el-icon-delete"></i>删除</el-button>
      </template>
      </zk-table>
      <!-- 分页组件 -->
      <el-pagination
        background
        layout="prev, pager, next"
        :total="dataTotal"
        @next-click="nextPage"
        @prev-click="prevPage"
        @current-change="changePage"
        style="margin-top: 12px"
      >
      </el-pagination>
    </el-card>
    <!-- 商品添加弹窗 -->
    <el-dialog title="添加商品" :visible.sync="addCateDialogVisible" @close="closeAddCateForm">
      <!-- 主体内容 -->
      <el-form :model="addCateInfo" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="分类名称" prop="cat_name"><el-input v-model="addCateInfo.cat_name"></el-input></el-form-item>  
        <div class="block">
          <span class="demonstration">父级分类：</span>
          <el-cascader
            v-model="parentCateKey"
            :options="parentCateArr"
            :props="cascaderProp"
            clearable
            :change-on-select="true"
            @change="handleChange"></el-cascader>
        </div>     
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分类编辑弹窗 -->
    <el-dialog title="编辑分类信息" :visible.sync="editCateDialogVisible" @close="closeEditCateForm">
      <!-- 主体内容 -->
      <el-form :model="editCateInfo" :rules="editFormRules" ref="editFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="分类ID" prop="cat_id"><el-input v-model="editCateInfo.cat_id" disabled :placeholder="editCateInfo.cat_id"></el-input></el-form-item>       
        <el-form-item label="分类名称" prop="cat_name"><el-input v-model="editCateInfo.cat_name" :placeholder="editCateInfo.cat_name"></el-input></el-form-item>       
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate(editCateInfo.cat_id)">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分类删除弹窗 -->
    <el-dialog title="删除分类信息" :visible.sync="deleteCateDialogVisible" width="30%">
      <!-- 主体内容 -->
      <span>你确定要删除这个分类吗???</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteCate(deleteCateInfo.cat_id)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 商品目录
      goodsList: [],
      catesInfo: {
        type: [1, 2, 3],
        pagenum: 1,
        pagesize: 5,
      },
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
          width: "300px",
        },
        {
          label: "是否有效",
          prop: "cat_deleted",
          width: "300px",
          type:'template',
          template:'isok'
        },
        {
          label: "排序",
          prop: "cat_level",
          width: "300px",
          type:'template',
          template:'goodLevel'
        },
        {
          label: "操作",
          prop: "",
          width: "300px",
          type:'template',
          template:'operations'
        },
      ],
      // 新增输入规则
      addCateFormRules:{
        cat_pid:[{trigger:'blur'}],
        cat_name:[
          { required: true, message: '请输入分类名', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        cat_level:[{trigger:'blur'}],
      },
      editFormRules:{
        cat_name:[
          { required: true, message: '请输入分类名', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ]
      },
      // 新增分类信息
      addCateInfo:{},
      // 编辑分类信息
      editCateInfo:{},
      // 删除分类信息
      deleteCateInfo:{},
      //父级分类数组
      parentCateArr:[],
      parentCateKey:{},
      cascaderProp:{
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      // 总页数
      dataTotal: 1000,
      addCateDialogVisible:false,
      editCateDialogVisible:false,
      deleteCateDialogVisible:false,
    };
  },
  methods: {
    // 获取分类数据
    async getGoodLists() {
      const { data: res } = await this.$http.get("categories", {
        params: this.catesInfo,
      });
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      console.log(res.data);
      this.dataTotal=res.data.total*10
      this.goodsList = res.data.result;
    },
    // 获取父级分类数据
    async getParentGoodLists(){
      const {data:res}=await this.$http.get('categories',{params:{type:2}})
      // console.log(res.data);
      this.parentCateArr=res.data
    },


    //添加
    //打开添加弹窗
    addCateBtn(){
      this.getParentGoodLists()
      this.addCateDialogVisible=true
    },
    // 添加商品，关闭弹窗
    addCate(){
      this.addCateDialogVisible=false
      this.$refs.addCateFormRef.validate(async valid=> {
        if(!valid)return;
        const {data:res}=await this.$http.post('categories',this.addCateInfo)
        console.log(res);
        if (res.meta.status != 201) return this.$message.error(res.meta.msg);
        this.$message.success('分类添加成功')
        console.log(res.data);
        this.getGoodLists()
      })
    },
    handleChange(){
      // console.log(this.parentCateKey);
      if(this.parentCateKey.length<=0)return
      // 给要添加的数据赋值
      this.addCateInfo.cat_pid=this.parentCateKey[this.parentCateKey.length-1];
      this.addCateInfo.cat_level=this.parentCateKey.length
      // console.log(this.addCateInfo);
    },


    // 编辑
    // 打开编辑弹窗
    editCateBtn(node){
      this.editCateInfo=node
      this.editCateDialogVisible=true
    },
    // 编辑信息，关闭弹窗
    editCate(id){
      this.$refs.editFormRef.validate(async valid=>{
        if(!valid)return;
        this.editCateDialogVisible=false
        const {data:res}=await this.$http.put(`categories/${id}`,this.editCateInfo)
        if (res.meta.status != 200) return this.$message.error(res.meta.msg);
        this.$message.success('分类编辑成功')
        console.log(res);
        // 更新视图
        this.getGoodLists()
      })
    },


    //删除
    // 打开删除弹窗
    deleteCateBtn(node){
      this.deleteCateInfo=node
      this.deleteCateDialogVisible=true
    },
    // 删除分类，关闭弹窗
    async deleteCate(id){
      this.deleteCateDialogVisible=false,
      await this.$http.delete(`categories/${id}`)
      this.getGoodLists()
    },
    
    
    nextPage() {
      this.catesInfo.pagenum++
      this.getGoodLists()
    },
    prevPage() {
      this.catesInfo.pagenum--
      this.getGoodLists()
    },
    changePage(newPage) {
      this.catesInfo.pagenum = newPage;
      // 更新页面数据，相当于重新发送一遍请求
      this.getGoodLists();
    },
    closeAddCateForm(){
      this.$refs.addCateFormRef.resetFields()
    },
    closeEditCateForm(){
      this.$refs.editFormRef.resetFields()
    }
  },
  created() {
    this.getGoodLists();
  },
};
</script>
<style>
.el-cascader-menu{
  width: 100%;
  height: 300px;
}
.block{
  padding-left: 30px;
}
.el-cascader{
  width:auto
}
.el-dialog{
  width: 22%;
}
</style>