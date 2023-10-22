import Vue from 'vue'
import Router from 'vue-router'
import login from '../components/LoginPage.vue'
import home from '../components/HomePage'
import welcome from '../components/WelcomePage'
import users from '../components/user/UserList.vue'
import rights from '../components/power/RightList'
import roles from '../components/power/RoleList'
import cates from '../components/goods/GoodCate'
import params from '../components/goods/GoodParam'
import goods from '../components/goods/GoodList'
import add from '../components/goods/AddPage'
import orders from '../components/order/OrderList'

Vue.use(Router)

// 解决路由重复问题
// const originalPush = Router.prototype.push
// Router.prototype.push = function push(location) {
//     return originalPush.call(this, location).catch(err => err)
// }

const router = new Router({
  routes: [
    // 重定向
    { path: '/', redirect: '/login' },
    { path: '/login', component: login },
    {
      path: '/home',
      component: home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: welcome },
        { path: '/users', component: users },
        { path: '/rights', component: rights },
        { path: '/roles', component: roles },
        { path: '/categories', component: cates },
        { path: '/params', component: params },
        { path: '/goods', component: goods},
        { path: '/goods/add', component: add}, 
        { path: '/orders', component: orders}, 
      ]
    }
  ]
})
//挂载路由守卫
router.beforeEach((to, from, next) => {
  // console.log(to);
  if (to.path == '/login') {
    return next()
  }
  if (to.path == '/home') {
    if (sessionStorage.getItem('token')) next();
    else {
      return next('/login')
    }
  }
  next()
})
export default router