<!-- 有用 -->
<template>
	<view class="container"
		style="background: url('/static/new1/bg.jpg') no-repeat center top / cover;background-attachment: fixed;">
		<view class="statusbar"></view>
		<view class="header_k">
			<view style="position: absolute;left: 20rpx;" @click="jumpk">
				<uni-icons type="left" color="#fff"></uni-icons>
			</view>
			人工客服

		</view>
		<view class="main">
			
			<view style="display: flex;margin-bottom: 50rpx;width: 100%;justify-content: space-between;align-items: center;">
				<view style="display: flex;color: #fff;align-items: center;">
					<image src="/static/new1/kfx.png" style="width: 100rpx;height: 100rpx;" mode=""></image>
					<view style="display: flex;flex-direction: column;margin-left: 20rpx;font-size: 28rpx;">
						<text>365在线</text>
						<text>每天12小时专属客服服务</text>
					</view>
				</view>
				<view style="color: #333;background: #fff;height: 60rpx;line-height: 60rpx;padding: 0 20rpx;border-radius: 50rpx;" @click="jumpx()">人工客服</view>
				
			</view>
			
			
			<view class="tab1">
				
				<view class="item" v-for="(item,index) in list" @click="jumpx(item)">
					<view class="icon">
						<image src="/static/new1/yw.png" mode=""></image>
					</view>
					<view class="text">
						<view style="width: 100%;display: flex;;justify-content: space-between;">
							<text>{{index+1}}·{{item.name}}</text>
							<uni-icons type="right"></uni-icons>
						</view>
						<view style="line-height: 40rpx;;margin-top: 20rpx;font-size:24rpx;color: #DCDCDC;">
							{{item.text}}
						</view>
					</view>
				</view>

			</view>
		</view>
	</view>
</template>

<script>
	import {
		getSettingApi, //系统配置

	} from '@/api/api.js'

	export default {
		data() {
			return {

				settingInfo: uni.getStorageSync('settingInfo'),



				list: [{
						name: '如何注册',
						text: "点击网站首页“登录”，在登录弹窗上点击“立即注册”，即可进入注册页面，本期仅支持手机号注册哦~"
					},
					{
						name: '订单如何取消',
						text: "点击网站首页“登录”，在登录弹窗上点击“立即注册”，即可进入注册页面，本期仅支持手机号注册哦~"
					},
					{
						name: '下了订单后，可以修改订单吗',
						text: "点击网站首页“登录”，在登录弹窗上点击“立即注册”，即可进入注册页面，本期仅支持手机号注册哦~"
					},
					{
						name: '如何查看物流',
						text: "点击网站首页“登录”，在登录弹窗上点击“立即注册”，即可进入注册页面，本期仅支持手机号注册哦~"
					},
					{
						name: '支付方式',
						text: "点击网站首页“登录”，在登录弹窗上点击“立即注册”，即可进入注册页面，本期仅支持手机号注册哦~"
					},
					{
						name: '如何注册',
						text: "点击网站首页“登录”，在登录弹窗上点击“立即注册”，即可进入注册页面，本期仅支持手机号注册哦~"
					},
				],

			}
		},
		onLoad() {

			// 配置接口 热更新
			getSettingApi().then(res => {
				this.settingInfo = res.data.data
				uni.setStorageSync('settingInfo', res.data.data)
				uni.setNavigationBarTitle({
					title: res.data.data.basic.site_name
				});

			})

		},

		methods: {
			jumpkl() {
				uni.navigateBack()
			},
			jumpx() {
			
					
					let url = this.settingInfo.service.service_url
					uni.navigateTo({
						url: `/pages/noPage/index?url=${url.split("&").join("$")}`,

					})


			},
			// 跳转外链
			toWeb(e) {
				if (!!this.swiperList[e].url) {
					this.$utils.toWeb(this.swiperList[e].url)
				}
			},
			// 页面跳转
			toPage(url) {
				if (this.UserInfo.is_auth == 1) {
					this.$utils.toPage(url)
				} else {
					this.rnShow = true;
				}
			},

			// 去在线客服页
			toLoads(url) {
				uni.navigateTo({
					url: `/pages/noPage/index?url=${url.split("&").join("$")}`
				})
			},

		}
	}
</script>

<style lang="scss" scoped>
	.header_k {
		position: relative;
		text-align: center;
		color: #fff;
		margin-top: 40rpx;
		font-weight: 700;
	}

	.container {
		min-height: 100vh;
		height: auto;
	}

	.main {
		padding: 30rpx;
		color: #040A13;
		margin-bottom: calc(60px + env(safe-area-inset-bottom));
	}

	.tab1 {
		display: flex;
		justify-content: space-around;
		flex-wrap: wrap;

		margin-bottom: 30rpx;

		.item {
			background: #fff;
			border-radius: 20rpx;
			padding: 30rpx 10rpx;
			width: 100%;
			display: flex;
			font-size: 28rpx;
			position: relative;
			margin-bottom: 20rpx;
			

			.icon {

				image,
				img {
					width: 50rpx;
					height: 50rpx;
					display: block;
					border-radius: 50%;
					margin-top: -10rpx;
				}
			}

			.text {
				line-height: 1;
				font-size: 1.1em;
				font-weight: 500;
				padding-left: 10rpx;
			}

		}
	}

	
</style>