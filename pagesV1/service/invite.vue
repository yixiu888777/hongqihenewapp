<template>
	
		<view class="container"
			style="background: url('/static/new1/bg.jpg') no-repeat center top / cover;background-attachment: fixed;">
			<view class="statusbar"></view>
			<view class="header_k">
				<view style="position: absolute;left: 20rpx;" @click="jumpk">
					<uni-icons type="left" color="#fff"></uni-icons>
				</view>
				邀请好友，共建纪元

			</view>

			<view class="tip">传递纪元力量·共创民族伟业·收获荣耀奖励</view>

			<!-- 专属码 -->
			<view class="count-box">

				<view style="font-weight: 800;margin-bottom: 40rpx;">
					邀请入口区
				</view>

				<view class="input-code">
					<view style="font-size: 28rpx;color: #333;font-weight: 800;margin-right: 20rpx;">邀请链接</view>
					<view class="input" style="color: #3670F7;">https://meeting.tencent.com/c</view>
					<view class="icon">
						<image src="/static/invite/copy.png" mode="height" @tap="copyText(info.invite_url)"></image>
					</view>
				</view>
				<view class="input-code" style="margin-top: 40rpx;">
					<view style="font-size: 28rpx;color: #333;font-weight: 800;margin-right: 20rpx;">我的邀请码</view>
					<view class="input" style="color: #3670F7;">https://meeting.tencent.com/c</view>
					<view class="icon">
						<image src="/static/invite/copy.png" mode="height" @tap="copyText(info.invite_url)"></image>
					</view>
				</view>
				<view style="font-weight: 800;margin: 40rpx 0;">
					下载二维码
				</view>
				<view class="qrcode">
					<image src="/static/invite/code.png" mode="widthFix"></image>
				</view>
				<view style="display: flex;justify-content: center;">
					<text
						style="padding: 10rpx 40rpx;color:#fff;background: red;border-radius: 40rpx;font-size: 24rpx;">保存</text>
				</view>
				<view style="font-size: 24rpx;color: red;text-align: center;margin-top: 20rpx;">
					提示:扫码下载App并自动绑定我的邀请码
				</view>

			</view>
			<view class="reward">
				<view class="tit">共建等级奖励</view>
				<view class="tit" style="align-items: center;display: flex;">
					<image src="/static/invite/0.png" style="width: 30rpx;height: 30rpx;" mode=""></image>
					<text style="font-size: 24rpx;margin-left: 10rpx;">多级使者计划</text>
				</view>
				<!-- <view class="list">
					<view class="item" :class="item.is_complete == 1?'success':'ing'" v-for="(item,index) in info.invite_config" :key="index">
						<view class="icon"><image :src="item.icon" mode="widthFix"></image></view>
						<view class="text">
							<view class="h3">{{item.title}}</view>
							<view class="desc">{{item.description}}</view>
						</view>
						<view class="btn" @tap="copyText(info.invite_url)">{{ item.is_complete == 1 ? '已完成' : '去完成' }}</view>
					</view>
				</view> -->
				<view class="level">
					<view :class="'item lv'+(index+1)" v-for="(item,index) in InviteConfig">
						<view class="icon">
							<image :src="item.icon" mode="widthFix"></image>
						</view>
						<view class="desc">{{item.title}}</view>
						<view class="btn"
							style="background: #fff;padding: 10rpx 20rpx;border-radius: 30rpx;font-size: 28rpx;color: #333;">
							<text>领取奖励</text>
						</view>
					</view>
				</view>
			</view>
			<view class="reward">
					<view class="tit">共建等级奖励</view>
				<view class="m-tips primary" style="padding: 0;">
					<view class="text" >
						<!-- <view  class="desc" v-html="settingInfo.text.invite_reward_rule"></view>
					 -->
					 <view style="display: flex;flex-direction: column;
					 line-height: 40rpx;">
					 	<text>邀请好友注册并完成实名认证即可成为纪元使者</text>
						<text>每一级达成后，可自行领取奖励</text>
						<text>团队成员活跃度越高，奖励倍增</text>  
					 </view>
					</view>
				</view>
				<view style="margin-top: 20rpx;
				margin-top:60rpx;
				background-color: red;text-align: center;color: #fff;
				padding: 30rpx 0;border-radius: 20rpx;">
					立即邀请好友
				</view>
			</view>
			<view style="color: #fff;text-align: center;margin-top: 60rpx;">
				◎2025 红旗河工程 官方运营中心
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

<style lang="scss">
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

	.count-box {
		padding: 30rpx;
		margin: 0 30rpx 30rpx;
		border-radius: 20rpx;
		background: #fff;

		.qrcode {
			width: 220rpx;
			margin: 0 auto 20rpx;
		}

		.btn {
			display: flex;
			align-items: center;
			border-radius: 50rpx;
			background: linear-gradient(to left, #FF624B, #FF3650);
			color: #fff;
			width: 220rpx;
			margin: 0 auto 30rpx;
			text-align: center;
			padding: 10rpx 30rpx;

			image {
				height: 30rpx;
				margin-left: 10rpx;
				display: inline-block;
			}
		}

		.h2 {
			font-size: 32rpx;
			font-weight: bold;
			text-align: center;
			margin-bottom: 30rpx;
		}

		.h3 {
			font-size: 32rpx;
			font-weight: bold;
			margin-bottom: 10rpx;
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

			.icon {
				width: 50rpx;
				padding-left: 20rpx;

				image {
					height: 30rpx;
				}
			}
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