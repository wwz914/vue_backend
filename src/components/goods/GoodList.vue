<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb
        separator-class="el-icon-arrow-right"
        style="margin-bottom: 15px"
        >
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区 -->
        <el-card class="box-card">
        <div style="margin: 15px 0">
            <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="pageInfo.query"
            clearable
            @clear="clearInput"
            >
            <el-button
                slot="append"
                icon="el-icon-search"
                @click="getGoodsList()"
            ></el-button>
            </el-input>
            <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </div>
        <el-table :data="goodsList" border stripe="">
            <el-table-column type="index"> </el-table-column>
            <el-table-column prop="goods_name" label="商品名称" width="700px"> </el-table-column>
            <el-table-column prop="goods_price" label="商品价格" width="100px"> </el-table-column>
            <el-table-column prop="goods_weight" label="商品重量" width="100px"> </el-table-column>
            <el-table-column prop="add_time" label="创建时间" >
                <template slot-scope="scope">
                    {{scope.row.add_time |dateFormat}}
                </template>
            </el-table-column>
            <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button type="primary" @click="editGoodBtn(scope.row)"><i class="el-icon-edit"></i></el-button>
                <el-button type="danger" @click="deleteGoodBtn(scope.row)"><i class="el-icon-delete"></i></el-button>
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
        <!-- 商品删除弹窗 -->
        <el-dialog title="删除商品信息" :visible.sync="deleteGoodDialogVisible" width="30%">
            <!-- 主体内容 -->
            <span>你确定要删除这个商品吗???</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deleteGoodDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteGood(curGood.goods_id)">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 商品编辑弹窗 -->
        <el-dialog title="编辑商品信息(编辑商品信息功能维护中，请勿使用~)" :visible.sync="editGoodDialogVisible" @close="closeEditGoodForm" width="40%">
        <!-- 主体内容 -->
        <el-form :model="editGoodInfo" :rules="editFormRules" ref="editFormRef" label-width="100px" class="demo-ruleForm">
            <el-form-item label="商品名称" prop="goods_name"><el-input v-model="editGoodInfo.goods_name" :placeholder="editGoodInfo.goods_name"></el-input></el-form-item>       
            <el-form-item label="价格" prop="goods_price"><el-input v-model.number="editGoodInfo.goods_price" :placeholder="editGoodInfo.goods_price"></el-input></el-form-item>       
            <el-form-item label="数量" prop="goods_number"><el-input v-model.number="editGoodInfo.goods_number" :placeholder="editGoodInfo.goods_number"></el-input></el-form-item>       
            <el-form-item label="重量" prop="goods_weight"><el-input v-model.number="editGoodInfo.goods_weight" :placeholder="editGoodInfo.goods_weight"></el-input></el-form-item>       
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editGoodDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editGood(editGoodInfo.goods_id)">确 定</el-button>
        </span>
        </el-dialog>
        </el-card>
    </div>
</template>
<script>
export default {
    data(){
        return{
            //列表总页数
            dataTotal:1000,
            //新增商品信息
            addGoodInfo:{},
            //编辑商品信息
            editGoodInfo:{},
            // 当前商品信息
            curGood:{},
            //商品信息
            goodsList:[],
            //分页控制
            pageInfo:{
                query:'',
                pagenum:1,
                pagesize:10
            },
            //编辑商品输入规则
            editFormRules:{
                goods_name:[
                    { required: true, message: '请输入商品名称', trigger: 'blur' },
                    { min: 3, max: 150, message: '长度在 3 到 150 个字符', trigger: 'blur' }
                ],
                goods_price:[
                    { required: true, message: '请输入价格', trigger: 'blur' },
                    { type: 'number', message: '年龄必须为数字值'}
                ],
                goods_number:[
                    { required: true, message: '请输入数量', trigger: 'blur' },
                    { type: 'number', message: '年龄必须为数字值'}
                ],
                goods_weight:[
                    { required: true, message: '请输入重量', trigger: 'blur' },
                    { type: 'number', message: '年龄必须为数字值'}
                ],
            },
            addGoodDialogVisible:false,
            deleteGoodDialogVisible:false,
            editGoodDialogVisible:false,

        }
    },
    methods:{
        // 获取商品
        async getGoodsList(){
            const {data:res}=await this.$http.get('goods',{
                params:this.pageInfo
            })
            console.log(res);
            if(res.meta.status!=200)return this.$message.error(res.meta.msg)
            // 获取数据
            this.goodsList=res.data.goods
            // 获取总页数
            this.dataTotal=res.data.total*10
        },



        //添加
        //添加商品，关闭弹窗
        goAddPage(){
            this.$router.push('/goods/add')
        },
        
        // 编辑
        editGoodBtn(node){
            this.editGoodDialogVisible=true
            console.log(node);
            this.editGoodInfo={...node}
            console.log(this.editGoodInfo);
        },
        editGood(id){
            this.$refs.editFormRef.validate(async valid=>{
                if(!valid)return this.$message.error('请正确填写修改信息')
                else{
                    const {data:res}=await this.$http.put(`goods/${id}`,this.editGoodInfo)
                    console.log(res)
                    if(res.meta.status!=201)return this.$message.error('编辑信息失败')
                    this.getGoodsList()
                    this.editGoodDialogVisible=false
                }
            })
        },
        // 删除
        deleteGoodBtn(node){
            this.deleteGoodDialogVisible=true,
            this.curGood=node
        },
        async deleteGood(id){
            const {data:res}=await this.$http.delete(`goods/${id}`)
            console.log(res);
            this.deleteGoodDialogVisible=false
            if(res.meta.status!=200)return this.$message.error(res.meta.msg)
            this.getGoodsList()
        },
        clearInput(){
            this.getGoodsList()
        },
        // 分页组件函数
        nextPage(nextPage){
            this.pageInfo.pagenum=nextPage
            this.getGoodsList()
        },
        prevPage(prevPage){
            this.pageInfo.pagenum=prevPage
            this.getGoodsList()
        },
        changePage(changePage){
            this.pageInfo.pagenum=changePage
            this.getGoodsList()
        },
        closeAddForm(){},
        closeEditGoodForm(){},
    },
    mounted(){
        this.getGoodsList()
    }
}
</script>
<style>
.input-with-select{
    width: 400px;
    margin-right: 15px;
}
.el-pagination{
    margin-top: 15px;
}
.el-form-item{
    padding: 0;
}
</style>