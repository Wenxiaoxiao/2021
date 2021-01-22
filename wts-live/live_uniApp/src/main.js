import Vue from 'vue'
import App from './App'
import store from '../src/store/state';
import notice from './api/notice'
import http from './api/http'
import tools from './api/tools'


Vue.config.productionTip = false;

App.mpType = 'app'
Vue.use(http)
Vue.use(notice)
Vue.use(tools)

//根据打包环境切换请求域名
if(process.env.NODE_ENV === 'development'){
    store.env = 0;
}else{
    store.env = 1;
}
Vue.prototype.$resourceUrl = store.domain[store.env];
Vue.prototype.$http = http.uniRequest;
Vue.prototype.$notice = notice;
Vue.prototype.$tools = tools;
const app = new Vue({
    ...App
})
app.$mount()