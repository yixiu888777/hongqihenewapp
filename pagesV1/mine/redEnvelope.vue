<template>
	<view class="container">
		<headerView>红包列表</headerView>
		<scroll-view scroll-y @scrolltolower="scrollBottom" class="content">
			
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
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
		}
	}
</style>
