<template>
	<view class="container">
		<headerView>合同详情</headerView>
		<view class="content">
			<scroll-view scroll-x="true" class="scroll">
				<view class="images">
					<view class="image" v-for="(item, index) in htImages" :key="index">
						<image :src="item" mode="widthFix" @click="previewImg = item"></image>
					</view>
				</view>
			</scroll-view>
			<view class="btn flex_center" @click="toSign">已阅读并同意签字</view>
			<view class="rule" v-if="!!htRule">
				<view class="rule-title">温馨提示</view>
				<view v-html="htRule"></view>
			</view>
		</view>
		
		<!-- 预览图片 -->
		<u-popup :show="previewImg!=''" mode="center" @close="previewImg=''">
			<view class="img_mask col_center">
				<view class="close" @tap="previewImg=''">
					<image src="@/static/public/close.svg" mode="widthFix"></image>
				</view>
				<view class="img_show">
					<image :src="previewImg" mode="widthFix"></image>
				</view>
			</view>
		</u-popup>
		
		<!-- 温馨提示 -->
		<u-popup :show="false" mode="center" round="32">
			<view class="van-dialog">
				<view class="van-dialog__header">温馨提示</view>
				<view class="van-dialog__content"></view>
				<template>
					<view class="van-dialog__footer flex_center">充值</view>
				</template>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				htImages: [],
				htRule: '',
				previewImg: '',
			};
		},
		onLoad(opt) {
			if(!!uni.getStorageSync('signatureInfo')){
				this.htImages = uni.getStorageSync('signatureInfo').ht_images
				this.htRule = uni.getStorageSync('signatureInfo').ht_wxts
			}else{
				uni.navigateBack()
			}
		},
		methods: {
			toSign(){
				uni.redirectTo({
					url: '/pages/signature/sign'
				})
			}
		}
	}
</script>

<style lang="scss">
	.container {
		background: url("/static/mine/recharge_bg.svg") no-repeat center top / 100%;
		background-color: rgba(255, 255, 255, 1);
	}
	
	.content{
		padding: 32rpx;
		background-color: rgba(255, 255, 255, 1);
		
		.scroll {
			width: 686rpx;
			
			.images {
				width: auto;
				display: flex;
				
				.image {
					width: 606rpx;
					border: 1rpx solid #dcdcdc;
					margin-right: 20rpx;
					padding: 24rpx;
					flex-shrink: 0;
					
					&>image {
						width: 100%;
					}
				}
			}
		}
		
		.btn {
			width: 686rpx;
			height: 100rpx;
			border-radius: 120rpx;
			background: #D33C30;
			margin: 110rpx auto;
			font-family: Mulish;
			font-weight: 600;
			font-size: 32rpx;
			color: #F7F7FC;
		}
		
		.rule {
			font-family: Roboto;
			font-weight: 500;
			font-size: 28rpx;
			line-height: 44rpx;
			letter-spacing: 0px;
			color: #858597;
			
			.rule-title {
				line-height: 32rpx;
				color: #D33C30;
				margin-bottom: 16rpx;
			}
		}
	}
	
	.img_mask {
		width: 100vw;
		height: 100vh;
		overflow: auto;
		background: rgba(0, 0, 0, 0.35);
		padding: 20rpx;
	
		.close {
			width: 38rpx;
			height: 38rpx;
			margin-bottom: -50rpx;
			margin-right: 70rpx;
			z-index: 100;
			align-self: flex-end;
		}
	
		.img_show {
			width: 606rpx;
			max-height: 856rpx;
		}
	}
	
	.van-dialog {
		width: 560rpx;
		padding: 48rpx 32rpx;
		border-radius: 16rpx;
		background: rgba(255, 255, 255, 1);
	
		.van-dialog__header {
			font-family: Roboto;
			font-weight: 700;
			font-size: 30rpx;
			line-height: 42rpx;
			text-align: center;
			color: #D33C30;
		}
	
		.van-dialog__content {
			margin: 32rpx auto;
			font-family: Roboto;
			font-weight: 400;
			font-size: 28rpx;
			line-height: 42rpx;
			text-align: center;
			color: #111826;
		}
	
		.van-dialog__footer {
			width: 496rpx;
			height: 80rpx;
			border-radius: 104rpx;
			background: #D33C30;
			font-family: Roboto;
			font-weight: 400;
			font-size: 28rpx;
			color: #F7F7FC;
		}
	}
</style>
