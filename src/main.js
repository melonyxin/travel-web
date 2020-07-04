import Vue from 'vue'
import App from './App.vue'
import router from "./router"
import VueCookies from 'vue-cookies'
import state from './state'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'

Vue.prototype.$state = state
Vue.use(VueCookies)
Vue.use(ElementUI);
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
