<!-- 有用 -->
<template>
	<view class="container"
		style="background: url('/static/new1/bg.jpg') no-repeat center top / cover;background-attachment: fixed;">
		<view class="statusbar"></view>
		<view class="header_k">
			<view style="position: absolute;left: 20rpx;" @click="jumpk">
				<uni-icons type="left" color="#fff"></uni-icons>
				<text style="margin-left: 20rpx;">红旗河工程</text>
			</view>
			
			

		</view>
		<view class="main">
			
			<view style="background: #fff;padding: 20rpx;border-radius: 20rpx;">
				<view style="font-weight: 700;">
					{{info.name}}
				</view>
				<view style="color: #999;font-size: 24rpx;margin-top: 10rpx;">
					{{info.createtime}}
				</view>
				<view style="margin: 20rpx 0;" v-html="info.content">
					
				</view>
			</view>
			
			<view style="margin-top: 20rpx;">
				<view style="background: #fff;padding: 20rpx;border-radius: 20rpx;">
					官方信息一栏
					<view style="display: flex;flex-wrap: wrap;justify-content: space-between;margin-top: 20rpx;">
						<view style="border: 1px dashed;padding: 10rpx;margin-bottom: 20rpx;" v-for="i in image">
							
							<image :src="i.image" style="width: 300rpx;height: 60rpx;"></image>
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
		indexOfficialApi,
		indexProjectApi

	} from '@/api/api.js'

	export default {
		data() {
			return {
				settingInfo: uni.getStorageSync('settingInfo'),
				info:{},
				image:[]
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
			indexOfficialApi().then(res=>{
				console.log("--1-",res.data)
				this.image=res.data.data
				console.log("this.ionfo",this.info)
			})
			indexProjectApi().then(res=>{
				console.log("-2--",res.data)
				this.info=res.data.data
			})

		},

		methods: {
			jumpk() {
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
        margin-top: 40rpx;
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