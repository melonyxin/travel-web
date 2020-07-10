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

    <div class=" w-3/5 flex flex-col items-center bg-white p-10 mt-6">
      <!-- <h1 class="text-left text-2xl font-extrabold border-b-2 pb-4 w-full">搜索结果</h1> -->

      <h2 v-if="spotResult.length !=0" class="text-left font-semibold border-b-2 pb-1 w-full">景点</h2>

      <div v-for="(item,index) in spotResult" 
        :key="'searchspot'+index"
        class="flex w-full pt-6 pb-6 cursor-pointer"
        style="border-bottom-width:1px"
        @click="showSpot(index)">
        <img :src="item.picture" class="w-1/5 rounded-md" />
        <div class="flex flex-col text-left ml-8">
          <span class="font-semibold text-lg">{{item.name}}</span>
          <span class="text-gray-600 text-xs font-semibold mt-2">开放时间：{{ item.open_time }} | 最多预约人数：{{ item.maximum }}</span>
          <span class="text-gray-600 text-sm mt-2">地址：{{ item.site }}</span>
          <span class="text-red-600 text-sm font-bold mt-2">￥{{ item.price }}</span>
        </div>
      </div>

      <h2 v-if="groupResult.length !=0" class="text-left font-semibold border-b-2 pb-1 w-full mt-10">旅游团</h2>

      <div v-for="(item,index) in groupResult" 
      :key="'searchgroup'+index"
      class="flex flex-col text-left w-full pt-6 pb-6 cursor-pointer"
      style="border-bottom-width:1px"
      @click="showGroup(index)">
        <span class="font-semibold text-lg">{{item.name}}</span>
        <span class="text-gray-600 text-xs font-semibold mt-2">最多人数：{{item.maximum}} |
          旅游路线：
          <span v-for="(point,index) in item.consistList" :key="'searchconsist'+index">
            <span v-if="index !=0">➜</span>
            {{point.spot_name}}
          </span>
        </span>
        <span class="text-red-600 text-sm font-bold mt-2">￥{{ item.price }}</span>
      </div>

      <div class="mt-4 mb-4"></div>
    </div>
    <div class="mt-10 mb-10"></div>
  </div>
</template>

<script>
export default {
  name: 'SearchResult',
  data(){
    return {
      user: null,
      spotResult:[],
      groupResult:[]
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
    showSpot(index){
      let spot = this.spotResult[index]
      this.$router.push({
        name:'spot',//这个name就是你刚刚配置在router里边的name
        params:{
          spot:spot
        }
    })
    },
    showGroup(index){
      let group = this.groupResult[index]
      this.$router.push({
        name:'group',//这个name就是你刚刚配置在router里边的name
        params:{
          group:group
        }
      })
    },
  },
  created(){
    if(this.$state.getUser() === null){
      this.$router.push('/login')
    } else {
      this.user=this.$state.getUser()
    }
    console.log(this.user)

    if(this.$route.params.searchvalue == undefined){
      this.$router.push('/index')
    }

    let searchvalue=this.$route.params.searchvalue;
    console.log(searchvalue)
    if(this.$state.getSpotList() === null){
      this.$router.push('/index')
    } else {
      for(let item of this.$state.getSpotList()){ //name,site,brief
        if(item.name.includes(searchvalue)){
          this.spotResult.push(item);
        } else if(item.site.includes(searchvalue)) {
          this.spotResult.push(item);
        } else if(item.brief.includes(searchvalue)) {
          this.spotResult.push(item);
        }
      }
    }
    console.log(this.spotResult)
    if(this.$state.getGroupList() === null){
      this.$router.push('/index')
    } else {
      for(let item of this.$state.getGroupList()){
        console.log(item)
        if(item.name.includes(searchvalue)){
          this.groupResult.push(item);
        } else if(item.brief.includes(searchvalue)) {
          this.groupResult.push(item);
        } else {
          for(let spot of item.consistList){
            if(spot.spot_name.includes(searchvalue)){
              this.groupResult.push(item);
              break;
            }
          }
        }
      }
      console.log(this.groupResult)
    }
  }
}
</script>

<style>

</style>