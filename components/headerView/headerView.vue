<template>
	<view class="header flex_center">
		<view v-if="!hideBack" class="left_icon" @tap="pageBack">
			<slot name="leftIcon">
				<!-- <u-icon name="arrow-left" color="#fff" size="24"></u-icon> -->
			</slot>
		</view>
		<view class="title">
			<slot></slot>
		</view>
		<view class="right_icon">
			<slot name="rightIcon"></slot>
		</view>
	</view>
</template>

<script>
	export default {
		name: "headerView",
		props: {
			back: [String, Boolean],
			/** 为 true 时不展示左侧返回区域 */
			hideBack: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {

			};
		},
		methods: {
			pageBack() {
				// console.log("this.back", getCurrentPages()[0].route)s
				let backPage = getCurrentPages()
				if (backPage.length == 1) {
					uni.reLaunch({
						url: "/pages/index/index"
					})
				} else {
					uni.navigateBack()
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.header {
		padding: 30rpx;
		margin: 0;
		margin-top: var(--status-bar-height);
		font-size: var(--font-16);
		font-weight: 400;
		line-height: 60rpx;
		height: 120rpx;
		text-align: center;
		color: #fff;
		position: relative;
		.left_icon {
			flex-shrink: 0;
			position: absolute;
			left: 32rpx;
			top: 50%;
			transform: translateY(-50%);
		}
		.title {
			flex: 1;
			font-weight: bold;
			padding: 0 64rpx;
		}
		.right_icon {
			min-width: 48rpx;
			height: 48rpx;
			line-height: 48rpx;
			flex-shrink: 0;
			position: absolute;
			right: 32rpx;
			top: 50%;
			transform: translateY(-50%);
		}
	}
</style>