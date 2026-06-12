<!-- 有用 -->
<template>
	<view class="container" style="background:#c8131e url(/static/new/bg.jpg) no-repeat center top / 100%;">
		<headerView>
			<template #leftIcon><u-icon name="arrow-left" color="#fff" size="24"></u-icon></template>
			<view>团队详情</view>
		</headerView>
		<view class="main">
			<view class="level">
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
			<view class="list">
				<view class="item dt">
					<view class="dd phone">账号</view>
					<view class="dd name">姓名</view>
					<view class="dd str">状态</view>
					<view class="dd time">时间</view>
				</view>
				<view class="item" v-for="(item,index) in TeamInfo" :key="index">
					<view class="dd phone">{{item.phone}}</view>
					<view class="dd name">{{item.realname}}</view>
					<view class="dd str" :class="item.is_auth == 1?'real':''">{{item.is_auth_str}}</view>
					<view class="dd time">{{item.create_time}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getTeamListAPI
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
			// this.loadStatus = 'loading';
			// this.page++
			// this.loadData();
		},
		methods: {
			async loadData() {
				getTeamListAPI({
					level: this.level
				}).then(res => {
					this.TeamInfo = res.data.data.list;
					this.isPageShow = true;
				})
			},
			onLevel(e) {
				this.lists = []
				this.level = e;
				this.loadData();
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
			padding: 20rpx;
			overflow: hidden;
			flex: 1;
			position: relative;

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
		background: #fff;
		border-radius: 20rpx;

		.item {
			padding: 30rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 2rpx solid #e5e5e5;
			text-align: left;

			.dd {
				line-height: 1;
				flex: none;
			}

			.phone {
				width: 200rpx;
			}

			.name {
				width: 150rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				text-align: center;
			}

			.str {
				width: 150rpx;
				text-align: center;
				color: rgba(246, 42, 45, 1);
			}

			.str.real {
				color: rgba(7, 193, 96, 1);
			}

			.time {
				font-size: .8em;
				width: 150rpx;
				text-align: center;
				color: #999;
			}
		}

		.dt {
			color: #999;

			.str {
				color: #999;
			}
		}

		.item:last-child {
			border-bottom: none;
		}
	}
</style>