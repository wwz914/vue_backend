import Vue from 'vue'
import Router from 'vue-router'
// 这里进行一个路由懒加载
const login = () =>import(/* webpackChunkName: "login_home_welcome" */ '../components/LoginPage.vue')
const welcome = () =>import(/* webpackChunkName: "login_home_welcome" */ '../components/WelcomePage')
const home = () =>import(/* webpackChunkName: "login_home_welcome" */ '../components/HomePage')
// import login from '../components/LoginPage.vue'
// import home from '../components/HomePage'
// import welcome from '../components/WelcomePage'

const users = () =>import(/* webpackChunkName: "users_rights_roles" */ '../components/user/UserList.vue')
const rights = () =>import(/* webpackChunkName: "users_rights_roles" */ '../components/power/RightList')
const roles = () =>import(/* webpackChunkName: "users_rights_roles" */ '../components/power/RoleList')
// import users from '../components/user/UserList.vue'
// import rights from '../components/power/RightList'
// import roles from '../components/power/RoleList'

const cates = () =>import(/* webpackChunkName: "cates_params" */ '../components/goods/GoodCate')
const params = () =>import(/* webpackChunkName: "cates_params" */ '../components/goods/GoodParam')
// import cates from '../components/goods/GoodCate'
// import params from '../components/goods/GoodParam'

const goods = () =>import(/* webpackChunkName: "goods_add_order_reports" */ '../components/goods/GoodList')
const add = () =>import(/* webpackChunkName: "goods_add_order_reports" */ '../components/goods/AddPage')
const orders = () =>import(/* webpackChunkName: "goods_add_order_reports" */ '../components/order/OrderList')
const reports = () =>import(/* webpackChunkName: "goods_add_order_reports" */ '../components/report/ReportPage')
// import goods from '../components/goods/GoodList'
// import add from '../components/goods/AddPage'
// import orders from '../components/order/OrderList'
// import reports from '../components/report/ReportPage'

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
        { path: '/reports', component: reports}, 
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