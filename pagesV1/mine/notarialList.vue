<template>
	<view class="container" style="background:#c8131e url(/static/new/asset_bg.png) no-repeat center top / 100%;">
		<headerView>人气排行榜
			<template #leftIcon>
				<image src="@/static/mine/back.svg" mode="widthFix"></image>
			</template>
		</headerView>
		<view class="nav">
			<view class="item" :class="navIndex == index?'on':''" v-for="(item,index) in navList" :key="index" @click="onNav(index)">{{item.name}}</view>
		</view>
		<view class="reg" v-if="navIndex == 0">
			<image src="/static/new/bg.png" mode="widthFix"></image>
		</view>
		<view class="content" v-if="navIndex == 1">
			<view class="btnText flex_center">
				<view>激活人数：<span>{{totalUser}}</span>人</view>
			</view>
			<view class="card">
				<view class="card_header">

				</view>
				<view class="card_inner">
					<view class="card-title el1">激活人数TOP10</view>
					<view class="list">
						<view class="title">
							<view>排名</view>
							<view>手机号</view>
							<view>激活人数</view>
						</view>
						<view class="item" v-for="item in list" :key="item.member_id">
							<view class="item-ranking flex_center">
								<image src="@/static/mine/ranking1.svg" mode="widthFix" v-if="item.rank==1">
								</image>
								<image src="@/static/mine/ranking2.svg" mode="widthFix" v-else-if="item.rank==2">
								</image>
								<image src="@/static/mine/ranking3.svg" mode="widthFix" v-else-if="item.rank==3">
								</image>
								<view class="rangking flex_center" v-else>{{item.rank}}</view>
							</view>
							<view class="item-name el1">{{item.realname+item.phone}}</view>
							<view class="item-num">{{item.cnt}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		rankListApi
	} from '@/api/api.js'
	export default {
		data() {
			return {
				lists: [],
				navIndex: 0,
				navList:[
					{name:'注册排行榜'},
					{name:'激活排行榜'}
				]
			};
		},
		onLoad() {
			rankListApi().then(res => {
				this.totalUser = res.data.data.total_user
				this.list = res.data.data.list
			})
		},
		methods:{
			onNav(e){
				this.navIndex = e;
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
					background: url("/static/mine/rank_list.png") no-repeat center / 100%;

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
	.nav{ display: flex; justify-content: center; align-items: center; border-radius: 20rpx; overflow: hidden; margin: 0 150rpx 30rpx;
		.item{ padding: 20rpx 30rpx; background: rgba(243, 240, 241, .2); color: #fff; flex: 1; text-align: center;}
		.item.on{ background: #fff; color: rgba(246, 42, 45, 1); }
	}
	.reg{ background: #fff; padding: 30rpx; border-radius: 20rpx; margin: 0 30rpx 30rpx;
		image{ width: 100%; border-radius: 20rpx; }
	}
</style>