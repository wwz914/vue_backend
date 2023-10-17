import Vue from 'vue'
import { Button,
    FormItem,
    Form,
    Input,
    Message,
    Header,
    Container,
    Aside,
    Main,
    Col,
    Menu,
    Submenu,
    MenuItem,
    Icon,
    MenuItemGroup,
    Row,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Table,
    TableColumn,
    Tag,
    MessageBox,
    Dialog,
    Tree,
    Pagination,
    Switch,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Select,Option,
    Cascader,
    Alert,
    Tabs,
    TabPane 
} from 'element-ui'

    

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
Vue.use(Pagination)
Vue.use(Switch)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
// 添加$message全局方法
Vue.prototype.$message=Message
Vue.prototype.$confirm=MessageBox.confirm
