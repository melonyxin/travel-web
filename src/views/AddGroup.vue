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
        <span class="label">旅游团名字：</span>
        <el-input v-model="group.name" placeholder="name" maxlength="10" size="small" :disabled="type == 'update'" show-word-limit></el-input>
        <span class="tip">长度小于10个字符</span>

        <span class="label">最多报名人数：</span>
        <el-input v-model="group.maximum" type="number" placeholder="maximum" size="small" show-word-limit></el-input>
        <span class="tip">整数</span>

        <span class="label">价格：</span>
        <el-input v-model="group.price" type="number" placeholder="price" size="small" show-word-limit></el-input>
        <span class="tip">整数</span>

        <span class="label">旅游团简介：</span>
        <el-input v-model="group.brief" type="textarea" placeholder="brief" maxlength="200" size="small" autosize show-word-limit></el-input>
        <span class="tip">长度小于200个字符</span>

        <span class="label">旅游团路线：</span>
        <el-button @click="addConsist()" size="small" type="primary">增加旅游点</el-button>
        <el-button @click="removeConsist()" size="small" type="primary">删除旅游点</el-button>

        <template v-for="(item,index) in group.consistList">
          <span class="label" :key="'span'+index">景点{{index+1}}：</span>
          <!-- <el-input v-model="item.spot_name" maxlength="20" placeholder="景点" size="small" show-word-limit :key="'name'+index"></el-input> -->
          <el-select v-model="item.spot_name" :key="'name'+index" placeholder="请选择景点">
            <el-option
              v-for="(item,index) in allSpotName"
              :key="'spotname'+index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
          <el-date-picker
            v-model="item.date"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions"
            :key="'date'+index"
            size="small"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </template>
      </div>

      <div class="flex mt-4">
        <el-button v-if="type == 'add'" type="primary" @click="addGroup()" size="small">添加旅游团</el-button>
        <el-button v-if="type == 'update'" type="primary" @click="updateGroup()" size="small">修改旅游团</el-button>
        <el-button @click="toBack()" size="small">返回</el-button>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'AddGroup',
  data() {
    return {
      user: null,
      type:null,
      group:{
        name:'',
        maximum:'',
        price:'',
        brief:'',
        agency_account:'',
        consistList:[{
          spot_name: '',
          group_name: '',
          date: ''
        }],
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        },
      },
      last_consist:[],
      sendnum:0,
      allSpotName:[]
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
    toBack() {
      this.$router.push('/managegroup')
    },
    addConsist(){
      let consist = {
        spot_name: '',
        group_name: '',
        date: ''
      }
      this.group.consistList.push(consist)
      console.log(this.group.consistList)
      console.log(this.last_consist)
    },
    removeConsist(){
      this.group.consistList.pop();
      console.log(this.group.consistList)
      console.log(this.last_consist)
    },
    addGroup(){
      let that = this;
      let group={
        name: this.group.name,
        maximum: this.group.maximum,
        price: this.group.price,
        brief: this.group.brief,
        agency_account: this.group.agency_account
      };
      let url = this.$state.getUrl()+'group/add';
      axios.post(url,group)
      .then(function(res) {
        //成功时服务器返回 response 数据
        if(res.data.result){
          that.addConsistList();
          that.$message({
              message: '旅游团添加成功！',
              type: 'success'
          });
          console.log(that.$state.getGroupList());
          that.$router.push('/managegroup')
        } else {
          that.$message.error('添加旅游团信息失败');
        }
      })
      .catch(function(error) {
        console.log(error);
      });
    },
    addConsistList(){
      for(let item of this.group.consistList){
        item.group_name = this.group.name;
        this.uploadConsist(item);
      }
    },
    uploadConsist(consist){
      let url = this.$state.getUrl()+'consist/add';
      return axios.post(url,consist);
    },
    deleteConsist(consist){
      let url = this.$state.getUrl()+'consist/delete';
      return axios.post(url,consist);
    },
    updateGroup(){
      let url = this.$state.getUrl()+'group/update';
      let that = this;
      let group={
        last_name:this.group.name,
        name: this.group.name,
        maximum: this.group.maximum,
        price: this.group.price,
        brief: this.group.brief,
        agency_account: this.group.agency_account
      };
      axios.post(url,group)
      .then(function(res) {
        //成功时服务器返回 response 数据  
        if(res.data.result){
          that.updateConsistList();
        } else {
          that.$message.error('修改旅游团信息失败');
        }
      })
      .catch(function(error) {
        console.log(error);
      });
    },
    updateConsistList(){
      let delreq = [];
      let addreq = [];
      let that = this;
      for(let item of this.last_consist){
        delreq.push(this.deleteConsist({spot_name:item.spot_name,group_name:item.group_name}));
      }

      axios.all(delreq)
      .then(function(){
        for(let item of that.group.consistList){
          item.group_name = that.group.name;
          addreq.push(that.uploadConsist(item));
        }

        axios.all(addreq)
        .then(function(){
          that.$message({
              message: '旅游团修改成功！',
              type: 'success'
          });
          console.log(that.$state.getGroupList());
          that.$router.push('/managegroup')
        })
      })
    }
  },
  created() {
    if(this.$state.getUser() === null){
      this.$router.push('/login')
    } else if(this.$state.getUser().type != 'agency'){
      this.$router.push('/index')
    } else {
      this.user = this.$state.getUser();
      this.group.agency_account = this.user.account;
    }

    if(this.$route.params.type == undefined){
      this.$router.push('/index')
    } else {
      this.type=this.$route.params.type;
      if(this.type == 'update'){
        this.group = this.$state.deepClone(this.$route.params.group);
        this.last_consist = this.$state.deepClone(this.group.consistList);
      }
    }
    
    let spotList = this.$state.getSpotList();
    let len = spotList.length;
    for(let i=0;i<len;i++){
      this.allSpotName.push(spotList[i].name)
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