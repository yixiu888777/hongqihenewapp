<template>
	<view class="container"
		style="background:RGBA(1, 51, 62, 1) url(/static/new/hbbg.jpg) no-repeat center top / 100%;">
		<view class="left_icon" @tap="pageBack">
			<u-icon name="arrow-left" color="#fff" size="24"></u-icon>
		</view>
		<!-- #ifdef H5 -->
		<view class="video" id="videoContain"></view>
		<!-- #endif -->
		<!-- #ifdef APP -->
		<view class="video">
			<video :src="android_url" :poster="detail.live_image" style="width: 100vw; height: 430rpx;" id="liveVideo"
			 object-fit="cover"	@play="videoPlay()" @pause="videoPause()" @ended="onVideoEnded()" @error="videoError()"
				show-fullscreen-btn="false"></video>
		</view>
		<!-- #endif -->
		<view class="footer">
			<view class="lm">
				<image src="/static/new/lm.png" mode="widthFix"></image>
			</view>
			<view class="btn">
				<view class="hby">
					<image src="/static/new/hby.jpg" mode="heightFix"></image>
				</view>
				<view class="sx" @click="refresh">
					<image src="/static/new/sx.png" mode="heightFix"></image>
				</view>
				<view class="hb" @click="onBag">
					<image src="/static/new/hb.png" mode="heightFix"></image>
				</view>
				<!-- <view class="sx" @click="refresh">
					<image src="/static/new/sx.png" mode="heightFix"></image>
				</view> -->
			</view>
		</view>

		<u-popup :show="hbShow" mode="center" round="32" :closeable="true" @close="hbShow=false">
			<view class="van-dialog">
				<view class="van-dialog__header">提示</view>
				<view class="van-dialog__content">
					<view><text style="font-size: 2em;font-weight: bold;line-height: 2;">{{bag.reward_amount}}</text>
						元</view>
					<view style="font-size: 1.2em;">{{bag.lx_tips}}</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		userMeetingLive,
		userMeetingReceive
	} from '@/api/api.js'
	// #ifdef H5
	import TCPlayer from 'tcplayer.js';
	// #endif
	export default {
		data() {
			return {
				settingInfo: uni.getStorageSync('settingInfo'),
				isPlay: false,
				player: null,
				canClick: true,
				detail: {},
				bag: {},
				hbShow: false,
				videoContext: null,
				android_url: ''
			};
		},
		onLoad() {
			this.loadData();
		},
		onReady() {
			// #ifdef H5
			this.tcpalyer();
			// #endif
			// #ifdef APP
			this.play()
			// #endif
		},
		methods: {
			loadData() {
				userMeetingLive().then(res => {
					this.detail = res.data.data
					this.android_url = res.data.data.live_android_url + '?t=' + new Date().getTime()
				})
			},
			pageBack() {
				let backPage = getCurrentPages()
				if (backPage.length == 1) {
					uni.reLaunch({
						url: "/pages/index/index"
					})
				} else {
					uni.navigateBack()
				}
			},
			refresh() {
				if (this.canClick) {
					this.canClick = false;
					this.onBag();
					setTimeout(() => {
						this.canClick = true;
					}, 5000);
				} else {
					uni.showToast({
						title: '请不要重复点击，稍后再试',
						icon: "none"
					})
				}
			},
			onBag() {
				if (this.canClick) {
					this.canClick = false;
					userMeetingReceive().then(res => {
						this.bag = res.data.data;
						this.hbShow = true;
					})
					setTimeout(() => {
						this.canClick = true;
					}, 5000);
				} else {
					uni.showToast({
						title: '请不要重复点击，稍后再试',
						icon: "none"
					})
				}
			},
			tcpalyer() {
				var that = this;
				// sdk引入有顺序
				let script1 = document.createElement("script");
				script1.type = "text/javascript";
				script1.src = "https://web.sdk.qcloud.com/player/tcplayer/release/v4.2.1/libs/hls.min.0.13.2m.js";
				document.getElementsByTagName("head")[0].appendChild(script1);
				// 创建script标签，引入外部文件
				let script = document.createElement("script");
				script.type = "text/javascript";
				script.src =
					"https://web.sdk.qcloud.com/player/tcplayer/release/v4.2.1/tcplayer.v4.2.1.min.js";
				document.getElementsByTagName("head")[0].appendChild(script);

				const video = document.createElement("video")
				video.setAttribute("id", "player-container-id")
				video.setAttribute('playsinline', true)
				video.setAttribute('webkit-playsinline', true)
				video.setAttribute('autoplay', true)
				// document.getElementById("videoContain").appendChild(video)

				const targetElement = document.getElementById('videoContain');
				if (targetElement) { // 先检查是否为null/undefined
					targetElement.appendChild(video);
					this.play();
				} else {
					console.warn('目标DOM元素不存在，请检查ID是否正确');
				}

				// 引入成功
				script.onload = function() {
					console.log("js资源加载成功了");
				};
				// 引入失败
				script.onerror = function() {
					console.log("js资源加载失败了");
				};
			},
			play() {
				// this.isPlay = true
				// #ifdef APP
				console.log('this.android_url', this.android_url)
				this.videoContext = uni.createVideoContext("liveVideo", this);
				this.videoContext.play()
				// this.videoPlay()
				// let videoContext = uni.createVideoContext("liveVideo");
				// videoContext.play();
				// #endif

				// #ifdef H5
				if (this.player) {
					this.player.dispose();
					this.player = null;
				}
				this.player = TCPlayer('player-container-id', {
					sources: [{
						src: this.detail.live_url, // 播放地址
					}],
					licenseUrl: 'webrtc', // license 地址，必传。参考准备工作部分，在视立方控制台申请 license 后可获得 licenseUrl
					width: "100%",
					height: "100%",
					controlBar: {
						// 自定义控件配置
						//fullscreenRotate:false,
						//pictureInPictureToggle:true,
						fullscreenToggle: false,
					},
					//fakeFullscreen:true,
				});

				// 监听事件
				this.player.one('play', () => {
					this.status = '播放中';
					// console.log('this.status', this.status)
				});
				this.player.one('playing', () => {
					this.status = '因缓冲而暂停或停止后恢复播放时触发，paused 属性为 false 。通常用这个事件来标记视频真正播放，play 事件只是开始播放，画面并没有开始渲染';
					// console.log('this.status', this.status)
					//增加观看人数
					this.addLiveLook()
				});
				this.player.on('pause', () => {
					this.status = '已暂停';
					// console.log('this.status', this.status)
				});
				this.player.on('ended', () => {
					//直播结束
					// this.isPlay = false
					this.status = '播放结束';
					if (this.player) {
						this.player.dispose();
						this.player = null;
					}
					// this.tcpalyer()
					// uni.showToast({
					// 	title: '播放结束',
					// 	icon: "none"
					// })
					// setTimeout(() => {
					// 	uni.navigateBack();
					// }, 2000);
					// console.log('this.status', this.status)
				});
				this.player.on('error', (e) => {
					//直播还未开始
					// this.isPlay = false
					this.status = '播放出错';
					if (this.player) {
						this.player.dispose();
						this.player = null;
					}
					this.tcpalyer()
					// uni.showToast({
					// 	title: '播放出错',
					// 	icon: "none"
					// })
					// uni.navigateBack()
					// console.log('this.status', this.status)
				});
				this.player.on('waiting', () => {
					this.status = '缓冲中';
					// console.log('this.status', this.status)
				});
				this.player.on('canplay', () => {
					this.status = '可以播放';
					// console.log('this.status', this.status)
				});
				// #endif
			},
			//重新加载
			videoReload() {
				console.log('重新加载')
				// this.isPlay = false
				this.videoContext.play()
				// this.loadData();
			},
			videoPlay() {
				// console.log('开始播放')
			},
			videoPause() {
				// console.log('暂停播放')
			},
			onVideoEnded() {
				// this.videoReload()
				// console.log('播放结束')
				uni.showToast({
					title: '播放结束',
					icon: "none"
				})
				// setTimeout(() => {
				// 	uni.navigateBack();
				// }, 2000);
			},
			videoError(error) {
				this.videoReload()
				// console.log(error, '播放失败1')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		height: auto;
	}

	.left_icon {
		position: absolute;
		left: 30rpx;
		top: 30rpx;
		margin-top: var(--status-bar-height);
	}

	.video {
		width: 100vw;
		height: 430rpx;
		margin-top: 225rpx;

		::v-deep .player-container-id-dimensions {
			width: 100vw;
			height: 430rpx;
		}
	}

	.footer {
		padding: 30rpx;
		margin-top: auto;

		.lm {
			padding: 0 30rpx;
			margin-bottom: 60rpx;
		}

		.btn {
			position: relative;
			text-align: center;

			.hby {
				height: 60rpx;
			}

			.hb {
				height: 100rpx;
			}

			.sx {
				position: absolute;
				bottom: 0;
				right: 0;
				height: 100rpx;
			}
		}
	}
</style>