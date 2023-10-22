<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb
            separator-class="el-icon-arrow-right"
            style="margin-bottom: 15px"
            >
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <!-- 搜索框 -->
            <el-input
                placeholder="请输入内容"
                class="input-with-select"
                v-model="orderInfo.query"
                clearable
                @clear="clearInput"
            >
            <el-button
                slot="append"
                icon="el-icon-search"
                @click="getOrdersList()">
            </el-button>
            </el-input>
            <!-- 订单列表 -->
            <el-table
                :data="orderList"
                border
                stripe
                style="width: 100%">
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="order_number" label="订单编号" width="600px"></el-table-column>
                <el-table-column prop="order_price" label="订单价格" width="80px"></el-table-column>
                <el-table-column prop="order_pay" label="是否付款">
                    <template slot-scope="scope">
                        <el-tag type="danger" v-if="scope.row.order_pay=='0'">未付款</el-tag>
                        <el-tag type="success" v-else>已付款</el-tag>    
                    </template>
                </el-table-column>
                <el-table-column prop="is_send" label="是否发货" width="80px"></el-table-column>                 
                <el-table-column prop="create_time" label="下单时间">
                    <template slot-scope="scope">
                        {{scope.row.create_time|dateFormat}}
                    </template></el-table-column>                 
                <el-table-column label="操作">
                    <template>
                        <el-button type="primary" @click="changeAddressBtn"><i class="el-icon-edit"></i></el-button>
                        <el-button type="success" @click="checkAddressBtn"><i class="el-icon-location"></i></el-button>    
                    </template>
                </el-table-column>                 
            </el-table>
            <!-- 分页组件 -->
            <el-pagination
                background
                layout="prev, pager, next"
                :total="total">
            </el-pagination>
            <!-- 弹窗区 -->
            <!-- 修改地址弹窗 -->
            <el-dialog
                title="修改地址"
                :visible.sync="changeAddressDialogVisible"
                width="30%"
                @close="closeChange">
                <!-- 主体内容 -->
                <el-form :model="changeAddressInfo" status-icon :rules="changeRules" ref="changeFormRef" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="省市区/县" prop="address1">
                        <el-cascader
                            :options="cityData"
                            :value="city"
                            width="100%"
                            @change="cityChange">
                        </el-cascader>
                     </el-form-item> 
                    <el-form-item label="详细地址" prop="address2">
                        <el-input type="password" v-model="changeAddressInfo.pass"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="changeAddressDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="changeAddressBtn">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 查看地址弹窗 -->
            <el-dialog title="提示" :visible.sync="checkAddressDialogVisible" width="30%">
                <!-- <span>查询功能尚处于维护阶段，敬请期待...</span> -->
                <el-timeline>
                    <el-timeline-item
                        v-for="(status, index) in expressData.data"
                        :key="index"
                        :timestamp="status.time">
                        {{status.context}}
                    </el-timeline-item>
                </el-timeline>
            </el-dialog>
        </el-card>
    </div>
</template>
<script>
import cityData from './citydata'
import expressData from './expressdata'
export default {
    data(){
        return{
            // 订单查询参数
            orderInfo:{
                query:'',
                pagenum:1,
                pagesize:10
            },
            // 获取的订单信息
            orderList:[],
            changeAddressInfo:{},
            changeRules:{
                address1:[
                    { required: true, message: '请输入商品名称', trigger: 'blur' },
                    { min: 3, max: 150, message: '长度在 3 到 150 个字符', trigger: 'blur' }
                ],
                address2:[
                    { required: true, message: '请输入商品名称', trigger: 'blur' },
                    { min: 3, max: 150, message: '长度在 3 到 150 个字符', trigger: 'blur' }
                ],
            },
            city:'',
            cityData,
            expressData,
            // 订单总页数
            total:1000,
            changeAddressDialogVisible:false,
            checkAddressDialogVisible:false,
        }
    },
    methods:{
        // 获取订单列表
        async getOrdersList(){
            const {data:res}=await this.$http.get('orders',{params:this.orderInfo})
            console.log(res);
            if(res.meta.status!=200)return this.$message.error('获取订单失败')
            this.orderList=res.data.goods
        this.total=res.data.total*10
        },

        //修改地址
        changeAddressBtn(){
            this.changeAddressDialogVisible=true
        },
        changeAddress(){
            this.changeAddressDialogVisible=false
        },
        // 查看地址
        checkAddressBtn(){
            this.checkAddressDialogVisible=true 
            const res=this.expressData
            console.log(res);
        },
        closeChange(){
            console.log('已删除');
            this.$refs.changeFormRef.resetFields()
        },
        cityChange(){},
        clearInput(){},
    },
    created(){
        this.getOrdersList()
    }
}
</script>
<style>
.el-cascader{
    margin-bottom: 15px;  
}
.demonstration{
    margin-right: 8px;
}
.el-cascader{
    width: 100%;
}
</style>