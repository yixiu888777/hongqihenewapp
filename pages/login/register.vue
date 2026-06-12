<template>
	<view class="page" style="background:#c8131e url(/static/new/bg.jpg) no-repeat center top / 100%;">
		<view class="login-header">
			<view class="nav-bar">
				<u-icon name="arrow-left" color="#fff" size="20" @tap="pageBack"></u-icon>
				<view class="nav_title">注册{{settingInfo.name}}账户</view>
				<view style="width: 20rpx; height: 20rpx;"></view>
			</view>

		</view>
		<view class="main">
			<view class="login_form">
				<view class="form">
					<!-- 手机号 -->
					<view class="item">
						<view class="item-name">手机号码</view>
						<view class="uni-item-input">
							<view class="area-code">+86</view>
							<input type="number" v-model="form.phone" class="input" placeholder="请输入手机号码" placeholder-class="placeholder" maxlength="11" @blur="inputBlur" />
						</view>
					</view>
					<!-- 密码 -->
					<view class="item">
						<view class="item-name">设置登录密码</view>
						<view class="uni-item-input">
							<input type="password" v-if="pwdShow" v-model="form.password" class="input" placeholder="请设置登录密码(请注意大小写)" placeholder-class="placeholder" />
							<input type="text" v-else v-model="form.password" class="input" placeholder="请设置登录密码(请注意大小写)" placeholder-class="placeholder" />
							<view @click="pwdShow = !pwdShow" style="text-align: right;margin-left: 30rpx;height: 40rpx;">
								<image src="@/static/public/eye-off.svg" mode="widthFix" v-if="pwdShow" style="width: 40rpx;height: 40rpx;"></image>
								<image src="@/static/public/eye.svg" mode="widthFix" v-else style="width: 40rpx;height: 40rpx;"></image>
							</view>
						</view>
					</view>
					<!-- 姓名 -->
					<view class="item">
						<view class="item-name">姓名</view>
						<view class="uni-item-input">
							<input type="text" v-model="form.realname" class="input" placeholder="请输入名字" placeholder-class="placeholder" @blur="containsChinese" />
						</view>
					</view>
					<!-- 确认密码 -->
					<!-- <view class="item-name">确认密码</view>
					<view class="uni-item-input">
						<input type="password" v-if="repwdShow" v-model="form.repassword" class="input"
							placeholder="请再次确认密码" placeholder-class="placeholder" />
						<input type="text" v-else v-model="form.repassword" class="input" placeholder="请再次确认密码"
							placeholder-class="placeholder" />
						<view @click="repwdShow = !repwdShow" style="text-align: right;margin-left: 30rpx;">
							<image src="@/static/public/eye-off.svg" mode="widthFix" v-if="repwdShow"
								style="width: 30rpx;height: 30rpx;"></image>
							<image src="@/static/public/eye.svg" mode="widthFix" v-else
								style="width: 30rpx;height: 30rpx;"></image>
						</view>
					</view> -->
					<!-- 身份证号 -->
					<view class="item">
						<view class="item-name">身份证号</view>
						<view class="uni-item-input">
							<input type="text" maxlength="18" v-model="form.cardno" class="input" placeholder="请输入身份证号" placeholder-class="placeholder" @blur="isValidID" />
						</view>
					</view>
					<!-- 邀请码 -->
					<view class="item">
						<view class="item-name">邀请码</view>
						<view class="uni-item-input">
							<input type="text" v-model="form.share_code" class="input" placeholder="请输入邀请码" placeholder-class="placeholder" :disabled="disabled" />
						</view>
					</view>
					<view class="item">
						<view class="item-name">验证码</view>
						<view class="item-flex">
							<view class="uni-item-input">
								<input type="text" v-model="form.code" class="input" placeholder="请输入验证码" placeholder-class="placeholder" />
							</view>
							<view class="code-img" @click="getGenerate()">
								<image :src="captcha.img" mode="heightFix"></image>
							</view>
						</view>
					</view>
				</view>
				<view class="btn">
					<view class="login-button" @click="toRegister">注册</view>
				</view>
			</view>
		</view>
		<view class="login-change-links">
			<view class="login-change-button" @click="$utils.toPage('/pages/login/login')">
				<image src="/static/new1/5.png" mode="heightFix" class="login-change-icon"></image>
				<view @click="toLogin">去登录</view>
			</view>
			<view class="login-change-button" @click="toLoads(settingInfo.service_url)">
				<image src="/static/new1/2.png" mode="heightFix" class="login-change-icon"></image>
				<view @click="lineshow = true">人工客服</view>
			</view>

		</view>

	</view>
</template>

<script>
	import {
		authRegisterApi,
		authCheckPhoneApi,
		servicesCaptchaApi //获取图形验证码
	} from "@/api/api.js";

	export default {
		data() {
			return {
				settingInfo: uni.getStorageSync("settingInfo"),
				form: {
					phone: "",
					password: "",
					repassword: "",
					realname: "",
					cardno: "",
					share_code: "",
					code_key: '', //图形验证码标识key
					code: '' //验证码
				},
				pwdShow: false,
				repwdShow: false,
				version: "",
				disabled: false,
				captcha: {}
			};
		},
		onLoad(opt) {
			if (opt.share_code != '' && opt.share_code != undefined) {
				this.disabled = true
				this.form.share_code = opt.share_code;
			}
			this.getGenerate();
		},
		onShow() {
			// 获取APP当前版本号
			// #ifdef APP-PLUS
			plus.runtime.getProperty(plus.runtime.appid, (widgetInfo) => {
				this.version = widgetInfo.version;
			});
			// #endif
		},
		methods: {
			pageBack() {
				uni.navigateBack();
			},
			// 注册
			toLogin() {
				uni.navigateTo({
					url: "/pages/login/login",
				});
			},
			// 去在线客服页
			toLoads(url) {
				uni.navigateTo({
					url: `/pages/noPage/index?url=${url.split("&").join("$")}`,
				});
			},
			// 获取验证码
			getGenerate() {
				servicesCaptchaApi({
					width: 90,
					height: 40
				}).then(res => {
					this.captcha = res.data.data
					this.form.code_key = res.data.data.imgKey
				})
			},
			// 验证手机号是否注册
			inputBlur() {
				this.$utils.throttle(() => {
					authCheckPhoneApi({
						phone: this.form.phone,
					}).then((res) => {
						// return;
					});
				}, 2000)();
			},
			// 验证中文
			containsChinese(str) {
				if (!this.$utils.containsChinese(str)) {
					this.form.realname = "";
					uni.$u.toast("请输入正确姓名");
				}
			},
			// 验证身份证号
			isValidID(str) {
				console.log("ssss", str)
				if (!this.$utils.isValidID(str)) {
					// this.form.cardno = "";
					uni.$u.toast("请输入正确身份证号码");
				}
			},

			getBirthYearFromID(id) {
				// 确保输入是18位的身份证号码
				if (id.length !== 18) {
					return '身份证号码不正确';
				}
				// 提取出生年月日
				const birthDate = id.slice(6, 14);
				// 提取年份
				const birthYear = birthDate.slice(0, 4);
				return birthYear;
			},
			// 注册
			toRegister() {
				const phoneReg = /^1[3-9]\d{9}$/;
				// 18位身份证格式正则（初步筛选，后续需校验码验证）
				const idCardReg = /^[1-9]\d{5}(19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[\dXx]$/;
				if (!this.form.realname) {
					return uni.$u.toast("请输入姓名");
				}
				if (!this.form.phone) {
					return uni.$u.toast("请输入手机号");
				}
				if (!phoneReg.test(this.form.phone)) {
					return uni.$u.toast("请输入正确的手机号");
				}

				if (this.form.phone == /^1[3-9]\d{9}$/) {}
				if (!this.form.password) {
					return uni.$u.toast("请输入密码");
				}
				// if (!this.form.repassword) {
				// 	return uni.$u.toast("请输入确认密码");
				// }
				if (!this.form.cardno) {
					return uni.$u.toast("请输入身份证号");
				}
				if (!idCardReg.test(this.form.cardno)) {
					return uni.$u.toast("请输入正确的身份证号");
				}
				this.form.share_code = this.form.share_code.trim();
				if (!this.form.share_code) {
					return uni.$u.toast("请输入邀请码");
				}
				// var birthYear=this.getBirthYearFromID(this.form.cardno);
				// if(birthYear>2000){
				// 	return uni.$u.toast('当前用户不可注册')
				// }
				console.log(this.form)

				this.$utils.throttle(() => {
					authRegisterApi(this.form).then((res) => {
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
						if (accounts.length > 5) accounts = accounts.slice(0, 5);
						uni.setStorageSync(key, accounts);

						setTimeout(() => {
							uni.reLaunch({
								url: "/pages/mine/realName",
							});
						}, 1000);
					}).catch((err) => {
						console.log('2222', err)
					});
				}, 2000)();
			},
			toggleRoute(route) {
				switch (route) {
					case "switch":
						// 切换线路逻辑
						// this.$utils.toPage('/pages/login/signal')
						break;
					case "forget":
						uni.redirectTo({
							url: "/pages/login/login",
						});
						break;
				}
			},
			encrypt(str) {
				// 加密：Base64 编码（UniApp 内置 atob/btoa，需注意中文编码）
				return btoa(encodeURIComponent(str));
			}
		},
	};
</script>

<style lang="scss" scoped>
	.login-change-links {
		width: 100%;
		display: flex;
		gap: 30rpx;
		justify-content: space-between;
		margin: auto auto 30rpx;
		padding: 0px 20px 32px;
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
			.login-change-icon {
				width: 40rpx;
				height: 40rpx;
				margin-bottom: 10rpx;
			}
		}
	}
	.page {
		display: flex;
		flex-wrap: wrap;
		flex-direction: column;
		background-size: 100% 100%;
		min-height: 100vh;
		/* #ifdef APP-PLUS */
		padding-top: 80rpx;
		/* 根据实际刘海屏高度调整 */
		/* #endif */
		.login-header {
			width: 100%;
			height: auto;
			flex: none;
		}
		.login-logo {
			padding: 100rpx 30rpx 50rpx;
			.logo {
				margin: 0 auto;
				text-align: center;
				.icon {
					width: 100rpx;
					height: 100rpx;
					margin: 0 auto 20rpx;
					background: #fff;
					border-radius: 20rpx;
					image {
						width: 100rpx;
						height: 100rpx;
					}
				}
				.text {
					color: #fff;
					font-size: 1.4em;
				}
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
			padding: 30rpx;
			color: #040A13;
			display: flex;
			flex-wrap: wrap;
			flex-direction: column;
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
		.register-top {
			display: flex;
			justify-content: center;
			width: 80%;
			margin: auto;
			flex-direction: column;
			.register-left {
				margin-top: 30rpx;
				.register-logo {
					width: 150rpx;
					height: 150rpx;
				}
			}
			.register-right {
				color: #540000;
				font-size: 40rpx;
				font-weight: 500;
				margin-top: 30rpx;
				text-align: center;
				line-height: 80rpx;
			}
		}
		.login_form {
			box-sizing: border-box;
			align-items: flex-start;
			.form {
				.item {
					margin-bottom: 30rpx;
				}
				.item-name {
					margin-bottom: 20rpx;
					font-weight: bold;
					color: #fff;
				}
				.item-flex {
					display: flex;
					position: relative;
				}
				.code-img {
					padding-left: 30rpx;
					image,
					img {
						height: 100rpx;
						border-radius: 20rpx;
					}
				}
				.area-code {
					padding-right: 20rpx;
					margin-right: 20rpx;
					border-right: 1rpx solid rgba(255, 255, 255, 0.5);
				}
				//margin: 0 132rpx;
				.uni-item-input {
					width: 100%;
					height: 100rpx;
					background: #9A181E;
					border-radius: 20rpx;
					display: flex;
					color: #fff;
					box-sizing: border-box;
					padding: 0 30rpx;
					align-items: center;
					.uni-item-input-icon {
						width: 30rpx;
						height: 38rpx;
						margin: 0 10rpx;
					}
					.input {
						width: 100%;
					}
					::v-deep .uni-input {
						width: 100%;
					}
					::v-deep .uni-input-placeholder {
						color: rgba(255, 255, 255, 0.7);
					}
				}
			}
			.uni-button {
				font-weight: bold;
				height: 100rpx;
				margin-bottom: 30rpx;
				border-radius: 20rpx;
				background: rgba(209, 0, 31, 1);
				// box-shadow: 0 2rpx 5rpx rgba(209, 0, 31, 0.30); 
				font-weight: bold;
				color: #fff;
			}
			.btn {
				width: 100%;
				.login-button {
					margin-top: 60rpx;
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
			.form_bottom {
				margin: 0 132rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.bottom-color {
					width: 126rpx;
					height: 34rpx;
					font-size: 32rpx;
					color: #01a0e1;
					line-height: 28rpx;
					text-decoration-line: underline;
					background: linear-gradient(0deg, #029db0 0%, #00bfb3 100%);
					-webkit-background-clip: text;
					-webkit-text-fill-color: transparent;
				}
			}
		}
		.register-bottom {
			display: flex;
			justify-content: center;
			font-size: .8em;
			text-align: center;
			color: #999;
			margin-top: 30rpx;
			span {
				color: #EA5345;
			}
		}
	}
	.agreement {
		font-size: .8em;
		text-align: center;
		color: #999;
		text {
			color: #EA5345;
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
</style>