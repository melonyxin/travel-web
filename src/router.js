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
        },
        {
          path: "spot",
          name: "spot",
          component: ()=>import("./views/Spot.vue")
        },
        {
          path: "group",
          name: "group",
          component: ()=>import("./views/Group.vue")
        },
        {
          path: "managespot",
          name: "managespot",
          component: ()=>import("./views/ManageSpot.vue")
        },
        {
          path: "addspot",
          name: "addspot",
          component: ()=>import("./views/AddSpot.vue")
        },
        {
          path: "allspot",
          name: "allspot",
          component: ()=>import("./views/AllSpot.vue")
        },
        {
          path: "allgroup",
          name: "allgroup",
          component: ()=>import("./views/AllGroup.vue")
        },
        {
          path: "managegroup",
          name: "managegroup",
          component: ()=>import("./views/ManageGroup.vue")
        },
        {
          path: "addgroup",
          name: "addgroup",
          component: ()=>import("./views/AddGroup.vue")
        },
        {
          path: "myappointment",
          name: "myappointment",
          component: ()=>import("./views/MyAppointment.vue")
        },
        {
          path: "myorder",
          name: "myorder",
          component: ()=>import("./views/MyOrder.vue")
        },
        {
          path: "searchresult",
          name: "searchresult",
          component: ()=>import("./views/SearchResult.vue")
        },
        {
          path: "allappointment",
          name: "allappointment",
          component: ()=>import("./views/AllAppointment.vue")
        },
        {
          path: "allorder",
          name: "allorder",
          component: ()=>import("./views/AllOrder.vue")
        },
      ],
      redirect: "/index"
    } 
  ]
});