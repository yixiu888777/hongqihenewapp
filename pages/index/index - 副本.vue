<!-- 有用 -->
<template>
	<view class="container" style="background-color: rgba(186, 28, 29, 1);" v-if="isPageShow">
		<view class="statusbar"></view>
		<view class="m-header" style="justify-content: flex-end;">
			<view class="header_m" @click="$utils.toPage('/pages/mine/messages/messages')">
				<image src="/static/index/xx.png" mode=""></image>
				<text>重要通知</text>
				<u-badge type="error" shape="horn" max="99" :value="msgNum" v-if="msgNum > 0" class="u-badge"></u-badge>
			</view>
		</view>
		<view class="main">
			<swiper class="swiper" circular :interval="15000" :duration="1000" autoplay indicator-dots
				indicator-color="rgba(5, 5, 5, 0.2)" indicator-active-color="#333">
				<swiper-item v-for="item in swiperList" :key="item.id">
					<view v-if="item.type==2" class="video" @click="onVideo(item.file)">
						<image :src="item.image" mode="none" class="simg"></image>
					</view>
					<view v-else class="img" @click="showImg(item.image)">
						<image :src="item.image" mode="none" class="simg"></image>
					</view>
				</swiper-item>
			</swiper>
			<view class="noticex">
				<!-- <image src="../../static/index/notices.svg" mode=""></image> -->
				<view class="dt">公告：</view>
				<view class="dd"><u-notice-bar :text="noticeText" icon="" speed="40" bgColor="rgba(243, 62, 49, 0)"
						color="#fff" fontSize="16"></u-notice-bar></view>
			</view>
			<view class="video">
				<video id="myVideo" style="width: 100%; height: 480rpx;" loop :show-center-play-btn="true"
					:src="settingInfo.index_video" :poster="settingInfo.index_video_image" object-fit="cover"
					:autoplay="videoShow" controls @pause="onPause" v-if="myVideoShow"></video>
				<image :src="settingInfo.index_video_image" mode="aspectFill" v-else
					style="width: 100%; height: 480rpx; display: block;">
				</image>
			</view>
			<view class="zxrk" @click="$utils.toPage('/pages/index/newsList')">更多资讯入口</view>
			<view class="titlex">
				<text>百年复兴</text>
				<text>纪元基金</text>
			</view>
			<view class="tab1">
				<view class="item" v-for="(item,index) in epochList" @click="submits(item.id)">
					<image :src="item.image" mode="widthFix"></image>
					<view class="kl">
						<view class="name">{{item.name}}</view>
						<view class="kl_t">{{item.price}}</view>
					</view>
					<view class="kl_b">
						共襄伟业
					</view>
				</view>
			</view>
		</view>
		<!-- <tabBarView current="1"></tabBarView> -->


		<!-- 视频弹窗 -->
		<!-- <u-popup :show="videoShow" mode="center" @close="videoShow = false" overlayOpacity="0.75">
			<view class="video_mask">
				<video id="myVideo" loop :show-center-play-btn="true" :src="videoUrl" object-fit="fill" autoplay muted controls></video>				
			</view>
		</u-popup> -->

		<!-- 进入页面弹窗 -->
		<u-popup :show="noticeShow" mode="center" :overlayStyle="kkl">
			<view class="notice_mask">
				<!-- <scroll-view scroll-x class="mask_box flex_center">
					<view class="mask_box_nav flex">
						<view class="item el1 active">{{noticeInfo.name}}</view>
					</view>
				</scroll-view> -->
				<view
					style="display: flex;justify-content: space-between;margin-bottom: 30rpx;color: #fff;align-items: center;font-size: 30rpx;font-weight: 700;">
					<view style="display: flex;align-items: center;">
						<image :src="settingInfo.logo"
							style="background: #fff; border-radius: 10rpx; width: 40rpx;height: 40rpx;"
							mode="heightFix"></image>
						<text style="margin-left: 20rpx;">{{settingInfo.site_name}}</text>
					</view>
					<view class="">公告</view>
				</view>
				<view class="mask_content" ref="noticeContent">
					<view class="mask_notice">
						<view class="item">
							<view class="contentTip-title">{{noticeDT.name}}</view>
							<view class="contentTip-box">
								<!-- <u-skeleton :loading="true" :animate="true" :rows="5"></u-skeleton> -->
								<!-- <view class="contentTip-time">
									{{noticeDT.createtime}}
								</view> -->
								<view class="contentTip-content"><u-parse :content="noticeDT.content"></u-parse></view>
							</view>
						</view>
					</view>
					<view class="btn on" @tap="noticeClick(noticeDT.id)">
						<view class="text">知道了</view>
					</view>
				</view>
			</view>
		</u-popup>

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
						<progress :percent="percent" show-info stroke-width="6" activeColor="rgba(243, 62, 49, 1)"
							backgroundColor="rgba(206, 213, 218, 1)" />
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
						<uni-link :href="settingInfo.android_url" text="更新App" showUnderLine="false"
							color="var(var(--text-white-color))"></uni-link>
					</view>
				</view>
			</view>
		</u-popup>

		<!-- 是否实名认证 -->
		<!-- <u-popup :show="rnShow" mode="center" round="32" @close="rnShow=false">
			<view class="van-dialog van-dialog2">
				<view class="van-dialog__header">温馨提示</view>
				<image src="/static/new1/real.png" style="width: 150rpx;height: 150rpx;" mode=""></image>
				<view class="van-dialog__content" style="padding-top: 0;">领取前请先完成实名认证审核</view>
				<view class="van-dialog__footer"
					style="background: #F62A2D;box-shadow: 0px 8rpx 20rpx 0px rgba(246,42,45,0.3);border-radius: 30rpx;">
					<view class="van-success" @tap="$utils.toPage('/pages/mine/realName')">认证</view>
				</view>
			</view>
		</u-popup> -->

		<!-- 是否实名认证 -->
		<u-popup :show="rnShow" mode="center" round="32" @close="rnShow=false">
			<view class="van-dialog van-dialog2">
				<view class="van-dialog__header">温馨提示</view>
				<view class="van-dialog__content">
					<view class="icon">
						<image src="/static/new/safe.png" mode="heightFix" style="height: 160rpx;"></image>
					</view>
					<view class="desc">领取前请先完成实名认证审核</view>
				</view>
				<view class="van-dialog__footer">
					<view class="van-success" @tap="$utils.toPage('/pages/mine/realName')">去认证</view>
				</view>
			</view>
		</u-popup>
		<!-- 是否实名认证 -->
		<u-popup :show="jyShow" mode="center" round="32" @close="onjyShow">
			<view class="van-dialog van-dialog2">
				<view class="van-dialog__header">
					<image src="/static/new/gift2.png" mode="heightFix" style="height: 50rpx; vertical-align: middle;">
					</image> 恭喜您!
				</view>
				<view class="van-dialog__content">
					<view class="desc">您将获得纪元基金</view>
					<view class="num">￥ {{jyEpoch.price}}</view>
					<view class="desc">请保持签到，共襄伟业！</view>
				</view>
				<view class="van-dialog__footer">
					<view class="van-success" @tap="onjyShow">关闭</view>
					<view class="van-success" @tap="onEpoch()">确认领取</view>
				</view>
			</view>
		</u-popup>
		<u-popup :show="imgShow" mode="center" round="32" :closeable="true" @close="onimgShow">
			<view class="van-img">
				<image src="/static/new/IMG_4904.jpg" mode="aspectFill"></image>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		getSettingApi,
		commonBannerApi, // 轮播图
		commonScrollApi, // 公告列表
		commonPopupApi, //弹窗公告
		commonNewsApi, // 新闻列表
		userMessageCountApi, // 最新通知列表未读数量
		userEpochApi,
		epochReceiveApi,
		userInfoApi
	} from '@/api/api.js'
	import nVideo from '@/components/nVideo.vue'
	export default {
		data() {
			return {
				kkl: '#641902',
				isPageShow: false,
				loading: false, // 加载状态
				settingInfo: uni.getStorageSync('settingInfo'),
				UserInfo: uni.getStorageSync('user_info'),
				jyShow: false,
				jyEpoch: {},
				rnShow: false,
				myVideoShow: false,
				videoShow: false,
				videoUrl: '',
				// 热更新
				updataShow: false,
				isShow: true,
				percent: 0,
				downShow: false,
				money: 0,
				people: 0,

				houseInfo: {},
				isWithfourShow: false,
				qianmingInfo: {
					show: false,
					tips: '',
					status: 0
				},
				bxInfo: {
					show: false,
					check_id: null,
					bx_list: []
				},
				isLoanShow: false,

				// 关于实名认证
				auth: false,
				authInfo: {},
				// 弹窗公告
				noticeList: [],
				noticeDT: {},
				noticeId: null,
				noticeInfo: {
					imagelist: []
				},
				noticeShow: false,
				isCheck: false,
				// 轮播图
				swiperCurrent: 0,
				swiperList: [],
				isBo: false,
				isPaly: false,
				// 滚动公告
				noticeText: '',
				noticeIndex: 0,
				// 换新状态切换
				projectValue: 1,
				// 新闻列表
				newsList: [],
				page: 1,
				loadStatus: 'loading', //more/loading/noMore
				oldday: uni.getStorageSync('oldday'),
				today: '',
				CountTime: 10000,
				msgNum: 0,
				imgShow: false,
				epochList: []
			}
		},
		onLoad() {
			this.today = this.getDateString(new Date())
			// 配置接口 热更新
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
			this.loadData();
			// 新闻
			// this.getNewsList()
			//纪元基金
			this.epoch()
			this.rnShow = false;
			this.noticeIndex = 0;
			userMessageCountApi().then(res => {
				this.msgNum = res.data.data.count;
			})
			
			// #ifdef H5
			this.myVideoShow = true;
			// #endif
		},
		onShow() {
			this.getNotice()
			
			// let time = new Date().getTime() // 当前时间戳
			// let indexTime = uni.getStorageSync('indexTime') // 上传记录时间戳
			// if (!!indexTime) {
			// 	let minute = (time - indexTime) / 60000
			// 	if (minute > 15) {
			// 		this.getNotice()
			// 	} else {
			// 		// setTimeout(()=>{
			// 		// 	// #ifndef APP-PLUS
			// 		// 	this.play()
			// 		// 	// #endif
			// 		// 	// #ifdef APP-PLUS
			// 		// 	this.isPaly = true
			// 		// 	// #endif
			// 		// }, 1000)
			// 	}
			// } else {
			// 	this.getNotice()
			// }
			this.getUserInfo()
			
		},
		onHide() {},
		onUnload() {},
		onReachBottom() {
			// 上拉触底时
			this.getRight()
		},
		methods: {
			getUserInfo() {
				userInfoApi().then(res => {
					this.UserInfo = res.data.data
					uni.setStorageSync('user_info', res.data.data)
				})
			},
			async submits(id) {
				if (this.UserInfo.is_auth == 1) {
					var targetEpoch = this.epochList.filter(item => item.id === id);
					// console.log("targetEpoch", targetEpoch)
					this.jyEpoch = targetEpoch[0]
					this.jyShow = true;
					// #ifdef APP
					this.myVideoShow = false;
					// #endif

				} else {
					this.rnShow = true;
				}
			},
			async onEpoch() {
				this.jyShow = false;
				this.imgShow = true;
				epochReceiveApi({
					id: this.jyEpoch.id
				}).then(res => {
					uni.$u.toast(res.data.msg)
				})
			},
			onjyShow() {
				this.jyShow = false;
				this.myVideoShow = true;
			},
			onimgShow() {
				this.imgShow = false;
				this.myVideoShow = true;
			},
			async epoch() {
				userEpochApi({
					page: this.page
				}).then(res => {
					// this.epochList = res.data.data.data

					let data = res.data.data.data
					if (data.length > 0) {
						this.epochList = [...this.epochList, ...data]
						this.loadStatus = 'more';
					} else {
						this.loadStatus = 'noMore';
						uni.$u.toast('数据加载完毕!')
						this.page--
					}
				})
			},
			async loadData() {
				// console.log("isPageShow", this.isPageShow)
				// 轮播图
				commonBannerApi({
					cate: 1
				}).then(res => {
					this.swiperList = res.data.data;
				})
				// 滚动通知
				commonScrollApi({
					is_popup: 2
				}).then(res => {
					this.noticeText = res.data.data[0].content
				})
				getSettingApi().then(res => {
					this.settingInfo = res.data.data
					uni.setStorageSync('settingInfo', res.data.data)
					this.isPageShow = true;
				})
			},
			// 将日期转换为"YYYY-MM-DD"格式的字符串
			getDateString(date) {
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0');
				const day = String(date.getDate()).padStart(2, '0');
				return `${year}-${month}-${day}`;
			},
			// 加载更多
			getRight() {
				this.loadStatus = 'loading';
				this.page++
				// console.log("this.page", this.page)
				this.epoch()
			},
			// 跳转外链
			toWeb(e) {
				if (!!this.swiperList[e].url) {
					this.$utils.toWeb(this.swiperList[e].url)
				}
			},
			// 页面跳转
			toPage(url) {
				if (this.UserInfo.is_auth == 1) {
					this.$utils.toPage(url)
				} else {
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
			// 获取新闻列表
			getNewsList() {
				commonNewsApi({
					page: this.page
				}).then(res => {
					let data = res.data.data.data
					if (data.length > 0) {
						this.newsList = [...this.newsList, ...data]
						this.loadStatus = 'more';
					} else {
						this.loadStatus = 'noMore';
						uni.$u.toast('数据加载完毕!')
						this.page--
					}
				})
			},
			// 视频播放
			play() {
				let videoContext = uni.createVideoContext('myVideo')
				this.isBo = true
				videoContext.play()
			},
			// 视频暂停
			stop() {
				let videoContext = uni.createVideoContext('myVideo')
				videoContext.pause()
				this.isBo = false
			},
			// 获取弹窗公告
			getNotice() {
				commonPopupApi().then(res => {
					this.noticeList = res.data.data
					this.noticeDT = res.data.data[0]
					this.noticeShow = true
					this.myVideoShow = false
				})
			},
			// 弹窗公告关闭
			noticeClick() {
				
				this.noticeDT = {}
				this.noticeIndex = this.noticeIndex + 1
				// console.log("this.noticeIndex",this.noticeIndex)
				if (this.noticeList.length > this.noticeIndex) {
					this.noticeDT = this.noticeList[this.noticeIndex]
					this.noticeShow = true;
				}else{
					this.noticeIndex = 0
					this.noticeShow = false;
					this.myVideoShow = true;
				}
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
			onVideo(url) {
				this.videoUrl = url;
				this.videoShow = true;
				setTimeout(() => {
					// this.$refs.video.play()
					let videoContext = uni.createVideoContext('myVideo')
					videoContext.play()
				}, 500)
			},
			onPause() {
				this.videoShow = false;
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
	.titlex {
		text-align: center;
		color: #fff;
		font-size: 46rpx;
		font-weight: 500;
		padding: 0 30rpx;
		margin-bottom: 20rpx;
		display: flex;
		justify-content: center;

		text {
			flex: 1;
			display: block;
		}
	}

	.zxrk {
		background: #fff;
		border-radius: 20rpx;
		text-align: center;
		color: rgba(192, 20, 20, 1);
		font-size: 36rpx;
		font-weight: 700;
		padding: 25rpx;
		margin: 0 30rpx 60rpx;
	}

	.noticex {
		margin: 0 30rpx 30rpx;
		border-radius: 20rpx;
		color: #fff;
		background: linear-gradient(to top right, #831213, #9F4018);
		display: flex;
		padding: 20rpx;
		align-items: center;
		font-size: 28rpx;
		overflow: hidden;

		image {
			width: 30rpx;
			height: 30rpx;
			margin-right: 10rpx;
		}

		.dt {
			flex: none;
		}

		.dd {
			flex: 1;
			overflow: hidden;
		}
	}

	.header_m {
		position: relative;
		display: flex;
		justify-content: flex-end;
		flex-direction: column;
		align-items: center;
		font-size: 24rpx;

		image {
			width: 34rpx;
			height: 40rpx;
		}

		.u-badge {
			position: absolute;
			top: 0;
			right: 10rpx;
			animation: heartbeat 1s infinite;
		}

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

	.container {
		min-height: 100vh;
		height: auto;
	}

	.main {
		color: #040A13;
		margin-bottom: calc(160rpx + env(safe-area-inset-bottom));
	}

	.swiper {
		height: 460rpx;
		overflow: hidden;
		margin-bottom: 30rpx;
		border-radius: 10rpx;

		.swiper-item {
			height: 460rpx;
			display: block;
			text-align: center;
			border-radius: 10rpx;
			overflow: hidden;

			image {
				width: 100%;
			}
		}

		.simg {
			width: 100%;
			height: 460rpx;
		}

		.video {
			position: relative;
			min-height: 400rpx;

			.play {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background: rgba(0, 0, 0, .3);
				display: flex;
				text-align: center;

				.u-icon {
					margin: 0 auto;
				}
			}

			.video_mask {
				width: 100%;
				margin: 0 auto;
				position: absolute;
				top: 0;
				left: 0;

				video {
					width: 100%;
					height: 340rpx;
				}
			}
		}
	}

	.notice {
		display: flex;
		align-items: center;
		background: #fff;
		border-radius: 10rpx;
		margin-bottom: 30rpx;
		padding: 20rpx;

		.icon {

			image,
			img {
				width: 30rpx;
				height: 30rpx;
				display: block;
			}
		}

		.text {
			line-height: 1;
			padding-left: 20rpx;
			color: #FF363E;
			font-size: 0.8em;
			overflow: hidden;
		}
	}

	.tab1 {
		display: flex;
		flex-wrap: wrap;
		gap: 30rpx;
		margin: 0 30rpx;
		margin-bottom: 30rpx;

		.item {
			background: #fff;
			border-radius: 20rpx;
			padding: 0rpx 0rpx;
			width: 330rpx;
			position: relative;

			image,
			img {
				display: block;
				border-radius: 20rpx 20rpx 0 0;
				background: #eee;
				width: 100%;
				height: 220rpx;
			}

			.kl {
				color: #93969A;
				font-weight: 500;
				font-size: 24rpx;
				padding: 30rpx;

				.kl_t {
					margin-top: 5rpx;
					color: rgba(246, 42, 45, 1);
					font-size: 36rpx;
					font-weight: 800;
				}
			}

			.kl_b {
				background-color: rgba(246, 42, 45, 1);
				color: #fff;
				text-align: center;
				margin: 0 30rpx 30rpx;
				border-radius: 10rpx;
				padding: 20rpx 0;
				font-size: 24rpx;
			}

			.text {
				line-height: 1;
				font-size: 1.1em;
				font-weight: 500;
				padding-left: 10rpx;
			}

			.u-badge {
				position: absolute;
				top: 30rpx;
				left: 240rpx;
				animation: heartbeat 1s infinite;
			}

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
	.tab2 {
		display: flex;
		background: #fff;
		border-radius: 10rpx;
		margin-bottom: 30rpx;

		.item {
			padding: 30rpx 10rpx;
			text-align: center;
			flex: 1;

			.icon {
				margin-bottom: 10rpx;

				image,
				img {
					width: 108rpx;
					height: 108rpx;
					display: block;
					margin: 0 auto;
				}
			}

			.text {
				line-height: 1;
				font-size: 1.1em;
				font-weight: 500;
			}
		}
	}

	.news {
		background: #fff;
		border-radius: 10rpx;
		padding: 30rpx;

		.title {
			display: flex;

			.h1 {
				font-size: 1.2em;
				font-weight: bold;
				flex: 1;
			}

			.more {
				font-size: 0.8em;

				image,
				img {
					width: 30rpx;
					height: 30rpx;
					vertical-align: middle;
					display: inline-block;
					margin-left: 10rpx;
					margin-top: -5rpx;
				}
			}
		}

		.list {
			.item {
				display: flex;
				border-bottom: 1px solid rgba(0, 0, 0, .1);
				padding: 30rpx 0;

				.img {
					background: #f5f5f5;
					border-radius: 20rpx;

					image,
					img {
						width: 200rpx;
						height: 140rpx;
						display: block;
						border-radius: 20rpx;
					}
				}

				.text {
					line-height: 1;
					padding-left: 20rpx;
					overflow: hidden;

					.h2 {
						font-weight: 500;
						margin-bottom: 20rpx;
						font-size: 1em;
						height: 40rpx;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}

					.desc {
						color: rgba(4, 10, 19, .7);
						font-size: .9em;
						line-height: 1.2;
						height: 70rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
						display: -webkit-box;
					}
				}
			}

			.item:last-child {
				border-bottom: none;
			}
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
				background-color: #FFFFFF;
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

	.notice_mask {
		padding: 30rpx;

		.mask_box {
			background: #fff;
			border-radius: 20rpx 20rpx 0 0;
			overflow: hidden;
			width: 690rpx;

			.item {
				flex: 1;
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

			.active {
				background: linear-gradient(180deg, #CA2500 0%, #FF6B67 100%);
				color: #FFFFFF;
			}
		}

		.mask_content {
			background: #fff;
			width: 690rpx;
			border-radius: 20rpx;
			position: relative;
			overflow: auto;

			.mask_notice {
				overflow: auto;
			}

			.btn {
				padding: 20rpx;
				margin-top: 20rpx;
				background: linear-gradient(to left, rgba(247, 247, 247, 1), rgba(216, 216, 216, .5));
				border-radius: 0 0 20rpx 20rpx;
				color: #fff;
				text-align: center;
				display: flex;
				align-items: center;
				justify-content: center;
				color: #999;

				.ucode {
					margin: 0 5rpx;
				}
			}

			.btn.on {
				background: rgba(246, 42, 45, 1);
				color: #fff;

				.ucode {
					display: none;
				}
			}

			.close {
				position: absolute;
				top: 24rpx;
				right: 24rpx;
				width: 48rpx;
				height: 48rpx;
			}

			.contentTip-title {
				padding: 30rpx;
				font-size: 40rpx;
				font-weight: bold;
				line-height: 48rpx;
				text-align: center;
			}

			.contentTip-time {
				margin-bottom: 30rpx;
			}

			.contentTip-box {
				padding: 0 30rpx 30rpx;
				height: 65vh;
				overflow-y: auto;
			}

			.contentTip-content {
				overflow: auto;
			}

			.contentTip-image {
				width: 610rpx;
				margin: 0 auto;

				image {
					border-radius: 20rpx;
				}
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
	.video {
		margin-bottom: 30rpx;
		height: 500rpx;

		video {
			display: block;
		}
	}
</style>