<template>
	<view class="page">
		<headerView>
			<template #leftIcon>
				<u-icon name="arrow-left" color="#333" size="24"></u-icon>
			</template>
			<view class="nav-title">保单状态</view>
		</headerView>

		<view class="content">
			<view class="card">
				<!-- 顶部插图 -->
				<view class="illus-wrap">
					<view class="illus-deco deco-left"></view>
					<view class="illus-deco deco-right"></view>
					<view class="orbit orbit-outer"></view>
					<view class="orbit orbit-inner"></view>
					<view class="shield-box">
						<view class="shield-body">
							<u-icon name="clock-fill" color="#fff" size="56"></u-icon>
						</view>
						<view class="shield-badge">
							<u-icon name="checkmark" color="#fff" size="14"></u-icon>
						</view>
					</view>
				</view>

				<view class="main-title">保单号生成倒计时</view>
				<view class="sub-title">保单生效后进入{{ waitDays }}天等待期</view>

				<view class="days-row">
					<view class="days-box">
						<text class="days-num">{{ waitDays }}</text>
					</view>
					<text class="days-unit">天</text>
				</view>

				<view class="notice">
					<text>等待期内(含第{{ waitDays }}天)发生保险事故，</text>
					<text>我们将不承担保险责任。</text>
				</view>

				<view class="confirm-btn" @click="onConfirm">我知道了</view>
			</view>
		</view>
	</view>
</template>

<script>
	const DEFAULT_WAIT_DAYS = 90;

	export default {
		data() {
			return {
				waitDays: DEFAULT_WAIT_DAYS
			};
		},
		onLoad(options) {
			const days = parseInt(options && options.days, 10);
			if (!isNaN(days) && days > 0) {
				this.waitDays = days;
			}
		},
		methods: {
			onConfirm() {
				const pages = getCurrentPages();
				if (pages.length > 1) {
					uni.navigateBack();
					return;
				}
				uni.switchTab({ url: '/pages/index/index' });
			}
		}
	};
</script>

<style lang="scss" scoped>
	$page-green: #2ba245;
	$page-bg: #f0f2f5;

	.page {
		min-height: 100vh;
		background: $page-bg;
		display: flex;
		flex-direction: column;
	}

	::v-deep .header {
		color: #333 !important;
		background: #fff;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
	}

	.nav-title {
		color: #333;
		font-size: 32rpx;
	}

	.content {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 32rpx 40rpx calc(40rpx + env(safe-area-inset-bottom));
		box-sizing: border-box;
	}

	.card {
		width: 100%;
		background: #fff;
		border-radius: 40rpx;
		padding: 64rpx 48rpx 56rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.06);
	}

	/* 顶部插图 */
	.illus-wrap {
		position: relative;
		width: 280rpx;
		height: 280rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 40rpx;
	}

	.orbit {
		position: absolute;
		border-radius: 50%;
		border: 2rpx dashed rgba(43, 162, 69, 0.2);
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}

	.orbit-outer {
		width: 260rpx;
		height: 260rpx;
	}

	.orbit-inner {
		width: 200rpx;
		height: 200rpx;
		border-style: dotted;
		opacity: 0.6;
	}

	.illus-deco {
		position: absolute;
		top: 50%;
		width: 28rpx;
		height: 40rpx;
		background: $page-green;
		border-radius: 0 100% 0 100%;
		opacity: 0.75;

		&.deco-left {
			left: 0;
			transform: translateY(-50%) rotate(-30deg);
		}

		&.deco-right {
			right: 0;
			transform: translateY(-50%) scaleX(-1) rotate(-30deg);
		}
	}

	.shield-box {
		position: relative;
		z-index: 2;
	}

	.shield-body {
		width: 160rpx;
		height: 180rpx;
		background: linear-gradient(180deg, #3bc45a 0%, $page-green 100%);
		border-radius: 80rpx 80rpx 24rpx 24rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 12rpx 32rpx rgba(43, 162, 69, 0.25);
		position: relative;

		&::before {
			content: '';
			position: absolute;
			inset: 8rpx 12rpx auto;
			height: 40%;
			background: rgba(255, 255, 255, 0.15);
			border-radius: 60rpx 60rpx 0 0;
		}
	}

	.shield-badge {
		position: absolute;
		right: -12rpx;
		bottom: 8rpx;
		width: 44rpx;
		height: 44rpx;
		border-radius: 50%;
		background: $page-green;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 4rpx solid #fff;
		box-shadow: 0 4rpx 12rpx rgba(43, 162, 69, 0.3);
	}

	.main-title {
		font-size: 40rpx;
		font-weight: 700;
		color: #222;
		text-align: center;
		line-height: 1.4;
	}

	.sub-title {
		font-size: 28rpx;
		color: #666;
		text-align: center;
		margin-top: 16rpx;
		line-height: 1.5;
	}

	.days-row {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 48rpx;
	}

	.days-box {
		min-width: 120rpx;
		height: 120rpx;
		padding: 0 24rpx;
		background: #fff;
		border: 2rpx solid #eee;
		border-radius: 16rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
	}

	.days-num {
		font-size: 72rpx;
		font-weight: 700;
		color: $page-green;
		line-height: 1;
	}

	.days-unit {
		font-size: 32rpx;
		color: #333;
		margin-left: 16rpx;
	}

	.notice {
		margin-top: 40rpx;
		padding: 0 8rpx;
		text-align: center;
		font-size: 26rpx;
		color: #999;
		line-height: 1.7;

		text {
			display: block;
		}
	}

	.confirm-btn {
		width: 100%;
		height: 96rpx;
		line-height: 96rpx;
		text-align: center;
		margin-top: 56rpx;
		background: $page-green;
		color: #fff;
		font-size: 32rpx;
		font-weight: 600;
		border-radius: 48rpx;
	}
</style>
