<template>
  <div class="flex flex-col items-center w-3/5 mt-10">
    <h1 class="font-extrabold text-3xl text-left text-teal-500 w-full border-b p-2">Toursim</h1>
    <div class="grid grid-cols-3 row-gap-4 items-center col-gap-2 mt-16">
      <span class="label">账号类型 :</span>
      <el-radio-group v-model="type" size="small">
        <el-radio-button label="tourist">游客</el-radio-button>
        <el-radio-button label="agency">旅游公司</el-radio-button>
        <el-radio-button label="bureau">旅游局</el-radio-button>
      </el-radio-group>
      <span class="tip">请先选择账号类型</span>

      <span class="label">账号 :</span>
      <el-input v-model="account" placeholder="account" maxlength="10" size="small" show-word-limit></el-input>
      <span class="tip">长度在4~10个字符之间</span>

      <span v-if="type == 'agency'" class="label">公司名字 :</span>
      <span v-if="type == 'bureau'" class="label">旅游局名字 :</span>
      <el-input v-if="type != 'tourist'" v-model="name" placeholder="name" size="small" maxlength="10" show-word-limit></el-input>
      <span v-if="type != 'tourist'" class="tip">长度在4~10个字符之间</span>
      
      <span class="label">密码 :</span>
      <el-input v-model="password" placeholder="password" maxlength="10" size="small" show-word-limit show-password></el-input>
      <span class="tip">长度在4~10个字符之间</span>

      <span v-if="type == 'bureau'" class="label">旅游局地址 :</span>
      <el-input v-if="type == 'bureau'" v-model="address" type="textarea" placeholder="address" size="small" maxlength="20"  autosize show-word-limit></el-input>
      <span v-if="type == 'bureau'" class="tip">长度在4~10个字符之间</span>

      <span class="label">电话号码 :</span>
      <el-input v-model="telephone" placeholder="telephone" size="small" maxlength="11" show-word-limit></el-input>
      <span class="tip">长度在4~10个字符之间</span>

      <span v-if="type == 'agency'" class="label">公司简介 :</span>
      <el-input v-if="type == 'agency'" type="textarea" maxlength="200" size="small" v-model="brief" placeholder="brief" autosize show-word-limit></el-input>
      <span v-if="type == 'agency'" class="tip">长度在4~10个字符之间</span>
    </div>

    <div class="flex mt-4">
      <el-button type="primary" @click="register()" size="small">注册</el-button>
      <el-button @click="returnLogin()" size="small">返回登录</el-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Register',
  data(){
    return {
      account: "",
      password: "",
      telephone: "",
      type:"tourist",
      name:"",
      address:"",
      brief:""
    }
  },
  methods:{
    register(){
      let that = this;
      let url = this.$state.getUrl()+this.type+'/add';
      let user = {
        account:that.account,
        password:that.password,
        telephone:that.telephone
      }
      if(this.type=='agency'){
        user.name = that.name;
        user.brief = that.brief;
      } else if(this.type=='bureau'){
        user.name = that.name;
        user.address = that.address;
      }
      axios.post(url,user)
      .then(function(res) {
        //成功时服务器返回 response 数据
        if(res.data.result){
          that.$state.setUser(res.data.user);
          that.$message({
            message: '注册成功！',
            type: 'success'
          });
          that.$router.push('/index')
        } else {
           that.$message.error('填入信息有问题或用户名已被注册');
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

<style scoped>
.label {
  justify-self: end;
  font-size:0.875rem;
}
.tip {
  justify-self: start;
  font-size:0.75rem;
  color:#718096;
}
</style>