<!-- 有用 -->
<template>
	<view class="container" style="background:#c8131e url(/static/new/bg.jpg) no-repeat center top / 100%;">
		<headerView>
			<!-- <template #leftIcon><u-icon name="arrow-left" color="#fff" size="24"></u-icon></template> -->
			<!-- <view>{{settingInfo.site_name}}</view> -->
		</headerView>
		<!-- <view class="main"> -->
		<view class="hd">
			<view class="h1">
				<image :src="settingInfo.logo" style="background: #fff; border-radius: 10rpx; width: 40rpx;height: 40rpx;" mode="heightFix">
				</image>
				<text style="margin-left: 20rpx;">{{settingInfo.site_name}}</text>
			</view>
			<view class="icon" @click="showDrawer('showRight')"><u-icon name="grid-fill" size="20" color="#fff"></u-icon></view>
		</view>
		<view class="info">
			<view class="name">
				{{info.name}}
			</view>
			<!-- <view class="time">
				{{info.createtime}}
			</view> -->
			<view class="content"><u-parse :content="info.content"></u-parse></view>
		</view>

		<view class="link">
			<view class="title">官方信息一览</view>
			<view class="imglink">
				<view class="item" v-for="(item,index) in link" :key="index">
					<image :src="item.image" mode="widthFix"></image>
				</view>
			</view>
		</view>
		<uni-drawer ref="showRight" mode="right" :mask-click="true">
			<view class="scroll-lists">
				<scroll-view class="scroll-view-box" scroll-y="true">
					<view class="lists">
						<view class="item" v-for="(item,index) in lists" :key="index" @click="loadProject(item.id)">
							{{item.name}}
						</view>
					</view>
				</scroll-view>
				<view class="nav">
					<view class="index" @click="goBack"><u-icon name="arrow-leftward" color="#333" size="20"></u-icon> 返回上一页</view>
				</view>
				<view class="close" @click="closeDrawer('showRight')">
					<u-icon name="close" color="#333" size="28"></u-icon>
				</view>
			</view>
		</uni-drawer>
	</view>
</template>

<script>
	import {
		servicesOfficialApi,
		servicesProjectApi,
		servicesProjectListApi
	}
	from '@/api/api.js'

	export default {
		data() {
			return {
				settingInfo: uni.getStorageSync('settingInfo'),
				lists: {},
				info: {},
				link: []
			}
		},
		onLoad() {
			this.loadData()
		},
		methods: {
			loadData() {
				servicesOfficialApi().then(res => {
					this.link = res.data.data
				})
				servicesProjectListApi().then(res => {
					this.lists = res.data.data;
					this.loadProject(res.data.data[0].id);
				})
			},
			loadProject(e) {
				servicesProjectApi({
					id: e
				}).then(res => {
					this.info = res.data.data;
					this.closeDrawer('showRight')
				})
			},
			showDrawer(e) {
				this.$refs[e].open()
			},
			closeDrawer(e) {
				this.$refs[e].close()
			},
			change(e, type) {
				// console.log((type === 'showLeft' ? '左窗口' : '右窗口') + (e ? '打开' : '关闭'));
				// this[type] = e
			},
			goBack() {
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		min-height: 100vh;
		height: auto;
	}
	.info {
		padding: 30rpx;
		background: #fff;
		border-radius: 20rpx;
		margin: 0 30rpx 30rpx;
		.name {
			font-weight: bold;
			line-height: 1;
			margin-bottom: 20rpx;
		}
		.time {
			opacity: .5;
			margin-bottom: 30rpx;
		}
	}
	.link {
		padding: 30rpx 30rpx 0;
		background: #fff;
		border-radius: 20rpx;
		margin: 0 30rpx 30rpx;
		.title {
			font-weight: bold;
			margin-bottom: 20rpx;
		}
		.imglink {
			// display: flex;
			// flex-wrap: wrap;
			// gap: 10rpx;
			margin-bottom: 30rpx;
			.item {
				margin-bottom: 30rpx;
				// flex: 1;
				// min-width: 300rpx;
				image {
					border-radius: 20rpx;
					width: 100%;
					display: block;
				}
			}
		}
	}
	.hd {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: -44px 30rpx 30rpx;
		color: #fff;
		align-items: center;
		font-size: 30rpx;
		font-weight: 700;
		.h1 {
			display: flex;
		}
	}
	.scroll-lists {
		height: 100vh;
		position: relative;
		padding-top: 200rpx;
		/* #ifdef APP */
		padding-top: 300rpx;
		/* #endif */
		.close {
			margin-top: var(--status-bar-height);
			position: absolute;
			top: 30rpx;
			right: 30rpx;
			text-align: right;
		}
		.nav {
			margin-top: var(--status-bar-height);
			width: 100%;
			position: absolute;
			top: 120rpx;
			right: 0;
			.index {
				display: flex;
				align-items: center;
				background: #eee;
				border-radius: 20rpx;
				padding: 20rpx;
				margin: 0 30rpx;
				.u-icon {
					margin-right: 20rpx;
				}
			}
		}
		.scroll-view-box {
			height: 100vh;
		}
		.lists {
			height: 200vh;
			padding: 30rpx;
			.item {
				line-height: 1;
				margin-bottom: 30rpx;
				padding-bottom: 30rpx;
				border-bottom: 2rpx solid #e5e5e5;
			}
			.item:last-child {
				border-bottom: none;
			}
		}
	}
</style>