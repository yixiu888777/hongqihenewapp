<template>
	<view class="container">
		<headerView>购买记录</headerView>
		<scroll-view scroll-y @scrolltolower="scrollBottom" class="content">
			<scroll-view scroll-x class="nav-box flex_center">
				<view class="nav flex_between">
					<view :class="type==1?'active':''" @click="type=1">福利</view>
					<view :class="type==2?'active':''" @click="type=2">筑梦</view>
					<view :class="type==3?'active':''" @click="type=3">数字人民币</view>
				</view>
			</scroll-view>
			
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: 1
			};
		},
		methods: {
			scrollBottom() {
				console.log('触底！');
			},
		}
	}
</script>

<style lang="scss">
	.container {
		background: linear-gradient(198.19deg, #F23D30 7.15%, #FF5D29 35.57%, #FFFFFF 60%);
	
		.content {
			width: 750rpx;
			padding: 28rpx 32rpx 0;
			border-radius: 30rpx 30rpx 0rpx 0rpx;
			background-color: rgba(255, 255, 255, 1);
			
			.nav-box{
				width: 674rpx;
				height: 72rpx;
				margin: 0 auto;
				padding: 6rpx 8rpx;
				border-radius: 20rpx;
				background: rgba(245, 245, 245, 1);
				box-shadow: 0px 0px 64rpx 0px rgba(136, 152, 170, 0.15);
				
				.nav{
					&>view{
						width: 222rpx;
						height: 72rpx;
						border-radius: 20rpx;
						font-family: Roboto;
						font-size: var(--font-11);
						font-weight: 400;
						line-height: 72rpx;
						text-align: center;
						color: rgba(34, 34, 34, 1);
						flex-shrink: 0;
					}
					
					.active{
						background: rgba(243, 62, 49, 1);
						color: rgba(255, 255, 255, 1);
					}
				}
			}
		}
	}
</style>
