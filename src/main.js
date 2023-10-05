import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import router from './router'
// 引入样式表
import './assets/css/login.css'
//引入axios
import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL='http://1.13.159.135/api/private/v1'
Vue.prototype.$http=axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
