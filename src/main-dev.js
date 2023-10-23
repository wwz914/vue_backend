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
// 富文本编辑器组件
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
// 导入nprogress的js和css
import  NProgress  from 'nprogress'
import 'nprogress/nprogress.css'
//引入axios
import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL='http://47.97.255.94:8889/api/private/v1'
// axios拦截请求，携带token以访问其他接口
axios.interceptors.request.use((config)=>{
  NProgress.start()
  config.headers.Authorization=window.sessionStorage.getItem('token')
  return config;
})
axios.interceptors.response.use(config=>{
  NProgress.done()
  return config;
})
Vue.prototype.$http=axios
Vue.use(ZkTable)
Vue.filter('dateFormat',function(originVal){
  const dt=new Date(originVal)
  const YY=dt.getFullYear()
  const MM=(dt.getMonth()+1+'').padStart(2,'0')
  const DD=(dt.getDate()+'').padStart(2,'0')
  const hh=(dt.getHours()+'').padStart(2,'0')
  const mm=(dt.getMinutes()+'').padStart(2,'0')
  const ss=(dt.getSeconds()+'').padStart(2,'0')
  return `${YY}-${MM}-${DD} ${hh}:${mm}:${ss}`
})
Vue.use(VueQuillEditor)
// 取消开发or生产模式提示
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
