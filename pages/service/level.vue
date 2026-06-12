<template>
	<view class="container" style="background:#c8131e url(/static/new/bg.jpg) no-repeat center top / 100%;">
		<headerView>
			<template #leftIcon><u-icon name="arrow-left" color="#fff" size="24"></u-icon></template>
			<view>共建奖励</view>
		</headerView>
		<!-- <swiper class="m-swiper" previous-margin="30rpx" next-margin="30rpx" :current="swiperIndex"
			@change="swiperChange">
			<swiper-item class="swiper-item" v-for="(item,index) in InviteConfig">
				<view :class="'card lv'+(index+1)">
					<view class="info">
						<view class="icon">
							<image :src="item.icon" mode="widthFix"></image>
						</view>
						<view class="text">
							<view class="name">{{ item.title }}</view>
							<view class="desc">{{ item.description }}</view>
						</view>
					</view>
					<view class="btn" :class="rules.is_complete == 1 ? 'yes':'no'">
						{{rules.is_complete == 1 ? '已完成':'未完成'}}</view>
				</view>
			</swiper-item>
		</swiper> -->
		<view class="content">
			<view class="rules">
				<view class="title">
					<image src="/static/new/integral.png" mode="heightFix" style="height: 40rpx;"></image></u-icon>
					<text>{{rules.title}}晋升条件</text>
					<view class="sbtn" @click="$utils.toPage(`/pages/service/level-detail?level=${id}`)">查看团队</view>
				</view>
				<view class="box" v-if="rules.direct">
					<view class="progress">
						<view class="info">
							<view class="demand">直推人数要求</view>
						</view>
						<view class="line">
							<u-line-progress :percentage="Math.round(rules.direct_count/rules.direct*100)" activeColor="rgba(246, 42, 45, 1)" inactiveColor="rgba(246, 42, 45, .2)"></u-line-progress>
							<view class="num">{{rules.direct_count}}/{{rules.direct}} 人</view>
						</view>
					</view>
					<view class="progress">
						<view class="info">
							<view class="demand">三级内总人数要求</view>
						</view>
						<view class="line">
							<u-line-progress :percentage="Math.round(rules.total_count/rules.min*100)" activeColor="rgba(246, 42, 45, 1)" inactiveColor="rgba(246, 42, 45, .2)"></u-line-progress>
							<view class="num">{{rules.total_count}}/{{rules.min}} 人</view>
						</view>
					</view>
					<view class="reward">
						<view class="name">晋级奖励金额</view>
						<view class="amount">{{rules.money}}</view>
						<view class="btn no" v-if="rules.is_complete == 0">未达标</view>
						<view class="btn yes" v-if="rules.is_complete == 1" @click="getTeamCount()">可领取</view>
						<view class="btn no" v-if="rules.is_complete == 2">已领取</view>
					</view>
				</view>
				<u-skeleton :loading="true" :animate="true" :rows="3" v-else></u-skeleton>
			</view>
			<view class="prize">
				<view class="title"><u-icon name="gift-fill" color="#ff3650" size="28"></u-icon>
					<text>{{rules.title}}邀请奖励</text>
				</view>
				<view class="list" v-if="rules.direct">
					<view class="item" v-for="(item,index) in rules.day_task" :key="index">
						<view class="text">
							<view class="name"><text class="index">{{index+1}}</text> 直推 {{item.direct}} 人 → 奖励
								¥{{item.money}}</view>
						</view>
						<view class="btn" :class="item.is_complete == 1 ? 'yes':'no'">
							{{item.is_complete == 1 ? '已完成':'未完成'}}
						</view>
					</view>
				</view>
				<u-skeleton :loading="true" :animate="true" :rows="3" v-else></u-skeleton>
			</view>
			<view class="m-tips warning">
				<view class="icon">
					<image src="/static/new/tips.png" mode="aspectFit"></image>
				</view>
				<!-- <view class="text" v-html="settingInfo.text.invite_level_rule"></view> -->
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getInviteConfigAPI,
		getInviteDetailAPI,
		getTeamCountAPI
	} from '@/api/api.js'
	export default {
		data() {
			return {
				settingInfo: uni.getStorageSync('settingInfo'),
				id: 1,
				swiperIndex: 0,
				InviteConfig: [],
				rules: {},
				InviteDetail: {}
			};
		},
		onLoad(opt) {
			if (opt.id) {
				// console.log("sss",opt)
				this.id = opt.id;
				this.swiperIndex = opt.index;
				// console.log("swiperIndex",this.swiperIndex)
			}
			this.loadData();
			// this.getTeamList(opt.type) 
		},
		methods: {
			loadData() {
				getInviteConfigAPI().then(res => {
					this.InviteConfig = res.data.data
					//this.rules = res.data.data[this.swiperIndex]
				})
				this.getDT();
			},
			getDT() {
				getInviteDetailAPI({
					id: this.id
				}).then(res => {
					this.rules = res.data.data
				})
			},
			swiperChange(e) {
				this.swiperIndex = e.detail.current
				this.rules = this.InviteConfig[this.swiperIndex]
				this.id = this.InviteConfig[this.swiperIndex].id
				this.getDT();
			},
			getTeamCount() {
				getTeamCountAPI({
					id: this.id
				}).then(res => {
					uni.$u.toast(res.data.msg)
					this.getDT();
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {}
	.m-swiper {
		margin-bottom: 30rpx;
		border-radius: 20rpx;
		height: 300rpx;
		.swiper-item:last-child .card {
			margin-right: 0;
		}
	}
	.card {
		background: #fff;
		padding: 50rpx;
		border-radius: 20rpx;
		overflow: hidden;
		position: relative;
		margin-right: 30rpx;
		.info {
			display: flex;
			.icon {
				image {
					width: 120rpx;
				}
			}
			.text {
				padding-left: 30rpx;
				.name {
					height: 60rpx;
					font-size: 1.4em;
					font-weight: bold;
					white-space: nowrap;
					overflow: hidden;
				}
				.desc {
					height: 140rpx;
					opacity: .8;
					overflow: hidden;
					text-overflow: ellipsis;
					-webkit-line-clamp: 3;
					-webkit-box-orient: vertical;
					display: -webkit-box;
				}
			}
		}
		.points {
			height: 10rpx;
			background: rgba(255, 255, 255, .3);
			margin-bottom: 10rpx;
			border-radius: 10rpx;
		}
		.points-now {
			height: 10rpx;
			background: #000;
			border-radius: 10rpx;
		}
		.points-desc {}
		.points-num {}
		.btn {
			position: absolute;
			top: 0;
			right: 0;
			padding: 10rpx 20rpx;
			font-size: .6em;
			border-radius: 0 20rpx 0 20rpx;
		}
		.btn.no {
			background: linear-gradient(to left, rgba(247, 247, 247, 1), rgba(216, 216, 216, .5));
		}
		.btn.yes {
			background: linear-gradient(to left, #FF624B, #FF3650);
			color: #fff;
		}
	}
	.card.lv1 {
		background: linear-gradient(to left, rgba(255, 255, 255, 1), rgba(255, 255, 255, .9));
	}
	.card.lv2 {
		background: linear-gradient(to left top, rgba(255, 255, 255, 1), rgba(255, 255, 255, .9));
	}
	.card.lv3 {
		background: linear-gradient(to left, rgba(255, 255, 255, 1), rgba(255, 255, 255, .9));
	}
	.card.lv4 {
		background: linear-gradient(to left, rgba(255, 255, 255, 1), rgba(255, 255, 255, .9));
	}
	.card.lv5 {
		background: linear-gradient(to left, rgba(255, 255, 255, 1), rgba(255, 255, 255, .9));
	}
	// .card:last-child{ margin-right: 0;}
	.content {
		padding: 0 30rpx 30rpx;
	}
	.rules {
		background: #fff;
		border-radius: 20rpx;
		padding: 30rpx;
		margin-bottom: 30rpx;
		.title {
			font-weight: bold;
			margin-bottom: 20rpx;
			display: flex;
			align-items: center;
			text {
				padding: 0 10rpx;
				flex: 1;
			}
			.sbtn {
				padding: 10rpx 30rpx;
				background: rgba(246, 42, 45, 1);
				color: #fff;
				border-radius: 30rpx;
				font-size: .6em;
				font-weight: 500;
			}
		}
		.progress {
			margin-bottom: 30rpx;
			background: rgba(246, 42, 45, .1);
			padding: 30rpx;
			border-radius: 20rpx;
			.info {
				display: flex;
				justify-content: space-between;
				margin-bottom: 20rpx;
			}
			.line {
				display: flex;
				justify-content: space-between;
				align-items: center;
				.num {
					padding-left: 20rpx;
				}
			}
		}
		.reward {
			text-align: center;
			padding: 50rpx 0 0;
			.amount {
				font-size: 1.6em;
				font-weight: bold;
				margin-bottom: 30rpx;
			}
			.btn {
				padding: 20rpx 30rpx;
				border-radius: 20rpx;
			}
			.btn.no {
				background: rgba(183, 183, 183, 1);
			}
			.btn.yes {
				background: rgba(246, 42, 45, 1);
				color: #fff;
			}
		}
	}
	.prize {
		background: #fff;
		border-radius: 20rpx;
		padding: 30rpx;
		margin-bottom: 30rpx;
		.title {
			font-size: 1.2em;
			font-weight: bold;
			margin-bottom: 20rpx;
			display: flex;
			align-items: center;
			text {
				padding-left: 10rpx;
			}
		}
		.list {
			.item {
				padding: 30rpx;
				margin-bottom: 30rpx;
				border-radius: 20rpx;
				background: rgba(246, 42, 45, .1);
				color: rgba(246, 42, 45, 1);
				display: flex;
				align-items: center;
				justify-content: space-between;
				.text {
					.name {
						line-height: 40rpx;
					}
					.index {
						border: 2rpx solid rgba(246, 42, 45, 1);
						display: inline-block;
						border-radius: 30rpx;
						width: 40rpx;
						height: 40rpx;
						line-height: 40rpx;
						text-align: center;
						font-size: .6em;
						margin-right: 10rpx;
					}
					.desc {
						font-size: .8em;
						opacity: .8;
					}
				}
				.num {
					font-weight: bold;
					color: #f00;
				}
				.btn {
					padding: 10rpx 30rpx;
					background: rgba(246, 42, 45, 1);
					color: #fff;
					border-radius: 60rpx;
					font-size: .8em;
				}
				.btn.no {
					background: rgba(183, 183, 183, 1);
				}
			}
		}
	}
</style>