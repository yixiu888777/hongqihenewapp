<template>

	<view class="container"
		style="background: url('/static/new1/bg.jpg') no-repeat center top / cover;background-attachment: fixed;">
		<view class="statusbar"></view>
		<view class="header_k">
			
		我的团队
		</view>

		<view class="count-box" style="margin-top: 60rpx;height:800rpx">
			<view style="display: flex;flex-direction: column;align-items: center;
			width: 100%;">
				<image :src="info.member_avatar" style="width:80rpx;height:80rpx" mode=""></image>
				<text style="margin-top: 20rpx;color: red;font-weight: 700;">{{info.realname}}</text>
			</view>
			
			<view style="display: flex;flex-wrap: wrap;justify-content: space-between;margin-top: 20rpx;">
				<view style="width: 300rpx;background:#FEDFE0;display: flex;
				flex-direction: column;padding:20rpx 0;
				text-align: center;border-radius: 20rpx;margin-top:20rpx">
					<text style="font-size: 24rpx;">绩效提成</text>
					<text style="color: #F62A2D;font-weight: 700;font-size: 30rpx;">{{info.performance}}</text>
				</view>
				<view style="width: 300rpx;background:#FEDFE0;display: flex;
				flex-direction: column;padding:20rpx 0;text-align: center;border-radius: 20rpx;margin-top:20rpx">
					<text style="font-size: 24rpx;">个人收入</text>
					<text style="color: #F62A2D;font-weight: 700;font-size: 30rpx;">{{info.personal}}</text>
				</view>
				<view style="width: 300rpx;background:#FEDFE0;display: flex;
				flex-direction: column;padding:20rpx 0;text-align: center;border-radius: 20rpx;margin-top:20rpx">
					<text style="font-size: 24rpx;">今日注册</text>
					<text style="color: #F62A2D;font-weight: 700;font-size: 30rpx;">{{info.today_req}}</text>
				</view>
				<view style="width: 300rpx;background:#FEDFE0;display: flex;
				flex-direction: column;padding:20rpx 0;
				text-align: center;border-radius: 20rpx;margin-top:20rpx">
					<text style="font-size: 24rpx;">今日激活</text>
					<text style="color: #F62A2D;font-weight: 700;font-size: 30rpx;">{{info.today_active}}</text>
				</view>
				<view style="width: 300rpx;background:#FEDFE0;display: flex;
				flex-direction: column;padding:20rpx 0;text-align: center;border-radius: 20rpx;margin-top:20rpx">
					<text style="font-size: 24rpx;">本月注册</text>
					<text style="color: #F62A2D;font-weight: 700;font-size: 30rpx;">{{info.month_req}}</text>
				</view>
				<view style="width: 300rpx;background:#FEDFE0;display: flex;
				flex-direction: column;padding:20rpx 0;text-align: center;border-radius: 20rpx;margin-top:20rpx">
					<text style="font-size: 24rpx;">本月激活</text>
					<text style="color: #F62A2D;font-weight: 700;font-size: 30rpx;">{{info.month_active}}</text>
				</view>
				<view style="width: 300rpx;background:#FEDFE0;display: flex;
				flex-direction: column;padding:20rpx 0;
				text-align: center;border-radius: 20rpx;margin-top:20rpx">
					<text style="font-size: 24rpx;">团队总人数</text>
					<text style="color: #F62A2D;font-weight: 700;font-size: 30rpx;">{{info.total_req}}</text>
				</view>
				<view style="width: 300rpx;background:#FEDFE0;display: flex;
				flex-direction: column;padding:20rpx 0;text-align: center;border-radius: 20rpx;margin-top:20rpx">
					<text style="font-size: 24rpx;">团队总激活</text>
					<text style="color: #F62A2D;font-weight: 700;font-size: 30rpx;">{{info.total_active}}</text>
				</view>
				
			</view>

		</view>
		<view class="reward">
			<view style="background: #F3F0F1;padding:30rpx;display: flex;justify-content: space-between;align-items: center;margin: 10rpx 0 20rpx;border-radius: 30rpx;">
				<text style="font-size: 28rpx;font-weight: 800;">个人绩效奖励{{info.yongjin_rate}}</text>
				<text style="font-size: 26rpx;color: #fff;background: #F62A2D;padding: 10rpx 20rpx;border-radius: 30rpx;" @click="jump(0)">查看明细</text>
			</view>
			<view style="background: #F3F0F1;padding:30rpx;margin: 10rpx 0 20rpx;border-radius: 30rpx;">
				<view style="display: flex;justify-content: space-between;align-items: center;">
					<text style="font-size: 28rpx;font-weight: 800;">一级团队奖励奖励{{info.yongjin_rate_1}}</text>
					<text style="font-size: 26rpx;color: #fff;background: #F62A2D;padding: 10rpx 20rpx;border-radius: 30rpx;"  @click="jump(1)">查看明细</text>
				</view>
				<view style="margin-top: 20rpx;font-size: 26rpx;">
					<text>注册 {{info.first_req}}人</text>
					<text style="margin-left: 80rpx;">激活 {{info.first_active}}人</text>
				</view>
			</view>
			<view style="background: #F3F0F1;padding:30rpx;margin: 10rpx 0 20rpx;border-radius: 30rpx;">
				<view style="display: flex;justify-content: space-between;align-items: center;">
					<text style="font-size: 28rpx;font-weight: 800;">二级团队奖励奖励{{info.yongjin_rate_2}}</text>
					<text style="font-size: 26rpx;color: #fff;background: #F62A2D;padding: 10rpx 20rpx;border-radius: 30rpx;" @click="jump(2)">查看明细</text>
				</view>
				<view style="margin-top: 20rpx;font-size: 26rpx;">
					<text>注册 {{info.two_req}}人</text>
					<text style="margin-left: 80rpx;">激活 {{info.two_active}}人</text>
				</view>
			</view>
			<view style="background: #F3F0F1;padding:30rpx;margin: 10rpx 0 20rpx;border-radius: 30rpx;">
				<view style="display: flex;justify-content: space-between;align-items: center;">
					<text style="font-size: 28rpx;font-weight: 800;">三级团队奖励奖励{{info.yongjin_rate_3}}</text>
					<text style="font-size: 26rpx;color: #fff;background: #F62A2D;padding: 10rpx 20rpx;border-radius: 30rpx;"  @click="jump(3)">查看明细</text>
				</view>
				<view style="margin-top: 20rpx;font-size: 26rpx;">
					<text>注册 {{info.three_req}}人</text>
					<text style="margin-left: 80rpx;">激活 {{info.three_active}}人</text>
				</view>
			</view>

		</view>
	<view class="reward" >
		<view style="display: flex; align-items: center;margin-bottom: 40rpx;">
			<image src="/static/service/team/1.png" style="width: 50rpx;height: 50rpx;" mode=""></image>
			<text style="margin-left: 20rpx;font-weight: 800;">红旗河工程</text>
		</view>
			<view style="display: flex;
			justify-content: space-between;align-items: center;margin: 10rpx 0 20rpx;border-radius: 30rpx;">
				<view style="display: flex;align-items: center;">
					<image src="/static/service/team/2.png" style="width: 80rpx;height: 80rpx;" mode=""></image>
					<text style="font-size: 28rpx;font-weight: 800;margin-left:20rpx;margin-top: -10rpx;">岗位介绍</text>
				</view>
				<text style="font-size: 24rpx;color: #fff;background: #F62A2D;
				padding: 10rpx 40rpx;border-radius: 30rpx;" @click="jumpx">查看</text>
			</view>
			<view style="display: flex;
			justify-content: space-between;align-items: center;margin: 10rpx 0 20rpx;border-radius: 30rpx;">
				<view style="display: flex;align-items: center;">
					<image src="/static/service/team/3.png" style="width: 80rpx;height: 80rpx;" mode=""></image>
					<text style="font-size: 28rpx;font-weight: 800;margin-left:20rpx;margin-top: -10rpx;">人工客服咨询</text>
				</view>
				<text style="font-size: 24rpx;color: #fff;background: #F62A2D;
				padding: 10rpx 40rpx;border-radius: 30rpx;">查看</text>
			</view>

		</view>
		<tabBarView current="4"></tabBarView>
	</view>



</template>

<script>
	import {
		userTeamInfoApi
	} from '@/api/api.js'
	export default {
		data() {
			return {
				settingInfo: uni.getStorageSync('settingInfo'),
				info:{}
				
			};
		},
		onLoad() {
			// commonScrollApi({
			// 	is_popup: 2
			// }).then(res => {
			// 	this.noticeText = res.data.data.data[0].content
			// })

			userTeamInfoApi().then(res=>{
				this.info=res.data.data
			})
		},
		methods: {
			jumpx(){
				uni.navigateTo({
					url:'/pages/salary/gwjs'
				})
			},
			jump(id){
				uni.navigateTo({
					url:'/pages/salary/detail?level='+id
				})
			},
		
		}
	}
</script>

<style lang="scss">
	.count-box {
		padding: 30rpx;
		margin: 0 30rpx 30rpx;
		border-radius: 20rpx;
		background: #fff;}
	.container {
		min-height: 100vh;
		height: auto;
		padding-bottom: 120rpx;
	}

	.header_k {
		position: relative;
		text-align: center;
		color: #fff;
		margin-top: 40rpx;
		font-weight: 700;
	}



	.tip {
		text-align: center;
		color: #fff;
		font-size: 28rpx;
		line-height: 1;
		margin: 20rpx 0 40rpx;
	}

	.input-code {
			display: flex;
			align-items: center;
			background: rgba(246, 247, 249, 1);
			padding: 30rpx;
			border-radius: 10rpx 20rpx;

			.input {
				flex: 1;
				overflow: hidden;
				white-space: nowrap;
				overflow: hidden;
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

		.list {
			.item {
				padding: 30rpx;
				margin-bottom: 30rpx;
				border-radius: 20rpx;
				display: flex;
				align-items: center;
				background: rgba(249, 250, 251, 1);

				.icon {
					image {
						width: 100rpx;
					}
				}

				.text {
					flex: 1;
					padding: 0 30rpx;

					.h3 {
						font-weight: bold;
					}

					.desc {
						font-size: .8em;
					}
				}

				.btn {
					font-size: .8em;
					background: linear-gradient(to left, #FF624B, #FF3650);
					color: #fff;
					border-radius: 10rpx;
					padding: 10rpx 20rpx;
				}
			}

			.success {
				filter: grayscale(100%);
				-webkit-filter: grayscale(100%);
				opacity: .7;

				.btn {}
			}

			.ing {
				.btn {}
			}
		}

		.level {
			font-size: 0.8em;
			margin-bottom: 30rpx;

			.lv1 {
				background: linear-gradient(270deg, #7B90AD 0%, #B2C1D7 100%);
			}

			.lv2 {
				background: linear-gradient(270deg, #DDB999 0%, #F1D8BA 100%);
			}

			.lv3 {
				background: linear-gradient(90deg, #ADCAE8 0%, #CCE0F8 100%);
			}

			.lv4 {
				background: linear-gradient(90deg, #E8BE76 0%, #F4D59E 100%);
			}

			.lv5 {
				background: linear-gradient(90deg, #918EE5 0%, #A5A0F0 100%);
			}

			.lv6 {
				background: linear-gradient(90deg, #131313 0%, #48484A 100%);
			}

			.item {
				border-radius: 20rpx;
				padding: 30rpx;
				display: flex;
				align-items: center;
				margin-bottom: 30rpx;

				.icon {
					image {
						width: 90rpx;
					}
				}

				.desc {
					color: #fff;
					font-size: 1.2em;
					padding: 0 20rpx;
					flex: 1;
				}

				.btn {
					color: #FF374F;
					font-size: 1.2em;
					font-weight: bold;
				}
			}
		}

	}

	.nav-list {
		grid-template-columns: 1fr 1fr 1fr;
		margin-bottom: 30rpx;
		display: flex;
		justify-content: space-between;

		.nav-item {
			width: 31%;
			height: 104rpx;
			padding: 12rpx 20rpx;
			;
			border-radius: 20rpx;
			background: linear-gradient(to left, rgba(255, 49, 80, 0.1), rgba(255, 100, 75, 0.1));
			border-top: 1px solid rgba(255, 255, 255, 1);
			font-family: Roboto;
			font-size: 28rpx;
			font-weight: 400;
			line-height: 40rpx;
			color: rgba(175, 21, 0, 1);

			image {
				width: 28rpx;
				height: 28rpx;
			}
		}
	}
</style>