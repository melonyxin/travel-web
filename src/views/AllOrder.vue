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
      <h1 class="text-left text-2xl font-extrabold border-b-2 pb-4 w-full">全部订单</h1>
      <div class="flex justify-start w-full mt-4 mb-2">
        <el-select v-model="groupName" placeholder="选择旅游团" class="mr-4">
          <el-option
            v-for="(item,index) in groupList"
            :key="'allorder'+index"
            :label="item.name"
            :value="item.name">
          </el-option>
        </el-select>
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
            prop="group_name"
            label="景点">
          </el-table-column>
          <el-table-column
            prop="time"
            label="下单时间">
          </el-table-column>
        </el-table>

        <span class="mt-2 text-sm text-gray-600 font-semibold">共 {{showList.length}} 个订单</span>
    </div>

  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'AllOrder',
  data(){
    return {
      user: null,
      groupName:"",
      groupList:[],
      orderList:[],
      showList:[],
      sort: {
        prop: 'time',
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
      for(let item of this.orderList){
        if(item.group_name==this.groupName){
          this.showList.push(item);
        }
      }
    },
    clear(){
      this.groupName="";
      this.showList=[];
      for(let item of this.orderList){
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

    if(this.$state.getGroupList() == null){
      this.$router.push('/index')
    } else {
      for(let it of this.$state.getGroupList()){
        if(it.agency_account == this.user.account){
          this.groupList.push(it);
        }
      }
    }
    
    let url = this.$state.getUrl()+"order/getByGroup";
    let reqList = [];
    let info;
    let that = this;
    for(let item of this.groupList){
      info = {group_name: item.name};
      reqList.push(axios.post(url,info));
    }
    axios.all(reqList)
    .then(function(res){
      console.log(res);
      for(let it of res){
        that.orderList.push(...it.data.ordertList)
      }

      url = that.$state.getUrl()+"tourist/get";
      reqList = [];
      for(let item of that.orderList){
        info = {account:item.tourist_account}
        reqList.push(axios.post(url,info))
      }
      axios.all(reqList)
      .then(function(res){
        for(let i in res){
          that.orderList[i].telephone = res[i].data.tourist_info.telephone
        }
        that.showList = that.orderList;
      })
      console.log(that.orderList);
    })    
  }
}
</script>

<style>

</style>