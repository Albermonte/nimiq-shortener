import Vue from 'vue'
import App from './App.vue'
import router from "./router";
import VeeValidate from "vee-validate";
import './firebase';
import VueFire from 'vuefire';

Vue.use(VueFire)

Vue.use(VeeValidate);


new Vue({
  router,
  el: '#app',
  render: h => h(App)
})
