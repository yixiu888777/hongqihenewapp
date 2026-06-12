<!-- 有用 -->
<template>
	<view class="container" style="background:#c8131e url(/static/new/bg.jpg) no-repeat center top / 100%;">
		<headerView>
			<template #leftIcon><u-icon name="arrow-left" color="#fff" size="24"></u-icon></template>
			<view>{{title_name}}</view>
		</headerView>
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
			<view class="level2">
				<view class="item">
					<view class="dl title">
						<view class="dt"> </view>
						<view class="dd">一级</view>
						<view class="dd">二级</view>
						<view class="dd">三级</view>
					</view>
					<view class="dl">
						<view class="dt">注册人数</view>
						<view class="dd">{{TeamInfo.first_req}}</view>
						<view class="dd">{{TeamInfo.two_req}}</view>
						<view class="dd">{{TeamInfo.three_req}}</view>
					</view>
					<view class="dl">
						<view class="dt">有效人数</view>
						<view class="dd">{{TeamInfo.first_auth}}</view>
						<view class="dd">{{TeamInfo.two_auth}}</view>
						<view class="dd">{{TeamInfo.three_auth}}</view>
					</view>
					<view class="dl">
						<view class="dt">激活人数</view>
						<view class="dd">{{TeamInfo.first_active}}</view>
						<view class="dd">{{TeamInfo.two_active}}</view>
						<view class="dd">{{TeamInfo.three_active}}</view>
					</view>
					<view class="dl">
						<view class="dt">绩效金额</view>
						<view class="dd">{{TeamInfo.first_amount}}</view>
						<view class="dd">{{TeamInfo.two_amount}}</view>
						<view class="dd">{{TeamInfo.three_amount}}</view>
					</view>


				</view>
				<!-- <uni-load-more iconType="snow" :status="loadStatus"></uni-load-more> -->
			</view>
			<view class="list">
				<view class="dl">
					<view class="item dt">
						<view class="name">姓名</view>
						<view class="phone">账户</view>
						<view class="time">时间</view>
						<view class="price">金额</view>
					</view>
					<view class="item dd" v-for="(item,index) in lists" :key="index">
						<view class="name">{{item.realname}}</view>
						<view class="phone">{{item.phone}}</view>
						<view class="time">{{item.createtime}}</view>
						<view class="price">{{item.price}}</view>
					</view>
					<uni-load-more iconType="snow" :status="loadStatus"></uni-load-more>
				</view>
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
				title_name: '团队详情'
			}
		},
		onLoad(opt) {
			if (opt.level) {
				this.level = Number(opt.level)
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
					page: this.page,
					type: 2
				}).then(res => {
					// this.lists = res.data.data.data
					// console.log("---",this.lists)
					let list = res.data.data.data
					// if (data.length > 0) {
					// 	this.lists = [...this.lists, ...data]
					// 	this.loadStatus = 'more';
					// } else {
					// 	this.loadStatus = 'noMore';
					// 	uni.$u.toast('数据加载完毕!')
					// 	this.page--
					// }
					this.lists = this.page === 1 ? list : [...this.lists, ...list];
					this.loadStatus = res.data.data.last_page > this.page ? 'more' : 'nomore';
				})
			},
			onLevel(e) {
				this.page = 1
				this.lists = []
				this.level = e;
				this.getList();
			}
		}
	}
</script>


<style lang="scss" scoped>
	.container {
		min-height: 100vh;
		height: auto;
	}

	.main {
		padding: 0 30rpx 30rpx;
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
			padding: 20rpx 0;
			overflow: hidden;
			flex: 1;
			position: relative;

			.desc {
				font-size: .8em;
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

	.level2 {
		background: #fff;
		border-radius: 20rpx;
		margin-bottom: 30rpx;

		.dl {
			display: flex;
			padding: 30rpx;
			border-bottom: 1rpx solid #eee;

			.dt {
				width: 25%;
			}

			.dd {
				width: 25%;
				color: #f00;
			}
		}

		.dl:last-child {
			border-bottom: none;
		}

		.title {
			font-weight: bold;

			.dd {
				color: #000;
			}
		}
	}

	.list {
		background: #fff;
		border-radius: 20rpx;
		margin-bottom: 30rpx;

		.item {
			padding: 30rpx 40rpx;
			border-bottom: 1rpx solid #eee;
			display: flex;
			align-items: center;
			text-align: left;

			.name {
				flex: none;
				width: 100rpx;
			}

			.phone {
				flex: none;
				width: 200rpx;
				overflow: hidden;
			}

			.time {
				flex: none;
				width: 200rpx;
			}

			.price {
				flex: 1;
			}
		}

		.dt {
			padding: 30rpx;
			font-weight: bold;
		}

		.dd {
			margin: 0 30rpx;
			padding: 50rpx 0;
			font-size: .9em;
		}
	}
</style>