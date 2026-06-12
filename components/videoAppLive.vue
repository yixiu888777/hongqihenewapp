<template>
  <view v-if="settingInfo.live_show == 1" style="position: relative;">
		<!-- 直播人数-->
		<div style=" position: absolute;
		top: 10rpx; 
		right: 30rpx; 
		background-color: rgba(0,0,0,0.5);
		color: #fff;
		padding: 5px;
		border-radius: 5px;
		font-size: 20rpx;z-index: 99;" id="viewCount">观看人数:{{look_people}}</div>
		<view style="height: 300rpx;width: 94%;margin:30rpx auto;position: relative;" id="videoContain" v-show="isPlay">
			<video
				:src="android_url"
				style="width: 100%; height: 100%;"
				id="liveVideo"
				@play="videoPlay()"
				@pause="videoPause()"
				@ended="onVideoEnded()"
				@error="videoError()"
				show-fullscreen-btn="false"
			  ></video>
		</view>
		<view v-if="!isPlay" style="position: relative;height: 400rpx;width: 94%;margin:30rpx auto;">
			<image :src="end_image" style="width: 100%;height: 400rpx;" v-if="live_status == 2"></image>
			<image :src="start_image" style="width: 100%;height: 400rpx;" v-if="live_status == 1 || live_status == 0"></image>
			<view style="position: absolute;top: 0;width: 100%;height: 400rpx;color: #fff;padding-top: 150rpx;">
				<view style="display: flex;justify-content: center;">
					<view style="background-color: rgba(0, 0, 0, 0.5);display: flex;padding: 15rpx 30rpx;border-radius: 60rpx;font-size: 24rpx;" v-if="live_status==0">
						<view>未开播</view>
					</view>
					<view style="background-color: rgba(0, 0, 0, 0.5);display: flex;padding: 15rpx 30rpx;border-radius: 60rpx;font-size: 24rpx;" @click="play" v-else-if="live_status==1">
						<view style="margin-right: 10rpx;">
							<image src="/static/images/mine/love/bofang-icon.png" style="width: 40rpx;height: 40rpx;"></image>
						</view>
						<view>正在直播</view>
					</view>
					<view style="background-color: rgba(0, 0, 0, 0.5);display: flex;padding: 15rpx 30rpx;border-radius: 60rpx;font-size: 24rpx;" v-else-if="live_status==2">
						<view>直播已结束</view>
					</view>
				</view>
			</view>
		</view>
  </view>
</template>

<script>
import {
	liveInfoAPI,
	addLiveLookAPI,
	getLiveLookAPI
} from "@/api/api.js";

export default {
  data() {
    return {
		settingInfo: uni.getStorageSync("settingInfo"),
		isPlay:false,
		webrtc_url: 'https://nlive.ysmim.com/live/ttcc_test.m3u8',
		android_url:'https://nlive.ysmim.com/live/ttcc_test.m3u8',
		player: null,
		status: '未播放',
		live_status:0,
		live_title:'',
		end_image:'',
		look_people:0,
		start_image:'',
		id:'',
    }
  },
  mounted() {
	this.liveInfo();
	setInterval(this.getLiveLook, 5000);
  },
  methods: {
	liveInfo(){
		liveInfoAPI().then(res => {
			this.id = res.data.data.id
			this.webrtc_url = res.data.data.webrtc_url
			this.android_url = res.data.data.android_url + '?t='+ new Date().getTime() 
			this.live_status = res.data.data.live_status
			this.live_title = res.data.data.live_title
			this.end_image = res.data.data.end_image
			this.look_people = res.data.data.look_people
			this.start_image = res.data.data.start_image
		})
	},
	addLiveLook(){
		addLiveLookAPI({id:this.id}).then(res => {
		    //console.log(res)
		})
	},
	getLiveLook(){
		getLiveLookAPI({id:this.id}).then(res => {
		    this.look_people = res.data.data.count
		})
	},
	play(){
		this.isPlay = true
		let videoContext = uni.createVideoContext("liveVideo");
		console.log(this.android_url)
		videoContext.play();
	},
	//重新加载
	videoReload(){
		this.isPlay = false
		this.liveInfo()
	},
	videoPlay(label){
		console.log(label,'开始播放')
		this.addLiveLook()
	},
	videoPause(label){
		console.log(label,'暂停播放')
	},
	onVideoEnded(label){
		this.videoReload()
		console.log(label,'播放完毕')
	},
	videoError(error){
		this.videoReload()
		console.log(error,'播放失败1')
	},
  }
}
</script>

<style lang="scss" scoped>

video::-webkit-media-controls-fullscreen-button {
  display: none; /* Chrome, Safari, Opera */
}
 
video::-webkit-media-controls-overlay-play-button {
  display: none; /* Chrome, Safari, Opera */
}
</style>