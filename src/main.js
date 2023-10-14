import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import router from './router'
// 引入树状表格插件
import ZkTable from 'vue-table-with-tree-grid'
// 引入样式表
import './assets/css/login.css'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
//引入axios
import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL='http://47.97.255.94:8889/api/private/v1'
// axios拦截请求，携带token以访问其他接口
axios.interceptors.request.use((config)=>{
  config.headers.Authorization=window.sessionStorage.getItem('token')
  return config;
})
Vue.prototype.$http=axios
Vue.use(ZkTable)
// 取消开发or生产模式提示
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
