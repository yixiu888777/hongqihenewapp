<template>
	<view class="container" style="background:#c8131e url(/static/new/bg.jpg) no-repeat center top / 100%;">
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
			servicesPolicyApi().then(res => {
				this.detail = res.data.data
			})
			servicesPolicylistApi().then(res => {
				this.list = res.data.data
			})
		},
		methods: {}
	}
</script>

<style lang="scss" scoped>
	.container {
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