<template>
	<view class="container" style="background:#c8131e url(/static/new/bg.jpg) no-repeat center top / 100%;">
		<headerView>
			<template #leftIcon><u-icon name="arrow-left" color="#fff" size="24"></u-icon></template>
			<view>切换帐号</view>
		</headerView>
		<view class="content">
			<view class="title">点击切换帐号</view>
			<view class="list">
				<view class="item" v-for="(acc, index) in savedAccounts" :key="index">
					<view class="text" @click="selectAccount(acc)">{{ acc.phone }}</view>
					<view class="del" @click="toDel(index)"><u-icon name="close-circle"></u-icon></view>
				</view>
				<view class="item other" @click="signOut">
					<view class="plus"><u-icon name="plus"></u-icon></view>
					<view class="text">登录其他帐号</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		authLoginApi
	} from '@/api/api.js'
	export default {
		data() {
			return {
				settingInfo: uni.getStorageSync('settingInfo'),
				savedAccounts: uni.getStorageSync('savedAccounts') || [],
				form: {
					phone: '',
					password: '',
				},
			};
		},
		onLoad() {},
		methods: {
			// 退出登录
			signOut() {
				uni.removeStorageSync('token')
				uni.removeStorageSync('user_info')
				uni.reLaunch({
					url: '/pages/login/login'
				})
			},
			selectAccount(e) {
				 console.log("selectAccount", e.phone)
				 console.log("password", e.password)
				this.form.phone = e.phone;
				this.form.password = this.decrypt(e.password);
				this.toLogin();
			},
			decrypt(str) {
				//  解密（与加密对应）
				return decodeURIComponent(atob(str));
			},
			// 登录
			toLogin() {
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
							accounts[existIndex].avatar = res.data.data.user_info.avatar;
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
						uni.reLaunch({
							url: "/pages/index/index"
						})
					})
				}, 2000)()
			},
			toDel(e) {
				var that = this
				uni.showModal({
					title: '提示',
					content: '确定删除吗？',
					confirmColor: '#ee7e1a',
					success: function(res) {
						if (res.confirm) {
							// console.log('用户点击确定', e);
							that.onDel(e)
						} else if (res.cancel) {
							// console.log('用户点击取消', id);
						}
					}
				});
			},
			onDel(e) {
				this.savedAccounts.splice(e, 1);
				uni.setStorageSync('savedAccounts', this.savedAccounts);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {}

	.content {
		padding: 200rpx 30rpx 30rpx;

		.title {
			text-align: center;
			color: #fff;
			font-weight: bold;
			margin-bottom: 30rpx;
		}
	}

	.list {
		.item {
			position: relative;
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 30rpx;
			background: #fff;
			border-radius: 20rpx;
			margin-bottom: 30rpx;
			text-align: center;

			.img {
				width: 60rpx;

				image {
					width: 60rpx;
					display: block;
				}
			}

			.plus {
				width: 60rpx;
				height: 60rpx;
				background: #eee;
				border-radius: 10rpx;
				text-align: center;
				display: flex;
				justify-content: center;
			}

			.text {
				font-weight: bold;
				line-height: 60rpx;
			}

			.del {
				position: absolute;
				left: 30rpx;
			}
		}

		.other {
			.text {
				padding-left: 20rpx;
			}
		}
	}
</style>