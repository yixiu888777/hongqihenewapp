<template>
	<view class="container" style="background:#c8131e url(/static/new/bg.jpg) no-repeat center top / 100%;">
		<headerView>
			<template #leftIcon><u-icon name="arrow-left" color="#fff" size="24"></u-icon></template>
			<view>{{settingInfo.name}}会议中心</view>
		</headerView>
		<view class="list">
			<view class="item" v-for="item in lists" :key="item.id">
				<view class="title">官方直播回放</view>
				<view class="img" @click="showImg(item.image)">
					<image :src="item.image" mode="widthFix"></image>
				</view>
				<view class="h2">
					{{item.title}}
				</view>
				<view class="text">
					<view class="icon">
						会议时间
					</view>
					<view class="desc">{{item.time}}</view>
				</view>
				<view class="text">
					<view class="icon">
						会议主讲
					</view>
					<view class="desc">{{item.speaker}}</view>
				</view>
				<view class="text link">
					<view class="icon">
						会议链接
					</view>
					<view class="desc" @tap="copyText(item.url)">{{item.url}}</view>
					<view class="icon copy">
						<image src="/static/new/copy.png" mode="widthFix"></image>
					</view>
				</view>
				<view class="btn">
					<view class="sbtn" @click="toParticipate(item.time,item.url)">
						<image src="/static/new/repaly.png" mode="heightFix"></image> 查看回放
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		userMeetingPlaybackApi
	} from '@/api/api.js'
	export default {
		data() {
			return {
				settingInfo: uni.getStorageSync('settingInfo'),
				lists: [],
				load: {
					status: 'loading', //more/loading/noMore
				}
			};
		},
		onLoad() {
			this.loadData();
		},
		methods: {
			loadData() {
				userMeetingPlaybackApi().then(res => {
					let data = res.data.data.data;
					if (data.length > 0) {
						this.lists = [...this.lists, ...data]
						this.load.status = 'more';
					} else {
						this.load.status = 'noMore';
						uni.$u.toast('数据加载完毕!')
						this.page--
					}
				})
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
			popParticipate(time, id) {
				// console.log("popParticipate",id)
				var newTime = new Date().getTime()
				var PartTime = new Date(time).getTime()
				if (newTime > PartTime) {
					this.hyShow = true
					this.id = id
				} else {
					uni.$u.toast("会议暂未开始，请等待开播后重试")
				}
			},
			toParticipate(time, url) {
				// console.log("url",url)
				// console.log("time",new Date(time).getTime())
				var newTime = new Date().getTime()
				var PartTime = new Date(time).getTime()
				if (newTime > PartTime) {
					this.$utils.toWeb(url)
				} else {
					uni.$u.toast("暂未到开播时间")
				}
			},
			onParticipate() {
				meetingParticipateApi({
					id: this.id,
					code: this.code
				}).then(res => {
					this.meetingParticipate = res.data.data;
					uni.$u.toast(res.data.msg)
					// uni.showToast({
					// 	title: res.data.msg,
					// 	duration: 2000
					// });
					if (res.data.code == 1) {
						this.hyShow = false;
						this.code = '';
						if (res.data.data.lx_tips.length > 0) {
							this.hbShow = true;
						}
					}
				})
			},
			showImg(e) {
				uni.previewImage({
					urls: [e],
					current: 0
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
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
			margin-bottom: 30rpx;

			.title {
				text-align: center;
				font-weight: bold;
				margin-bottom: 30rpx;
			}

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
					background: rgba(246, 42, 45, 1);
					border-radius: 20rpx;
					margin-right: 10rpx;
				}
			}

			.time {
				background: rgba(246, 42, 45, .1);
				color: rgba(206, 9, 0, 1);
				padding: 30rpx;
				text-align: center;
				border-radius: 20rpx;
				margin-bottom: 30rpx;
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
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 40rpx;

				.icon {
					border-radius: 20rpx;
					font-weight: 500;

					image,
					img {
						width: 40rpx;
						display: block;
					}
				}

				.desc {
					text-align: right;
					flex: 1;
					padding: 0 20rpx;
					overflow: hidden;
					color: rgba(4, 10, 19, .7);
					white-space: nowrap;
					text-overflow: ellipsis;
					overflow: hidden;
				}

				.copy {

					image,
					img {
						width: 30rpx;
						display: block;
					}
				}
			}

			.link {
				.desc {
					color: rgba(54, 112, 247, 1);
				}
			}

			.btn {
				display: flex;
				gap: 30rpx;
				margin: 30rpx 0 0;

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

		.item:last-child {
			border-bottom: none;
		}
	}
</style>