<template>
  <div class="w-full flex flex-col items-center bg-gray-200">
    <div class="w-full bg-gray-100 h-12 flex justify-center">
      <div class="w-3/4 h-full flex justify-between items-center">
        <h1 class="font-bold text-lg text-teal-500">Tourism</h1>
        <div class="flex text-sm">
          <span>欢迎！<span v-if="user.type == 'tourist'" class="text-orange-500">{{ user.account }}</span>
          <span v-else class="text-orange-500">{{ user.name }}</span></span>
          <el-link :underline="false" class="ml-6" @click="toAddGroup()">添加旅游团</el-link>
          <el-link :underline="false" class="ml-6" @click="returnIndex()">返回主页</el-link>
          <el-link :underline="false" class="ml-6" @click="logout()">退出登录</el-link>
        </div>
      </div>
    </div>
    <div class="w-4/5 flex flex-col items-center bg-white p-10 mt-6">
      <h1 class="text-left text-2xl font-extrabold border-b-2 pb-4 w-full">全部景点</h1>

    <div class="grid grid-cols-4 w-full mt-4  col-gap-4 row-gap-4">
        <div v-for="(item,index) in groupList" :key="index" class="border rounded-lg overflow-hidden max-w-sm shadow-md w-full cursor-pointer" @click="showGroup(index)">
          <div class="p-6 flex flex-col items-start">
            <h4 class="font-semibold text-lg">{{ item.name }}</h4>
            <div class="text-gray-600 text-xs font-semibold mt-2 overflow-hidden w-full text-left" style="text-overflow: ellipsis;white-space: nowrap;">
              游玩地点：
              <span v-for="(it,index) in item.consistList" :key="index">
                <span v-if="index != 0">、</span>
                {{it.spot_name}}
              </span>
            </div>
            <div class="text-red-600 text-sm font-bold mt-2">
              ￥{{ item.price }}
            </div>
            <div class="text-teal-500 text-sm font-semibold mt-2">
              最多预约人数：{{ item.maximum }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'ManageGroup',
  data(){
    return {
      user:null,
      groupList:[],
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
    showGroup(index){
      let group = this.groupList[index]
      this.$router.push({
        name:'group',//这个name就是你刚刚配置在router里边的name
        params:{
          group:group
        }
      })
    },
    toAddGroup(){
      let group=this.group;
      this.$router.push({
        name:'addgroup',//这个name就是你刚刚配置在router里边的name
        params:{
          type:'add',
          group:group
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

    let that = this;
    let url = this.$state.getUrl()+'group/get';
    axios.get(url)
    .then(function(res) {
      //成功时服务器返回 response 数据
      if(res.data.result){
        let groupList = res.data.groupList
        let req = [];
        url = that.$state.getUrl()+'consist/get';
        for(let item of groupList){
          req.push(axios.post(url,{group_name:item.name}))
        }
        axios.all(req)
        .then(function(res){
          for(let i in groupList){
            groupList[i].consistList = res[i].data.consistList
          }
          that.$state.setGroupList(groupList);
          for(let it of groupList){
            if(it.agency_account == that.user.account){
              that.groupList.push(it);
            }
          }
        })
      } else {
        that.$message.error('旅游团信息获取失败');
      }
    })
    .catch(function(error) {
      console.log(error);
    });

    console.log(this.groupList)
  }
}
</script>

<style>

</style>