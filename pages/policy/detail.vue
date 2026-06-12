<template>
	<view class="container" style="background:#c8131e url(/static/new/bg.jpg) no-repeat center top / 100%;">
		<headerView>
			<template #leftIcon><u-icon name="arrow-left" color="#fff" size="24"></u-icon></template>
			<view>申购详情</view>
		</headerView>
		<view class="content">
			<view class="list">
				<view class="item">
					<view class="title">{{detail.pro_name}}</view>
					<view class="dl" v-for="(item2,index2) in detail.front_display" :key="index2">
						<view class="dt">{{item2.key}}</view>
						<view class="dd" :class="item2.key == '申购金额'? 'num':''">{{item2.value}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		productOrderDetailApi //申购记录
	} from '@/api/api.js'
	export default {
		data() {
			return {
				id: '',
				detail: {},
			};
		},
		onLoad(opt) {
			this.id = opt.id
			this.loadData()
		},
		methods: {
			loadData() {
				productOrderDetailApi({
					id: this.id
				}).then(res => {
					this.detail = res.data.data
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
					padding: 30rpx;
					border-radius: 20rpx;
					margin-bottom: 30rpx;
					.title {
						font-weight: bold;
						font-size: 1.2em;
						border-bottom: 2rpx dashed #e5e5e5;
						padding: 0 0 20rpx;
						margin-bottom: 20rpx;
					}
					.dl {
						display: flex;
						justify-content: space-between;
						align-items: center;
						padding: 20rpx;
						border-radius: 10rpx;
						line-height: 1;
						.dt {
							font-size: .8em;
							opacity: .8;
						}
						.dd {}
						.num {
							color: #ff3650;
						}
					}
					.dl:nth-child(odd) {
						background: linear-gradient(to left, rgba(247, 247, 247, .7), rgba(216, 216, 216, .3));
					}
				}
			}
		}
	}
</style>