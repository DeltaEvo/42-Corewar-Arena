import Vue from "vue";
import App from "./App.vue";
import "./components/VM";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faUpload, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import "vue-multiselect/dist/vue-multiselect.min.css";

library.add(faUpload, faPlay);

Vue.component("icon", FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
