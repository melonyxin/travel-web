<template>
  <div class="mt-10 w-3/5">
    <h1 class="font-extrabold text-3xl text-left text-teal-500">Toursim</h1>
    <div class="flex mt-6 items-center">
      <img src="https://s0.meituan.net/bs/file/?f=fe-sso-fs:build/page/static/banner/www.jpg" />
      <div class="flex flex-col w-auto ml-6">
        <el-radio-group v-model="type">
          <el-radio label="tourist">游客</el-radio>
          <el-radio label="agency">旅游公司</el-radio>
          <el-radio label="bureau">旅游局</el-radio>
        </el-radio-group>
        <span class="text-left mt-3 text-sm text-blue-400 font-bold">账号 : </span>
        <el-input v-model="account" placeholder="account"></el-input>
        <span class="text-left mt-2 text-sm text-blue-400 font-bold">密码 : </span>
        <el-input placeholder="password" v-model="password" show-password></el-input>
        <div class=" text-left mt-2"><el-checkbox v-model="auto_login">下次自动登录</el-checkbox></div>
        <div class="mt-4">
          <el-button type="primary" @click="login()">登录</el-button>
          <el-button @click="goToRegister()">注册</el-button>
        </div>
      </div>   
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Login',
  data(){
    return {
      account: "",
      password: "",
      type:"tourist",
      auto_login:false,
    }
  },
  methods:{
    login() {
      let that = this;
      let url = this.$state.getUrl()+this.type+'/verify';
      axios.post(url,{
        account:that.account,
        password:that.password
      })
      .then(function(res) {
        //成功时服务器返回 response 数据
        console.log(res.data);
        if(res.data.result) {
          that.$message({
            message: '登录成功！',
            type: 'success'
          });
          if(that.auto_login){
            that.$cookies.set("user",res.data.user,60*5)
          }
          that.$state.setUser(res.data.user);
          that.$router.push('/index')
        } else {
          that.$message.error('账号或密码错误，请重新输入！')
        }
      })
      .catch(function(error) {
        console.log(error);
      });
    },
    goToRegister(){
      this.$router.push('/register')
    }
  },
  created(){
    if(this.$state.getUser() != null){
      this.$router.push('/index')
    }
  }
}
</script>

<style scoped>
</style>