<template>
	<view v-if="settingInfo.live_show == 1">
		<!-- 直播人数-->
		<div style=" position: absolute;
		top: 160rpx; 
		right: 60rpx; 
		background-color: rgba(0,0,0,0.5);
		color: #fff;
		padding: 5px;
		border-radius: 5px;
		font-size: 20rpx;z-index: 99;" id="viewCount">观看人数:{{look_people}}</div>
		<view style="height: 400rpx;width: 94%;margin:30rpx auto;" id="videoContain" v-show="isPlay">

		</view>
		<view v-if="!isPlay" style="position: relative;height: 400rpx;width: 94%;margin:30rpx auto;">
			<image :src="end_image" style="width: 100%;height: 400rpx;" v-if="live_status == 2"></image>
			<image :src="start_image" style="width: 100%;height: 400rpx;" v-if="live_status == 1 || live_status == 0">
			</image>
			<view
				style="position: absolute;top: 0;width: 100%;height: 400rpx;justify-items: center;justify-content: center;color: #fff;padding-top: 150rpx;">
				<view
					style="background-color: rgba(0, 0, 0, 0.5);display: flex;padding: 15rpx 30rpx;border-radius: 60rpx;font-size: 24rpx;"
					v-if="live_status==0">
					<view>未开播</view>
				</view>
				<view
					style="background-color: rgba(0, 0, 0, 0.5);display: flex;padding: 15rpx 30rpx;border-radius: 60rpx;font-size: 24rpx;"
					@click="play" v-else-if="live_status==1">
					<view style="margin-right: 10rpx;">
						<image src="/static/images/mine/love/bofang-icon.png" style="width: 40rpx;height: 40rpx;">
						</image>
					</view>
					<view>正在直播</view>
				</view>
				<view
					style="background-color: rgba(0, 0, 0, 0.5);display: flex;padding: 15rpx 30rpx;border-radius: 60rpx;font-size: 24rpx;"
					v-else-if="live_status==2">
					<view>直播已结束</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import {
		userMeetingLive,
		addLiveLookAPI,
		getLiveLookAPI
	} from "@/api/api.js";
	import TCPlayer from 'tcplayer.js';

	export default {
		data() {
			return {
				settingInfo: uni.getStorageSync("settingInfo"),
				isPlay: false,
				webrtc_url: 'webrtc://nlive.ysmim.com/live/ttcc_test',
				player: null,
				status: '未播放',
				live_status: 0,
				live_title: '',
				end_image: '',
				look_people: 0,
				start_image: '',
				id: '',
			}
		},
		mounted() {
			this.liveInfo();
			this.tcpalyer();
			setInterval(this.getLiveLook, 5000);
		},
		methods: {
			liveInfo() {
				userMeetingLive().then(res => {
					this.id = res.data.data.id
					this.webrtc_url = res.data.data.webrtc_url
					this.live_status = res.data.data.live_status
					this.live_title = res.data.data.live_title
					this.end_image = res.data.data.end_image
					this.look_people = res.data.data.look_people
					this.start_image = res.data.data.start_image
				})
			},
			addLiveLook() {
				// addLiveLookAPI({
				// 	id: this.id
				// }).then(res => {
				// 	//console.log(res)
				// })
			},
			getLiveLook() {
				getLiveLookAPI({
					id: this.id
				}).then(res => {
					this.look_people = res.data.data.count
				})
			},
			tcpalyer() {
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
				document.getElementById("videoContain").appendChild(video)

				// 引入成功
				script.onload = function() {
					console.log("js资源加载成功了");
					/* var player = TCPlayer("player-container-id", {
					fileID: '5285890799710670616',
					appID: '1400329073',
						// autoplay: true, 
						width: "375",
						height: "320",
					}); */
					/* // if(player) {
					//   player.dispose();
					// } */
					/* // var player = TCPlayer('player-container-id', {
					//      sources: [{
					//        src: 'webrtc://nlive.ysmim.com/live/ttcc_test', // 播放地址
					//      }],
					//      licenseUrl: 'webrtc', // license 地址，必传。参考准备工作部分，在视立方控制台申请 license 后可获得 licenseUrl
					// 	 width: "380",
					// 	 height: "100%",
					// }); */
					//player.src('webrtc://nlive.ysmim.com/live/ttcc_test');
				};
				// 引入失败
				script.onerror = function() {
					console.log("js资源加载失败了");
				};
			},
			play() {
				this.isPlay = true
				if (this.player) {
					this.player.dispose();
					this.player = null;
				}
				this.player = TCPlayer('player-container-id', {
					sources: [{
						src: this.webrtc_url, // 播放地址
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


				/* this.player.on('fullscreenchange', function(isFullscreen) {
					console.log(this.player.isFullscreen(),"是否全屏")
					//console.log(isFullscreen)
				    if (fullscreen) {
				        // 全屏时调整自定义控件的位置或样式
				        //document.getElementById('viewCount').style.bottom = '50px'; // 举例调整位置
				    } else {
				        // 非全屏时恢复原位置或样式
				        //document.getElementById('viewCount').style.bottom = '10px'; // 恢复原位置
				    }
				}); */

				// 监听事件
				this.player.one('play', () => {
					this.status = '播放中';
					console.log(this.status)
				});
				this.player.one('playing', () => {
					this.status = '因缓冲而暂停或停止后恢复播放时触发，paused 属性为 false 。通常用这个事件来标记视频真正播放，play 事件只是开始播放，画面并没有开始渲染';
					console.log(this.status)
					//增加观看人数
					this.addLiveLook()
				});
				this.player.on('pause', () => {
					this.status = '已暂停';
					console.log(this.status)
				});
				this.player.on('ended', () => {
					//直播结束
					this.isPlay = false
					this.status = '播放结束';
					if (this.player) {
						this.player.dispose();
						this.player = null;
					}
					this.tcpalyer()
					console.log(this.status)
				});
				this.player.on('error', (e) => {
					//直播还未开始
					this.isPlay = false
					this.status = '播放出错';
					if (this.player) {
						this.player.dispose();
						this.player = null;
					}
					this.tcpalyer()
					console.log(this.status)
				});
				this.player.on('waiting', () => {
					this.status = '缓冲中';
					console.log(this.status)
				});
				this.player.on('canplay', () => {
					this.status = '可以播放';
					console.log(this.status)
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import url('https://imgcache.qq.com/open/qcloud/video/tcplayer/tcplayer.css');

	::v-deep .video-js {
		width: 100%;
		height: 100%;
	}
</style>