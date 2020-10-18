import Vue from 'vue';
import App from './App';
import store from './store';
import VueSplit from 'vue-split-panel';
import '@fortawesome/fontawesome-free/css/all.css';

Vue.use(VueSplit);
Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App)
}).$mount('#app');