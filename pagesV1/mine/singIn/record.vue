<template>
	<view class="container">
		<view class="content">
			<view class="title">
				<view class="cell">姓名</view>
				<view class="cell">手机号</view>
				<view class="cell">奖品</view>
			</view>
			<scroll-view scroll-y @scrolltolower="scrollBottom" class="list">
				<view class="item" v-for="(item,index) in list" :key="index">
					<view class="cell">{{item.realname}}</view>
					<view class="cell">{{item.phone}}</view>
					<view class="cell">{{item.tips}}</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import { signRewardApi } from '@/api/api.js'
	export default {
		data() {
			return {
				page: 1,
				list: []
			};
		},
		onLoad() {
			this.getSignReward()
		},
		methods: {
			getSignReward() {
				signRewardApi({
					page: this.page
				}).then(res => {
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

<style lang="scss">
	.container {
		.content {
			padding: 30rpx 0; margin: 30rpx 0;
			
			.title {
				background-color: rgba(255, 255, 255, .7); font-weight: bold;
				height: 80rpx;
				padding: 20rpx 0px;
				font-family: Roboto;
				font-size: var(--font-14);
				font-weight: 400;
				// line-height: 80rpx;
				letter-spacing: 0.4000000059604645px;
				text-align: center;
				color: rgba(133, 133, 151, 1);
				display: grid;
				grid-template-columns: 1fr 1fr 2fr;
				
				.cell {
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}

			.list {
				width: 100%;
				height: 100%;
				box-sizing: border-box;

				.item { border-top: 1px solid rgba(0, 0, 0, .1);
					height: 92rpx; background-color: rgba(255, 255, 255, .7);
					font-family: Roboto;
					font-size: var(--font-14);
					font-weight: 400;
					// line-height: 92rpx;
					letter-spacing: 0.4000000059604645px;
					text-align: center;
					color: #222222;
					display: grid;
					grid-template-columns: 1fr 1fr 2fr;
				
					.cell {
						display: flex;
						align-items: center;
						justify-content: center;
					}
				}
			}
		}

	}
</style>