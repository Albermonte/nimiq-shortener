import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VueFire from "vuefire";

Vue.use(VueFire);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
