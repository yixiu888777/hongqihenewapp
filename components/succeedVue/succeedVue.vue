<template>
	<view>
		<u-popup :show="show" mode="center" round="32" @close="onclick">
		    <view class="van-dialog">
				<view class="van-dialog__header">
					<image src="./succeed.png" mode="widthFix"></image>
				</view>
				<view class="van-dialog__content">{{info}}</view>
				<view class="van-dialog__footer">
					<view class="button" @click="onclick">知道了</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		name:"succeedVue",
		props: ['show', 'info'],
		data() {
			return {
				
			};
		},
		methods: {
			onclick(){
				this.$emit('onClick');
			}
		}
	}
</script>

<style lang="scss">
	.van-dialog{
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
			width: 168rpx;
			height: 168rpx;
			margin: 0 auto;
		}
		
		.van-dialog__content{
			margin: 34rpx auto;
			font-size: var(--font-16);
		}
		
		.van-dialog__footer {
			display: flex;
			
			.button{
				height: 72rpx;
				font-size: var(--font-14);
			}
		}
	}
</style>