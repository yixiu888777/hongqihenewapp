<template>
	<view class="container">
		<!-- <headerView></headerView> -->
		<view class="content">
			<view class="box">
				<image :src="withdrawalPro.sj_pro_img" mode="widthFix"></image>
				<view class="title">{{withdrawalPro.sj_pro_title}}</view>
				<view class="tips" v-html="withdrawalPro.sj_pro_content"></view>
				<view class="button" :class="withdrawalPro.is_jiaona==1?'active':''" @click="withdrawalProjn">{{withdrawalPro.is_jiaona==1?'已缴纳':'缴纳'}}</view>
			</view>
		</view>

		<!-- 提示 -->
		<u-popup :show="show" mode="center" round="32">
			<view class="van-dialog">
				<view class="van-dialog__header">缴费成功</view>
				<view class="van-dialog__content">{{tips}}</view>
				<view class="van-dialog__footer">
					<view class="button" @click="confirmSub">确定</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import { withdrawalProApi, withdrawalProjnApi } from '@/api/api.js'
	export default {
		data() {
			return {
				withdrawalPro: {},
				show: false,
				tips: ''
			}
		},
		onLoad() {
			withdrawalProApi().then(res=>{
				this.withdrawalPro = res.data.data
				this.show = this.withdrawalPro.is_jiaona==1?true:false
				this.tips = this.withdrawalPro.tips
			})
		},
		methods: {
			withdrawalProjn(){
				this.$utils.throttle(() => {
					withdrawalProjnApi().then(res => {
						this.show = true
						this.tips = res.data.msg
					})
				}, 2000)()
			},
			confirmSub(){
				uni.reLaunch({
					url: '/pages/mine/mine'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		background: #F33E31;

		.content {
			width: 750rpx;
			padding: 28rpx 32rpx;
			background-color: rgba(255, 255, 255, 1);
			
			.box {
				width: 686rpx;
				padding-bottom: 40rpx;
				border-radius: 20rpx;
				border: 2rpx solid rgba(206, 213, 218, 1);
				box-shadow: 0px 8rpx 32rpx 0px rgba(0, 0, 0, 0.05);
				overflow: hidden;
				
				&>image {
					width: 686rpx;
					height: 334rpx;
				}
				
				.title {
					font-family: PingFang SC;
					font-size: 32rpx;
					font-weight: 400;
					line-height: 40rpx;
					text-align: center;
					color: rgba(0, 0, 0, 1);
					margin: 20rpx auto;
				}
				
				.tips {
					margin: 0 auto 20rpx;
					font-family: PingFang SC;
					font-size: 24rpx;
					font-weight: 400;
					line-height: 40rpx;
					text-align: center;
					color: rgba(238, 72, 49, 1);
				}
				
				.button {
					width: 622rpx;
					margin: 0 auto;
				}
				
				.active {
					background: rgba(212, 212, 212, 1);
				}
			}
		}

		.van-dialog {
			width: 540rpx;
			padding: 48rpx;
			border-radius: 16rpx;
			background: rgba(255, 255, 255, 1);
			font-family: Roboto;
			font-weight: 400;
			line-height: 40rpx;
			text-align: center;
			color: rgba(27, 28, 30, 1);
		
			.van-dialog__header {
				font-size: var(--font-18);
				color: rgba(0, 186, 19, 1);
			}
		
			.van-dialog__content {
				margin: 34rpx auto;
				font-size: var(--font-16);
			}
		
			.van-dialog__footer {
				display: flex;
		
				.button {
					height: 72rpx;
					font-size: var(--font-14);
				}
			}
		}
	}
</style>