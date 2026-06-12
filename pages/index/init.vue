<template>
	<view class="pages">
		<view class="bg">
			<view class="video" v-if="videoShow">
				<!-- #ifdef APP -->
				<video src="/static/new/init-video.mp4" id="myVideo" :autoplay="false" enable-gpu-accelerated
					webkit-playsinline playsinline object-fit="fill" :controls="false"></video>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<video src="/static/new/init-video.mp4" id="myVideo" muted :autoplay="false" enable-gpu-accelerated
					webkit-playsinline playsinline object-fit="fill" :controls="false"></video>
				<!-- #endif -->
			</view>
			<cover-view class="btn" v-if="btnShow">
				<cover-image src="/static/new/init-btn.gif" mode="heightFix" class="btn-img"
					@click="onBtn()"></cover-image>
			</cover-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				onloadCode: '',
				is_auth: false,
				videoShow: false,
				btnShow: false,
				isMuted: true,
				videoContext: null,
				timer: null,
			};
		},
		onLoad() {

		},
		onReady() {
			this.videoShow = true;
			if (!!uni.getStorageSync('token')) {
				this.is_auth = true;
			}
			setTimeout(() => {
				this.onVideo()
			}, 10);
		},
		onShow() {

		},
		onUnload() {
			this.clearTimer()
		},
		methods: {
			onVideo() {
				// console.log("newVal", newVal)
				this.videoContext = uni.createVideoContext("myVideo", this);
				this.videoContext.play()
				setTimeout(() => {
					this.btnShow = true
				}, 3000);
				this.timer = setTimeout(() => {
					this.onBtn()
				}, 27000);
			},
			onVideoLoaded() {
				clearTimeout(this.timer);
				this.isMuted = false;
			},
			clearTimer() {
				clearTimeout(this.timer);
				this.timer = null;
			},
			onBtn() {
				this.clearTimer()
				this.videoContext.stop()
				if (this.is_auth) {
					uni.switchTab({
						url: '/pages/index/index'
					})
				} else {
					uni.navigateTo({
						url: '/pages/login/login'
					})
				}
				return
			}
		}
	}
</script>

<style lang="scss" scoped>
	.bg {
		width: 100vw;
		height: 100vh;

		.video {
			#myVideo {
				position: relative;
				width: 100vw;
				height: 100vh;
				display: block;
			}

			video {
				width: 100vw;
				height: 100vh;
			}
		}

		.btn {
			position: absolute;
			z-index: 999;
			opacity: 0.9;
			width: 100vw;
			height: 120rpx;
			bottom: 15%;
			text-align: center;

			.btn-img {
				width: 460rpx;
				height: 120rpx;
				margin: 0 auto;
			}
		}
	}
</style>