<!-- 有用 -->
<template>
	<view class="container" style="background:#c8131e url(/static/new/bg.jpg) no-repeat center top / 100%;" v-if="isPageShow">
		<headerView>
			<view>服务</view>
		</headerView>
		<view class="hd">
			<view class="title">
				<view class="text">{{settingInfo.name}}纪元服务中心</view>
			</view>
			<view class="desc">
				让参与成为荣光，让助力成就伟业
			</view>
		</view>
		<view class="main">
			<view class="tab1">
				<view class="item" v-for="(item,index) in list" @click="toPage(item.url)">
					<view class="icon">
						<image :src="item.img" mode="aspectFit"></image>
					</view>
					<view class="text">{{item.name}}</view>
				</view>
			</view>
		</view>
		<!-- <tabBarView current="2"></tabBarView> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isPageShow: false,
				settingInfo: uni.getStorageSync('settingInfo'),
				list: [{
						name: '签到',
						img: '/static/service/1.png',
						url: '/pages/mine/singIn/index'
					},
					{
						name: '抽奖',
						img: '/static/service/2.png',
						url: '/pages/mine/singIn/dialer'
					},
					{
						name: '直播入口',
						img: '/static/service/3.png',
						url: '/pages/service/live'
					},
					{
						name: '会议记录',
						img: '/static/service/4.png',
						url: '/pages/service/meeting'
					},
					{
						name: '扶持申请',
						img: '/static/service/5.png',
						url: '/pages/service/fpsq'
					},
					{
						name: '团队入驻',
						img: '/static/service/6.png',
						url: '/pages/service/team'
					},
					{
						name: '直播招募',
						img: '/static/service/9.png',
						url: '/pages/service/zbzm'
					},
					{
						name: '纪元人物',
						img: '/static/service/10.png',
						url: 'epoch_figures_url'
					},
					{
						name: '邀请链接',
						img: '/static/service/11.png',
						url: '/pages/service/invite'
					},
					{
						name: '项目介绍',
						img: '/static/service/12.png',
						url: '/pages/service/project'
					},
					{
						name: '人工客服',
						img: '/static/service/13.png',
						url: '/pages/service/kf'
					},
					{
						name: '官方群聊',
						img: '/static/service/14.png',
						url: '/pages/index/downloadApp'
					},
				],
			}
		},
		onLoad() {
			this.isPageShow = true;

		},

		methods: {
			// 页面跳转
			toPage(url) {
				if (url == "epoch_figures_url") {
					return uni.$u.toast('暂未开放！');
					console.log(this.settingInfo.epoch_figures_url);
					this.$utils.toWeb(this.settingInfo.epoch_figures_url)
				} else {
					this.$utils.toPage(url)
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		min-height: 100vh;
		height: auto;
	}
	.hd {
		text-align: center;
		color: #fff;
		margin-bottom: 30rpx;
		.title {
			font-weight: bold;
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 0 30rpx;
			.text {
				font-size: 1.2em;
				padding: 0 30rpx;
				flex: 1;
				white-space: nowrap;
			}
		}
		.title:before {
			content: '';
			display: block;
			width: 20%;
			height: 4rpx;
			background: #fff;
			flex: 1;
		}
		.title::after {
			content: '';
			display: block;
			width: 20%;
			height: 4rpx;
			background: #fff;
			flex: 1;
		}
		.desc {}
	}
	.main {
		padding: 30rpx;
		color: #040A13;
		margin-bottom: calc(60px + env(safe-area-inset-bottom));
	}
	.tab1 {
		display: flex;
		justify-content: space-around;
		flex-wrap: wrap;
		gap: 30rpx;
		margin-bottom: 30rpx;
		.item {
			background: #fff;
			border-radius: 10rpx;
			padding: 30rpx 10rpx;
			width: 330rpx;
			display: flex;
			align-items: center;
			position: relative;
			.icon {
				image, img {
					width: 100rpx;
					height: 100rpx;
					display: block;
				}
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
</style>