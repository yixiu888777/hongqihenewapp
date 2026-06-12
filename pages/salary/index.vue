<template>
	<view class="container" style="background:#c8131e url(/static/new/bg.jpg) no-repeat center top / 100%;" v-if="isPageShow">
		<headerView>
			<view>我的团队</view>
		</headerView>

		<view class="count-box">
			<view class="me">
				<image class="avatar" :src="UserInfo.avatar" mode="aspectFill"></image>
				<text class="name">{{info.realname}}</text>
			</view>

			<view class="info">
				<view class="item">
					<view class="dt">绩效提成</view>
					<view class="dd">{{info.performance}}</view>
				</view>
				<view class="item">
					<view class="dt">个人收入</view>
					<view class="dd">{{info.personal}}</view>
				</view>
				<view class="item">
					<view class="dt">今日注册</view>
					<view class="dd">{{info.today_req}}</view>
				</view>
				<view class="item">
					<view class="dt">今日激活</view>
					<view class="dd">{{info.today_active}}</view>
				</view>
				<view class="item">
					<view class="dt">本月注册</view>
					<view class="dd">{{info.month_req}}</view>
				</view>
				<view class="item">
					<view class="dt">本月激活</view>
					<view class="dd">{{info.month_active}}</view>
				</view>
				<view class="item">
					<view class="dt">团队总人数</view>
					<view class="dd">{{info.total_req}}</view>
				</view>
				<view class="item">
					<view class="dt">团队总激活</view>
					<view class="dd">{{info.total_active}}</view>
				</view>

			</view>

		</view>
		<view class="reward">
			<view class="item">
				<view class="dt">个人绩效奖{{info.yongjin_rate}}</view>
				<view class="dd" @click="jump(0)">查看明细</view>
			</view>
			<view class="item">
				<view class="dt">一级团队奖励{{info.yongjin_rate_1}}
					<view class="desc">
						<text>注册 {{info.first_req}}人</text>
						<text>激活 {{info.first_active}}人</text>
					</view>
				</view>
				<view class="dd" @click="$utils.toPage(`/pages/salary/detail?level=1`)">查看明细</view>
			</view>
			<view class="item">
				<view class="dt">二级团队奖励{{info.yongjin_rate_2}}
					<view class="desc">
						<text>注册 {{info.two_req}}人</text>
						<text>激活 {{info.two_active}}人</text>
					</view>
				</view>
				<view class="dd" @click="$utils.toPage(`/pages/salary/detail?level=2`)">查看明细</view>
			</view>
			<view class="item">
				<view class="dt">三级团队奖励{{info.yongjin_rate_3}}
					<view class="desc">
						<text>注册 {{info.three_req}}人</text>
						<text>激活 {{info.three_active}}人</text>
					</view>
				</view>
				<view class="dd" @click="$utils.toPage(`/pages/salary/detail?level=3`)">查看明细</view>
			</view>

		</view>
		<view class="box">
			<view class="title">
				<image src="/static/service/team/1.png" mode=""></image>
				<text>红旗河工程</text>
			</view>
			<view class="item">
				<image src="/static/service/team/2.png" mode=""></image>
				<text class="text">岗位介绍</text>
				<text class="btn" @click="$utils.toPage(`/pages/salary/gwjs`)">查看</text>
			</view>
			<view class="item">
				<image src="/static/service/team/3.png" mode=""></image>
				<text class="text">人工客服</text>
				<text class="btn" @click="$utils.toPage(`/pages/service/kf`)">咨询</text>
			</view>
		</view>
		<!-- <tabBarView current="4"></tabBarView> -->
	</view>
</template>

<script>
	import {
		userTeamInfoApi
	} from '@/api/api.js'
	export default {
		data() {
			return {
				isPageShow: true,
				settingInfo: uni.getStorageSync('settingInfo'),
				UserInfo: uni.getStorageSync('user_info'),
				info: {}

			};
		},
		onShow() {
			this.UserInfo = uni.getStorageSync('user_info');
			userTeamInfoApi().then(res => {
				this.info = res.data.data
				this.isPageShow = true;
			})
		},
		onLoad() {},
		methods: {
			jumpx() {
				uni.navigateTo({
					url: '/pages/salary/gwjs'
				})
			},
			jump(id) {
				uni.navigateTo({
					url: '/pages/salary/recharge?level=' + id
				})
			},

		}
	}
</script>

<style lang="scss" scoped>
	.count-box {
		padding: 30rpx;
		margin: 0 30rpx 30rpx;
		border-radius: 20rpx;
		background: #fff;
	}
	.container {
		min-height: 100vh;
		height: auto;
		padding-bottom: 150rpx;
	}
	.me {
		text-align: center;
		margin-bottom: 30rpx;
		.avatar {
			width: 120rpx;
			height: 120rpx;
			border-radius: 90rpx;
			display: block;
			margin: 0 auto;
		}
		.name {
			color: rgba(246, 42, 45, 1);
		}
	}
	.info {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 30rpx;
		.item {
			width: 300rpx;
			text-align: center;
			padding: 20rpx;
			flex: none;
			background: rgba(246, 42, 45, .15);
			border-radius: 20rpx;
			.dt {
				color: rgba(0, 0, 0, .6);
			}
			.dd {
				font-size: 1.4em;
				font-weight: bold;
				color: rgba(246, 42, 45, 1);
			}
		}
	}
	.reward {
		padding: 30rpx;
		margin: 0 30rpx 30rpx;
		border-radius: 20rpx;
		background: #fff;
		.tit {
			font-size: 32rpx;
			font-weight: bold;
			margin-bottom: 30rpx;
		}
		.item {
			background: rgba(243, 240, 241, 1);
			padding: 30rpx;
			border-radius: 20rpx;
			margin-bottom: 30rpx;
			display: flex;
			justify-content: space-between;
			align-items: baseline;
			.dt {
				font-weight: bold;
				.desc {
					font-weight: 500;
					font-size: .9em;
					margin-top: 20rpx;
					color: rgba(4, 10, 19, .7);
					text {
						margin-right: 30rpx;
					}
				}
			}
			.dd {
				background: rgba(246, 42, 45, 1);
				color: #fff;
				font-size: .8em;
				border-radius: 90rpx;
				padding: 10rpx 30rpx;
			}
		}
	}
	.box {
		padding: 30rpx;
		margin: 0 30rpx 30rpx;
		border-radius: 20rpx;
		background: #fff;
		.title {
			display: flex;
			align-items: center;
			font-size: 32rpx;
			font-weight: bold;
			margin-bottom: 30rpx;
			image {
				width: 60rpx;
				height: 60rpx;
				margin-right: 10rpx;
			}
		}
		.item {
			display: flex;
			align-items: center;
			margin-bottom: 30rpx;
			image {
				width: 60rpx;
				height: 60rpx;
				margin-right: 10rpx;
			}
			.text {
				flex: 1;
			}
			.btn {
				background: rgba(246, 42, 45, 1);
				color: #fff;
				font-size: .8em;
				border-radius: 90rpx;
				padding: 10rpx 30rpx;
			}
		}
	}
</style>