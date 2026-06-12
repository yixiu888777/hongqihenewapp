<template>
	<view class="container" style="background:#c8131e url(/static/new/bg.jpg) no-repeat center top / 100%;">
		<headerView>
			<template #leftIcon><u-icon name="arrow-left" color="#fff" size="24"></u-icon></template>
			<view>
				<image :src="settingInfo.logo"
					style="background: #fff; border-radius: 10rpx; width: 40rpx;height: 40rpx;margin-right: 20rpx; vertical-align: middle;"
					mode="heightFix"></image>{{settingInfo.name}}·直播中心
			</view>
		</headerView>

		<view class="list">
			<view class="item" :class="detail.live_status == 1?'pend':'ing'">
				<view class="h2">
					<view class="dot"></view>
					在线讲解 / 公益工程 / 红利生态
				</view>
				<!-- 0待开播  1直播中-->
				<view class="time" v-if="detail.live_status == 0">
					<image src="/static/new/live2.png" mode="heightFix"></image> {{detail.live_in_notice}}
				</view>
				<view class="time" v-if="detail.live_status == 1"> {{detail.live_to_notice}}</view>
				<!-- <view class="video" id="videoContain"></view> -->
				<view class="img">
					<image :src="detail.live_image" mode="widthFix"></image>
				</view>
				<view class="btn">
					
					<!-- <view class="sbtn" @click="$utils.toPage(`/pages/service/live-on`)">
						<image src="/static/new/live1.png" mode="heightFix"></image> 进入直播间
					</view> -->
					
					<view class="sbtn" @click="$utils.toPage(`/pages/service/live-on`)" v-if="detail.live_status == 0">
						<image src="/static/new/live1.png" mode="heightFix"></image> 进入直播间
					</view>
					<view class="sbtn" @click="toParticipate(detail.live_callback)" v-if="detail.live_status == 1">
						<image src="/static/new/live4.png" mode="heightFix"></image> 查看回放
					</view>
				</view>
				<view class="text">
					<image src="/static/new/live3.png" mode="heightFix"></image>
					今日直播主题
				</view>
				<view class="text">{{detail.live_title}}</view>
				<view class="text">主讲：{{detail.live_speaker}}</view>
			</view>
		</view>
		<view class="m-tips">
			<view class="text">
				<view class="h2">参会说明</view>
				<view class="desc"><u-parse :content="settingInfo.meeting_rule"></u-parse></view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		userMeetingLive,
	} from '@/api/api.js'
	export default {
		data() {
			return {
				settingInfo: uni.getStorageSync('settingInfo'),
				detail: {}
			};
		},
		onLoad() {},
		onShow() {
			this.loadData();
		},
		methods: {
			loadData() {
				userMeetingLive().then(res => {
					this.detail = res.data.data
				})
			},
			toParticipate(url) {
				if (url == null) {
					uni.showToast({
						title: '暂无回放',
						icon: 'error',
						duration: 2000
					});
					return
				}
				this.$utils.toWeb(url)
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import url('https://imgcache.qq.com/open/qcloud/video/tcplayer/tcplayer.css');

	.container {
		min-height: 100vh;
		height: auto;
	}

	.list {
		padding: 0 30rpx 30rpx;

		.item {
			padding: 30rpx;
			background: #fff;
			border-radius: 20rpx;

			.h2 {
				font-weight: bold;
				margin-bottom: 30rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				font-weight: bold;

				.dot {
					width: 20rpx;
					height: 20rpx;
					background: rgba(206, 9, 0, 1);
					border-radius: 20rpx;
					margin-right: 10rpx;
				}
			}

			.time {
				background: rgba(246, 42, 45, .1);
				color: rgba(206, 9, 0, 1);
				padding: 30rpx;
				line-height: 40rpx;
				text-align: center;
				border-radius: 20rpx;
				margin-bottom: 30rpx;

				image {
					height: 40rpx;
					vertical-align: middle;
					margin-right: 10rpx;
				}
			}

			.img {
				background: #eee;
				min-height: 200rpx;
				border-radius: 20rpx;
				margin-bottom: 30rpx;

				image {
					display: block;
					width: 100%;
				}
			}

			.text {
				line-height: 1;
				text-align: center;
				display: flex;
				justify-content: center;
				align-items: center;
				margin-bottom: 20rpx;
				margin-bottom: 30rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				font-weight: bold;

				image {
					display: block;
					height: 90rpx;
					margin-right: 10rpx;
				}
			}

			.btn {
				display: flex;
				gap: 30rpx;
				margin: 30rpx 0;

				.sbtn {
					flex: 1;
					background: rgba(246, 42, 45, 1);
					color: #fff;
					text-align: center;
					padding: 20rpx;
					border-radius: 20rpx;
					box-shadow: 0 2rpx 5rpx rgba(255, 77, 77, 0.30);
					display: flex;
					align-items: center;
					justify-content: center;

					image {
						display: block;
						height: 30rpx;
						margin-right: 20rpx;
					}
				}
			}
		}

		.item.ing {
			.dot {
				background: rgba(7, 193, 96, 1);
			}

			.time {
				background: rgba(7, 193, 96, .1);
				color: rgba(7, 193, 96, 1);
			}
		}

		.item:last-child {
			border-bottom: none;
		}
	}

	.m-tips {
		padding: 30rpx;
		background: #fff;
		border-radius: 20rpx;
		margin: 0 30rpx 30rpx;
	}
</style>