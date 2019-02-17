import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VeeValidate from "vee-validate";
import VueFire from "vuefire";
import { Validator } from "vee-validate";
import VueClipboard from "vue-clipboard2";

import "@nimiq/style/nimiq-style.min.css";

import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

Vue.use(Buefy)


Vue.use(VueClipboard);

Vue.use(VueFire);

Vue.use(VeeValidate);

Vue.config.productionTip = false;

new Vue({
  router,
  el: "#app",
  render: h => h(App)
});

Validator.extend("address", {
  getMessage: () => {
    return "Invalid Address";
  },
  validate: value => {
    value = value.replace(/ /g, "");
    value = value.substr(4) + value.substr(0, 4);

    const num = value
      .split("")
      .map(c => {
        const code = c.toUpperCase().charCodeAt(0);
        return code >= 48 && code <= 57 ? c : (code - 55).toString();
      })
      .join("");
    let tmp = "";

    for (let i = 0; i < Math.ceil(num.length / 6); i++) {
      tmp = (parseInt(tmp + num.substr(i * 6, 6)) % 97).toString();
    }

    if (parseInt(tmp) !== 1) {
      return false;
    } else {
      return true;
    }
  }
});
