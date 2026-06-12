import crypto from '@/utils/crypto.js'

let baseUrl = uni.getStorageSync('baseUrl') || 'https://api.wodehongqi.cc'

let request = (vm) => {
	uni.$u.http.setConfig((config) => {
		config.timeout = 6000;
		config.baseURL = uni.getStorageSync('baseUrl')
		config.header.Authorization = uni.getStorageSync('token') ? uni.getStorageSync('token') : ''
		return config
	})

	// 请求拦截
	uni.$u.http.config.baseURL = uni.getStorageSync('baseUrl') || baseUrl
	uni.$u.http.interceptors.request.use((config) => {
		config.baseURL = uni.getStorageSync('baseUrl') || baseUrl;
		config.header.Authorization = uni.getStorageSync('token') ? uni.getStorageSync('token') : ''
		return config;
	})
	uni.$u.http.interceptors.request.use((config) => {
		config.baseURL = uni.getStorageSync('baseUrl') || baseUrl;
		uni.showLoading({
			mask: true
		})
		if (config.custom.auth == true) {
			let token = uni.getStorageSync("token") || ''
			let data = {
				...config.data,
				...{
					token: token,
					site: uni.getStorageSync("baseUrl"),
					app_ver: '102'
				}

			}
			//config.data = data
			try {
				//config.data = crypto.encrypt(data)
				 config.data = data
			} catch (e) {
				console.error("加密失败：", e)
			}
			//	config.data = crypto.encrypt(data)
		};
		return config
	}, config => {
		return Promise.reject(config)
	})

	// 响应拦截
	uni.$u.http.interceptors.response.use((res) => {
		uni.hideLoading();
		// 解密文本
		if (res.data.code == undefined) {
			let decrypted = crypto.decrypt(res.data.data)
			res.data = decrypted
		}
		if (res.data.code == -9 || res.data.code == -10 || res.data.code == -11 || res.data.code == -99) {
			return Promise.reject(res)
		}
		if (res.data.code != 1) {
			if (res.data.code == -5) {
				uni.$u.toast(res.data.msg)
				setTimeout(() => {
					uni.navigateTo({
						url: '/pages/mine/account/paymentPassword'
					});
				}, 500)
			} else if (res.data.code == -6) {
				uni.$u.toast(res.data.msg)
				setTimeout(() => {
					uni.navigateTo({
						url: "/pages/mine/realName?type=back"
					})
				}, 500)
			} else if (res.data.code == -7) {
				uni.$u.toast(res.data.msg)
				setTimeout(() => {
					uni.navigateTo({
						url: "/pages/mine/recharge/recharge"
					})
				}, 500)
			} 
			else if (res.data.code == -122) {
				uni.$u.toast(res.data.msg)
				setTimeout(() => {
					uni.navigateTo({
						url: "/pages/policy/buy?id="+res.data.data
					})
				}, 2000)
			}else if (res.data.code == -8) {

			} else if (res.data.code == 3) {
				// uni.$u.toast(res.data.msg)
				uni.removeStorageSync('token')
				// uni.$u.toast(res.data.msg)
				setTimeout(() => {
					uni.navigateTo({
						url: "/pages/login/login"
					})
				}, 500)
				return
			} else {
				uni.$u.toast(res.data.msg)
			}
			return Promise.reject(res)
		}
		return res
	}, (res) => {
		console.log('响应失败：', JSON.stringify(res))
		console.log('失败' + res.config.timeout)
		console.log('失败' + res.config.url)
		uni.hideLoading();
		if( res.config.url != '/api/services/line'){
			//uni.$u.toast('响应失败,请切换线路')
		}
		
		let failnum = uni.getStorageSync('failnum') || 1;
		uni.setStorageSync('failnum',failnum+1)
		if(res.config.url !='/api/services/check/level' && res.config.url != '/api/services/config' && res.config.url != '/api/services/line'){
			if(failnum > 3){
				/* uni.removeStorageSync('token')
				uni.setStorageSync('failnum',0)
				uni.navigateTo({
					url: "/pages/login/login"
				}) */
				
			}
			
		}
		// 对响应错误做点什么 （statusCode !== 200）
		return Promise.reject(res)
	})
}
module.exports = request