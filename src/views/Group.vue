<template>
  <div class="w-full flex flex-col items-center bg-gray-200">
    <div class="w-full bg-gray-100 h-12 flex justify-center">
      <div class="w-3/4 h-full flex justify-between items-center">
        <h1 class="font-bold text-lg text-teal-500">Tourism</h1>
        <div class="flex text-sm">
          <span>欢迎！<span class="text-orange-500">{{ user.account }}</span></span>
          <el-link v-if="user.type=='agency' && user.account == group.agency_account" :underline="false" class="ml-6" @click="toAddGroup()">修改旅游团</el-link>
          <el-link :underline="false" class="ml-6" @click="returnIndex()">返回主页</el-link>
          <el-link :underline="false" class="ml-6" @click="logout()">退出登录</el-link>
        </div>
      </div>
    </div>

    <div class="flex w-full justify-center mt-6">
      <div class="w-2/5 mr-10 bg-white p-6 flex flex-col items-center">
        <h1 class="text-left text-2xl font-extrabold border-b-2 pb-4 w-full">{{ group.name }}</h1>
        <!-- <p class="w-full text-left mt-4 text-sm">地址：{{spot.site}}</p> -->
        <!-- <p class="w-full text-left mt-2 text-xs font-semibold text-teal-500">开放时间：{{spot.open_time}}</p> -->
        <p class="w-full text-left mt-2 text-xs font-bold text-red-600">最多预约人数：{{group.maximum}}</p>
        <p class="w-full text-left mt-2 font-light">简介：{{group.brief}}</p>
        <p class="w-full text-left mt-2 text-xs text-gray-500">由组织</p>

        <h2 class="text-left w-full mt-4 font-bold mb-4">游玩路线：</h2>
        <el-timeline :reverse="true">
          <el-timeline-item
            v-for="(item, index) in group.consistList"
            :key="index"
            :timestamp="item.date">
            {{item.spot_name}}
          </el-timeline-item>
        </el-timeline>
      </div>

      <div class="w-1/5 bg-white flex flex-col h-40 p-6 items-start">
        <span class="text-sm font-semibold mb-4">
          价格：<span class="text-red-600 font-bold">{{ group.price }}￥</span>
        </span>
        <el-button size="small" @click="book()" class="self-center" type="primary" :disabled="user.type != 'tourist'">预订</el-button>
      </div>
    </div>

    <div class="mb-6"></div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Group',
  data(){
    return {
      user: null,
      group:null,

    }
  },
  methods:{
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
    book(){
      if(this.user.type !='tourist'){
        this.$message.error('只有游客才能购买！');
        return;
      }

      let today = new Date();
      let month = today.getMonth() + 1;
      month = month < 10 ? '0'+month : month;
      let day = today.getDate() < 10 ? '0'+today.getDate() : today.getDate();
      let hours = today.getHours() < 10 ? '0'+today.getHours() : today.getHours();
      let mins = today.getMinutes() < 10 ? '0'+today.getMinutes() : today.getMinutes();
      let secs = today.getSeconds() < 10 ? '0'+today.getSeconds() : today.getSeconds();
      let time = today.getFullYear() + '-' + month + '-' + day + ' ' + hours + ":" + mins + ":" + secs ;
      let id = ''+this.user.account+today.getFullYear()+month+day+hours+mins+secs;
      let that = this;
      let url = this.$state.getUrl()+'order/add';
      axios.post(url,{
          id: id,
          time: time,
          tourist_account: that.user.account,
          group_name: that.group.name
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
    },
    toAddGroup(){
      let group=this.group;
      this.$router.push({
        name:'addgroup',//这个name就是你刚刚配置在router里边的name
        params:{
          type:'update',
          group:group
        }
      })
    }
  },
  created(){
    if(this.$route.params.group == undefined){
      this.$router.push('/index')
    }

    this.user=this.$state.getUser();
    this.group=this.$route.params.group;
    console.log(this.group)
  }
}
</script>

<style>

</style>