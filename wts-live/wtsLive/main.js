import Vue from 'vue'
import App from './App'
import notice from './tool/notice.js'
import http from './tool/http.js'
import tools from './tool/tools'

Vue.config.productionTip = false

App.mpType = 'app'
Vue.use(http)
Vue.use(notice)
Vue.use(tools)

Vue.prototype.$http = http.uniRequest;
Vue.prototype.$notice = notice;
Vue.prototype.$tools = tools;

const app = new Vue({
    ...App
})
app.$mount()
