<template>
  <div>
    <form method="post">
      账号 :
      <input type="text" id="name" v-model="name"/>
      <br /><br />
      密码 :
      <input type="text" id="pwd" v-model="password"/>
      <br /><br />
      电话号码 :
      <input type="text" id="tel" v-model="telephone"/>
      <br /><br />
      <input type="button" value="注册" @click="register()">
      <input type="button" value="返回登录" @click="returnLogin()">
    </form>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Register',
  data(){
    return {
      name: "",
      password: "",
      telephone: ""
    }
  },
  methods:{
    register(){
      let that = this;
      axios.post('http://127.0.0.1:3000/user/addUser',{
        name:that.name,
        password:that.password,
        telephone:that.telephone
      })
      .then(function(res) {
        //成功时服务器返回 response 数据
        if(res.data.result){
          that.$cookies.set("user",res.data.user,60*5)
          that.$router.push('/index')
        } else {
          alert("用户名已被注册！")
        }
        
      })
      .catch(function(error) {
        console.log(error);
      });
    },
    returnLogin(){
      this.$router.push('/login')
    }
  }
}
</script>

<style>

</style>