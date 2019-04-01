import Vue from 'vue'
import App from './App.vue'
import BaiduMap from 'vue-baidu-map';
import VueResource from 'vue-resource';
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import store from './store'  

Vue.prototype.$store = store
Vue.use(ElementUI);
Vue.use(VueResource);
Vue.use(router);
Vue.use(BaiduMap, {
  /* Visit http://lbsyun.baidu.com/apiconsole/key for details about app key. */
  ak: 'qhxpqSwdRZc1pfy3Ldda4dScRt2OlAEb'
});

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
