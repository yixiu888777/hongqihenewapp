<template>
	<view class="page" style="background:#c8131e url(/static/new/bg.jpg) no-repeat center top / 100%;">
		<headerView>
			<view style="color: bisque;">红旗河工程</view>
		</headerView>
		<view class="main">
			<view class="login-logo">
				<view class="logo">
					<view class="icon">
						<image src="@/static/logo.png" mode="widthFix"></image>
					</view>
				</view>
			</view>
			<view class="login-form">
				<u-form labelPosition="left" :model="form" ref="uForm">
					<u-form-item prop="phone" label="登录手机号" labelPosition="top" labelWidth="200">
						<u-input class="uni-input" maxlength="11" color="#fff" placeholderStyle="color: #fff;" v-model="form.phone" placeholder="请输入手机号">
						</u-input>
					</u-form-item>
					<u-form-item prop="password" label="密码" labelPosition="top" labelWidth="200">
						<u-input type="password" class="uni-input" v-model="form.password" color="#fff" placeholderStyle="color: #fff;" placeholder="请输入密码" v-if="pwdShow">
						</u-input>
						<u-input type="text" class="uni-input" v-model="form.password" color="#fff" placeholderStyle="color: #fff;" placeholder="请输入密码" :password='pass' v-else>
						</u-input>
						<view @click="pwdShow = !pwdShow" class="uni-input-passowrd">
							<image v-if="pwdShow" src="@/static/public/eye-off.svg" mode="aspectFill" style="width: 30rpx;height: 30rpx;"></image>
							<image src="@/static/public/eye.svg" mode="widthFix" style="width: 30rpx;height: 30rpx;" v-else></image>
						</view>
					</u-form-item>
				</u-form>
			</view>
			<view class="btn">
				<view class="login-button" @click="toLogin">登录</view>
			</view>
			<view class="login-version" v-if="appVersion">版本 1.7.7</view>

			<view class="login-change-links">
				<view class="login-change-button" @click="$utils.toPage('/pages/login/register')">
					<image src="/static/new1/1.png" mode="heightFix" class="login-change-icon"></image>
					<view @click="lineshow = true">去注册</view>
				</view>
				<view class="login-change-button" @click="toLoads(settingInfo.service_url)">
					<image src="/static/new1/2.png" mode="heightFix" class="login-change-icon"></image>
					<view @click="lineshow = true">人工客服</view>
				</view>
				<view class="login-change-button" @click="popSignal()">
					<image src="/static/new1/3.png" mode="heightFix" class="login-change-icon"></image>
					<view >切换线路</view>
				</view>
				<view class="login-change-button" @tap="cache">
					<image src="/static/new1/4.png" mode="heightFix" class="login-change-icon"></image>
					<view>清理缓存</view>
				</view>
			</view>

		</view>

		<!-- 线路选择弹窗 -->
		<u-popup :show="signalShow" mode="center" round="32" @close="signalShow = false">
			<view class="van-dialog van-dialog2">
				<view class="van-dialog__header">
					<view class="h2">红旗河工程专用线路</view>
					<view class="desc">数值越小，速度越快</view>
				</view>
				<view class="checkSignal">
					<view class="item" :class="index == signalShowIndex?'on':''" v-for="(item,index) in signal" :key="index" @click="checkSignal(index)">
						<view class="text">{{item.name}}</view>
						<view class="code">{{item.ms}}</view>
					</view>
				</view>
				<view class="van-dialog__footer">
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		servicesLineApi,
		getSettingApi,
		getUserInfoAPI,
		authLoginApi
	} from '@/api/api.js'
	export default {
		data() {
			return {
				isPageShow: false,
				settingInfo: {},
				baseUrl: 'http://43.248.117.58:8907',  // 正式
				lists: [
					
					{
						url: 'http://43.248.117.58:8907',
						name: '红旗河工程专用线路2',
						ms: 10
					},
					{
						url: 'https://zzapi.fqqgto.cn',
						name: '红旗河工程专用线路2',
						ms: 10
					},
					{
						url: 'https://zzapi.hqhgt.cc',
						name: '红旗河工程专用线路1',
						ms: 13
					},
					{
						url: 'https://zzapi.hqhllg.cc',
						name: '红旗河工程专用线路3',
						ms: 234
					},
					{
						url: 'https://zzapi.hqhlog.cc',
						name: '红旗河工程专用线路4',
						ms: 294
					},
					
					{
						url: 'https://zzapi.hqhwap.cc',
						name: '红旗河工程专用线路5',
						ms: 394
					},
					{
						url: 'https://api.hqhpop.cc',
						name: '红旗河工程专用线路6',
						ms: 394
					},
					{
						url: 'https://api.hqhop.cc',
						name: '红旗河工程专用线路7',
						ms: 394
					},
					
					{
						url: 'http://43.248.117.58:8907',
						name: '红旗河工程专用线路8',
						ms: 394
					}
				],
				index: -1,
				form: {
					phone: '',
					password: '',
				},
				pass: false,
				pwdShow: false,
				
				checkList: {
					name: '记住密码',
					checked: true,
					disabled: false
				},
				check: !!uni.getStorageSync('loginInfo') ? ['记住密码'] : [],
				signal: [],
				signalindex: [0, 0, 0],
				signalname: '线路切换',
				signalShow: false,
				signalShowIndex: -1,
				accIndex: 0,
				appVersion: process.env.UNI_APP_VERSION_NAME || '',
			}; 
		},
		onLoad(e) {
			// #ifdef APP-PLUS
			if (typeof plus !== 'undefined' && plus.runtime && plus.runtime.version) {
				this.appVersion = plus.runtime.version
			}
			// #endif
			
			if (e.accIndex) {
				
				this.accIndex = e.accIndex
				
			}
			if (!!uni.getStorageSync('settingInfo')) {
				
				this.settingInfo = uni.getStorageSync('settingInfo')
				
			}else{
				this.getSetting();
			}
			
			if (!!uni.getStorageSync('token')) {
				uni.reLaunch({
					url: "/pages/index/index"
				})
			}
			//先判断当前缓存 baseurl 是否存在  不存在/ 取this.baseUrl 检测
		// uni.setStorageSync('baseUrl','http://38.190.200.163:8896')
		//  let baseUrl  = "http://38.190.200.163:8896";
		//uni.setStorageSync("baseUrl","http://38.190.200.163:8896") //测试
			let baseUrl = uni.getStorageSync('baseUrl') || this.baseUrl
			if (!!uni.getStorageSync('baseUrl')) {
				uni.setStorageSync('baseUrl', baseUrl)
			}
			this.check_url(baseUrl)

			this.getStoredUserInfo()
		},
		methods: {
			getSetting() {
				getSettingApi().then(res => {
					this.settingInfo = res.data.data
					uni.setStorageSync('settingInfo', res.data.data)
					this.isPageShow = true;
				})
			},
			signalChange(e) {
				this.signalindex = e.detail.value
				// this.signal_id = this.signal[e.detail.value].id
				// this.signalname = this.signal[e.detail.value[0]].name
			},
			pickerConfirm() {
				this.signalname = this.signal[this.signalindex[0]].name
				if (this.activeValue == this.signalindex[0]) return
				this.activeValue = this.signalindex[0]
				uni.setStorageSync('currentline', this.signal[this.signalindex[0]])
				uni.setStorageSync('baseUrl', this.signal[this.signalindex[0]].url)
				// this.$refs.signalRef.close()
				this.signalShow = false;
			},
			pickerCancel() {
				// this.$refs.signalRef.close()
				this.signalShow = false;
			},
			checkSignal(e) {
				uni.setStorageSync('currentline', this.signal[e])
				uni.setStorageSync('baseUrl', this.signal[e].url)
				this.signalname = this.signal[e].name
				this.signalShowIndex = e
				this.signalShow = false;
				window.location.reload()
			},
			cache() {
				// 清理缓存
				uni.showLoading({
					title: '清理缓存中',
					mask: true
				});
				uni.clearStorage();
				this.check_url(this.baseUrl)
				setTimeout(() => {
					uni.hideLoading();
					uni.showToast({
						icon: 'none',
						title: '清理成功',
						duration: 1000
					});
					window.location.reload()
				}, 1000);
			},
			// 去在线客服页
			toLoads(url) {
				uni.navigateTo({
					url: `/pages/noPage/index?url=${url.split("&").join("$")}`
				})
			},
			// 登录
			toLogin() {
				if (!this.form.phone) {
					return uni.$u.toast('请输入手机号');
				}
				if (!this.form.password) {
					return uni.$u.toast('请输入密码');
				}
				this.$utils.throttle(() => {
					authLoginApi(this.form).then(res => {
						uni.$u.toast(res.data.msg);
						uni.setStorageSync('token', res.data.data.token)
						uni.setStorageSync('user_info', res.data.data.user_info)

						const key = 'savedAccounts';
						let accounts = uni.getStorageSync(key) || [];
						const existIndex = accounts.findIndex(acc => acc.phone === this.form.phone);
						const now = Date.now();
						if (existIndex >= 0) {
							accounts[existIndex].lastLogin = now;
						} else {
							accounts.push({
								phone: this.form.phone,
								avatar: res.data.data.user_info.avatar,
								password: this.encrypt(this.form.password),
								lastLogin: now
							});
						}
						accounts.sort((a, b) => b.lastLogin - a.lastLogin);
						if (accounts.length > 3) accounts = accounts.slice(0, 3);
						uni.setStorageSync(key, accounts);

						// if (this.check.length == 1) {
						// 	uni.setStorageSync('loginInfo', this.form)
						// } else {
						// 	uni.removeStorageSync('loginInfo')
						// }
						if (this.checkList.checked == true) {
							const encryptPwd = this.encrypt(this.form.password);
							uni.setStorageSync('user_login_info', {
								phone: this.form.phone,
								password: encryptPwd,
								storedTime: Date.now() // 可选：记录存储时间，用于过期清理
							});
						}
						this.getUser();
						// setTimeout(() => {
						// 	if (res.data.data.is_auth != 1) {
						// 		// 未实名进入实名认证
						// 		// uni.reLaunch({
						// 		// 	url: "/pages/mine/realName?type=back"
						// 		// })
						// 		// 进入首页
						// 		uni.reLaunch({
						// 			url: "/pages/index/index"
						// 		})
						// 	} else {
						// 		// 已实名进入首页
						// 		uni.reLaunch({
						// 			url: "/pages/index/index"
						// 		})
						// 	}
						// }, 1000)
					})
				}, 2000)()
			},
			getUser() {
				// getUserInfoAPI().then(res=>{
				// uni.setStorageSync('UserInfo', res.data.data)
				uni.reLaunch({
					url: "/pages/index/index"
				})
				// })
			},
			getLine() {
				servicesLineApi().then(res => {
					this.signal = res.data.data
				})
			},
			popSignal() {
				this.signal = this.lists
				// this.$refs.signalRef.open('bottom')
				this.signalShow = true
				this.getLine();
				
			},
			async check_url(url) {
				await uni.request({
					url: url + "/api/services/check/level", //仅为示例，并非真实接口地址。
					method: 'GET',
					timeout: 3000,
					success: (res) => {
						//uni.setStorageSync('baseUrl', url)
						if (res && res.data.code === 1) {
							uni.setStorageSync('baseUrl', url)
							return true
						} else {
							this.wayGet();
							return false
						}
					},
					fail: (err) => {
						//失败接口  去this.lists 所有域名
						// this.index++
						this.wayGet();
						return false
					}
				});
			},
			async wayGet() {
				for (var i = 0; i < this.lists.length; i++) {
					let [error, res] = await uni.request({
						url: this.lists[i].url + "/api/services/check/level",
						timeout: 3000,
					});
					if (res && res.data.code === 1) {
						uni.setStorageSync('baseUrl', this.lists[i].url)
						return this.lists[i].url
					}
				}
			},
			getStoredUserInfo() {
				try {
					// 读取存储的用户信息（key 自定义，如 user_login_info）
					// const storedInfo = uni.getStorageSync('user_login_info');
					const Accounts = uni.getStorageSync('savedAccounts') || [];
					const storedInfo = Accounts[this.accIndex];
					if (storedInfo) {
						// 解密密码（与存储时的加密方式对应）
						const decryptPwd = this.decrypt(storedInfo.password);
						// 填充到表单
						this.form = {
							phone: storedInfo.phone,
							password: decryptPwd
						};
						this.checkList.checked = true // 已存储则默认勾选
					}
				} catch (e) {
					console.error('读取本地存储失败：', e);
				}
			},
			encrypt(str) {
				// 加密：Base64 编码（UniApp 内置 atob/btoa，需注意中文编码）
				return btoa(encodeURIComponent(str));
			},
			decrypt(str) {
				//  解密（与加密对应）
				return decodeURIComponent(atob(str));
			},
			remember(n) {
				this.checkList.checked = !this.checkList.checked
			}
		}
	}
</script>



<style lang="scss" scoped>
	::v-deep .u-input {
		border: 0;
		background: rgba(0, 0, 0, 0.3);
		padding: 20rpx !important;
		border-radius: 10rpx;
	}
	::v-deep .u-form-item__body__left__content__label {
		color: #fff;
		font-weight: 500;
		font-size: 30rpx;
	}
	.page {
		display: flex;
		flex-wrap: wrap;
		flex-direction: column;
		background-size: 100% 100%;
		min-height: 100vh;
		.login-header {
			width: 100%;
			height: auto;
			flex: none;
		}
		.nav-bar {
			padding: 30rpx 32rpx 0;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.nav_title {
				font-size: 30rpx;
				font-weight: bold;
				color: #fff;
				line-height: 21rpx;
			}
		}
		.login-logo {
			padding: 0 0 30rpx;
			.logo {
				width: 300rpx;
				height: 300rpx;
				margin: 0 auto;
				image {
					width: 100%;
				}
			}
			.text {
				text-align: left;
				color: #fff;
				font-weight: bold;
				font-size: 1.6em;
			}
		}
		.login-text {
			display: flex;
			justify-content: center;
			color: #540000;
			font-size: 36rpx;
			font-weight: bold;
			margin-top: 30rpx;
		}
		.main {
			flex: 1;
			min-height: 100%;
			border-radius: 20rpx 20rpx 0 0;
			padding: 100rpx 30rpx 30rpx;
			color: #fff;
			display: flex;
			flex-wrap: wrap;
			flex-direction: column;
		}
		.login-form {
			width: 100%;
			margin-bottom: 0;
			height: auto;
			::v-deep .u-form-item__body__right {
				position: relative;
			}
			.uni-input {
				margin-top: 20rpx;
			}
			.uni-input-passowrd {
				width: 23rpx;
				height: 30rpx;
				position: absolute;
				top: 45rpx;
				right: 30rpx;
			}
		}
		.btn {
			width: 100%;
			.login-button {
				margin-top: 80rpx;
				text-align: center;
				margin-bottom: 30rpx;
				border-radius: 20rpx;
				background: #fff;
				font-size: 30rpx;
				padding: 20rpx;
				// box-shadow: 0 2rpx 5rpx rgba(209, 0, 31, 0.30);
				font-weight: bold;
				color: rgba(206, 9, 0, 1);
			}
			.reg-button {
				margin-top: 20rpx;
				margin-bottom: 30rpx;
				border-radius: 20rpx;
				background: rgba(209, 0, 31, 0.10);
				color: rgba(209, 0, 31, 1);
				height: 100rpx;
			}
		}
		.login-version {
			width: 100%;
			text-align: center;
			font-size: 24rpx;
			color: rgba(255, 255, 255, 0.65);
			margin-top: -10rpx;
			margin-bottom: 20rpx;
		}
		.login-forget {
			width: 100%;
			display: flex;
			justify-content: space-between;
		}
		.login-change-links {
			width: 100%;
			display: flex;
			gap: 30rpx;
			justify-content: space-between;
			margin: auto auto 30rpx;
			.login-change-button {
				display: flex;
				flex-direction: column;
				align-items: center;
				align-items: center;
				justify-content: center;
				background: #9A181E;
				color: #fff;
				font-size: 28rpx;
				font-weight: bold;
				border-radius: 20rpx;
				padding: 30rpx 10rpx;
				flex: 1;
				.login-change-icon, image {
					width: 40rpx;
					height: 40rpx;
					margin-bottom: 10rpx;
				}
			}
		}
		.login-bottom {
			display: flex;
			justify-content: center;
			margin-top: 30rpx;
			color: #999;
			span {
				color: #EA5345;
			}
		}
		.list {
			background: #F5F5F5;
			width: 700rpx;
			padding: 30rpx;
			border-radius: 20rpx;
			.item {
				margin: 40rpx auto 0;
				font-family: Roboto;
				font-size: var(--font-14);
				font-weight: 400;
				line-height: 48rpx;
				.item-name {
					flex: 1;
				}
				.item-image {
					width: 48rpx;
					height: 48rpx;
					flex-shrink: 0;
					margin: 0 20rpx;
				}
				.item-checkbox {
					width: 36rpx;
					height: 36rpx;
					border-radius: 8rpx;
					border: 1px solid #6f7374;
				}
				.active {
					background: rgba(25, 203, 55, 1);
					border: 1px solid rgba(25, 203, 55, 1);
				}
			}
		}
	}
	.fixedBtn {
		display: flex;
		justify-content: flex-end;
		position: fixed;
		bottom: 150rpx;
		right: 30rpx;
		.btn {
			border-radius: 100rpx;
			display: flex;
			align-items: center;
			flex: none;
			.icon {
				image,
				img {
					width: 120rpx;
					height: 120rpx;
					display: block;
				}
			}
			.text {
				line-height: 1;
				padding: 0 20rpx;
				display: none;
				.dt {
					font-weight: bold;
					margin-bottom: 10rpx;
					font-size: .8em;
				}
				.dd {
					font-size: .6em;
				}
			}
		}
	}
	.checkSignal {
		.item {
			background: #fff;
			display: flex;
			justify-content: space-between;
			border-radius: 20rpx;
			margin-bottom: 30rpx;
			padding: 20rpx;
			background: linear-gradient(to left, rgba(247, 247, 247, 1), rgba(216, 216, 216, .5));
			.name {}
			.code {
				opacity: .5;
			}
		}
		.item.on {
			background: linear-gradient(to left, rgba(255, 98, 75, 1), rgba(255, 54, 80, 1));
			color: #fff;
		}
	}
</style>