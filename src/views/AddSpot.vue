<template>
  <div class="w-full flex flex-col items-center bg-gray-200">
    <div class="w-full bg-gray-100 h-12 flex justify-center">
      <div class="w-3/4 h-full flex justify-between items-center">
        <h1 class="font-bold text-lg text-teal-500">Tourism</h1>
        <div class="flex text-sm">
          <span>欢迎！<span v-if="user.type == 'tourist'" class="text-orange-500">{{ user.account }}</span>
          <span v-else class="text-orange-500">{{ user.name }}</span></span>
          <el-link :underline="false" class="ml-6" @click="logout()">退出登录</el-link>
        </div>
      </div>
    </div>

    <div class=" w-1/2 flex flex-col items-center bg-white p-10 mt-6">
      <div class="grid grid-cols-3 row-gap-4 items-center col-gap-4 mt-6">
        <span class="label">景点名：</span>
        <el-input v-model="spot.name" placeholder="name" maxlength="20" size="small" :disabled="type == 'update'" show-word-limit></el-input>
        <span class="tip">长度小于20个字符</span>

        <span class="label">地址：</span>
        <el-input v-model="spot.site" type="textarea" placeholder="address" maxlength="45" size="small" autosize show-word-limit></el-input>
        <span class="tip">长度小于45个字符</span>

        <span class="label">开放时间：</span>
        <el-input v-model="spot.open_time" placeholder="time" maxlength="20" size="small" show-word-limit></el-input>
        <span class="tip">如："9:00-18:00"</span>

        <span class="label">最多预约人数：</span>
        <el-input v-model="spot.maximum" type="number" placeholder="num" size="small" show-word-limit></el-input>
        <span class="tip">整数</span>

        <span class="label">预览图片地址：</span>
        <el-input v-model="spot.picture" type="textarea" placeholder="http://.." maxlength="500" size="small" autosize show-word-limit></el-input>
        <span class="tip">长度小于500个字符</span>

        <span class="label">门票价格：</span>
        <el-input v-model="spot.price" type="number" placeholder="price" size="small" show-word-limit></el-input>
        <span class="tip">整数</span>

        <span class="label">景点简介：</span>
        <el-input v-model="spot.brief" type="textarea" placeholder="brief" maxlength="500" size="small" autosize show-word-limit></el-input>
        <span class="tip">长度小于500个字符</span>

      </div>

      <div class="flex mt-4">
        <el-button v-if="type == 'add'" type="primary" @click="addSpot()" size="small">添加景点</el-button>
        <el-button v-if="type == 'update'" type="primary" @click="updateSpot()" size="small">修改景点</el-button>
        <el-button @click="toBack()" size="small">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'AddSpot',
  data() {
    return {
      user: null,
      spot:{
        name: '',
        site: '',
        open_time: '',
        maximun: 0,
        brief:'',
        picture:'',
        price:'',
        bureau_account:''
      },
      type:null,
      index:-1,
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
    toBack() {
      this.$router.go(-1)
    },
    addSpot() {
      let that = this;
      let spot = this.spot;
      let url = this.$state.getUrl()+'spot/add';
      axios.post(url,spot)
      .then(function(res) {
        //成功时服务器返回 response 数据
        if(res.data.result){
          that.$state.getSpotList().push(res.data.spot);
          that.$message({
              message: '景点添加成功！',
              type: 'success'
          });
          that.$router.go(-1);
        } else {
          that.$message.error('添加景点信息失败');
        }
      })
      .catch(function(error) {
        console.log(error);
      });

    },
    updateSpot(){
      let that = this;
      let spot = this.spot;
      let url = this.$state.getUrl()+'spot/update';
      spot.last_name = spot.name;
      axios.post(url,spot)
      .then(function(res) {
        //成功时服务器返回 response 数据
        if(res.data.result){
          that.$state.getSpotList().splice(that.index,1);
          that.$state.getSpotList().push(res.data.spot);
          that.$message({
              message: '景点修改成功！',
              type: 'success'
          });
          console.log(that.$state.getSpotList());
          that.$router.go(-1)
        } else {
          that.$message.error('添加景点信息失败');
        }
      })
      .catch(function(error) {
        console.log(error);
      });
    }
  },
  created() {
    if(this.$state.getUser() === null){
      this.$router.push('/login')
    } else if(this.$state.getUser().type != 'bureau'){
      this.$router.push('/index')
    } else {
      this.user = this.$state.getUser();
      this.spot.bureau_account = this.user.account;
    }

    if(this.$route.params.type == undefined){
      this.$router.push('/index')
    } else {
      this.type=this.$route.params.type;
      if(this.type == 'update'){
        this.spot = this.$route.params.spot;
      }
    }
    
    for(let i in this.$state.getSpotList()){
      if(this.spot === this.$state.getSpotList()[i]){
        this.index = i;
        break;
      }
    }
    console.log(this.index)
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