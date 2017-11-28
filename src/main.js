// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import App from './App'
import router from './router'
import store from './vuex/index'; //store
import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'font-awesome/css/font-awesome.css';
// import './assets/iconfont.css';
// API
import api from './api/index.js'
// make global
Vue.prototype.$api = api
import utils from './commons/utils.js'
Vue.prototype.$utils = utils
//Object.definePrototype(Vue.prototype, '$utils', { value: utils });

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store, //
  template: '<App/>',
  components: { App }
})
