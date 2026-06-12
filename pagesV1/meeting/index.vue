<!-- 有用 -->
<template>
	<view class="container" style="background:#df2516 url(/static/new/bg.png) no-repeat center top / 100%;">
		<swiper class="swiper" circular :autoplay="!videoShow" :interval="3000" :duration="1000" indicator-dots indicator-color="rgba(5, 5, 5, 0.2)" indicator-active-color="rgba(5, 5, 5, 0.5)">
			<swiper-item v-for="item in swiperList" :key="item.id">
				<view v-if="item.type==2" class="video" @click="onVideo(item.file)">
					<image :src="item.image" mode="none" style=" height: 300rpx;"></image>
					<view class="play"><u-icon size="40" name="play-circle" color="#F5F6FF"></u-icon></view>
					<view class="video_mask" v-if="videoShow">
						<video id="myVideo" loop :show-center-play-btn="true" :src="videoUrl" object-fit="fill" :autoplay="videoShow" controls @pause="onPause"></video>
					</view>
				</view>
				<view v-else>
					<image :src="item.image" mode="none" style="height: 300rpx;"></image>
				</view>
			</swiper-item>
		</swiper>
		<view class="main">
			<view class="tab1">
				<view class="item" @tap="$utils.toPage('/pages/meeting/list')">
					<view class="icon"><image src="/static/new/mt1.png" mode="aspectFit"></image></view>
					<view class="text">在线会议</view>
				</view>
				<view class="item" @tap="$utils.toPage('/pages/meeting/playback')">
					<view class="icon"><image src="/static/new/mt2.png" mode="aspectFit"></image></view>
					<view class="text">记录回放</view>
				</view>
			</view>
			<view class="notice" v-if="noticeText">
				<view class="icon"><image src="/static/new/notice.png" mode="aspectFit"></image></view>
				<view class="text">
					<u-notice-bar :text="noticeText" icon="" speed="40" bgColor="rgba(243, 62, 49, 0)" color="#FF363E" fontSize="12"></u-notice-bar>
				</view>
			</view>
			<view class="news">
				<view class="title">
					<view class="icon"><image src="/static/new/qus.png" mode="aspectFit"></view>
					<view class="h1">每日问答</view>
				</view>
				<view class="list" v-if="questionList.problem">
					<view class="h2">{{questionList.problem}}</view>
					<view class="item" :class="{on:item.key == key,err:item.key != questionList.correct_answer}" v-for="item in questionList.answer" :key="item.key" @click="onAnswer(item.key)">
						<view class="key" :class="item.key">{{item.key}}</view>
						<view class="text">{{item.value}}</view>
						<view class="icon">
							<u-icon name="checkmark" color="#fff" size="14" class="mark"></u-icon>
							<u-icon name="close" color="#fff" size="14" class="close"></u-icon>
						</view>
					</view>
					<view class="info">
						<view class="dt">奖励配置</view>
						<view class="dd" v-html="questionList.question_rule"></view>
					</view>
				</view>
				<u-skeleton :loading="true" :animate="true" :rows="4" :title="false" v-else></u-skeleton>
			</view>
		</view>
		<!-- 红包提示 -->
		<u-popup :show="hbShow" mode="center" round="32" @close="hbShow = false">
			<view class="van-dialog van-dialog2">
				<view class="van-dialog__header">提示</view>
				<view class="van-dialog__content">{{meetingAnswer.lx_tips}}</view>
			</view>
		</u-popup>
		<!-- 是否实名认证 -->
		<Real-Name></Real-Name>
		<!-- 视频弹窗 -->
		<!-- <u-popup :show="videoShow" mode="center" @close="videoShow = false" overlayOpacity="0.75">
			<view class="video_mask">
				<video id="myVideo" loop :show-center-play-btn="true" :src="videoUrl" object-fit="fill" autoplay muted controls></video>				
			</view>
		</u-popup> -->
	</view>
</template>

<script>
	import {
		commonBannerApi, // 轮播图
		commonScrollApi, // 公告列表
		meetingAnswerApi, //问答回答
		meetingQuestionApi, // 每日问答
	} from '@/api/api.js'
	import nVideo from '@/components/nVideo.vue'
	export default {
		data() {
			return {
				isPageShow: false,
				videoShow: false,
				videoUrl: '',
				// 轮播图
				swiperCurrent: 0,
				swiperList: [],
				isBo: false,
				isPaly: false,
				// 滚动公告
				noticeText: '',
				// 换新状态切换
				projectValue: 1,
				// 新闻列表
				questionList: [],
				page: 1,
				key:'',
				meetingAnswer: {},
				hbShow: false,
			}
		},
		onLoad() {
			this.loadData();
		},
		onShow() {
			
		},
		onHide() {
			
		},
		onUnload() {
			// 页面卸载时
		},
		methods: {
			async loadData() {
				// 轮播图
				commonBannerApi({ cate: 4 }).then(res => {
					this.swiperList = res.data.data
					// this.swiperList.forEach(item=>{
					// 	if(item.type == 2){
					// 		item.type = "video"
					// 	}else{
					// 		item.type = "image"
					// 	}
					// })
				})
				// 滚动通知
				commonScrollApi({
					is_popup: 2
				}).then(res => {
					if( res.data.data.total > 0){
						this.noticeText = res.data.data.data[0].content
					}
				})
				meetingQuestionApi().then(res => {
					this.questionList = res.data.data
					this.key = res.data.data.member_answer
					this.isPageShow = true;
				})
			},
			// 问答回答
			onAnswer(e) {
				if(this.key){
					uni.$u.toast('今日已回答')
				} else{
					// console.log("问答回答",e)
					meetingAnswerApi({ id:this.questionList.id, answer:e }).then(res => {
						uni.$u.toast(res.data.msg)
						this.meetingAnswer = res.data.data;
						this.key = e;
						if( res.data.code == 1 ){
							if( res.data.data.lx_tips.length > 0 ){
								this.hbShow = true;
							}
						}
						setTimeout(() => {
							this.loadData(); // 加载数据
						}, 1000);
					}).catch(err =>{
						// console.log("err.data.data.msg",err.data.msg)
						uni.$u.toast(err.data.msg)
						setTimeout(() => {							this.loadData(); // 加载数据						}, 1000);
					})
				}
			},
			onVideo(url){
				this.videoUrl = url;
				this.videoShow = true;
				setTimeout(() => {
				      // this.$refs.video.play()
					let videoContext = uni.createVideoContext('myVideo')
					videoContext.play()
				}, 500)
			},
			onPause(){
				this.videoShow = false;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container { min-height: 100vh; background-size: cover;  height: auto; padding: 0; }
	.main{ padding: 30rpx; color: #040A13; margin-bottom: calc(60px + env(safe-area-inset-bottom));}
	.swiper { height: 300rpx; overflow: hidden; border-radius: 10rpx;
		.swiper-item { height: 300rpx; display: block; text-align: center; border-radius: 10rpx;
			image,video{width: 100%;}
		}
		.video{ position: relative;
			.play{ position: absolute; top: 0;left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, .3); display: flex; text-align: center; 
				.u-icon{ margin: 0 auto;}
			}
			.video_mask{width: 100%; margin: 0 auto; position: absolute; top: 0; left: 0;
				video{ width: 100%; height: 300rpx;}
			}
		}
	}
	.notice{ display: flex; align-items: center; background: #fff; border-radius: 10rpx; margin-bottom: 30rpx; padding: 20rpx;		
		.icon{ 
			image,img{ width: 40rpx; height: 40rpx; display: block; }
		}
		.text{line-height: 1; padding-left: 20rpx; color: #FF363E; font-size: 0.8em; overflow: hidden;}
	}
	.tab1{ display: flex; flex-wrap: wrap; gap: 30rpx; margin-bottom: 30rpx; 
		.item{ background: #fff; border-radius: 10rpx; padding: 30rpx 10rpx; width: 330rpx; flex: 1; display: flex; align-items: center;
			.icon{ 
				image,img{ width: 100rpx; height: 100rpx; display: block; }
			}
			.text{ line-height: 1; font-weight: 300; padding-left: 10rpx; }
		}
	}
	.tab2{ display: flex; background: #fff; border-radius: 10rpx; margin-bottom: 30rpx;
		.item{  padding:30rpx 10rpx; text-align: center; flex: 1;
			.icon{ 
				image,img{ width: 100rpx; height: 100rpx; display: block; margin: 0 auto; }
			}
			.text{line-height: 1; font-weight: bold;  }
		}
	}
	.news{ background: #fff; border-radius: 10rpx; padding: 30rpx;
		.title{ display: flex; margin-bottom: 30rpx;
			.icon{ padding-right: 20rpx; 
				image{ display: inline-block; width: 50rpx; height: 50rpx;}
			}
			.h1{ font-weight: bold; flex: 1; }
		}
		.list{
			.h2{ margin-bottom: 20rpx; }
			.item{ display: flex; padding: 30rpx; background: #F6F7F9; margin-bottom: 30rpx; border-radius: 20rpx; font-size: .8em;
				.icon{ border-radius: 20rpx; display: none;  width: 40rpx; height: 40rpx;padding: 8rpx;
					image,img{ width: 40rpx; display: block;}
				}
				.text{ padding-left: 20rpx; flex: 1; }
				.key{ padding: 5rpx; border-radius: 10rpx; background: #FF363E; font-size: .8em; color: #fff; width: 40rpx; height: 40rpx; text-align: center; line-height: 30rpx; }
				.key.A{ background: linear-gradient(to left, rgb(44, 227, 255), rgb(33, 196, 255)); }
				.key.B{ background: linear-gradient(to left, rgba(195, 212, 44, 1.0), rgba(198, 255, 41, 1.0)); }
				.key.C{ background: linear-gradient(to left, rgba(255, 162, 32, 1), rgba(255, 212, 42, 1)); }
				.key.D{ background: linear-gradient(to left, rgba(255, 59, 80, 1), rgba(255, 94, 76, 1)); }
			}
			.item.on{ 
				.icon{ display: block; background: linear-gradient(to left, rgba(53, 174, 124, 1), rgba(58, 194, 138, 1));
					.mark{ display: block; }
					.close{ display: none;}
				}
			}
			.err.on{background: linear-gradient(to left, rgba(255, 59, 80, .2), rgba(255, 94, 76, .2));
				.icon{ background: linear-gradient(to left, rgba(255, 59, 80, 1), rgba(255, 94, 76, 1));
					.mark{ display: none;}
					.close{ display: block;}
				}
			}
			.info{
				.dt{}
				.dd{ font-size: .8em; opacity: .8; }
			}
		}
	}
	.video_mask{max-width: 750px; margin: 0 auto;
		video{ width: 750px; height: 400rpx;}
	}
</style>