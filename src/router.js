import Vue from "vue";
import Router from "vue-router";
import App from "./App.vue";
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "app",
      component: App,
      children: [
        {
          path: "index",
          name: "index",
          component: ()=>import("./views/Index.vue"),
        },
        {
          path: "login",
          name: "login",
          component: ()=>import("./views/Login.vue")
        },
        {
          path: "register",
          name: "register",
          component: ()=>import("./views/Register.vue")
        }
      ],
      redirect: "/index"
    } 
  ]
});