import Vue from 'vue'
import { Button,FormItem,Form,Input,Message,Header,Container,Aside,Main,Col,Menu,Submenu,MenuItem,Icon,MenuItemGroup,Row,Breadcrumb,BreadcrumbItem,Card,Table,TableColumn,Tag,MessageBox,Dialog,Tree } from 'element-ui'

Vue.use(Button)
Vue.use(FormItem)
Vue.use(Form)
Vue.use(Input)
Vue.use(Header)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Col)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Icon)
Vue.use(Row)
Vue.use(MenuItemGroup)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tag)
Vue.use(Dialog)
Vue.use(Tree)
// 添加$message全局方法
Vue.prototype.$message=Message
Vue.prototype.$confirm=MessageBox.confirm
