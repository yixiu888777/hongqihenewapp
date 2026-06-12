<template>
	<view class="container" style="background:#c8131e url(/static/new/bg.jpg) no-repeat center top / 100%;">
		<headerView>
			<template #leftIcon><u-icon name="arrow-left" color="#fff" size="24"></u-icon></template>
			<view>官方群聊</view>
		</headerView>
		<view class="content">
			<view class="htit">
				<view class="">
					<image :src="appInfo.chat_logo" mode="widthFix" style="width: 150rpx;height:  150rpx;"></image>
				</view>
			</view>
			<view class="box">
				<view class="title" v-if="appInfo.chat_desc">{{appInfo.chat_desc}}</view>
				<view class="desc">官方聊天APP:{{appInfo.chat_name}}</view>

				<view class="line-btn flex_center" style="margin-top: 70rpx;" @click="download(appInfo.down_url_1)" v-if="appInfo.down_url_1">
					<view class="text ">点击下载线路1</view>
				</view>
				<view class="line-btn flex_center" @click="download(appInfo.down_url_2)" v-if="appInfo.down_url_2">
					<view class="text">点击下载线路2</view>
				</view>
				<view class="line-btn flex_center" @click="download(appInfo.down_url_3)" v-if="appInfo.down_url_3">
					<view class="text">点击下载线路3</view>
				</view>
				<view class="line-btn flex_center" @click="copyText(appInfo.chat_invite_code)" v-if="appInfo.chat_invite_code">
					<view class="text">官方邀请码：{{appInfo.chat_invite_code}}</view>
				</view>
			</view>
		</view>
		<view style="position: absolute;bottom:72rpx;text-align: center; 
			;font-weight:500; color:#fff;width: 100%;display: flex;justify-content: center;flex-direction: column;">
			<view class="" @click="toLoads(settingInfo.service_url)">
				下载不成功？点击联系<text style="color: #FFD500;">人工客服</text>
			</view>
			<view style="margin-top:20rpx;font-size: 22rpx;">
				@ 红旗河工程 联合出品|新纪元 提供服务
			</view>

		</view>
		<view @click="toLoads(settingInfo.service_url)">
			<image src="../../static/new1/kf.png" style="width:100rpx;height:100rpx;position: fixed;
    right: 40rpx;
    bottom: 200rpx;
}" mode=""></image>
		</view>
	</view>
</template>

<script>
	import {
		servicesChatApi
	} from '@/api/api.js'
	export default {
		data() {
			return {
				settingInfo: uni.getStorageSync('settingInfo'),
				appInfo: {}
			};
		},
		onLoad() {
			servicesChatApi().then(res => {
				this.appInfo = res.data.data
			})
		},
		methods: {
			// 复制
			copyText(text) {
				uni.setClipboardData({
					data: text,
					success: () => {
						uni.$u.toast('复制成功')
					},
					fail: () => {
						uni.$u.toast('复制失败')
					}
				});
			},
			// 下载软件
			download(url) {
				// #ifdef H5
				window.open(url)
				// #endif
				// #ifdef APP-PLUS
			/* 	uni.navigateTo({
					url: `/pages/noPage/index?url=${url}`
				}) */
				 plus.runtime.openURL(url);
				// #endif
			},
			// 跳转在线客服
			toLoads(url) {
				uni.navigateTo({
					url: `/pages/noPage/index?url=${url.split("&").join("$")}`
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		min-height: 100vh;
		.content {
			position: relative;
			flex: none;
			width: 100%;
			.htit {
				text-align: center;
				color: #fff;
				width: 100%;
				height: 340rpx;
				padding: 200rpx 0 0;
				line-height: 1;
			}
			.logo {
				width: 200rpx;
				margin: 0 auto;
				image {
					width: 100%;
				}
			}
			.box {
				padding: 30rpx 0 60rpx;
				margin: 0 50rpx;
				margin-bottom: 30rpx;
				color: #fff;
				text-align: center;
				.title {
					font-weight: bold;
					font-size: 32rpx;
					letter-spacing: 2rpx;
					margin-bottom: 10rpx;
				}
				.desc {
					opacity: .8;
					line-height: 1;
					font-size: 28rpx;
					margin: 20rpx 0;
				}
			}
			.box:last-child {
				border-bottom: none;
			}
			.copy {
				.url {
					display: inline;
					line-height: 1.2;
					margin-right: 14rpx;
				}
				image {
					width: 46rpx;
					height: 46rpx;
					margin-left: 14rpx;
				}
			}
			.line-btn {
				margin: 30rpx 30rpx 0;
				padding: 30rpx;
				border-radius: 20rpx;
				background: #fff;
				color: #333;
				font-size: 32rpx;
				line-height: 1;
				font-weight: 400;
				display: flex;
				align-items: center;
				.text {
					margin-left: 20rpx;
				}
				&>image {
					width: 56rpx;
					margin-right: 40rpx;
				}
			}
		}
	}
</style>