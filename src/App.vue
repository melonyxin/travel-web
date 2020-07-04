<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
    
  },
  data(){
    return {
      user: 1
    }
  },
  methods:{
    
  },
  created(){
    //在页面加载时读取sessionStorage里的状态信息
    if (sessionStorage.getItem("store") ) {
      this.$state.data = JSON.parse(sessionStorage.getItem("store"))
    } else if(this.$cookies.get("user")) {
      this.$state.setUser(this.$cookies.get("user"))
    }
    
    //在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener("beforeunload",()=>{
        sessionStorage.setItem("store",JSON.stringify(this.$state.data))
    })
  }
}
</script>

<style src="./assets/tailwind.min.css"></style>

<style>
html,body{
  min-height: 100%;
  height: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: 100%;
}
</style>
