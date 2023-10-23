<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 头像区域 -->
      <div class="logo-box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 表单区域 -->
      <el-form
        label-width="0px"
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginFormRef"
        class="login-form"
      >
        <!-- 输入框 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入内容"
            prefix-icon="el-icon-s-custom"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            placeholder="请输入内容"
            prefix-icon="el-icon-lock"
            type="password"
          >
          </el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btn">
          <el-button type="primary" @click="login()"
            >登录</el-button
          >
          <el-button type="info" @click="resetForm()">重置</el-button>
        </el-form-item>
        <!-- <el-form-item>
        </el-form-item> -->
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456",
      },
      loginFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 15,
            message: "长度在 3 到 15 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (valid) {
        //   alert("submit!");
        const {data:res}=await this.$http.post("login",this.loginForm)
        if(res.meta.status==200){
            this.$message.success('登录成功！');
            // 将登录成功的token保存到客户端的sessionStorage中
                //项目中其他的接口，必须在登录之后才能访问
                //token只应在当前网站打开期间生效，所以将token保存在sessionStorage中
            window.sessionStorage.setItem("token",res.data.token);
            // 通过编程式导航跳转到后台，路由地址是/home
            this.$router.push('/home')
            }
        else this.$message.error('登录失败！');
        } else {
          this.$message.error('提交失败！');
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.loginFormRef.resetFields();
    },
  },
};
</script>
<style lang="less" scoped>
.login-container {
  background-color: #2a4b69;
}
.login-box {
  width: 450px;
  height: 300px;
  border-radius: 3px;
  background-color: #fff;
  margin: 100px auto;
  position: relative;
  .logo-box {
    width: 130px;
    height: 130px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: -70px;
    background-color: #ecefeb;
    border: 8px solid #fff;
    border-radius: 50%;
    box-shadow: 0px 3px 10px #ecefeb;
    overflow: hidden;
    img {
      width: 100%;
    }
  }
}
.login-form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btn {
  display: flex;
  justify-content: flex-end;
}
</style>