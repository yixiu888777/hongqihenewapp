<template>
	<view>
		<u-popup :show="show" mode="center" round="32">
			<image class="van-close" src="./image/close.svg" mode="widthFix" @click="$emit('onClick', '')"></image>
		    <view class="van-dialog">
				<view class="van-dialog__header">防止国有资产流失需资金监管公证，确保筑梦资金合法性合规性和透明度，需缴纳100.00元公证费用</view>
				<view class="van-dialog__content">筑梦补贴及公证费用，同步进入筑帐户(24小时审核期后)</view>
				<view class="van-dialog__footer">
					<view class="van-dialog__button flex_center" @click="paymentClick">缴费</view>
					<view class="van-dialog__button btn flex_center" @click="$emit('onClick', '')">重新选择</view>
				</view>
			</view>
		</u-popup>
		
		<succeed-vue :show="succeedShow" :info="'缴费成功'" @onClick="succeedClick"></succeed-vue>
		<fail-vue :show="failShow" @onClick="failClick"></fail-vue>
	</view>
</template>

<script>
	import succeedVue from '@/components/succeedVue/succeedVue.vue';
	import failVue from '@/components/failVue/failVue.vue';
	export default {
		components: {
			succeedVue,
			failVue
		},
		name:"paymentVue",
		props: ['show'],
		data() {
			return {
				succeedShow: false,
				failShow: false
			};
		},
		methods: {
			paymentClick(){
				this.$emit('onClick', '')
				this.succeedShow = true
			},
			succeedClick(){
				this.succeedShow = false
				this.$emit('onClick', 1)
			},
			failClick(){
				this.failShow = false
			}
		}
	}
</script>

<style lang="scss">
	.van-close{
		width: 48rpx;
		height: 48rpx;
		position: absolute;
		right: 0;
		top: -66rpx;
	}
	
	.van-dialog{
		width: 686rpx;
		height: 556rpx;
		padding: 40rpx 20rpx;
		border-radius: 20rpx;
		background: url('./image/bg.png') no-repeat center / cover;
		font-family: Roboto;
		font-weight: 500;
		line-height: 48rpx;
		
		.van-dialog__header {
			width: 512rpx;
			height: 144rpx;
			margin: 8rpx auto 0;
			font-size: var(--font-16);
			color: rgba(255, 255, 255, 1);
		}
		
		.van-dialog__content{
			width: 476rpx;
			margin: 28rpx auto;
			font-size: var(--font-14);
			text-align: center;
			color: rgba(255, 255, 255, 1);
		}
		
		.van-dialog__footer {
			margin: 8rpx auto 0;
			
			.van-dialog__button{
				width: 414rpx;
				height: 72rpx;
				margin: 20rpx auto 0;
				border-radius: 92rpx;
				background: rgba(255, 255, 255, 1);
				border: 4rpx solid rgba(255, 255, 255, 1);
				font-size: var(--font-14);
				font-weight: 400;
				color: rgba(192, 27, 23, 1);
			}
			
			.btn{
				background: transparent;
				color: rgba(255, 255, 255, 1);
			}
		}
	}
</style>