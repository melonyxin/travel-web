<template>
  <div class="w-full flex flex-col items-center bg-gray-200">
    <div class="w-full bg-gray-100 h-12 flex justify-center">
      <div class="w-3/4 h-full flex justify-between items-center">
        <h1 class="font-bold text-lg text-teal-500">Tourism</h1>
        <div class="flex text-sm">
          <span>欢迎！<span v-if="user.type == 'tourist'" class="text-orange-500">{{ user.account }}</span>
          <span v-else class="text-orange-500">{{ user.name }}</span></span>
          <el-link :underline="false" class="ml-6" @click="returnIndex()">返回主页</el-link>
          <el-link :underline="false" class="ml-6" @click="logout()">退出登录</el-link>
        </div>
      </div>
    </div>

    <div class="w-4/5 flex flex-col items-center bg-white p-10 mt-6">
      <h1 class="text-left text-2xl font-extrabold border-b-2 pb-4 w-full">全部预约</h1>
      <el-table
        :data="appointmentList"
        stripe
        style="width: 100%"
        :default-sort="sort">
        <el-table-column
          prop="spot_name"
          label="景点">
        </el-table-column>
        <el-table-column
          prop="date"
          label="日期">
        </el-table-column>
      </el-table>
    </div>

  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'MyAppointment',
  data(){
    return {
      user: null,
      appointmentList:null,
      sort: {
        prop: 'date',
        order: 'descending'
      }
    }
  },
  methods: {
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
  },
  created(){
    if(this.$state.getUser() === null){
      this.$router.push('/login')
    } else {
      this.user=this.$state.getUser()
    }
    console.log(this.user)

    let info = {tourist_account: this.user.account};
    let url = this.$state.getUrl()+"appointment/getByUser";
    let that = this;
    axios.post(url,info)
    .then(function(res){
      if(res.data.result){
        that.appointmentList = res.data.consistList
        console.log(that.appointmentList)
      } else {
        that.$message.error('预订失败');
      }
    })
    .catch(function(error) {
      console.log(error);
    });
  }
}
</script>

<style>

</style>