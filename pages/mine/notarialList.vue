<template>
	<view class="container" style="background:#c8131e url(/static/new/asset_bg.png) no-repeat center top / 100%;">
		<headerView>
			<template #leftIcon><u-icon name="arrow-left" color="#fff" size="24"></u-icon></template>
			人气排行榜
		</headerView>
		<view class="nav">
			<view class="item" :class="navIndex == index?'on':''" v-for="(item,index) in navList" :key="index"
				@click="onNav(index)">{{item.name}}</view>
		</view>
		<view class="reg" v-if="navIndex == 0" @click="showImg(rank.register_rank)">
			<image :src="rank.register_rank" mode="widthFix"></image>
		</view>
		<view class="reg" v-if="navIndex == 1" @click="showImg(rank.active_rank)">
			<image :src="rank.active_rank" mode="widthFix"></image>
		</view>
	</view>
</template>

<script>
	import {
		servicesRankApi
	} from '@/api/api.js'
	export default {
		data() {
			return {
				rank: [],
				navIndex: 0,
				navList: [{
						name: '注册排行榜'
					},
					{
						name: '激活排行榜'
					}
				]
			};
		},
		onLoad() {
			servicesRankApi().then(res => {
				this.rank = res.data.data
			})
		},
		methods: {
			onNav(e) {
				this.navIndex = e;
			},
			showImg(e) {
				uni.previewImage({
					urls: [e],
					current: 0
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		min-height: 100vh;
		height: auto;

		.header {
			color: #fff;
		}

		.content {
			.btnText {
				margin: 0 auto 40rpx;

				&>view {
					padding: 8rpx 32rpx;
					border-radius: 120rpx;
					background: linear-gradient(90deg, #FFCB99 0%, #FFF2E7 52%, #FFCB99 100%);
					font-size: var(--font-12);
					font-weight: 400;
					line-height: 48rpx;
					color: rgba(149, 8, 4, 1);
				}
			}

			.card {
				width: 696rpx;
				margin: 40rpx auto 64rpx;

				.card_header {
					position: relative;
					width: 100%;
					height: 36rpx;

					// background: url("/static/mine/rank_list.png") no-repeat center / 100%;
					&::before {
						content: "";
						position: absolute;
						left: 50%;
						top: 50%;
						transform: translate(-50%, 0);
						background: linear-gradient(360deg, rgba(255, 251, 245, 0.1) 0%, #F5C897 100%);
						width: 630rpx;
						height: 30rpx;
					}
				}

				.card_inner {
					background: linear-gradient(270deg, #FFE3C9 0%, #FFFBF5 49%, #FFE3C9 100%);
					width: 630rpx;
					margin: -18rpx auto 0;
					padding-top: 30rpx;
					border-radius: 20rpx;

					.card-title {
						font-weight: 400;
						line-height: 48rpx;
						letter-spacing: 0.20000000298023224px;
						text-align: center;
						font-size: var(--font-18);
						color: rgba(149, 8, 4, 1);
					}

					.list {
						margin-top: 16rpx;
						padding: 0 16rpx 48rpx;

						.title {
							height: 80rpx;
							display: grid;
							grid-template-columns: 1fr 1.5fr 1fr;
							font-family: Roboto;
							font-size: var(--font-12);
							font-weight: 400;
							line-height: 80rpx;
							text-align: center;
							color: rgba(104, 3, 2, 1);
						}

						.item {
							height: 80rpx;
							display: grid;
							grid-template-columns: 1fr 1.5fr 1fr;
							font-family: Roboto;
							font-weight: 400;
							color: rgba(0, 0, 0, 1);
							line-height: 80rpx;

							.item-ranking {
								&>image {
									width: 64rpx;
									margin: 0 auto;
								}

								.rangking {
									width: 44rpx;
									height: 44rpx;
									margin: 0 auto;
									border-radius: 50%;
									border: 2rpx solid rgba(146, 7, 4, 1);
									font-size: var(--font-12);
									color: rgba(146, 7, 4, 1);
									font-size: var(--font-12);
								}
							}

							.item-name {
								font-size: var(--font-12);
								text-align: center;
							}

							.item-num {
								font-size: var(--font-12);
								font-weight: 700;
								color: rgba(104, 3, 2, 1);
								text-align: center;
							}
						}
					}
				}
			}
		}
	}

	.nav {
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 20rpx;
		overflow: hidden;
		margin: 0 150rpx 30rpx;

		.item {
			padding: 20rpx 30rpx;
			background: rgba(243, 240, 241, .2);
			color: #fff;
			flex: 1;
			text-align: center;
		}

		.item.on {
			background: #fff;
			color: rgba(246, 42, 45, 1);
		}
	}

	.reg {
		background: #fff;
		padding: 30rpx;
		border-radius: 20rpx;
		margin: 0 30rpx 30rpx;

		image {
			width: 100%;
			border-radius: 20rpx;
		}
	}
</style>