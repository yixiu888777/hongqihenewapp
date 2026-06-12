<!-- 有用 -->
<template>
	<view class="container" style="background: url('/static/new1/bg.jpg') no-repeat center top / cover;background-attachment: fixed;">
		<view class="statusbar"></view>
		<view class="header_k">
			服务
		</view>
		<view style="margin-top: 20rpx;padding:10rpx 30rpx;">
			<view style="display: flex;align-items: center;">
				<view style="height: 4rpx;width: 140rpx;background: #fff;"></view>
				<image src="/static/service/a1.png" style="width: 40rpx;height: 40rpx;margin: 0 10rpx;" mode=""></image>
				<text style="color: #fff;font-size: 34rpx;">红旗河纪元服务中心</text>
				<image src="/static/service/a1.png" style="width: 40rpx;height: 40rpx;margin: 0 10rpx;" mode=""></image>
				<view style="height: 4rpx;width: 140rpx;background: #fff;"></view>
			</view>
			<view style="text-align: center;color: #fff;margin-top:20rpx ;">
				让参与成为荣光，让助力成就伟业
			</view>
			</view>
			
		<view class="main">
			<view class="tab1">
				<view class="item"  v-for="(item,index) in list" @click="jumpx(item)">
					<view class="icon"><image :src="item.img" mode="aspectFit"></image></view>
					<view class="text">{{item.name}}</view>
				</view>
				
			</view>
		</view>
		<tabBarView current="2"></tabBarView>
		
		<!-- 热更新 -->
		<u-popup :show="updataShow" mode="center" @close="updataShow=false">
			<view class="updata_mask">
				<view class="mask_header">发现新版本(V{{settingInfo.app_ver}})</view>
				<view class="mask_content">
					<view class="updata_content" v-show="!!settingInfo.app_upgrade_note">
						<view>更新内容:</view>
						<view v-html="settingInfo.app_upgrade_note"></view>
					</view>
					<view class="updata_tip">下载成功新的APP，请删除旧的APP</view>
				</view>
				<view class="mask_btn">
					<view class="button" v-if="isShow" @click="updataFn">立即升级</view>
					<view class="progress-box" v-else>
						<progress :percent="percent" show-info stroke-width="6" activeColor="rgba(243, 62, 49, 1)" backgroundColor="rgba(206, 213, 218, 1)" />
					</view>
				</view>
			</view>
		</u-popup>
		
		<!-- 安卓下载 -->
		<u-popup :show="downShow" mode="center">
			<view class="updata_mask">
				<view class="mask_header">发现新版本，请前往更新!</view>
				<view class="mask_btn" style="margin-top: 40rpx;">
					<view class="button">
						<uni-link :href="settingInfo.android_url" text="更新App" showUnderLine="false" color="var(var(--text-white-color))"></uni-link>
					</view>
				</view>
			</view>
		</u-popup>
		
		<!-- 是否实名认证 -->
		<u-popup :show="rnShow" mode="center" round="32" @close="rnShow=false">
			<view class="van-dialog van-dialog2">
				<view class="van-dialog__header">提示</view>
				<view class="van-dialog__content">您还未实名认证，请先实名认证</view>
				<view class="van-dialog__footer">
					<view class="van-success" @tap="$utils.toPage('/pages/mine/realName')">认证</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		getSettingApi, //系统配置
		commonBannerApi, // 轮播图
		commonScrollApi, // 公告列表
		commonPopupApi,
		commonNewsApi, // 新闻列表
		userMessageCountApi, // 最新通知列表未读数量
		getAuthInfoAPI,
		getUserInfoAPI,
		getTeamInfoAPI
	} from '@/api/api.js'
	import nVideo from '@/components/nVideo.vue'
	export default {
		data() {
			return {
				isPageShow: false,
				settingInfo: uni.getStorageSync('settingInfo'),
				UserInfo: [],
				
				// 热更新
				updataShow: false,
				isShow: true,
				percent: 0,
				downShow: false,
				money: 0,
				people: 0,
				
				list:[
					{
						name:'签到',
						img:'/static/service/1.png',
						url:'/pages/mine/singIn/index'
					},
					{
						name:'抽奖',
					img:'/static/service/2.png',
						url:'/pages/mine/singIn/dialer'
					},
					{
						name:'直播入口',
						img:'/static/service/3.png',
						url:'/pages/service/live'
					},
					{
						name:'会议记录',
						img:'/static/service/4.png',
						url:'/pages/service/meeting'
					},
					{
						name:'扶贫申请',
						img:'/static/service/5.png',
						url:'/pages/service/fpsq'
					},
					{
						name:'团队入驻',
						img:'/static/service/6.png',
						url:'/pages/service/team'
					},
					{
						name:'直播招募',
						img:'/static/service/9.png',
						url:'/pages/service/zbzm'
					},
					{
						name:'纪元人物',
						img:'/static/service/10.png',
						url:'/pages/service/jsgz'
					},
					{
						name:'邀请链接',
						img:'/static/service/11.png',
						url:'/pages/service/invite'
					},
					{
						name:'项目介绍',
						img:'/static/service/12.png',
						url:'/pages/service/project'
					},
					{
						name:'人工客服',
						img:'/static/service/13.png',
						url:'/pages/service/kf'
					},
					{
						name:'官方群聊',
						img:'/static/service/14.png',
						url:'/pages/index/downloadApp'
					},
				],
				// 关于实名认证
				auth: false,
				rnShow:false,
				isCheck: false,
			
				isBo: false,
				isPaly: false,
				
				page: 1,
				loadStatus: 'loading', //more/loading/noMore
				oldday: uni.getStorageSync('oldday'),
				today: '',
				CountTime: 10000,
				msgNum: 0
			}
		},
		onLoad() {
			
			// 配置接口 热更新
			getSettingApi().then(res => {
				this.settingInfo = res.data.data
				uni.setStorageSync('settingInfo', res.data.data)
				uni.setNavigationBarTitle({ title: res.data.data.basic.site_name });
				// #ifdef APP-PLUS
				let version = null
				let result = this.settingInfo.app_ver
				plus.runtime.getProperty(plus.runtime.appid, (widgetInfo) => {
					version = widgetInfo.version;
					if (version.split(".").join('') * 1 >= result.split(".").join('') * 1) {
						
					} else {
						const info = wx.getSystemInfoSync()
						if (info.system.indexOf('Android') > -1) {
							this.downShow = true
						} else {
							this.updataShow = true
						}
					}
				});
				// #endif
			})
			
		},
		
		methods: {
			jumpx(item){
				console.log("111",item)
				if(item.name=='人工客服1'){
					let settingInfo=uni.getStorageSync('settingInfo');
					let url=settingInfo.service.service_url
					uni.navigateTo({
						url: `/pages/noPage/index?url=${url.split("&").join("$")}`,
						
					})
				}else if(item.name=='纪元人物'){
					let settingInfo=uni.getStorageSync('settingInfo');
					let url=settingInfo.program.epoch_figures_url
					// #ifndef APP-PLUS
					window.open(url)
					// #endif
				}else{
				this.$utils.toPage(item.url)	
				}
				
				
			},
			// 跳转外链
			toWeb(e) {
				if (!!this.swiperList[e].url) {
					this.$utils.toWeb(this.swiperList[e].url)
				}
			},
			// 页面跳转
			toPage(url) {
				if( this.UserInfo.is_auth == 1 ){
					this.$utils.toPage(url)
				} else{
					 this.rnShow = true;
				}
			},
			// 去实名认证
			toAuth() {
				this.$utils.toPage('/pages/mine/realName')
				this.auth = false
			},
			// 去在线客服页
			toLoads(url) {
				uni.navigateTo({
					url: `/pages/noPage/index?url=${url.split("&").join("$")}`
				})
			},
			
			// 热更新
			updataFn() {
				this.isShow = false
				const dtask = uni.downloadFile({
					url: this.settingInfo.app_hot_update,
					success: (downloadResult) => {
						if (downloadResult.statusCode === 200) {
							plus.runtime.install(
								downloadResult.tempFilePath, {
									force: true
								},
								() => {
									this.percent = 100
									plus.nativeUI.toast('更新成功,正在重启稍等')
									setTimeout(() => {
										plus.runtime.restart();
									}, 500);
								},
								function(e) {
									plus.nativeUI.toast('安装失败')
									setTimeout(() => {
										this.updataShow = false
									}, 1000);
								}
							)
						} else {
							plus.nativeUI.toast('下载失败')
							setTimeout(() => {
								this.updataShow = false
							}, 1000);
						}
					},
					fail: (e) => {
						plus.nativeUI.toast('下载失败')
						setTimeout(() => {
							this.updataShow = false
						}, 1000);
					}
				})
				// 监听下载进度
				dtask.onProgressUpdate((res) => {
					this.percent = res.progress;
				});
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	.header_k{
		text-align: center;
		color: #fff;
		margin-top: 40rpx;
		font-weight: 700;
	}
	.container { min-height: 100vh; height: auto; }
	.main{ padding: 30rpx; color: #040A13; margin-bottom: calc(60px + env(safe-area-inset-bottom));}
	.swiper { height: 280rpx; overflow: hidden; margin-bottom: 30rpx; border-radius: 10rpx;
		.swiper-item { height: 280rpx; display: block; text-align: center; border-radius: 10rpx; overflow: hidden;
			image{width: 100%;}
		}
		.simg{ width: 100%; height: 280rpx; }
		.video{ position: relative;
			.play{ position: absolute; top: 0;left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, .3); display: flex; text-align: center; 
				.u-icon{ margin: 0 auto;}
			}
			.video_mask{width: 100%; margin: 0 auto; position: absolute; top: 0; left: 0;
				video{ width: 100%; height: 280rpx;}
			}
		}
		
	}
	.notice{ display: flex; align-items: center; background: #fff; border-radius: 10rpx; margin-bottom: 30rpx; padding: 20rpx;		
		.icon{ 
			image,img{ width: 30rpx; height: 30rpx; display: block; }
		}
		.text{line-height: 1; padding-left: 20rpx; color: #FF363E; font-size: 0.8em; overflow: hidden;}
		
	}
	.tab1{ display: flex; justify-content: space-around; flex-wrap: wrap; gap: 30rpx; margin-bottom: 30rpx; 
		.item{ background: #fff; border-radius: 10rpx; padding: 30rpx 10rpx; width: 330rpx; display: flex; align-items: center; position: relative;
			.icon{ 
				image,img{ width: 100rpx; height: 100rpx; display: block; }
			}
			.text{line-height: 1; font-size: 1.1em; font-weight: 500; padding-left: 10rpx; }
			.u-badge{position: absolute; top: 30rpx; left: 240rpx;animation: heartbeat 1s infinite;}
			@keyframes heartbeat {
				0% {
					transform: scale(1);
					opacity: 1;
				}
				14% {
					transform: scale(1.1);
				}
				28% {
					transform: scale(1);
				}
				42% {
					transform: scale(1.1);
				}
				70% {
					transform: scale(1);
				}
			}
		}
	}
	// .tab1::after { content: ''; flex: auto; height: 1rpx; overflow: hidden; }
	.tab2{ display: flex; background: #fff; border-radius: 10rpx; margin-bottom: 30rpx;
		.item{  padding:30rpx 10rpx; text-align: center; flex: 1;
			.icon{ margin-bottom: 10rpx;
				image,img{ width: 108rpx; height: 108rpx; display: block; margin: 0 auto; }
			}
			.text{line-height: 1; font-size: 1.1em; font-weight: 500; }
		}
	}
	.news{ background: #fff; border-radius: 10rpx; padding: 30rpx;
		.title{ display: flex; 
			.h1{ font-size: 1.2em; font-weight: bold; flex: 1;}
			.more{ font-size: 0.8em;
				image,img{ width: 30rpx; height: 30rpx; vertical-align: middle; display: inline-block; margin-left: 10rpx; margin-top: -5rpx; }
			 }
		}
		.list{
			.item{ display: flex; border-bottom: 1px solid rgba(0, 0, 0, .1); padding: 30rpx 0;
				.img{ background: #f5f5f5; border-radius: 20rpx;
					image,img{ width: 200rpx; height: 140rpx; display: block; border-radius: 20rpx;}
				}
				.text{line-height: 1;  padding-left: 20rpx; overflow: hidden;
					.h2{font-weight: 500; margin-bottom: 20rpx; font-size: 1em; height: 40rpx; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;}
					.desc{ color: rgba(4, 10, 19, .7); font-size: .9em; line-height: 1.2; height: 70rpx; overflow: hidden; text-overflow: ellipsis; -webkit-line-clamp: 2; -webkit-box-orient: vertical; display: -webkit-box; }
				}
			}
			.item:last-child{ border-bottom:none;}
		}
	}
	.noticeBar {
		width: 686rpx;
		height: 70rpx;
		margin: 20rpx 32rpx;
		padding: 12rpx 52rpx 12rpx 28rpx;
		border-radius: 40rpx;
		background: rgba(255, 248, 237, 1);
		overflow: hidden;
	
		image {
			width: 48rpx;
			height: 48rpx;
		}
	}
	
	.menu {
		width: 750rpx;
		padding: 0 20rpx 20rpx;
		
		.menu-item {
			margin-top: 20rpx;
			
			&>view {
				width: 345rpx;
			}
			
			.menu-item-1 {
				height: 258rpx;
				padding: 43rpx 24rpx 43rpx 40rpx;
				border-radius: 32rpx;
				background: linear-gradient(180deg, #B8D9FF 0%, #FFFFFF 100%);
				border-top: 1px solid rgba(255, 255, 255, 1);
				align-items: flex-start;
				
				&>image {
					width: 88rpx;
					height: 88rpx;
				}
				
				.name {
					font-family: Poppins;
					font-size: 28rpx;
					font-weight: 300;
					line-height: 42rpx;
					color: rgba(0, 0, 0, 0.75);
				}
				
				.price {
					margin: 8rpx 0;
					font-family: Open Sans;
					font-size: 32rpx;
					font-weight: 600;
					line-height: 54rpx;
					color: rgba(0, 0, 0, 0.75);
					
					text {
						font-size: 24rpx;
						font-weight: 700;
						line-height: 32rpx;
					}
				}
				
				.btn {
					width: 144rpx;
					height: 60rpx;
					border-radius: 20rpx;
					background: rgba(255, 244, 205, 1);
					border: 1px solid rgba(254, 169, 4, 1);
					font-family: Poppins;
					font-size: 24rpx;
					font-weight: 300;
					line-height: 36rpx;
					color: rgba(255, 168, 0, 1);
				}
			}
			
			.color-zi {
				background: linear-gradient(180deg, #D8D1FF 0%, #FFFFFF 100%);
				
				.btn {
					background: rgba(231, 227, 255, 1);
					border: 1px solid rgba(121, 99, 249, 1);
					color: rgba(121, 99, 249, 1);
				}
			}
			
			.menu-item-2 {
				height: 125rpx;
				padding: 12rpx 40rpx;
				border-radius: 32rpx;
				background: linear-gradient(180.69deg, #FFCE84 0.54%, #FFF7EC 99.36%);
				border-top: 1px solid rgba(255, 255, 255, 1);
				margin-bottom: 8rpx;
				font-family: Poppins;
				font-size: 28rpx;
				font-weight: 300;
				line-height: 42rpx;
				color: rgba(0, 0, 0, 0.75);
	
				&>image {
					width: 88rpx;
					height: 88rpx;
				}
			}
			
			.color-red {
				background: linear-gradient(180deg, #FFD7D7 -3.2%, #FFF2F2 100%);
			}
			
			.color-green {
				background: linear-gradient(148.35deg, #DBFFF5 17.52%, #F1FFFB 82.48%);
			}
			
			.color-blue {
				background: linear-gradient(180deg, #B4E2FF -3.2%, #F0FAFF 100%);
			}
		}
	}
	
	.prize {
		width: 686rpx;
		height: 116rpx;
		margin: 0 auto 32rpx;
		border-radius: 200rpx;
		background: linear-gradient(185.96deg, #FDBF9B 5.26%, #FF373B 95.84%);
		
		&>image {
			width: 100rpx;
			height: 100rpx;
			margin: 0 40rpx;
		}
		
		&_info {
			flex: 1;
			font-family: Roboto;
			font-weight: 400;
			font-size: 24rpx;
			line-height: 40rpx;
			color: #FFFFFF;
			
			.line {
				width: 56rpx;
				height: 2rpx;
				background-color:  #FFFFFF;
				box-shadow: 0px 1px 1px 0px #FF4444;
				margin: 0 8rpx;
			}
			
			.name {
				font-weight: 400;
				font-size: 38rpx;
				line-height: 52rpx;
				color: #FFFFFF;
			}
		}
		
		&_btn {
			width: 96rpx;
			height: 96rpx;
			border-radius: 96rpx;
			background: linear-gradient(180deg, #FAB734 0%, #F48728 100%);
			border: 2px solid #FFEACE;
			font-family: Roboto;
			font-weight: 400;
			font-size: 44rpx;
			color: #FFFFFF;
			margin: 0 16rpx;
		}
	}
	
	.withfourInfo {
		width: 686rpx;
		height: 210rpx;
		border-radius: 20rpx;
		background-image: url('@/static/index/image.png');
		background-size: 100%;
		background-position: top;
		background-repeat: no-repeat;
		background-color: #FFFBF4;
		margin: 20rpx auto;
		font-family: Roboto;
		font-weight: 700;
		font-size: 56rpx;
		color: #FFFFFF;
		
		.btns {
			width: 112rpx;
			height: 44rpx;
			border-radius: 112rpx;
			background: #2B58DD;
			margin-top: 20rpx;
			font-family: Roboto;
			font-weight: 400;
			font-size: 24rpx;
		}
	}
	
	.loanInfo {
		width: 686rpx;
		height: 210rpx;
		border-radius: 20rpx;
		background-image: url('@/static/index/loan.png');
		background-size: 100%;
		background-position: top;
		background-repeat: no-repeat;
		background-color: #FFFBF4;
		margin: 20rpx auto;
		padding: 26rpx 60rpx;
		font-weight: 400;
		font-size: 44rpx;
		line-height: 48rpx;
		color: #D9EDFF;
		box-shadow: 0px 2px 2px 0px #00000040;
		
		.btns {
			width: 110rpx;
			height: 40rpx;
			border-radius: 140rpx;
			background: linear-gradient(180deg, #FFFFFF 0%, #B3D8FF 100%);
			font-family: Roboto;
			font-weight: 300;
			font-size: 20rpx;
			color: #385BE1;
			margin-top: 14rpx;
		}
	}
	
	.house {
		width: 690rpx;
		margin: 20rpx auto 50rpx;
	}
	
	.auth {
		box-shadow: 0px 0px 16px 0px #8898AA26;
		border: 1px solid #FFFFFF;
		background: linear-gradient(180deg, #E8F0FB 0%, #FFFFFF 32.17%);
		border-radius: 20rpx;
		padding: 40rpx 20rpx;
		margin: 0 32rpx 28rpx;
		position: relative;
	
		.auth_header {
			.img {
				width: 48rpx;
				height: 48rpx;
			}
	
			.auth_title {
				margin-left: 20rpx;
				font-family: Roboto;
				font-size: var(--font-15);
				font-weight: 500;
				line-height: 42rpx;
				text-align: center;
				color: #222222;
			}
	
			.auth_status {
				position: absolute;
				top: 40rpx;
				right: 0;
				border-radius: 20rpx 0 0 20rpx;
				overflow: hidden;
	
				.inner {
					font-family: Roboto;
					font-size: var(--font-10);
					font-weight: 400;
					line-height: 32rpx;
					text-align: center;
					color: #FFFFFF;
					padding: 5rpx 16rpx;
				}
			}
		}
	
		.auth_content {
			.add_auth {
				height: 88rpx;
				border-radius: 8rpx;
				margin-top: 32rpx;
				border: 1px dashed #C4D0DF;
				line-height: 1;
				font-family: Roboto;
				font-size: var(--font-15);
				font-weight: 500;
				color: #F33E31;
	
				.add_icon {
					width: 44rpx;
					height: 44rpx;
					background: #F33E31;
					border-radius: 50%;
					margin-right: 20rpx;
				}
			}
	
			.is_auth {
				margin-top: 32rpx;
				height: 88rpx;
				font-family: Roboto;
				font-size: var(--font-15);
				font-weight: 500;
				line-height: 42rpx;
				color: #222222;
	
				.name {
					margin-right: 32rpx;
				}
	
				.card_num {
					flex: 1;
				}
	
				.btn {
					font-family: Roboto;
					font-size: var(--font-12);
					font-weight: 500;
					line-height: 1.2;
					color: #306DB7;
					border-bottom: 2rpx solid #306DB7;
				}
			}
		}
	}
	
	.notice_mask { padding: 30rpx;
		.mask_box{ background: #fff; border-radius: 20rpx 20rpx 0 0; overflow: hidden; width: 690rpx;
			 .item{ flex: 1;
				flex-shrink: 0;
				height: 64rpx;
				padding: 12rpx 20rpx;
				background: linear-gradient(180deg, #F5C6C5 0%, #FFFFFF 68%);
				font-size: 28rpx;
				font-weight: 400;
				line-height: 40rpx;
				text-align: center;
				color: #AF1500;
			 }
			 
			 .active{
				background: linear-gradient(180deg, #CA2500 0%, #FF6B67 100%);
				color: #FFFFFF; 
			 }
		}
		
		.mask_content{ background: #fff;  width: 690rpx; max-height: 800rpx; overflow-y: auto; font-weight: 300;
			padding: 50rpx 30rpx;
			border-radius:20rpx;
			position: relative;
			overflow: auto;
			.btn{ padding: 10rpx; margin-top: 20rpx; background: linear-gradient(to left, rgba(247, 247, 247, 1), rgba(216, 216, 216, .5)); border-radius: 20rpx; color: #fff; text-align: center; display: flex; align-items: center; justify-content: center; color: #999; 
				.ucode{ margin: 0 5rpx;}
			}
			.btn.on{ background: linear-gradient(to left, rgba(255, 98, 75, 1), rgba(255, 54, 80, 1)); color: #fff; 
				.ucode{ display: none; }
			}
			.close{
				position: absolute;
				top: 24rpx;
				right: 24rpx;
				width: 48rpx;
				height: 48rpx;
			}
			
			.contentTip-title{
				font-size: 40rpx;
				font-weight: 700;
				line-height: 48rpx;
				text-align: center;
				color: #D2110F;
			}
			
			.contentTip-content{
				margin: 28rpx auto;
				font-size: 28rpx;
			}
			
			.contentTip-image{
				width: 610rpx;
				margin: 0 auto;
				image{ border-radius: 20rpx; }
			}
		}
	}
	
	.updata_mask {
		width: 686rpx;
		padding: 60rpx 20rpx;
		border-radius: 16rpx;
		background: rgba(255, 255, 255, 1);
		font-family: Roboto;
		font-weight: 400;
		line-height: 40rpx;
	
		.mask_header {
			font-size: var(--font-18);
			text-align: center;
			color: rgba(27, 28, 30, 1);
		}
	
		.mask_content {
			font-size: var(--font-16);
			text-align: left;
			color: rgba(27, 28, 30, 1);
			margin: 40rpx 0;
	
			.updata_tip {
				color: rgba(243, 62, 49, 1);
				margin-top: 20rpx;
			}
		}
	
		.mask_btn {
			padding: 0 20rpx;
	
			.btn {
				width: 606rpx;
				margin: 0 auto;
			}
	
			.progress-box {
				width: 100%;
			}
		}
	}
	// .video_mask{max-width: 750px; margin: 0 auto;
	// 	video{ width: 750px; height: 400rpx;}
	// }
</style>