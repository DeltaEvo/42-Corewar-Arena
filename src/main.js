import Vue from "vue";
import App from "./App.vue";
import "./components/VM";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faUpload, faPlay, faCrown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import "vue-multiselect/dist/vue-multiselect.min.css";

library.add(faUpload, faPlay, faCrown);

Vue.component("icon", FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");

(function() {
  var script = document.createElement("script");
  script.onload = function() {
    var stats = new window.Stats();
    document.body.appendChild(stats.dom);
    requestAnimationFrame(function loop() {
      stats.update();
      requestAnimationFrame(loop);
    });
  };
  script.src = "//cdn.jsdelivr.net/gh/Kevnz/stats.js/build/stats.min.js";
  document.head.appendChild(script);
})();
