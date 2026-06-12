<!-- 有用 -->
<template>
	<!-- <view class="container" v-if="isPageShow" :style="'background: url('+ settingInfo.background.salary_bg_image +') no-repeat center top / 100%;background-attachment: fixed;'"> -->
	<view class="container" v-if="isPageShow"
		style="background: url('/static/new1/bg.jpg') no-repeat center top / cover;background-attachment: fixed;">
		<view class="statusbar"></view>
		<view class="header_k">
			<view style="position: absolute;left: 20rpx;" @click="jumpk">
				<uni-icons type="left" color="#fff"></uni-icons>
			</view>
			团队详情
		</view>
		<view class="main">


			<view class="level">
				<view class="item" :class="level == 0?'on':''" @click="onLevel(0)">
					<view class="desc">个人</view>
				</view>
				<view class="item" :class="level == 1?'on':''" @click="onLevel(1)">
					<view class="desc">一级</view>
				</view>
				<view class="item" :class="level == 2?'on':''" @click="onLevel(2)">
					<view class="desc">二级</view>
				</view>
				<view class="item" :class="level == 3?'on':''" @click="onLevel(3)">
					<view class="desc">三级</view>
				</view>
			</view>
			<view class="">

			</view>
			<!-- <view class="level level2">
				<view class="item" v-for="(item,index) in TeamInfo.list" :key="index" v-if="item.title != '奖励金额'">
					<view class="desc">{{item.title}}</view>
					<view class="num one" v-if="level == 1">{{item.one}}</view>
					<view class="num two" v-if="level == 2">{{item.two}}</view>
					<view class="num three" v-if="level == 3">{{item.three}}</view>
				</view>
			</view> -->
			<view class="list">
				<view class="item">
					<view style="width: 100%;display: flex;text-align: center;font-size: 24rpx;
					color: #040A13;font-weight: 300;padding-bottom: 30rpx;border-bottom: 1rpx solid #B7B7B7;">
						<text style="width: 25%;">一级</text>
						<text style="width: 25%;">一级</text>
						<text style="width: 25%;">二级</text>
						<text style="width: 25%;">三级</text>
					</view>
					<view style="width: 100%;display: flex;text-align: center;font-size: 24rpx;
				   font-weight: 300;padding-bottom: 30rpx;border-bottom: 1rpx solid #f5f5f5;margin: 20rpx 0;">
						<text style="width: 25%;color: #333;font-weight: 800;">注册人数</text>
						<text style="width: 25%;color: red;font-weight: 800;">{{TeamInfo.first_req}}</text>
						<text style="width: 25%;color: red;font-weight: 800;">{{TeamInfo.two_req}}</text>
						<text style="width: 25%;color: red;font-weight: 800;">{{TeamInfo.three_req}}</text>
					</view>
					<view style="width: 100%;display: flex;text-align: center;font-size: 24rpx;
					font-weight: 300;padding-bottom: 30rpx;border-bottom: 1rpx solid #f5f5f5;margin: 20rpx 0;">
						<text style="width: 25%;color: #333;font-weight: 800;">有效人数</text>
						<text style="width: 25%;color: red;font-weight: 800;">{{TeamInfo.first_auth}}</text>
						<text style="width: 25%;color: red;font-weight: 800;">{{TeamInfo.two_auth}}</text>
						<text style="width: 25%;color: red;font-weight: 800;">{{TeamInfo.three_auth}}</text>
					</view>
					<view style="width: 100%;display: flex;text-align: center;font-size: 24rpx;
										font-weight: 300;padding-bottom: 30rpx;border-bottom: 1rpx solid #f5f5f5;margin: 20rpx 0;">
						<text style="width: 25%;color: #333;font-weight: 800;">激活人数</text>
						<text style="width: 25%;color: red;font-weight: 800;">{{TeamInfo.first_active}}</text>
						<text style="width: 25%;color: red;font-weight: 800;">{{TeamInfo.two_active}}</text>
						<text style="width: 25%;color: red;font-weight: 800;">{{TeamInfo.three_active}}</text>
					</view>
					<view style="width: 100%;display: flex;text-align: center;font-size: 24rpx;
															font-weight: 300;padding-bottom: 30rpx;border-bottom: 1rpx solid #f5f5f5;margin: 20rpx 0;">
						<text style="width: 25%;color: #333;font-weight: 800;">绩效金额</text>
						<text style="width: 25%;color: red;font-weight: 800;">{{TeamInfo.first_amount}}</text>
						<text style="width: 25%;color: red;font-weight: 800;">{{TeamInfo.two_amount}}</text>
						<text style="width: 25%;color: red;font-weight: 800;">{{TeamInfo.three_amount}}</text>
					</view>


				</view>
				<!-- <uni-load-more iconType="snow" :status="loadStatus"></uni-load-more> -->
			</view>
			<view class="list" >
				<view class="item" >
					<view style="width: 100%;display: flex;text-align: center;font-size: 24rpx;
										color: #040A13;font-weight: 300;padding-bottom: 30rpx;border-bottom: 1rpx solid #B7B7B7;">
						<text style="width: 20%;">姓名</text>
						<text style="width: 25%;">账户</text>
						<text style="width: 30%;">时间</text>
						<text style="width: 25%;">金额</text>
					</view>
					<view style="width: 100%;display: flex;text-align: center;font-size: 24rpx;
					font-weight: 300;padding-bottom: 30rpx;border-bottom: 1rpx solid #f5f5f5;margin: 20rpx 0;" v-for="(item,index) in lists" :key="index">
						<text style="width: 20%;font-weight: 800;">{{item.realname}}</text>
						<text style="width: 25%;font-weight: 800;">{{item.phone}}</text>
						<text style="width: 30%;font-weight: 800;">{{item.createtime}}</text>
						<text style="width: 25%;font-weight: 800;">4890</text>
					</view>
						<uni-load-more iconType="snow" :status="loadStatus"></uni-load-more>
					<!-- 	<view class="title">
						<view class="name"><text class="real">{{item.realname}}</text> <text
								class="tel">{{item.phone}}</text></view>
						<view class="op">
							<view class="btn" :class="item.is_auth == 1 ? 'on':''">{{item.is_auth ==1? '已认证':'未认证'}}
							</view>
							<view class="btn" :class="item.is_active == 1 ? 'on':''">{{item.is_active_str}}</view>
						</view>
					</view>
					<view class="dl" v-if="item.create_time">
						<view class="dt">注册时间</view>
						<view class="dd">{{item.create_time}}</view>
					</view>
					<view class="dl" v-if="item.is_active_time">
						<view class="dt">激活时间</view>
						<view class="dd">{{item.is_active_time}}</view>
					</view> -->
				</view>
				<!-- <uni-load-more iconType="snow" :status="loadStatus"></uni-load-more> -->
			</view>
		</view>
	</view>
</template>

<script>
	import {
		userTeamStaticApi,
		userTeamOrderApi
	} from '@/api/api.js'
	export default {
		data() {
			return {
				isPageShow: false,
				settingInfo: uni.getStorageSync('settingInfo'),
				lists: [],
				page: 1,
				loadStatus: 'loading', //more/loading/noMore
				TeamInfo: {},
				level: 0,
			}
		},
		onLoad(opt) {
			if (opt.level) {
				this.level = opt.level
			}
			this.loadData();
			this.getList();
		},
		onShow() {

		},
		onHide() {

		},
		onUnload() {
			// 页面卸载时
		},
		onReachBottom() {
			// 上拉触底时
			this.loadStatus = 'loading';
			this.page++
			this.getList();
		},
		methods: {
			async loadData() {
				userTeamStaticApi().then(res => {
					this.TeamInfo = res.data.data
					this.isPageShow = true;
				})
			},
			getList() {
				userTeamOrderApi({
					level: this.level,
					page: this.page
				}).then(res => {
					// this.lists = res.data.data.data
					// console.log("---",this.lists)
					 let data = res.data.data.data
					if ( data.length > 0 ) {
						this.lists = [...this.lists, ...data]
						this.loadStatus = 'more';
					} else {
						this.loadStatus = 'noMore';
						uni.$u.toast('数据加载完毕!')
						this.page--
					}
				})
			},
			onLevel(e) {
				this.lists = []
				this.level = e;
				this.getList();
			}
		}
	}
</script>


<style lang="scss" scoped>
	.header_k {
		position: relative;
		text-align: center;
		color: #fff;
		margin-top: 40rpx;
		font-weight: 700;
	}

	.container {
		min-height: 100vh;
		height: auto;
	}

	.main {
		padding: 30rpx;
		color: #040A13;
		margin-bottom: calc(60px + env(safe-area-inset-bottom));
		overflow: hidden;
	}

	.total {
		display: flex;
		justify-content: space-between;
		padding: 30rpx 60rpx;
		position: relative;
		background: #FF3650;
		background: linear-gradient(to left, #FF624B, #FF3650);
		color: #fff;
		border-radius: 20rpx;
		margin-bottom: 30rpx;
		overflow: hidden;

		.item {}
	}

	.total::before {
		content: '';
		position: absolute;
		top: -150rpx;
		right: 300rpx;
		width: 100rpx;
		height: 500rpx;
		transform: rotate(-50deg);
		background: linear-gradient(to right, rgba(255, 255, 255, .1), rgba(255, 255, 255, 0));
	}

	.total::after {
		content: '';
		position: absolute;
		top: -200rpx;
		right: 0;
		width: 100rpx;
		height: 500rpx;
		transform: rotate(-60deg);
		background: linear-gradient(to right, rgba(255, 255, 255, .1), rgba(255, 255, 255, 0));
	}

	.level {
		margin-bottom: 30rpx;
		overflow: hidden;
		display: flex;
		gap: 30rpx;
		text-align: center;

		.item {
			width: 190rpx;
			background: #FA9169;
			color: #fff;
			border-radius: 60rpx;
			padding: 8rpx;
			overflow: hidden;
			flex: 1;
			position: relative;

			.desc {
				font-size: .8em;
				margin-bottom: 10rpx;
			}

			.num {
				color: #FF374F;
				font-size: 1.2em;
				font-weight: bold;
			}

			.right {
				position: absolute;
				right: 20rpx;
				top: 40%;
			}
		}

		.item.on {
			background: #fff;
			color: #F62A2D;

			.desc,
			.num,
			.right,
			.u-icon__icon {
				color: #F62A2D
			}

			::v-deep .u-icon__icon {
				color: #fff !important;
			}

		}
	}

	.list {
		.item {
			background: #fff;
			border-radius: 20rpx;
			margin-bottom: 30rpx;
			padding: 30rpx;

			.title {
				display: flex;
				justify-content: space-between;
				border-bottom: 2rpx dashed #e5e5e5;
				padding-bottom: 20rpx;
				margin-bottom: 10rpx;

				.name {
					.real {
						font-weight: bold;
					}

					.tel {
						margin-left: 20rpx;
					}
				}

				.op {
					display: flex;
					font-size: .8em;

					.btn {
						min-width: 100rpx;
						text-align: center;
						padding: 5rpx 20rpx;
						margin-left: 20rpx;
						font-weight: 100;
						border-radius: 50rpx;
						background: linear-gradient(to left, rgba(255, 49, 80, 0.10), rgba(255, 100, 75, 0.10));
					}

					.btn.on {
						background: #FF3650;
						background: linear-gradient(to left, #FF624B, #FF3650);
						color: #fff;
					}
				}
			}

			.dl {
				display: flex;
				justify-content: space-between;
				line-height: 2;

				.dt {}

				.dd {
					opacity: .5;
				}
			}

		}
	}
</style>