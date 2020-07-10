<template>
  <div class="w-full flex flex-col items-center bg-gray-200">
    <div class="w-full bg-gray-100 h-12 flex justify-center">
      <div class="w-3/4 h-full flex justify-between items-center">
        <h1 class="font-bold text-lg text-teal-500">Tourism</h1>
        <div class="flex text-sm">
          <span>欢迎！<span v-if="user.type == 'tourist'" class="text-orange-500">{{ user.account }}</span>
          <span v-else class="text-orange-500">{{ user.name }}</span></span>
          <el-link v-if="user.type == 'agency'" :underline="false" class="ml-6" @click="manageGroup()">管理旅游团</el-link>
          <el-link v-if="user.type == 'agency'" :underline="false" class="ml-6" @click="allorder()">订单管理</el-link>
          <el-link v-if="user.type == 'bureau'" :underline="false" class="ml-6" @click="manageSpot()">管理景点</el-link>
          <el-link v-if="user.type == 'bureau'" :underline="false" class="ml-6" @click="allappointment()">预约管理</el-link>
          <el-link v-if="user.type == 'tourist'" :underline="false" class="ml-6" @click="myappointment()">我的预约</el-link>
          <el-link v-if="user.type == 'tourist'" :underline="false" class="ml-6" @click="myorder()">我的订单</el-link>
          <el-link :underline="false" class="ml-6" @click="logout()">退出登录</el-link>
        </div>
      </div>
    </div>

    <div class="w-4/5 flex flex-col items-center bg-white p-10 mt-6">
    <div class="flex mb-4 w-full justify-center">
      <el-input v-model="search_content" placeholder="搜索景点或者旅游团" style="width:35%" class="mr-4"></el-input>
      <el-button type="primary" @click="search()">搜索</el-button>
    </div>
      

      <el-carousel height="400px" class=" w-3/5 mt-4">
        <el-carousel-item v-for="item in showNum" :key="'img'+item">
          <img :src="spotList[item].picture" class="object-fill w-full h-full" />
        </el-carousel-item>
      </el-carousel>

      <div class="w-full flex bg-red-500 text-white justify-between mt-10 h-10 items-center rounded-md">
        <h1 class="ml-4">景点</h1>
        <span class="mr-4 cursor-pointer" @click="allSpot()">全部></span>
      </div>
      <div class="flex w-full justify-around mt-4">
        <div v-for="i in showNum" :key="'spot'+i" class="border rounded-lg overflow-hidden max-w-sm shadow-md w-1/5 cursor-pointer" @click="showSpot(i)">
          <img class="w-full object-fill  h-40" :src="spotList[i].picture">
          <div class="p-6 flex flex-col items-start">
            <h4 class="font-semibold text-lg">{{ spotList[i].name }}</h4>
            <div class="text-gray-600 text-xs font-semibold mt-2">
              开放时间：{{ spotList[i].open_time }}
            </div>
            <div class="text-red-600 text-sm font-bold mt-2">
              ￥{{ spotList[i].price }}
            </div>
            <div class="text-teal-500 text-sm font-semibold mt-2">
              最多预约人数：{{ spotList[i].maximum }}
            </div>
          </div>
        </div>
      </div>
      
      <div class="w-full flex bg-orange-500 text-white justify-between mt-10 h-10 items-center rounded-md">
        <h1 class="ml-4">旅游团</h1>
        <span class="mr-4 cursor-pointer" @click="allgroup()">全部></span>
      </div>
      <div class="flex w-full justify-around mt-4">
        <div v-for="i in groupNum" :key="'group'+i" class="border rounded-lg overflow-hidden max-w-sm shadow-md w-1/5 cursor-pointer" @click="showGroup(i)">
          <!-- <img class="w-full object-cover" :src="spotList[i].picture"> -->
          <div class="p-6 flex flex-col items-start">
            <h4 class="font-semibold text-lg">{{ groupList[i].name }}</h4>
            <div class="text-gray-600 text-xs font-semibold mt-2 overflow-hidden w-full text-left" style="text-overflow: ellipsis;white-space: nowrap;">
              游玩地点：
              <span v-for="(item,index) in groupList[i].consistList" :key="'consist'+index">
                <span v-if="index != 0">、</span>
                {{item.spot_name}}
              </span>
            </div>
            <div class="text-red-600 text-sm font-bold mt-2">
              ￥{{ groupList[i].price }}
            </div>
            <div class="text-teal-500 text-sm font-semibold mt-2">
              最多预约人数：{{ groupList[i].maximum }}
            </div>
          </div>
        </div>
      </div>
      <div class="mt-4 mb-4"></div>
    </div>

    <div class="mt-10 mb-10"></div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Index',
  data(){
    return {
      user: {
        account:''
      },
      spotList:null,
      groupList:null,
      showNum:[0,1,2,3],
      spotNum:[3,2,4,0],
      groupNum:[0,1,2,3],
      search_content:""
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
    getSpotList(){
      let that = this;
      let url = this.$state.getUrl()+'spot/get';
      axios.get(url)
      .then(function(res) {
        //成功时服务器返回 response 数据
        if(res.data.result){
          that.$state.setSpotList(res.data.spotList);
          that.spotList = res.data.spotList
        } else {
          that.$message.error('获取景点信息失败');
        }
      })
      .catch(function(error) {
        console.log(error);
      });
    },
    getGroupList(){
      let that = this;
      let url = this.$state.getUrl()+'group/get';
      axios.get(url)
      .then(function(res) {
        //成功时服务器返回 response 数据
        if(res.data.result){
          that.groupList = res.data.groupList
          let req = [];
          url = that.$state.getUrl()+'consist/get';
          for(let item of that.groupList){
            req.push(axios.post(url,{group_name:item.name}))
          }

          axios.all(req)
          .then(function(res){
            for(let i in that.groupList){
              that.groupList[i].consistList = res[i].data.consistList
            }
            that.$state.setGroupList(that.groupList);
          })
        } else {
          that.$message.error('获取旅游团信息失败');
        }
      })
      .catch(function(error) {
        console.log(error);
      });
    },
    showSpot(index){
      let spot = this.spotList[index]
      this.$router.push({
        name:'spot',//这个name就是你刚刚配置在router里边的name
        params:{
          spot:spot
        }
    })
    },
    showGroup(index){
      let group = this.groupList[index]
      this.$router.push({
        name:'group',//这个name就是你刚刚配置在router里边的name
        params:{
          group:group
        }
      })
    },
    manageSpot(){
      this.$router.push('/managespot')
    },
    manageGroup(){
      this.$router.push('/managegroup')
    },
    allSpot(){
      this.$router.push('/allspot')
    },
    allgroup(){
      this.$router.push('/allgroup')
    },
    myappointment(){
      this.$router.push('/myappointment')
    },
    myorder(){
      this.$router.push('/myorder')
    },
    allorder(){
      this.$router.push('/allorder')
    },
    allappointment(){
      this.$router.push('/allappointment')
    },
    search(){
      if(this.search_content==""){
        this.$message.error("搜索不能为空")
        return;
      }
      let value = this.search_content;
      this.$router.push({
        name:'searchresult',//这个name就是你刚刚配置在router里边的name
        params:{
          searchvalue:value
        }
      })
    }
  },
  created(){
    if(this.$state.getUser() === null){
      this.$router.push('/login')
    } else {
      this.user=this.$state.getUser()
    }
    console.log(this.user)

    if(this.$state.getSpotList() === null){
      this.getSpotList()
    } else {
      this.spotList = this.$state.getSpotList()
    }
    console.log(this.$state.getSpotList())

    if(this.$state.getGroupList() === null){
      this.getGroupList()
    } else {
      this.groupList = this.$state.getGroupList()
    }
    console.log(this.$state.getGroupList())
  },
  mouted(){
    //this.user=this.$router.params.user;
  }
}
</script>

<style>

</style>