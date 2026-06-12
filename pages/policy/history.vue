<template>
	<view class="container" style="background:#c8131e url(/static/new/bg.jpg) no-repeat center top / 100%;">
		<headerView>
			<template #leftIcon><u-icon name="arrow-left" color="#fff" size="24"></u-icon></template>
			<view>申购记录</view>
		</headerView>
		<view class="content">
			<view class="list">
				<view class="item" v-for="(item,index) in list" :key="index">
					<view class="title">
						<view class="dt">项目名称</view>
						<view class="dd">{{item.pro_name}}</view>
					</view>
					<view class="dl">
						<view class="dt">金额</view>
						<view class="dd">{{item.price}}</view>
					</view>
					<view class="dl">
						<view class="dt">状态</view>
						<view class="dd">{{item.status_name}}</view>
					</view>
					<view class="dl">
						<view class="dt">时间</view>
						<view class="dd">{{item.createtime}}</view>
					</view>
					<view class="btn" @click="$utils.toPage(`/pages/policy/buy?id=${item.product_id}&pid=${item.id}`)">
						查看详情</view>
				</view>
				<uni-load-more iconType="snow" :status="load.status" color="rgba(255,255,255,.5)" />
			</view>
		</view>
	</view>
</template>

<script>
	import {
		productOrderApi //申购记录
	} from '@/api/api.js'
	export default {
		data() {
			return {
				page: 1,
				list: [],
				load: {
					status: 'loading', //more/loading/noMore
				},
				total: 0
			};
		},
		onLoad() {
			this.getOrderList()
		},
		onReachBottom() {
			// 上拉触底时
			// console.log("sss")
			this.scrollBottom()
		},
		methods: {
			scrollBottom() {
				this.page++
				this.load.status = 'loading';
				this.getOrderList()
			},
			getOrderList() {
				productOrderApi({
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
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		height: auto;
		min-height: 100vh;

		.content {
			padding: 0 30rpx 30rpx;
			display: flex;

			.list {
				flex: 1;

				.item {
					background: #fff;
					border-radius: 20rpx;
					margin-bottom: 30rpx;
					padding: 0 0 1rpx;

					.title {
						display: flex;
						justify-content: space-between;
						border-bottom: 2rpx solid #e5e5e5;
						padding: 30rpx;
						margin-bottom: 20rpx;

						.dt {
							font-weight: bold;
							font-size: 1.2em;
						}

						.dd {}
					}

					.dl {
						display: flex;
						justify-content: space-between;
						align-items: center;
						padding: 20rpx 30rpx;
						border-radius: 10rpx;
						line-height: 1;

						.dt {
							font-weight: 500;
						}

						.dd {
							opacity: .8;
						}

						.num {
							color: #ff3650;
						}
					}

					// .dl:nth-child(odd) {
					// 	background: linear-gradient(to left, rgba(247, 247, 247, .7), rgba(216, 216, 216, .3));
					// }
					.btn {
						background: rgba(246, 42, 45, 1);
						color: #fff;
						border-radius: 20rpx;
						text-align: center;
						padding: 20rpx;
						margin: 30rpx;
						font-weight: bold;
					}
				}
			}
		}
	}
</style>