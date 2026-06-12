<template>
	<view class="container">
		<headerView>官方直播
			<template #leftIcon>
				<image src="@/static/mine/back.svg" mode="widthFix"></image>
			</template>
		</headerView>
		<view class="content">
			<view class="c_header">
				<view class="p1">{{settingInfo.service_title_1}}</view>
				<view class="p2">{{settingInfo.service_title_2}}</view>
			</view>
			<view class="info">
				<view class="titel flex_center">
					<view class="title-left"></view>
					<view>直播间入口</view>
					<view class="title-right"></view>
				</view>
				<view class="item" v-if="!!settingInfo.zhibo_url_1" @click="toLoads(settingInfo.zhibo_url_1)">
					<view class="item-title">{{settingInfo.zhibo_title_1}}</view>
					<view>{{settingInfo.zhibo_url_1}}</view>
				</view>
				<view class="item" v-if="!!settingInfo.zhibo_url_2" @click="toLoads(settingInfo.zhibo_url_2)">
					<view class="item-title">{{settingInfo.zhibo_title_2}}</view>
					<view>{{settingInfo.zhibo_url_2}}</view>
				</view>
				<view class="item" v-if="!!settingInfo.zhibo_url_3" @click="toLoads(settingInfo.zhibo_url_3)">
					<view class="item-title">{{settingInfo.zhibo_title_3}}</view>
					<view>{{settingInfo.zhibo_url_3}}</view>
				</view>
				<view class="item" v-if="!!settingInfo.zhibo_url_4" @click="toLoads(settingInfo.zhibo_url_4)">
					<view class="item-title">{{settingInfo.zhibo_title_4}}</view>
					<view>{{settingInfo.zhibo_url_4}}</view>
				</view>
				<view class="tips">
					<view class="title">温馨提示</view>
					<view v-html="settingInfo.zhibo_tips"></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		commonBannerApi
	} from '@/api/api.js'
	import nVideo from '@/components/nVideo.vue'
	export default {
		components: {
			nVideo
		},
		data() {
			return {
				settingInfo: uni.getStorageSync('settingInfo'),
				swiperList: [],
				isBo: false,
				isPaly: false,
			};
		},
		onLoad() {
			// 轮播图
			commonBannerApi({
				cate: 3
			}).then(res => {
				this.swiperList = res.data.data
				this.swiperList.forEach(item => {
					if (item.type == 2) {
						item.type = "video"
					} else {
						item.type = "image"
					}
				})
			})
		},
		methods: {
			// 跳转在线客服
			toLoads(url) {
				// #ifndef APP-PLUS
				window.open(url)
				// #endif
				// #ifdef APP-PLUS
				uni.navigateTo({
					url: `/pages/noPage/index?url=${url.split("&").join("$")}`
				})
				// #endif
			},
		}
	}
</script>

<style lang="scss">
	.container {
		background: url("/static/mine/live_bg.svg") no-repeat center top / 100%;
		background-color: rgba(212, 36, 16, 1);

		.header {
			color: #fff;
		}

		.content {
			.c_header {
				padding: 0 32rpx 52rpx;
				font-weight: 700;
				line-height: 40rpx;
				color: rgba(255, 255, 255, 1);

				.p1 {
					font-size: 44rpx;
					line-height: 48rpx;
				}

				.p2 {
					margin-top: 20rpx;
					font-size: var(--font-16);
				}
			}

			.banner {
				width: 750rpx;
				height: 380rpx;

				.swiper {
					height: 380rpx;

					::v-deep.uni-swiper-dot-active {
						width: 60rpx !important;
						border-radius: 80rpx !important;
					}

					image,
					#myVideo {
						width: 750rpx;
						height: 100%;
					}

					.col_center {
						width: 100%;
						height: 100%;
						background-color: rgba(0, 0, 0, .6);
					}
				}
			}

			.info {
				padding: 24rpx 32rpx;

				.titel {
					font-family: Roboto;
					font-size: var(--font-16);
					font-weight: 700;
					line-height: 40rpx;
					color: rgba(255, 255, 255, 1);

					.title-left {
						width: 132rpx;
						height: 2rpx;
						background: linear-gradient(90deg, #FFFFFF 0%, #D42410 100%);
						margin-right: 32rpx;
					}

					.title-right {
						width: 132rpx;
						height: 2rpx;
						background: linear-gradient(90deg, #D42410 0%, #FFFFFF 100%);
						margin-left: 32rpx;
					}
				}

				.item {
					width: 686rpx;
					padding: 32rpx 20rpx;
					border-radius: 20rpx;
					background: linear-gradient(180deg, #F6CBCA 0%, #F6CBCA 3.78%, #FFFFFF 26.05%);
					border-top: 1px solid rgba(255, 255, 255, 1);
					box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.05);
					margin-top: 32rpx;
					font-family: Roboto;
					font-size: var(--font-14);
					font-weight: 400;
					line-height: 32rpx;
					text-align: center;
					color: rgba(51, 51, 51, 1);
					word-wrap: break-word;

					.item-title {
						width: 552rpx;
						height: 80rpx;
						border-radius: 140rpx;
						border: 2rpx solid rgba(250, 60, 49, 1);
						font-size: var(--font-16);
						font-weight: 400;
						line-height: 80rpx;
						text-align: center;
						color: rgba(250, 60, 49, 1);
						margin: 0 auto 32rpx;
					}
				}

				.tips {
					font-family: Roboto;
					font-size: var(--font-13);
					font-weight: 500;
					line-height: 44rpx;
					color: rgba(255, 255, 255, 1);
					margin-top: 32rpx;

					.title {
						font-size: var(--font-12);
						line-height: 32rpx;
						color: rgba(255, 255, 255, 1);
						margin-bottom: 16rpx;
					}
				}
			}
		}
	}
</style>