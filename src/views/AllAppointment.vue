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
      <div class="flex justify-start w-full mt-4 mb-2">
        <el-select v-model="spotName" placeholder="选择景点" class="mr-4">
        <el-option
          v-for="(item,index) in spotList"
          :key="'allappointment'+index"
          :label="item.name"
          :value="item.name">
        </el-option>
      </el-select>
      <el-date-picker
          v-model="date"
          align="right"
          type="date"
          placeholder="选择日期"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
          class="mr-4">
        </el-date-picker>
        <el-button type="primary" @click="query()">查询</el-button>
        <el-button type="primary" @click="clear()">清空</el-button>
      </div>

      <el-table
        :data="showList"
        stripe
        style="width: 100%"
        :default-sort="sort">
        <el-table-column
          prop="tourist_account"
          label="游客账号">
        </el-table-column>
        <el-table-column
          prop="telephone"
          label="联系方式">
        </el-table-column>
        <el-table-column
          prop="spot_name"
          label="景点">
        </el-table-column>
        <el-table-column
          prop="date"
          label="日期">
        </el-table-column>
      </el-table>

      <span class="mt-2 text-sm text-gray-600 font-semibold">共 {{showList.length}} 个预约</span>
    </div>

  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'AllAppointment',
  data(){
    return {
      user: null,
      spotList: [],
      spotName:"",
      date:"",
      appointmentList:[],
      showList:[],
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
    query(){
      this.showList=[];
      for(let item of this.appointmentList){
        if(item.spot_name==this.spotName && item.date==this.date){
          this.showList.push(item);
        }
      }
    },
    clear(){
      this.spotName="";
      this.date="";
      this.showList=[];
      for(let item of this.appointmentList){
        this.showList.push(item);
      }
      console.log(this.appointmentList);
    }
  },
  created(){
    if(this.$state.getUser() === null){
      this.$router.push('/login')
    } else {
      this.user=this.$state.getUser()
    }

    if(this.$state.getSpotList() == null){
      this.$router.push('/index')
    } else {
      for(let it of this.$state.getSpotList()){
        if(it.bureau_account == this.user.account){
          this.spotList.push(it);
        }
      }
    }

    let url = this.$state.getUrl()+"appointment/getBySpot";
    let reqList = [];
    let info;
    let that = this;
    for(let item of this.spotList){
      info = {spot_name: item.name};
      reqList.push(axios.post(url,info));
    }
    axios.all(reqList)
    .then(function(res){
      for(let it of res){
        that.appointmentList.push(...it.data.consistList)
      }

      url = that.$state.getUrl()+"tourist/get";
      reqList = [];
      for(let item of that.appointmentList){
        info = {account:item.tourist_account}
        reqList.push(axios.post(url,info))
      }
      axios.all(reqList)
      .then(function(res){
        for(let i in res){
          that.appointmentList[i].telephone = res[i].data.tourist_info.telephone
        }
        that.showList = that.appointmentList;
      })
      console.log(that.appointmentList);
    })
  }
}
</script>

<style>

</style>