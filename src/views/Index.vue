<template>
  <h1>hello {{ user.name }}</h1>
</template>

<script>
export default {
  name: 'Index',
  data(){
    return {
      user: null
    }
  },
  methods:{
    
  },
  created(){
    if(this.$cookies.get("user") === null){
      this.$router.push('/login')
    } else {
      this.user=this.$cookies.get("user")
    }
    console.log(this.user)
  },
  mouted(){
    //this.user=this.$router.params.user;
  }
}
</script>

<style>

</style>