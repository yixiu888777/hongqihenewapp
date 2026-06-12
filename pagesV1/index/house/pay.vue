<template>
	<view class="container">
		<view :style="{background: `url(${houseInfo.withnew3_bgimage}) no-repeat top / 100%`}">
			<headerView>缴纳</headerView>
			<view class="content_header flex">
				<view class="_title">{{settingInfo.withnew3_bg_title1}}</view>
				<view class="_tip">{{settingInfo.withnew3_bg_title2}}</view>
			</view>
		</view>
		<view class="content">
			<view class="title" v-html="settingInfo.withnew3_bg_title3"></view>
			<view class="form">
				<view>选择缴纳方式</view>
				<view class="form_input flex">正常缴纳</view>
			</view>
			<view class="rule" v-if="!!settingInfo.withnew3_fcjn_rule">
				<view class="rule_title">温馨提示</view>
				<view v-html="settingInfo.withnew3_fcjn_rule"></view>
			</view>
		</view>
		
		<view class="footer col_center">
			<view class="button" @click="getHouseInfo">确定</view>
			<view class="footer-tips">无法认证请联系<span @click="toLoads(settingInfo.service.service_url)">在线客服</span></view>
		</view>
		
		<!-- 提示 -->
		<u-popup :show="show" mode="center" round="32" @close="show = false">
			<view class="van-dialog">
				<view class="van-dialog__header">提示</view>
				<view class="van-dialog__content" v-html="houseInfo.status==0?houseInfo.jn_tips:houseInfo.tips"></view>
				<view class="van-dialog__footer">
					<view class="button" v-if="houseInfo.status == 1" @click="toIndex()">确定</view>
					<view class="button" v-else-if="houseInfo.status == 2" @click="$utils.toPage('/pages/mine/recharge/recharge')">去充值</view>
					<view class="button" v-else-if="houseInfo.status == 0" @click="houseWiththreeJiaona">确定</view>
					<view class="button" v-else @click="show=false">确定</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import { houseWiththreeApi, houseWiththreeJiaonaApi } from '@/api/api.js'
	export default {
		data() {
			return {
				settingInfo: uni.getStorageSync('settingInfo'),
				houseInfo: {},
				show: false
			};
		},
		onLoad() {
			houseWiththreeApi().then(res=> {
				this.houseInfo = res.data.data
			})
		},
		methods: {
			// 去在线客服页
			toLoads(url) {
				uni.navigateTo({
					url: `/pages/noPage/index?url=${url.split("&").join("$")}`
				})
			},
			toIndex(){
				uni.reLaunch({
					url: '/pages/index/index'
				})
			},
			getHouseInfo(){
				houseWiththreeApi().then(res=> {
					this.houseInfo = res.data.data
					if(this.houseInfo.status == 0 || this.houseInfo.status == 1){
						this.show = true
					}
				})
			},
			houseWiththreeJiaona(){
				this.$utils.throttle(() => {
					houseWiththreeJiaonaApi().then(res => {
						this.houseInfo.tips = res.data.msg
						this.houseInfo.status = 1
						this.show = true
					}).catch(err => {
						if(err.data.code == -99){
							this.houseInfo.tips = err.data.msg
							this.houseInfo.status = 2
							this.show = true
						}
					})
				}, 2000)()
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
			margin: 44rpx auto 0;
			
			.title {
				font-family: Manrope;
				font-weight: 700;
				font-size: 32rpx;
				line-height: 48rpx;
				letter-spacing: 0.2px;
				color: #FFFFFF;
				margin: 20rpx auto 40rpx;
			}
			
			.form {
				margin: 20rpx auto;
				font-family: Manrope;
				font-weight: 500;
				font-size: 28rpx;
				line-height: 48rpx;
				letter-spacing: 0.2px;
				color: #FFFFFF;
				
				.form_input {
					margin-top: 16rpx;
					width: 686rpx;
					height: 96rpx;
					padding: 28rpx 32rpx;
					border-radius: 20rpx;
					background: #FFFFFF;
					box-shadow: 0px 8rpx 32rpx 0px #0000000D;
					color: #111826;
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