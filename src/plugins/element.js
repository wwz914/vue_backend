import Vue from 'vue'
import { Button,FormItem,Form,Input,Message } from 'element-ui'

Vue.use(Button)
Vue.use(FormItem)
Vue.use(Form)
Vue.use(Input)
// 添加$message全局方法
Vue.prototype.$message=Message
