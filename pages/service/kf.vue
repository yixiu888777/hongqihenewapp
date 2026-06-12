<template>
	<view class="container" style="background:#c8131e url(/static/new/bg.jpg) no-repeat center top / 100%;">
		<headerView>
			<template #leftIcon><u-icon name="arrow-left" color="#fff" size="24"></u-icon></template>
			<view>人工客服</view>
		</headerView>
		<view class="content">
			<view class="service">
				<view class="img">
					<image :src="settingInfo.service_image" mode="heightFix"></image>
				</view>
				<view class="text">
					<view class="name">{{settingInfo.service_title}}</view>
					<view class="desc">{{settingInfo.service_title_2}}</view>
				</view>
				<view class="btn" @click="toLoads(settingInfo.service_url)">人工客服</view>
			</view>
			<view class="list">
				<view class="item" :class="onIndex == index?'on':''" v-for="(item,index) in manual" :key="index" @click="onQA(index)">
					<view class="icon">
						<image src="/static/new/qa.png" mode="widthFix"></image>
					</view>
					<view class="text">
						<view class="q">
							<text>{{index+1}}. {{item.name}}</text>
							<u-icon name="arrow-right"></u-icon>
						</view>
						<view class="a" v-html="item.content"></view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		servicesManualApi
	} from '@/api/api.js'
	export default {
		data() {
			return {
				settingInfo: uni.getStorageSync('settingInfo'),
				manual: {},
				onIndex: -1
			};
		},
		onLoad() {
			this.loadData();
		},
		methods: {
			loadData() {
				servicesManualApi().then(res => {
					this.manual = res.data.data
				})
			},
			onQA(e) {
				this.onIndex = e
			},
			// 跳转在线客服
			toLoads(url) {
				uni.navigateTo({
					url: `/pages/noPage/index?url=${url.split("&").join("$")}`
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.container {}
	.content {
		padding: 30rpx;
	}
	.service {
		display: flex;
		align-items: center;
		margin-bottom: 30rpx;
		.img {
			width: 100rpx;
			image {
				height: 100rpx;
				display: block;
			}
		}
		.text {
			color: #fff;
			flex: 1;
			padding: 0 30rpx;
			.name {
				font-weight: bold;
			}
			.desc {
				font-size: .8em;
			}
		}
		.btn {
			background: #fff;
			padding: 20rpx 30rpx;
			border-radius: 90rpx;
		}
	}
	.list {
		.item {
			background: #fff;
			padding: 30rpx;
			border-radius: 20rpx;
			margin-bottom: 30rpx;
			display: flex;
			.icon {
				width: 50rpx;
				flex: none;
				image {
					width: 50rpx;
					display: block;
				}
			}
			.text {
				padding: 0 0 0 30rpx;
				flex: 1;
				.q {
					display: flex;
					justify-content: space-between;
					align-items: center;
					font-weight: bold;
				}
				.a {
					opacity: .5;
					margin-top: 20rpx;
					display: none;
				}
			}
		}
		.item.on {
			.text {
				padding: 0 0 0 30rpx;
				.a {
					display: block;
				}
			}
		}
	}
</style>