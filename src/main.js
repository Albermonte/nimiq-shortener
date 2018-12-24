import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VueFire from "vuefire";
import VeeValidate from "vee-validate";

import Firebase from "firebase";

// Don't worry, this api is only for development

const config = {
  apiKey: "AIzaSyC354qBB4o-FK5spI73fBj794O_So9PetE",
  authDomain: "shortnim-eba7a.firebaseapp.com",
  databaseURL: "https://shortnim-eba7a.firebaseio.com",
  projectId: "shortnim-eba7a",
  storageBucket: "shortnim-eba7a.appspot.com",
  messagingSenderId: "1018896212159"
};

Firebase.initializeApp(config);

Vue.use(VeeValidate);

Vue.use(VueFire);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
