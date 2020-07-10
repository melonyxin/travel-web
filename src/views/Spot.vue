<template>
  <div class="w-full flex flex-col items-center bg-gray-200">
    <div class="w-full bg-gray-100 h-12 flex justify-center">
      <div class="w-3/4 h-full flex justify-between items-center">
        <h1 class="font-bold text-lg text-teal-500">Tourism</h1>
        <div class="flex text-sm">
          <span>欢迎！<span v-if="user.type == 'tourist'" class="text-orange-500">{{ user.account }}</span>
          <span v-else class="text-orange-500">{{ user.name }}</span></span>
          <el-link v-if="user.type=='bureau' && user.account == spot.bureau_account" :underline="false" class="ml-6" @click="toAddSpot()">修改景点</el-link>
          <el-link :underline="false" class="ml-6" @click="returnIndex()">返回主页</el-link>
          <el-link :underline="false" class="ml-6" @click="logout()">退出登录</el-link>
        </div>
      </div>
    </div>

    <div class="flex w-full justify-center mt-6">
      <div class="w-2/5 mr-10 bg-white p-6 flex flex-col items-center">
        <h1 class="text-left text-2xl font-extrabold border-b-2 pb-4 w-full">{{ spot.name }}</h1>
        <p class="w-full text-left mt-4 text-sm">地址：{{spot.site}}</p>
        <p class="w-full text-left mt-2 text-xs font-semibold text-teal-500">开放时间：{{spot.open_time}}</p>
        <p class="w-full text-left mt-2 text-xs font-bold text-red-600">最多预约人数：{{spot.maximum}}</p>
        <p class="w-full text-left mt-2 font-light">简介：{{spot.brief}}</p>
        <p class="w-full text-left mt-2 text-xs text-gray-500">由{{bureau.name}}提供数据</p>
        <img :src="spot.picture" class="object-fit w-11/12 mt-4" />
      </div>

      <div class="w-1/5 bg-white flex flex-col h-40 p-6 items-start">
        <span class="text-sm font-semibold mb-4">
          价格：<span class="text-red-600 font-bold">{{ spot.price }}￥</span>
        </span>
        <el-date-picker
          v-model="date"
          align="right"
          type="date"
          placeholder="选择日期"
          :picker-options="pickerOptions"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
          size="small"
          class="mb-4">
        </el-date-picker>
        <el-button size="small" @click="book()" class="self-center" type="primary" :disabled="user.type != 'tourist'">预订</el-button>
      </div>
    </div>

    <div class="mb-6"></div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Spot',
  data(){
    return {
      user: null,
      spot:null,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now()-60*60*24*1000;
        },
      },
      date:null,
      bureau:null
    }
  },
  methods: {
    book(){
      if(this.date==null){
        this.$message.error('请选择预订的日期');
      } else if(this.user.type=='tourist'){
        let that = this;
        let url = this.$state.getUrl()+'appointment/add';
        axios.post(url,{
          tourist_account: that.user.account,
          spot_name: that.spot.name,
          date: that.date 
        })
        .then(function(res) {
          //成功时服务器返回 response 数据
          if(res.data.result){
            that.$message({
              message: '预订成功！',
              type: 'success'
            });
          } else {
            that.$message.error('预订失败');
          }
        })
        .catch(function(error) {
          console.log(error);
        });
      } else {
        this.$message.error('只有游客才能预订');
      }
    },
    logout(){
      if(this.$cookies.get("user")!=null){
        this.$cookies.remove("user")
      }
      this.$state.setUser(null);
      this.$router.push('/login');
    },
    returnIndex(){
      this.$router.push('/index');
    },
    toAddSpot(){
      let spot=this.spot
      this.$router.push({
        name:'addspot',//这个name就是你刚刚配置在router里边的name
        params:{
          type:'update',
          spot:spot
        }
      })
    }
  },
  created(){
    if(this.$route.params.spot == undefined){
      this.$router.push('/index')
    }

    this.user=this.$state.getUser();
    this.spot=this.$route.params.spot;
    let that = this;
    let url = this.$state.getUrl()+'bureau/get';
    let info = {account: this.spot.bureau_account}
    axios.post(url,info)
    .then(function(res) {
      if(res.data.result){
        that.bureau = res.data.bureau_info;
      }
    })
    .catch(function(error) {
      console.log(error);
    });
    console.log(this.spot)
  }
}
</script>

<style>

</style>