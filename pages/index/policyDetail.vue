<template>
	<view class="container">
		<headerView>
			<template #leftIcon><u-icon name="arrow-left" color="#fff" size="24"></u-icon></template>
			<view>政策文件</view>
		</headerView>
		<!-- <view class="main">
			<view class="content">
				<view class="title">{{detail.name}}</view>
				<view class="body"><u-parse :content="detail.content"></u-parse></view>
			</view>
			
		</view> -->
		<view class="main" v-for="(item,index) in list">
			<view class="content">
				<view class="title">{{item.name}}</view>
				<view class="body"><u-parse :content="item.content"></u-parse></view>
			</view>
			
		</view>
		
	</view>
	
</template>

<script>
	import {
		servicesPolicyApi,servicesPolicylistApi
	} from '@/api/api.js'
	export default {
		data() {
			return {
				settingInfo: uni.getStorageSync('settingInfo'),
				detail: {},
				list:[],
			};
		},
		onShow() {
		/* 	servicesPolicyApi().then(res => {
				this.detail = res.data.data
			}) */
			servicesPolicylistApi().then(res => {
				this.list = res.data.data
			})
		},
		methods: {}
	}
</script>

<style lang="scss">
	/* 背景挂在 page 上，整页滚动区域都有底图；仅 view 设背景时，多屏内容下常出现下半截露白 */
	page {
		background-color: #c8131e;
		background-image: url(/static/new/bg.jpg);
		background-repeat: no-repeat;
		background-position: center top;
		background-size: 100% 100%;
		min-height: 100%;
	}
</style>

<style lang="scss" scoped>
	.container {
		min-height: 100vh;
		width: 100%;
		box-sizing: border-box;
		.main {
			display: flex;
			flex-direction: column;
			flex: 1;
			margin: 0 30rpx 30rpx;
		}

		.content {
			background: #fff;
			border-radius: 20rpx;
			display: flex;
			flex-direction: column;
			flex: 1;

			.title {
				padding: 30rpx;
				border-bottom: 2rpx solid #e5e5e5;
				font-weight: bold;
			}

			.body {
				margin: 30rpx;
				overflow: auto;
				flex: 1;
				max-height: calc(100vh - 300rpx);
				/* #ifdef APP */
				max-height: calc(100vh - 400rpx);
				/* #endif */
			}
		}
	}
</style>