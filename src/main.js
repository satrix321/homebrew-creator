// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import VueSplit from 'vue-split-panel';

import "@fortawesome/fontawesome-free-webfonts/css/fontawesome.css";
import "@fortawesome/fontawesome-free-webfonts/css/fa-brands.css";
import "@fortawesome/fontawesome-free-webfonts/css/fa-regular.css";
import "@fortawesome/fontawesome-free-webfonts/css/fa-solid.css";

Vue.use(VueSplit);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');