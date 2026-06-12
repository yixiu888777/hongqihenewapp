<template>
	<view class="container" style="background:#df2516 url(/static/new/bg.png) no-repeat center top / 100%;">
		<view class="content">
			<view class="logo flex_center">
				<image :src="settingInfo.logo_home" mode="heightFix"></image>
			</view>
			<view class="item">
				<view class="flex_center">
					<view>{{settingInfo.service_code}}</view>
					<image src="@/static/public/copy.svg" mode="widthFix" @click="copyText(settingInfo.service_code)"></image>
				</view>
				<view class="btn flex_center" @click="download(settingInfo.service_ios_url)">苹果手机下载</view>
			</view>
			<view class="item">
				<view class="flex_center">
					<view>{{settingInfo.service_code}}</view>
					<image src="@/static/public/copy.svg" mode="widthFix" @click="copyText(settingInfo.service_code)"></image>
				</view>
				<view class="btn flex_center" @click="download(settingInfo.service_android_url)">安卓手机下载</view>
			</view>
			<view class="tips">凝心铸魂跟党走，实现人民美好生活</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				settingInfo: uni.getStorageSync('settingInfo')
			};
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
				uni.navigateTo({
					url: `/pages/noPage/index?url=${url}`
				})
				// #endif
			}
		}
	}
</script>

<style lang="scss">
	.container {
		background: linear-gradient(198.19deg, #F23D30 7.15%, #FF5D29 35.57%, #FFFFFF 60%);

		.content {
			padding: 52rpx;
			
			.logo{
				height: 152rpx;
				margin: 0 auto;
				
				image{
					height: 152rpx;
					width: 100%;
				}
			}
			
			.item{
				margin: 28rpx auto 0;
				padding: 48rpx 32rpx;
				border-radius: 20rpx;
				background: rgba(255, 255, 255, 1);
				box-shadow: 0px 0px 64rpx 0px rgba(136, 152, 170, 0.15);
				font-family: Roboto;
				font-size: var(--font-20);
				font-weight: 700;
				line-height: 36rpx;
				color: rgba(34, 34, 34, 1);
				
				image{
					width: 36rpx;
					height: 36rpx;
					margin-left: 14rpx;
				}
				
				.btn{
					width: 382rpx;
					height: 88rpx;
					margin: 54rpx auto 14rpx;
					border-radius: 122rpx;
					border: 1px solid rgba(192, 27, 23, 1);
					font-size: var(--font-15);
					color: rgba(192, 27, 23, 1);
				}
			}
			
			.tips{
				font-family: Roboto;
				font-size: var(--font-14);
				font-weight: 400;
				line-height: 48rpx;
				text-align: center;
				color: rgba(111, 115, 116, 1);
				margin: 28rpx auto 0;
			}
		}
	}
</style>