<template>
	<view class="page">
		<headerView class="white">
			<template #leftIcon><u-icon name="arrow-left" color="#000" size="24"></u-icon></template>
			<view>积分账单</view>
		</headerView>

		<scroll-view scroll-y="true" @scrolltolower="scrollBottom" class="content" v-if="list.length > 0">
			<view class="item" v-for="(item,index) in list" :key="index">
				<image :src="item.product_image" class="gift-image"></image>
				<view class="detail">
					<view class="detail-top">
						<view class="name">{{item.product_name}}</view>
						<view class="price">{{item.points}}</view>
					</view>
					<view class="detail-bottom">
						<view>积分换商品</view>
						<view>{{item.createtime}}</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="empty" v-else>
			<u-empty mode="data"></u-empty>
		</view>
	</view>
</template>

<script>
	import { pointsOrderAPI } from '@/api/api.js'
	export default {
		data() {
			return {
				page: 1,
				list: []
			};
		},
		onLoad() {
			this.loadData()
		},
		onReachBottom() {
			this.page++
			this.loadData();
		},
		methods: {
			loadData() {
				pointsOrderAPI({ page: this.page }).then(res => {
					let temp = res.data.data.data
					if (temp.length > 0) {
						this.list = [...this.list, ...temp]
					} else {
						this.page--
						uni.$u.toast('数据加载完毕!')
					}
				})
			},
			scrollBottom() {
				this.page++
				this.getSignReward()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		.content {
			padding: 30rpx;
			.item {
				padding: 30rpx;
				background: #fff;
				display: flex;
				margin-bottom: 30rpx;
				border-radius: 20rpx;
				font-size: 30rpx;
				.gift-image {
					width: 120rpx;
					height: 120rpx;
					border-radius: 20rpx;
				}
				.detail {
					flex: 1;
					margin-left: 30rpx;
					.detail-top {
						display: flex;
						justify-content: space-between;
						.name {
							font-weight: bold;
							span {
								margin-left: 15rpx;
								font-size: 28rpx;
							}
						}
						.status {
							font-size: 26rpx;
							color: #4DBB88;
						}
						.status.on {
							color: rgba(209, 0, 31, 1);
						}
					}
					.price {
						color: rgba(209, 0, 31, 1);
						font-weight: bold;
					}
					.detail-bottom {
						display: flex;
						justify-content: space-between;
						margin-top: 20rpx;
						font-size: 24rpx;
						color: #A5A5A5;
					}
				}
			}
		}
	}
	.empty {
		padding: 500rpx 0;
	}
</style>