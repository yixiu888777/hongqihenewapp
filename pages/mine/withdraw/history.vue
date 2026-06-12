<template>
	<view class="container" style="background:#c8131e url(/static/new/bg.jpg) no-repeat center top / 100%;">
		<headerView>
			<template #leftIcon><u-icon name="arrow-left" color="#fff" size="24"></u-icon></template>
			<view>交易明细</view>
		</headerView>
		<view class="m-btn">
			<view class="sbtn" :class="type == 1?'on':''" @click="onType(1)">充值记录</view>
			<view class="sbtn" :class="type == 2?'on':''" @click="onType(2)">提款记录</view>
			<view class="sbtn" :class="type == 3?'on':''" @click="onType(3)">转账记录</view>
		</view>
		<scroll-view scroll-y="true" @scrolltolower="scrollBottom" class="content" v-if="total > 0">
			<view class="list list1" v-if="type == 1">
				<view class="item" v-for="item in list" :key="item.id">
					<view class="dl">
						<view class="dt">时间</view>
						<view class="dd">{{item.time_str}}</view>
					</view>
					<view class="dl">
						<view class="dt">金额</view>
						<view class="dd" v-if="item.read_price > 0">{{item.read_price}}</view>
						<view class="dd" v-else>{{item.pay_money}}</view>
					</view>
					<view class="dl">
						<view class="dt">状态</view>
						<view class="succeed" v-if="item.status==4 || item.status==5">{{item.status_str}}</view>
						<view class="fail" v-else-if="item.status==2 || item.status==3">{{item.status_str}}</view>
						<view class="audit" v-else>{{item.status_str}}</view>
					</view>
					<view class="dl" v-if="!!item.admin_msg">
						<view class="dt">备注</view>
						<view class="dd">{{item.admin_msg}}</view>
					</view>
				</view>
			</view>
			<view class="list list2" v-if="type == 2">
				<view class="item" v-for="item in list" :key="item.id">
					<view class="dl">
						<view class="dt">时间</view>
						<view class="dd">{{item.time_str}}</view>
					</view>
					<view class="dl">
						<view class="dt">账号</view>
						<view class="dd">{{item.money_type_str}}</view>
					</view>
					<view class="dl">
						<view class="dt">金额</view>
						<view class="dd">{{item.price}}</view>
					</view>
					<view class="dl">
						<view class="dt">状态</view>
						<view class="succeed" v-if="item.status==4 || item.status==9">{{item.status_str}}</view>
						<view class="fail" v-else-if="item.status==2 || item.status==3 || item.status==10">
							{{item.status_str}}
						</view>
						<view class="audit" v-else>{{item.status_str}}</view>
					</view>
					<view class="dl" v-if="!!item.msg">
						<view class="dt">备注</view>
						<view class="dd">{{item.msg}}</view>
					</view>
				</view>
				<!-- <uni-load-more iconType="snow" :status="load.status" color="rgba(255,255,255,.5)" /> -->
			</view>
			<view class="list list2" v-if="type == 3">
				<view class="item" v-for="item in list" :key="item.id">
					<view class="dl">
						<view class="dt">时间</view>
						<view class="dd">{{item.time_str}}</view>
					</view>
					<view class="dl">
						<view class="dt">转账账号</view>
						<view class="dd">{{item.member_name}} / {{item.member_phone}}</view>
					</view>
					<view class="dl">
						<view class="dt">收款账号</view>
						<view class="dd">{{item.realname}} / {{item.phone}}</view>
					</view>
					<view class="dl">
						<view class="dt">金额</view>
						<view class="dd">{{item.price}}</view>
					</view>
					<view class="dl">
						<view class="dt">状态</view>
						<view class="succeed" v-if="item.type==1">{{item.status_str}}</view>
						<view class="fail" v-else-if="item.type==2">{{item.status_str}}</view>
						<view class="audit" v-else>{{item.status_str}}</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="m-noData" v-else>
			<u-empty mode="data"></u-empty>
		</view>
	</view>
</template>

<script>
	import {
		userWithdrawalRecordApi,
		userTransferRecordApi,
		userRechargeRecordApi
	} from '@/api/api.js'
	export default {
		data() {
			return {
				settingInfo: uni.getStorageSync('settingInfo'),
				UserInfo: uni.getStorageSync('user_info'),
				type: 1,
				page: 1,
				list: [],
				load: {
					status: 'loading', //more/loading/noMore
				},
				total: 0
			};
		},
		onLoad(e) {
			if (e.type) {
				this.type = e.type
			}
			this.loadData()
		},
		methods: {
			scrollBottom() {
				// console.log("scrollBottom")
				this.load.status = 'loading';
				this.page++
				this.loadData()
			},
			loadData() {
				if (this.type == 1) {
					// 充值
					userRechargeRecordApi({
						page: this.page
					}).then(res => {
						this.total = res.data.data.total
						let data = res.data.data.data
						if (data.length > 0) {
							this.list = [...this.list, ...data]
							this.load.status = 'more';
						} else {
							this.load.status = 'noMore';
							uni.$u.toast('数据加载完毕!')
							this.page--
						}
					})
				}
				if (this.type == 2) {
					// 提现
					userWithdrawalRecordApi({
						page: this.page
					}).then(res => {
						this.total = res.data.data.total
						let data = res.data.data.data
						if (data.length > 0) {
							this.list = [...this.list, ...data]
							this.load.status = 'more';
						} else {
							this.load.status = 'noMore';
							uni.$u.toast('数据加载完毕！')
							this.page--
						}
					})
				}
				if (this.type == 3) {
					// 转账
					userTransferRecordApi({
						page: this.page
					}).then(res => {
						this.total = res.data.data.total
						let data = res.data.data.data
						if (data.length > 0) {
							this.list = [...this.list, ...data]
							this.load.status = 'more';
						} else {
							this.load.status = 'noMore';
							uni.$u.toast('数据加载完毕！')
							this.page--
						}
					})
				}
			},
			onType(e) {
				this.type = e;
				this.list = [];
				this.loadData()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		.m-btn {
			display: flex;
			flex-wrap: wrap;
			gap: 30rpx;
			text-align: center;
			padding: 0 30rpx;
			.sbtn {
				background: rgba(255, 255, 255, .4);
				color: #fff;
				min-width: 180rpx;
				flex: 1;
				border-radius: 120rpx;
				padding: 20rpx;
			}
			.sbtn:active {
				opacity: .8;
			}
			.sbtn.on {
				background: rgba(255, 255, 255, 1);
				color: rgba(246, 42, 45, 1);
			}
		}
		.content {
			padding: 30rpx;
			display: flex;
			.list {
				flex: 1;
				.item {
					background: #fff;
					flex: 1;
					padding: 30rpx;
					margin: 0 auto 30rpx;
					border-radius: 20rpx;
					font-weight: 400;
					color: rgba(17, 24, 38, 1);
					.dl {
						display: flex;
						justify-content: space-between;
						padding: 10rpx 0;
						.dt {
							white-space: nowrap;
							font-weight: 500;
							line-height: 1.2;
						}
						.dd {
							color: rgba(105, 105, 105, 1);
							text-align: right;
							line-height: 1.2;
						}
					}
					.text {
						.title {
							font-size: 1.4em;
							font-weight: bold;
						}
						.time {}
					}
					.num {
						font-size: 1.6em;
						font-weight: bold;
						color: rgba(250, 60, 49, 1);
					}
					.succeed {
						color: rgba(7, 193, 96, 1);
					}
					.fail {
						color: rgba(250, 60, 49, 1);
					}
					.audit {
						color: rgba(255, 92, 0, 1);
					}
					.tips {
						color: rgba(111, 115, 116, 1);
					}
				}
			}
		}
		.m-noData {
			margin: 30rpx;
			background: #fff;
			border-radius: 20rpx;
			flex: 1;
		}
	}
</style>