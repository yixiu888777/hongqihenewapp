<template>
	<view class="container" style="background:#c8131e url(/static/new/bg.jpg) no-repeat center top / 100%;">
		<view class="statusbar"></view>
		<view class="header_k">
			<view style="position: absolute;left: 20rpx;" @click="jumpk">
				<uni-icons type="left" color="#fff"></uni-icons>
			</view>
			<view>

			</view>


		</view>
		<view class="count-box" style="margin-top: 60rpx;height:1000rpx">
			<view style="display: flex;justify-content: center;align-items: center;;">
				<view style="width: 30rpx;height: 30rpx;background: #07C160;border-radius: 50%;margin-right: 20rpx;">
				</view>
				<text style="font-size: 34rpx;font-weight: 700;">在线讲解/公益工程/红利生态</text>
			</view>
			<view style="color: #07C160;background: #E7F9F0;display: flex;
			justify-content: center;padding: 30rpx 0;margin: 30rpx 0;
			border-radius: 20rpx;font-size: 30rpx;">
				<image src="/static/live/1.png" style="width: 52rpx;height:40rpx;margin-right: 20rpx;" mode=""></image>
				<text>正在直播中·8.2k人观看</text>
			</view>
			<image src="/static/live/over.png" style="width:100%;height:320rpx" mode=""></image>
			<view style="color: #fff;background: red;display: flex;
			justify-content: center;padding: 30rpx 0;margin: 30rpx 0;
			border-radius: 20rpx;font-size: 30rpx;">
				<image src="/static/live/2.png" style="width: 52rpx;height:40rpx;margin-right: 20rpx;" mode=""></image>

				<text>进入直播间</text>
			</view>
			<view style="display: flex;
			justify-content: center;margin: 30rpx 0 0;
			border-radius: 20rpx;font-size: 30rpx;align-items: center;font-weight: 700;">
				<image src="/static/live/3.png" style="width: 82rpx;height:80rpx;margin-right: 2rpx;" mode=""></image>

				<text>今日直播主题</text>
			</view>
			<view style="display: flex;
			justify-content: center;margin: 20rpx 0 30rpx;
			border-radius: 20rpx;font-size: 30rpx;align-items: center;font-weight: 700;">
				《红旗河建设进度 & 生态回馈》
			</view>
			<view style="display: flex;
			justify-content: center;margin: 30rpx 0;
			border-radius: 20rpx;font-size: 30rpx;align-items: center;font-weight: 700;">
				主讲:项目发起人/嘉宾专家
			</view>
		</view>


	</view>



</template>

<script>
	import {
		commonScrollApi,
		getInviteInfoAPI,
		getInviteConfigAPI
	} from '@/api/api.js'
	export default {
		data() {
			return {
				settingInfo: uni.getStorageSync('settingInfo'),
				// 滚动公告
				noticeText: '',
				info: {
					rate: {}
				},
				InviteConfig: []
			};
		},
		onLoad() {
			// commonScrollApi({
			// 	is_popup: 2
			// }).then(res => {
			// 	this.noticeText = res.data.data.data[0].content
			// })

			getInviteInfoAPI().then(res => {
				// console.log("getInviteInfoAPI",res.data)
				this.info = res.data.data
			})
			getInviteConfigAPI().then(res => {
				this.InviteConfig = res.data.data
			})
		},
		methods: {
			pageBack() {
				if (!!this.back) {
					uni.reLaunch({
						url: '/pages/index/index'
					})
				} else {
					// #ifndef APP-PLUS
					let backPage = getCurrentPages()
					if (backPage.length == 1) {
						uni.reLaunch({
							url: "/pages/index/index"
						})
					} else {
						uni.navigateBack()
					}
					// #endif

					// #ifdef APP-PLUS
					uni.navigateBack()
					// #endif
				}
			},
			// 跳转在线客服
			toLoads(url) {
				// #ifndef APP-PLUS
				window.open(url)
				// #endif
				// #ifdef APP-PLUS
				uni.navigateTo({
					url: `/pages/noPage/index?url=${url.split("&").join("$")}`
				})
				// #endif
			},
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
		}
	}
</script>

<style lang="scss" scoped>
	.count-box {
		padding: 30rpx;
		margin: 0 30rpx 30rpx;
		border-radius: 20rpx;
		background: #fff;
	}
	.container {
		min-height: 100vh;
		height: auto;
		padding-bottom: 120rpx;
	}
	.header_k {
		position: relative;
		text-align: center;
		color: #fff;
		margin-top: 40rpx;
		font-weight: 700;
	}
	.tip {
		text-align: center;
		color: #fff;
		font-size: 28rpx;
		line-height: 1;
		margin: 20rpx 0 40rpx;
	}
	.input-code {
		display: flex;
		align-items: center;
		background: rgba(246, 247, 249, 1);
		padding: 30rpx;
		border-radius: 10rpx 20rpx;
		.input {
			flex: 1;
			overflow: hidden;
			white-space: nowrap;
			overflow: hidden;
		}
	}
	.reward {
		padding: 30rpx;
		margin: 0 30rpx 30rpx;
		border-radius: 20rpx;
		background: #fff;
		.tit {
			font-size: 32rpx;
			font-weight: bold;
			margin-bottom: 30rpx;
		}
		.list {
			.item {
				padding: 30rpx;
				margin-bottom: 30rpx;
				border-radius: 20rpx;
				display: flex;
				align-items: center;
				background: rgba(249, 250, 251, 1);
				.icon {
					image {
						width: 100rpx;
					}
				}
				.text {
					flex: 1;
					padding: 0 30rpx;
					.h3 {
						font-weight: bold;
					}
					.desc {
						font-size: .8em;
					}
				}
				.btn {
					font-size: .8em;
					background: linear-gradient(to left, #FF624B, #FF3650);
					color: #fff;
					border-radius: 10rpx;
					padding: 10rpx 20rpx;
				}
			}
			.success {
				filter: grayscale(100%);
				-webkit-filter: grayscale(100%);
				opacity: .7;
				.btn {}
			}
			.ing {
				.btn {}
			}
		}
		.level {
			font-size: 0.8em;
			margin-bottom: 30rpx;
			.lv1 {
				background: linear-gradient(270deg, #7B90AD 0%, #B2C1D7 100%);
			}
			.lv2 {
				background: linear-gradient(270deg, #DDB999 0%, #F1D8BA 100%);
			}
			.lv3 {
				background: linear-gradient(90deg, #ADCAE8 0%, #CCE0F8 100%);
			}
			.lv4 {
				background: linear-gradient(90deg, #E8BE76 0%, #F4D59E 100%);
			}
			.lv5 {
				background: linear-gradient(90deg, #918EE5 0%, #A5A0F0 100%);
			}
			.lv6 {
				background: linear-gradient(90deg, #131313 0%, #48484A 100%);
			}
			.item {
				border-radius: 20rpx;
				padding: 30rpx;
				display: flex;
				align-items: center;
				margin-bottom: 30rpx;
				.icon {
					image {
						width: 90rpx;
					}
				}
				.desc {
					color: #fff;
					font-size: 1.2em;
					padding: 0 20rpx;
					flex: 1;
				}
				.btn {
					color: #FF374F;
					font-size: 1.2em;
					font-weight: bold;
				}
			}
		}
	}
	.nav-list {
		grid-template-columns: 1fr 1fr 1fr;
		margin-bottom: 30rpx;
		display: flex;
		justify-content: space-between;
		.nav-item {
			width: 31%;
			height: 104rpx;
			padding: 12rpx 20rpx;
			;
			border-radius: 20rpx;
			background: linear-gradient(to left, rgba(255, 49, 80, 0.1), rgba(255, 100, 75, 0.1));
			border-top: 1px solid rgba(255, 255, 255, 1);
			font-family: Roboto;
			font-size: 28rpx;
			font-weight: 400;
			line-height: 40rpx;
			color: rgba(175, 21, 0, 1);
			image {
				width: 28rpx;
				height: 28rpx;
			}
		}
	}
</style>