<template>
	<view class="container" style="background:#c8131e url(/static/new/bg.jpg) no-repeat center top / 100%;">
		<headerView>
			<template #leftIcon><u-icon name="arrow-left" color="#fff" size="24"></u-icon></template>
			<view>交易明细</view>
		</headerView>
		<view class="m-btn">
			<view class="sbtn" @tap="$utils.toPage('/pages/mine/recharge/history')">充值记录</view>
			<view class="sbtn" @tap="$utils.toPage('/pages/mine/withdraw/history')">提款记录</view>
			<view class="sbtn on" @tap="$utils.toPage('/pages/mine/transfer/history')">转账记录</view>
		</view>
		<scroll-view scroll-y="true" @scrolltolower="scrollBottom" class="content" v-if="list.length > 0">
			<view class="item" v-for="item in list" :key="item.id">
				<view class="flex_between">
					<view class="text">
						<view class="realname"><text class="name">{{item.realname}}</text>  / {{item.phone}}</view>
						<view class="time">{{item.time_str}}</view>
					</view>
					<view class="price">{{item.price}}
						<view class="status">{{item.status_str}}</view>						
					</view>
				</view>
			</view>
			<!-- <uni-load-more iconType="snow" :status="load.status" color="rgba(0,0,0,.3)" /> -->
		</scroll-view>
		<view class="m-noData" v-else>
			<u-empty mode="data"></u-empty>
		</view>
	</view>
</template>

<script>
	import {
		userTransferRecordApi
	} from '@/api/api.js'
	export default {
		data() {
			return {
				settingInfo: uni.getStorageSync('settingInfo'),
				page: 1,
				list: [],
				load:{
					status: 'loading', //more/loading/noMore
				},
			};
		},
		onLoad() {
			this.getTransferList()
		},
		methods: {
			scrollBottom() {
				this.load.status = 'loading';
				this.page++
				this.getTransferList()
			},
			getTransferList() {
				userTransferRecordApi({
					page: this.page
				}).then(res => {
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
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		.m-btn{ display: flex; flex-wrap: wrap; gap: 30rpx; text-align: center; padding: 0 30rpx;
			.sbtn{ background: rgba(255, 255, 255, .4); color: #fff; min-width: 180rpx; flex: 1; border-radius: 20rpx; padding:20rpx;}
			.sbtn:active{ opacity: .8;}
			.sbtn.on{ background: rgba(255, 255, 255, 1); color: rgba(246, 42, 45, 1);}
		}
		.content { padding:30rpx; 
			.item { background: #fff; border-radius: 20rpx; padding: 30rpx; margin-bottom: 30rpx; font-size: .8em;
				font-weight: 400;
				line-height: 48rpx;
				color: rgba(17, 24, 38, 1);
				.name { font-weight: bold;
					color: rgba(17, 24, 38, 1);
				}
				.price { text-align: center;
					color: rgba(250, 60, 49, 1);
					.status{
						color: #999;
					}
				}
				.time {
					color: rgba(17, 24, 38, 1);
				}
			}
		}
		.m-noData{ margin: 30rpx; background: #fff; border-radius: 20rpx; flex: 1;}
	}
</style>