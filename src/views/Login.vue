<template>
  <div>
    <form method="post">
      账号 :
      <input type="text" id="name" v-model="name"/>
      <br /><br />
      密码 :
      <input type="text" id="pwd"  v-model="password"/>
      <br /><br />
      <input type="button" value="登录" @click="login()">
      <input type="button" value="前往注册" @click="goToRegister()">
    </form>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Login',
  data(){
    return {
      name: "",
      password: ""
    }
  },
  methods:{
    login() {
      let that = this;
      axios.post('http://127.0.0.1:3000/user/checkUser',{
        name:that.name,
        password:that.password
      })
      .then(function(res) {
        //成功时服务器返回 response 数据
        console.log(res.data);
        if(res.data.result === null) {
          alert("账号或密码错误，请重新输入！")
        } else if(res.data.result) {
          //alert("登录成功")
          that.$cookies.set("user",res.data.user,60*5)
          that.$router.push('/index')
        } else {
          alert("账号或密码错误，请重新输入！")
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
    if(this.$cookies.get("user") !== null){
      //this.$router.push('/index')
    }
  }
}
</script>

<style>

</style>