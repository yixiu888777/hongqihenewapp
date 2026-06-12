<template>
	<view class="container"
		style="background:#c8131e url(/static/new/bg.jpg) no-repeat center top / cover;background-attachment: fixed;">
		<headerView>
			<template #leftIcon><u-icon name="arrow-left" color="#fff" size="24"></u-icon></template>
			<view>岗位介绍</view>
		</headerView>
		<view class="main">
			<view class="content" v-for="(item,index) in list" :key="index">
				<view class="item">
					<view class="title">{{item.name}}</view>
					<view class="body" v-html="item.detail"></view>
					<!-- <view class="desc">岗位说明</view>s -->
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		userTeamPositionApi
	} from '@/api/api.js'
	export default {
		data() {
			return {
				settingInfo: uni.getStorageSync('settingInfo'),
				list: []
			};
		},
		onLoad() {
			this.getDate()
		},
		methods: {
			getDate() {
				userTeamPositionApi().then(res => {
					// console.log(res.data.data);
					this.list = res.data.data
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		display: flex;
		flex-direction: column;

		.main {
			overflow: auto;
			margin: 0 30rpx 30rpx;
		}

		.content {
			background: #fff;
			border-radius: 20rpx;
			margin-bottom: 30rpx;

			.title {
				padding: 30rpx;
				border-bottom: 2rpx solid #e5e5e5;
				font-weight: bold;
			}

			.body {
				padding: 30rpx;
			}

			.desc {
				padding: 0 30rpx 30rpx;
				color: #999;
			}
		}
	}
</style>