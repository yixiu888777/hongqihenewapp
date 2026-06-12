<template>
	<view class="container" style="background:#c8131e url(/static/new/bg.jpg) no-repeat center top / 100%;">
		<headerView>
			<template #leftIcon>
				<image src="@/static/mine/back.svg" mode="widthFix"></image>
			</template>
			<view>切换帐号</view>
		</headerView>
		<view class="content">
			<view class="title">请触头像以切换帐号</view>
			<view class="list">
				<view class="item" v-for="(acc, index) in savedAccounts" :key="index" @click="selectAccount(acc)">
					<view class="img"><image :src="acc.avatar || '/static/new/avatar.png'" mode="widthFix"></image></view>
					<view class="text">{{ acc.phone }}</view>
				</view>
				<view class="item" @click="signOut">
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
				form: {
					phone: '',
					password: '',
				},
				savedAccounts: []
			};
		},
		onLoad() {
			const accounts = uni.getStorageSync('savedAccounts') || [];
		    this.savedAccounts = accounts;
		},
		methods: {
			// 退出登录
			signOut() {
				uni.removeStorageSync('token')
				uni.removeStorageSync('UserInfo')
				uni.reLaunch({
					url: '/pages/login/login'
				})
			},
			selectAccount(e){
				console.log("selectAccount",e.phone)
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
						  const key = 'savedAccounts';
						  let accounts = uni.getStorageSync(key) || [];
						  const existIndex = accounts.findIndex(acc => acc.phone === this.form.phone);
						  const now = Date.now();
						  if (existIndex >= 0) {
						    accounts[existIndex].lastLogin = now;
						  } else {
						    accounts.push({ phone:this.form.phone, avatar: '', password: this.encrypt(this.form.password), lastLogin: now });
						  }
						  accounts.sort((a, b) => b.lastLogin - a.lastLogin);
						  if (accounts.length > 5) accounts = accounts.slice(0, 5);
						  uni.setStorageSync(key, accounts);
						  uni.reLaunch({
						  	url: "/pages/index/index"
						  })
					})
				}, 2000)()
			}
		}
	}
</script>

<style lang="scss">
	.container {}
	.content{ padding: 200rpx 30rpx 30rpx;
		.title{ text-align: center; color: #fff; font-weight: bold; margin-bottom: 30rpx;}
	}
	.list{
		.item{ display: flex; padding: 30rpx;  background: #fff; border-radius: 20rpx; margin-bottom: 30rpx;
			.img{ width: 60rpx;
				image{ width: 60rpx; display: block; }
			}
			.plus{ width: 60rpx; height: 60rpx; background: #eee; border-radius: 10rpx; text-align: center; display: flex; justify-content: center;
			}
			.text{ padding: 0 30rpx; line-height: 60rpx;}
		}
	}
</style>