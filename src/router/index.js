import Vue from 'vue'
import Router from 'vue-router'
import login from '../components/LoginVue.vue'
import home from '../components/HomePage'

Vue.use(Router)

const router= new Router({
  routes:[
    // 重定向
    {path:'/',redirect:'/login'},
    {path:'/login',component:login},
    {path:'/home',component:home}
  ]
})
//挂载路由守卫
router.beforeEach((to,from,next)=>{
  console.log(to);
  if(to.path=='/login'){
    return next()
  }
  if(to.path=='/home'){
    if(sessionStorage.getItem('token'))next();
    else {
      return next('/login')
    }
  }
  next()
})
export default router