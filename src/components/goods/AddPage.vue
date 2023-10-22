<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb
            separator-class="el-icon-arrow-right"
            style="margin-bottom: 15px"
            >
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-alert
                title="添加商品信息"
                type="info"
                center
                show-icon>
            </el-alert>
            <!-- 步骤条 -->
            <el-steps :active="activeStep-0" finish-status="success" space="20%" :align-center="true">
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <el-form :model="addForm" :rules="addRules" ref="addRuleForm" label-width="100px" class="demo-ruleForm" label-position="top">
                <!-- 左侧标签栏 -->
                <el-tabs v-model="activeStep" :tab-position="'left'" :before-leave="tabChange">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model.number="addForm.goods_price"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model.number="addForm.goods_weight"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model.number="addForm.goods_number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <el-cascader
                                v-model="addForm.goods_cat"
                                :options="CateArr"
                                :props="cascaderProp"
                                clearable
                                @change="cateChange">
                            </el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item v-for="item in manyGoodParams" :key="item.attr_id">
                            {{item.attr_name}}
                            <br>
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox border :checked="false" :label="tag" v-for="(tag,t) in item.attr_vals" :key="t"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item :label="item.attr_name" prop="attr_name" v-for="(item) in onlyGoodParams" :key="item.attr_id">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <el-upload
                            class="upload-demo"
                            :action="picURL"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :headers="headerObj"
                            :on-success="handleSuccess"
                            list-type="picture">
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb(图片上传功能维护中，请跳过此步骤！)</div>
                        </el-upload>
                        <el-dialog :visible.sync="dialogVisible" width="50%">
                            <img width="100%" :src="dialogImageUrl" alt="" class="imgPreview">
                        </el-dialog>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <!-- 富文本编辑器 -->
                        <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                        <!-- 添加按钮 -->
                        <el-button type="primary" style="margin-top:15px" @click="addGoodBtn">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
    </div>
</template>
<script>
// 导入js库
import _ from 'lodash'
export default {
    data(){
        return{
            // 获取全部商品分类
            CateArr:[],
            // 当前激活步骤条
            activeStep:0,
            // 添加表单数据
            addForm:{goods_cat:[],pics:[],attrs:[]},
            //当前分类参数
            manyGoodParams:[],
            //当前分类属性
            onlyGoodParams:[],
            //选中的商品分类
            selectedKey:[],
            cascaderProp:{
                value:'cat_id',
                label:'cat_name',
                children:'children',
                expandTrigger: 'hover',
            },
            //表单输入规则
            addRules:{
                goods_name:[
                    { required: true, message: '请输入商品名称', trigger: 'blur' },
                    { min: 3, max: 150, message: '长度在 3 到 150 个字符', trigger: 'blur' }
                ],
                goods_cat:[
                    { required: true, message: '请输入商品分类', trigger: 'blur' }
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
                goods_introduce:[
                    { required: false, message: '请输入重量', trigger: 'blur' }
                ]
            },
            // 上传图片路径
            picURL:'http://47.97.255.94:8889/api/private/v1/upload',
            dialogVisible:false,
            dialogImageUrl:'',
            headerObj:{
                Authorization:window.sessionStorage.getItem('token')
            }
        }
    },
    methods:{
        // 获取所有分类
        async getCateArr(){
            const {data:res}=await this.$http.get('categories')
            this.CateArr=res.data
        },
        // 选择商品分类
        async cateChange(){
            // console.log(this.addForm.goods_cat);
            if(this.addForm.goods_cat.length!=3){
                this.addForm.goods_cat=[]
            }
            // console.log(this.addForm.goods_cat);
            //获取当前分类动态参数
            const {data:manyRes}=await this.$http.get(`categories/${this.addForm.goods_cat[2]}/attributes`,{params:{sel:'many'}})
            if(manyRes.meta.status!=200)return this.$message.error('获取失败')
            this.$message.success('获取成功')
            manyRes.data.forEach(item=>{
                item.attr_vals=item.attr_vals.split(',')
            })
            this.manyGoodParams=manyRes.data
            //获取当前分类静态属性
            const {data:onlyRes}=await this.$http.get(`categories/${this.addForm.goods_cat[2]}/attributes`,{params:{sel:'only'}})
            if(onlyRes.meta.status!=200)return this.$message.error('获取失败')
            this.$message.success('获取成功')
            this.onlyGoodParams=onlyRes.data
            console.log(onlyRes);
            console.log(this.onlyGoodParams);
        },
        // 点击tab切换
        tabChange(New,Old){
            // console.log(New);
            // console.log(Old);
            if(Old=='0'&&this.addForm.goods_cat.length!=3){
                this.$message.error('商品分类不能为空')    
                return false
            }
        },
        handleRemove(file) {
            console.log(file);
            const tmpURL=file.response.data.tmp_path;
            this.addForm.pics.splice(this.addForm.pics.findIndex(x=>x.pic==tmpURL),1);
            console.log(this.addForm);
        },
        handlePreview(file) {
            console.log(file);
            this.dialogVisible=true
            this.dialogImageUrl=file.url
        },
        handleSuccess(res){
            const picObj={pic:res.data.tmp_path}
            this.addForm.pics.push(picObj)
            console.log(this.addForm);
        },
        // 最终添加商品按钮
        addGoodBtn(){
            this.$refs.addRuleForm.validate(async valid=>{
                //发送添加请求前先完善一下发送的参数和参数格式->goods_cat和attrs
                // 简单的深拷贝方式
                // let obj={...this.addForm}
                // 外部js库提供的深拷贝方法
                const obj=_.cloneDeep(this.addForm)
                obj.goods_cat=obj.goods_cat.join(',')
                this.manyGoodParams.forEach(item=>{
                    const manyParamsObj={
                        attr_id:item.attr_id,
                        attr_vals:item.attr_vals
                    }
                    this.addForm.attrs.push(manyParamsObj)
                })
                this.onlyGoodParams.forEach(item=>{
                    const onlyParamsObj={
                        attr_id:item.attr_id,
                        attr_vals:item.attr_vals
                    }
                    this.addForm.attrs.push(onlyParamsObj)
                })
                if(!valid)return this.$message.error('请输入完整信息')
                console.log(obj);
                // 发送请求
                const {data:res}=await this.$http.post('goods',obj)
                console.log(res);
                if(res.meta.status!=201)return this.$message.error('添加商品失败')
                this.$message.success('添加商品成功')
                this.$router.push('/goods') 
            })
        }
    },
    created(){
        this.getCateArr()
    }
    
}
</script>
<style>
.el-steps{
    margin-top: 15px;
    margin-bottom: 15px;
}
.el-checkbox{
    margin-right: 15px;
    margin-bottom: 10px;
    margin-left: 0 !important;
}
.imgPreview{
    width: 100%;
}
</style>