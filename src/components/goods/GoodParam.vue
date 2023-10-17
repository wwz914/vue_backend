<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区 -->
    <el-card class="box-card">
        <el-alert
            title="注意:只允许为第三级分类设置相关参数！"
            type="warning"
            show-icon
            :closable="false">
        </el-alert>
        <div class="selectBox">
            <span style="margin-right:10px">选择商品分类:</span>
            <el-cascader
            v-model="selectedKey"
            :options="CateArr"
            :props="cascaderProp"
            clearable
            @change="cateChange"></el-cascader>
        </div>
        <!-- 标签页 -->
        <el-tabs v-model="activeName" @tab-click="handleClick()">
            <el-tab-pane label="动态参数" name="many">
                <el-button type="primary" :disabled="param1Btn" @click="addPopBtn">添加参数</el-button>
                <el-table :data="curActiveParam" border stripe="" index-text='#'>
                    <!-- 展开列 -->
                    <el-table-column type="expand">
                    <template>
                    </template>
                    </el-table-column>
                    <!-- 数字列 -->
                    <el-table-column type="index"> </el-table-column>
                    <!-- 名称列 -->
                    <el-table-column prop="attr_name" label="参数名称"></el-table-column>
                    <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="editParamBtn(scope.row)"
                        ><i class="el-icon-edit"></i>修改</el-button
                        >
                        <el-button type="danger" @click="deleteParamBtn(scope.row)"
                        ><i class="el-icon-delete"></i>删除</el-button
                        >
                    </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="静态属性" name="only">
                <el-button type="primary" :disabled="param2Btn" @click="addPopBtn">添加属性</el-button>
                <el-table :data="curStillAttibute" border stripe="">
                    <!-- 展开列 -->
                    <el-table-column type="expand">
                            <el-tag>
                                123456
                            </el-tag>
                            <el-tag
                            v-for="(item) in dynamicTags"
                            :key="item">
                            {{item}}
                            </el-tag>
                        <!-- <template slot-scope="scope"> -->
                            <!-- <el-input
                            class="input-new-tag"
                            v-if="inputTagVisible"
                            v-model="inputTagValue"
                            ref="saveTagInput"
                            size="small"
                            @keyup.enter.native="handleInputConfirm"
                            @blur="handleInputConfirm"
                            >
                            </el-input>
                            <el-button v-else class="button-new-tag" size="small" @click="showTagInput">+ New Tag</el-button> -->
                        <!-- </template> -->
                    </el-table-column>
                    <!-- 数字列 -->
                    <el-table-column type="index"> </el-table-column>
                    <!-- 名称列 -->
                    <el-table-column prop="attr_name" label="属性名称"> </el-table-column>
                    <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="editParamBtn(scope.row)"
                        ><i class="el-icon-edit"></i>修改</el-button
                        >
                        <el-button type="danger" @click="deleteParamBtn(scope.row)"
                        ><i class="el-icon-delete"></i>删除</el-button
                        >
                    </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
    </el-card>
    <!-- 属性/参数添加弹窗 -->
    <el-dialog :title="'修改'+pop_ups_name" :visible.sync="addPopDialogVisible" @close="closeAddPopForm">
      <!-- 主体内容 -->
      <el-form :model="addParamInfo" :rules="addPopFormRules" ref="addPopFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="activeName=='many'?'动态参数':'静态属性'" prop="attr_name"><el-input v-model="addParamInfo.attr_name"></el-input></el-form-item>       
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addPopDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addPop()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 属性/参数修改弹窗 -->
    <el-dialog title="修改" :visible.sync="editPopDialogVisible" @close="closeEditPopForm">
      <!-- 主体内容 -->
      <el-form :model="editPopInfo" :rules="editFormRules" ref="editFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="activeName=='many'?'动态参数':'静态属性'" prop="attr_name"><el-input v-model="editPopInfo.attr_name"></el-input></el-form-item>       
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editPopDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParam()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除弹窗 -->
    <el-dialog title="删除" :visible.sync="deletePopDialogVisible" width="30%">
      <!-- 主体内容 -->
      <span>你确定要删除这个参数or属性吗???</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deletePopDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteParam()">确 定</el-button>
      </span>
    </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return{
            // 从级联选择器中获取的id
            selectedKey:[],
            // 所有分类数据
            CateArr:[],
            // 级联规则
            cascaderProp:{
                value:'cat_id',
                label:'cat_name',
                children:'children',
                expandTrigger: 'hover',
            },
            
            // 当前标签页
            activeName:'many',
            // 根据id获取的商品参数
            curCate:{},
            // 是否禁用按钮
            param1Btn:true,
            param2Btn:true,
            // 当前项动态参数
            curActiveParam:[],
            // 当前项静态属性
            curStillAttibute:[],
            // 当前分类id
            cateId:0,
            //当前参数/属性
            curParam:{},
            // 当前弹窗名称
            pop_ups_name:'',
            // 新增参数信息
            addParamInfo:{},
            // 编辑参数信息
            editPopInfo:{},
            //动态参数
            dynamicTags:[],
            //新增标签名称
            inputTagValue:'',
            // 新增参数输入规则
            addPopFormRules:{
                attr_name:[
                    { required: true, message: '请输入名称', trigger: 'blur' },
                    { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
                ]
            },
            editFormRules:{
                attr_name:[
                    { required: true, message: '请输入名称', trigger: 'blur' },
                    { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
                ]
            },
            addPopDialogVisible:false,
            deletePopDialogVisible:false,
            editPopDialogVisible:false,
            inputTagVisible:false,
        }
    },
    // 函数区
    methods:{
        // 获取所有分类
        async getCateArr(){
            const {data:res}=await this.$http.get('categories')
            this.CateArr=res.data
        },
        // 级联变化函数
        async cateChange(){
            // 获取选中分类id
            if(!this.selectedKey.length)return
            this.cateId=this.selectedKey[this.selectedKey.length-1]
            // 用id查询分类
            const {data:res1}=await this.$http.get(`categories/${this.cateId}`)
            this.curCate=res1.data
            // 用id获取参数
            const {data:res}=await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:'many'}})
            if(res.meta.status!=200)return this.$$message.error(res.meta.msg)
            this.curActiveParam=res.data
            this.param1Btn=false
            this.param2Btn=false    
            res.data.forEach(item=>{
                item.attr_vals=item.attr_vals.split(',')
            })
            this.dynamicTags=res.data[0].attr_vals
            console.log(this.dynamicTags);
            console.log(res);
            this.pop_ups_name='添加动态参数'
        },
        // 点击切换参数/属性数据源
        async handleClick(){
            // 更改弹窗名
            if(this.activeName=='many'){
                this.pop_ups_name='添加动态参数'
            }else if(this.activeName=='only'){
                this.pop_ups_name='添加静态属性'
            }
            if(!this.selectedKey.length)return
            const {data:res}=await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:this.activeName}})
            if(res.meta.status!=200)return this.$message.error(res.meta.msg)
            if(this.activeName=='many'){
                this.curStillAttibute=res.data
            }else if(this.activeName=='only'){
                this.curStillAttibute=res.data
            }
            console.log(res);
        },


        //添加
        //打开弹窗
        addPopBtn(){
            this.addPopDialogVisible=true
        },
        //添加参数/属性，关闭弹窗
        addPop(){
            this.$refs.addPopFormRef.validate(async valid=>{
                if(!valid)return
                    const {data:res}=await this.$http.post(`categories/${this.cateId}/attributes`,{
                        attr_name:this.addParamInfo.attr_name,
                        attr_sel:this.activeName
                    })
                    console.log(res);
                    if(res.meta.status!=201)return this.$message.error(res.meta.msg)
                    // 更新视图
                    if(this.activeName=='many')this.cateChange()
                    else this.handleClick()
                    this.addPopDialogVisible=false
                }
            )
        },


        //编辑
        editParamBtn(node){
            this.editPopDialogVisible=true
            this.curParam=node
        },
        async editParam(){
            this.editPopDialogVisible=false
            const {data:res}=await this.$http.put(`categories/${this.cateId}/attributes/${this.curParam.attr_id}`,{
                attr_name:this.editPopInfo.attr_name,
                attr_sel:this.activeName
            })
            console.log(res);
            if(res.meta.status!=200)return this.$message.error(res.meta.msg)
            this.$message.success('修改成功')
            // 更新视图
            if(this.activeName=='many')this.cateChange()
            else this.handleClick()
        },


        //删除
        //打开弹窗
        deleteParamBtn(node){
            this.deletePopDialogVisible=true
            this.curParam=node
        },
        async deleteParam(){
            this.deletePopDialogVisible=false
            const {data:res}=await this.$http.delete(`categories/${this.cateId}/attributes/${this.curParam.attr_id}`)
            console.log(res);
            if(res.meta.status!=200)return this.$message.error(res.meta.msg)
            this.$message.success('删除成功')
            // 更新视图
            if(this.activeName=='many')this.cateChange()
            else this.handleClick()
        },
        tagClose(node){
            console.log(node)
        },
        showTagInput(){
            this.inputTagVisible=true
        },
        closeAddPopForm(){
            this.$refs.addPopFormRef.resetFields()
        },
        handleInputConfirm(){
            this.inputTagVisible=false
        },
        closeEditPopForm(){}
    },
    created(){
        this.getCateArr()
    }
}
</script>
<style>
.box-card {
  margin-top: 16px;
}
.selectBox{
  margin-top: 10px;
}
.el-table{
    margin-top: 10px;
}
.el-table__expanded-cell{
    height: 60px;
}
</style>