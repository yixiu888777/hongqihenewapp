<template>
	<view class="container">
		<view :style="{background: `url(${withthreeInfo.withnew3_bgimage}) no-repeat top / 100%`}">
			<headerView>缴纳</headerView>
			<view class="content_header flex">
				<view class="_title">{{settingInfo.withnew3_bg_title1}}</view>
				<view class="_tip">{{settingInfo.withnew3_bg_title2}}</view>
			</view>
		</view>
		<view class="content">
			<view class="title col_center">
				<view class="price">{{ withthreeInfo.total_money }}<text>元</text></view>
				<view>您的总资产余额</view>
			</view>
			<view class="form">
				<view>提现手续费</view>
				<view class="li flex_between" v-for="item in rateList" :key="item.id">
					<view>{{ item.title }}</view>
					<view class="flex_center">
						<view class="li-box flex_center" :class="rateId==item.id?'active':''">
							<view></view>
						</view>
					</view>
				</view>
			</view>
			<view class="rule" v-if="!!settingInfo.withnew3_txjn_rule">
				<view class="rule_title">温馨提示</view>
				<view v-html="settingInfo.withnew3_txjn_rule"></view>
			</view>
		</view>
		
		<view class="footer col_center">
			<view class="button" @click="withdrawal">确定</view>
			<view class="footer-tips">无法认证请联系<span @click="toLoads(settingInfo.service.service_url)">在线客服</span></view>
		</view>
		
		<!-- 提示 -->
		<u-popup :show="tipsInfo.show" mode="center" round="32">
			<view class="van-dialog">
				<view class="van-dialog__header">提示</view>
				<view class="van-dialog__content" v-html="tipsInfo.tips"></view>
				<view class="van-dialog__footer">
					<view class="button" @click="toMine">确定</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import { houseWiththreeApi, withdrawalApi } from '@/api/api.js'
	export default {
		data() {
			return {
				settingInfo: uni.getStorageSync('settingInfo'),
				withthreeInfo: {},
				rateId: null,
				rateList: [],
				tipsInfo: {
					show: false,
					tips: '',
					status: null
				}
			};
		},
		onLoad(opt) {
			houseWiththreeApi().then(res=> {
				let info = res.data.data
				
				this.rateId = info.xuanzhong
				this.withthreeInfo = info
				this.rateList = info.rateList
				
				if(info.status == 4 || info.status == 5){
					this.tipsInfo.show = true
					this.tipsInfo.tips = info.tips
					this.tipsInfo.status = info.status
				}
			})
		},
		methods: {
			// 去在线客服页
			toLoads(url) {
				uni.navigateTo({
					url: `/pages/noPage/index?url=${url.split("&").join("$")}`
				})
			},
			toMine(){
				uni.reLaunch({
					url: '/pages/mine/mine'
				})
			},
			withdrawal(){
				this.$utils.throttle(() => {
					withdrawalApi({
						...uni.getStorageSync('withdrawForm')
					}).then(res=> {
						uni.removeStorageSync('withdrawForm')
						let info = res.data.data
						this.tipsInfo = {
							show: true,
							tips: info.tips,
							status: info.status
						}
						// houseWiththreeApi().then(res=> {
						// 	let info = res.data.data
						// 	if(info.status == 4 || info.status == 5){
						// 		this.tipsInfo.show = true
						// 		this.tipsInfo.tips = info.tips
						// 		this.tipsInfo.status = info.status
						// 	}
						// })
					})
				}, 1000)()
			}
		}
	}
</script>

<style lang="scss">
	.container {
		display: block;
		height: auto;
		min-height: 100vh;
		background: linear-gradient(180deg, #FFFFFF 5%, #D42410 25.86%, #F2E7DF 100%);
		
		.header {
			position: absolute;
			left: 0;
			top: var(--status-bar-height);
			z-index: 3;
		}
		
		.content_header {
			height: calc(374rpx - var(--status-bar-height));
			position: relative;
			z-index: 2;
			justify-content: center;
			align-items: flex-end;
			padding-right: 60rpx;
			flex-direction: column;
			line-height: 40rpx;
			font-family: Roboto;
			color: rgba(177, 35, 39, 1);
		
			._title {
				font-size: var(--font-20);
				font-weight: 700;
				margin-bottom: 12rpx;
			}
		
			._tip {
				font-size: var(--font-14);
				font-weight: 400;
			}
		}

		.content {
			padding: 32rpx;
			margin: 44rpx auto 180rpx;
			
			.title {
				font-family: Manrope;
				font-weight: 500;
				font-size: 28rpx;
				line-height: 48rpx;
				letter-spacing: 0.2px;
				text-align: center;
				color: #FFFFFF;
				margin: 20rpx auto 40rpx;
				
				.price {
					font-weight: 700;
					font-size: 48rpx;
					
					text {
						font-weight: 500;
						font-size: 28rpx;
					}
				}
			}
			
			.form {
				margin: 20rpx auto;
				font-family: Manrope;
				font-weight: 500;
				font-size: 28rpx;
				line-height: 48rpx;
				letter-spacing: 0.2px;
				color: #FFFFFF;
				
				.li {
					height: 96rpx;
					margin: 16rpx 0 0;
					padding: 24rpx 32rpx;
					border-radius: 20rpx;
					background: rgba(255, 255, 255, 1);
					box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.05);
					font-size: var(--font-14);
					font-weight: 500;
					color: rgba(17, 24, 38, 1);
				
					.li-box {
						width: 36rpx;
						height: 36rpx;
						border-radius: 36rpx;
						border: 2rpx solid rgba(177, 177, 177, 1);
					}
				
					.active {
						border: 2rpx solid rgba(250, 60, 49, 1);
				
						&>view {
							width: 24rpx;
							height: 24rpx;
							border-radius: 24rpx;
							background: rgba(250, 60, 49, 1);
						}
					}
				}
			}
			
			.rule {
				margin: 20rpx auto;
				font-family: Roboto;
				font-weight: 500;
				font-size: 28rpx;
				line-height: 44rpx;
				letter-spacing: 0px;
				color: #FFFFFF;
				
				.rule_title {
					line-height: 32rpx;
					margin-bottom: 16rpx;
				}
			}
		}
		
		.footer {
			padding: 20rpx 0;
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			
			.button {
				width: 686rpx;
				height: 100rpx;
				border-radius: 120rpx;
				font-weight: 600;
				font-size: 32rpx;
			}
			
			.footer-tips {
				font-family: Roboto;
				font-size: var(--font-12);
				font-weight: 400;
				line-height: 40rpx;
				color: rgba(133, 133, 151, 1);
				margin-top: 8rpx;
		
				span {
					margin-left: 10rpx;
					color: rgba(243, 62, 49, 1);
				}
			}
		}
		
		.van-dialog {
			width: 560rpx;
			padding: 48rpx 32rpx;
			border-radius: 32rpx;
			background: url("/static/mine/popup_bg.svg") no-repeat left top / 100%;
			background-color: rgba(255, 255, 255, 1);
			font-family: Roboto;
			font-weight: 400;
			line-height: 40rpx;
			text-align: center;
			color: rgba(27, 28, 30, 1);
		
			.van-dialog__header {
				font-size: var(--font-15);
				color: rgba(210, 17, 15, 1);
				font-weight: 700;
			}
		
			.van-dialog__content {
				margin: 32rpx auto;
				font-size: var(--font-14);
				line-height: 42rpx;
			}
		
			.van-dialog__footer {
				display: flex;
				align-items: center;
				justify-content: space-between;
		
				.button {
					flex: 1;
					height: 80rpx;
					font-size: var(--font-14);
				}
			}
		}
	}
</style>