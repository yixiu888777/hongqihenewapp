// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import uView from '@/uni_modules/uview-ui'
import utils from "@/utils/index.js"
Vue.use(uView)
Vue.config.productionTip = false

Vue.prototype.$utils = utils
App.mpType = 'app'
const app = new Vue({
	...App
})
require('@/utils/request.js')(app)
app.$mount()
// #endif
// 导入全局组件
import RealName from './components/RealName/RealName.vue'
// 注册全局组件
Vue.component('Real-Name', RealName)

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
import App from './App.vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif