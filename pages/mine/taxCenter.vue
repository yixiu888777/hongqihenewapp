<template>
	<view class="page">
		<!-- 顶部图片头部 -->
		<view class="header-section">
			<view class="header">
				<image class="header-img" src="/static/top.jpg" mode="widthFix"></image>
				<view class="header-bar">
					<view class="back-btn" @tap="goBack">
						<u-icon name="arrow-left" color="#fff" size="20"></u-icon>
					</view>
				</view>
			</view>
			<!-- 法律说明：叠在头部图片上 -->
			<view class="card notice-card">
				<view class="notice-icon">
					<u-icon name="info-circle-fill" color="#2563eb" size="18"></u-icon>
				</view>
				<view class="notice-text">
					根据《中华人民共和国个人所得税法》及相关规定，您所获得的收益属于应税所得，需依法申报并缴纳个人所得税。完成申报后，资金将按国家规定流程发放至您绑定的银行卡账户。
				</view>
			</view>
		</view>

		<scroll-view scroll-y class="scroll" :show-scrollbar="false">
			<view class="content">
				<!-- 申报信息 -->
				<view class="card">
					<view class="card-title">
						<u-icon name="file-text-fill" color="#2563eb" size="18"></u-icon>
						<text>申报信息</text>
					</view>
					<view class="info-row">
						<text class="label">所得金额</text>
						<text class="value blue big">¥ {{ incomeAmount }}</text>
					</view>
					<view class="info-row">
						<text class="label">适用税率</text>
						<text class="value blue">{{ taxRate }}</text>
					</view>
					<view class="info-row">
						<text class="label">应纳税额</text>
						<text class="value orange big">¥ {{ taxAmount }}</text>
					</view>
					<view class="info-row">
						<text class="label">贴息贷款利率</text>
						<text class="value blue">{{ loanRate }}</text>
					</view>
					<view class="info-row">
						<text class="label">实际缴纳</text>
						<text class="value orange">¥ {{ payAmount }}</text>
					</view>
					<view class="info-row">
						<text class="label">贴息贷款</text>
						<text class="value green">¥ {{ loanAmount }}</text>
					</view>
					<view class="info-row">
						<text class="label">申报日期</text>
						<text class="value">{{ declareDateRange }}</text>
					</view>
				</view>

				<!-- 办理进度 -->
				<view class="card">
					<view class="card-title">
						<u-icon name="clock-fill" color="#2563eb" size="18"></u-icon>
						<text>办理进度</text>
					</view>
					<view class="info-row">
						<text class="label">当前状态</text>
						<view class="status-tag" :class="isSubmitted ? 'done' : ''">
							<u-icon :name="isSubmitted ? 'checkmark-circle' : 'clock'" :color="isSubmitted ? '#22c55e' : '#e67e22'" size="14"></u-icon>
							<text>{{ progressStatus }}</text>
						</view>
					</view>
					<view class="alert-box">
						<u-icon name="info-circle" color="#2563eb" size="16"></u-icon>
						<text>请在申报日期范围内完成个人所得税申报，逾期可能影响资金发放。</text>
					</view>
				</view>

				<!-- 纳税人信息 -->
				<view class="card">
					<view class="card-title">
						<u-icon name="account-fill" color="#2563eb" size="18"></u-icon>
						<text>纳税人信息</text>
					</view>
					<view class="verify-box" :class="isAuth ? 'verified' : 'unverified'" @tap="goRealName">
						<view class="verify-icon">
							<u-icon :name="isAuth ? 'checkmark-circle-fill' : 'info-circle-fill'" :color="isAuth ? '#22c55e' : '#f59e0b'" size="28"></u-icon>
						</view>
						<view class="verify-text">
							<view class="verify-title">{{ isAuth ? '已完成实名认证' : '未完成实名认证' }}</view>
							<view class="verify-desc">{{ isAuth ? '纳税人信息已通过核验' : '请先完成实名认证' }}</view>
						</view>
						<u-icon name="arrow-right" color="#9ca3af" size="16"></u-icon>
					</view>
				</view>

				<!-- 温馨提示 -->
				<view class="card tips-card">
					<view class="card-title">
						<u-icon name="bell-fill" color="#2563eb" size="18"></u-icon>
						<text>温馨提示</text>
					</view>
					<view class="tips-watermark">税</view>
					<view class="tips-list">
						<view class="tips-item" v-for="(tip, index) in tipsList" :key="index">
							<view class="tips-num">{{ index + 1 }}</view>
							<text class="tips-text">{{ tip }}</text>
						</view>
					</view>
				</view>

				<view class="footer-text">
					<u-icon name="lock-fill" color="#9ca3af" size="12"></u-icon>
					<text>本服务由国家税务总局提供</text>
				</view>
				<view class="scroll-bottom"></view>
			</view>
		</scroll-view>

		<!-- 底部按钮 -->
		<view class="bottom-bar">
			<view class="btn btn-outline" @tap="goHome">返回首页</view>
			<view class="btn btn-primary" :class="{ disabled: isSubmitted }" @tap="handleTax">{{ isSubmitted ? '已提交' : '立即办税' }}</view>
		</view>

		<!-- 税务办理完成提示 -->
		<u-popup :show="taxTipShow" mode="center" round="32" @close="taxTipShow=false">
			<view class="van-dialog van-dialog2">
				<view class="van-dialog__header">提示</view>
				<view class="van-dialog__content tax-tip-content">{{ taxCompletedTip }}</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
import { userTaxInfoApi, userTaxSubmitApi } from '@/api/api.js'

export default {
	data() {
		return {
			UserInfo: {},
			incomeAmount: '0.00',
			taxRate: '1.5%',
			taxAmount: '0.00',
			loanRate: '0%',
			payAmount: '0.00',
			loanAmount: '0.00',
			declareDateRange: '',
			progressStatus: '待办理',
			isSubmitted: false,
			taxTipShow: false,
			taxCompletedTip: '',
			taxTipTimer: null,
			loading: false,
			submitting: false,
			tipsList: [
				'个人所得税申报遵循"自行申报、自行缴纳"原则，纳税人应如实申报所得信息。',
				'申报信息提交后，税务机关将在3个工作日内完成审核。',
				'审核通过后，资金将发放至您绑定的银行卡账户，请注意查收。',
				'如有疑问，请确保申报信息真实准确，以免影响资金发放进度。'
			]
		};
	},
	computed: {
		isAuth() {
			return this.UserInfo && this.UserInfo.is_auth == 1;
		}
	},
	onLoad() {
		this.UserInfo = uni.getStorageSync('user_info') || {};
		this.loadTaxInfo();
	},
	onShow() {
		this.UserInfo = uni.getStorageSync('user_info') || {};
		this.loadTaxInfo();
	},
	onHide() {
		clearTimeout(this.taxTipTimer);
	},
	onUnload() {
		clearTimeout(this.taxTipTimer);
	},
	methods: {
		formatAmount(val) {
			const num = parseFloat(val) || 0;
			return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
		},
		showCompletedTip(tip) {
			if (!tip) return;
			this.taxCompletedTip = tip;
			this.taxTipShow = true;
			clearTimeout(this.taxTipTimer);
			this.taxTipTimer = setTimeout(() => {
				this.taxTipShow = false;
			}, 3000);
		},
		loadTaxInfo() {
			if (this.loading) return;
			this.loading = true;
			userTaxInfoApi().then(res => {
				const data = res.data.data || {};
				this.incomeAmount = this.formatAmount(data.ktx_amount);
				this.taxRate = data.tax_rate || '1.5%';
				this.taxAmount = this.formatAmount(data.tax_amount);
				this.loanRate = data.loan_rate || '0%';
				this.payAmount = this.formatAmount(data.pay_amount);
				this.loanAmount = this.formatAmount(data.loan_amount);
				this.declareDateRange = data.declare_date || '';
				this.progressStatus = data.progress_status || '待办理';
				this.isSubmitted = data.is_submitted == 1;
				if (data.completed_tip) {
					this.taxCompletedTip = data.completed_tip;
				}
				if (data.is_auth !== undefined) {
					this.UserInfo = { ...this.UserInfo, is_auth: data.is_auth };
				}
			}).finally(() => {
				this.loading = false;
			});
		},
		goBack() {
			const pages = getCurrentPages();
			if (pages.length > 1) {
				uni.navigateBack();
			} else {
				uni.reLaunch({ url: '/pages/index/index' });
			}
		},
		goHome() {
			uni.reLaunch({ url: '/pages/index/index' });
		},
		goRealName() {
			uni.navigateTo({ url: '/pages/mine/realName' });
		},
		handleTax() {
			if (this.isSubmitted) {
				this.showCompletedTip(this.taxCompletedTip);
				return;
			}
			if (!this.isAuth) {
				uni.showModal({
					title: '提示',
					content: '您还未完成实名认证，请先完成实名认证后再办理税务申报。',
					confirmText: '去认证',
					success: (res) => {
						if (res.confirm) {
							this.goRealName();
						}
					}
				});
				return;
			}
			if (this.submitting) return;
			this.submitting = true;
			userTaxSubmitApi().then(res => {
				const data = res.data.data || {};
				this.progressStatus = data.progress_status || '已经办理';
				this.isSubmitted = true;
				uni.showToast({
					title: res.data.msg || '申报提交成功，请等待审核',
					icon: 'none',
					duration: 2500
				});
			}).catch(() => {}).finally(() => {
				this.submitting = false;
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	background: #f0f4f8;
	display: flex;
	flex-direction: column;
}

/* ===== 头部 ===== */
.header-section {
	position: relative;
	z-index: 10;
}

.header {
	position: relative;
	width: 100%;
	z-index: 1;
}

.header-img {
	display: block;
	width: 100%;
}

.header-bar {
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	padding-top: var(--status-bar-height);
	height: calc(var(--status-bar-height) + 80rpx);
	display: flex;
	align-items: center;
	padding-left: 16rpx;
}

.back-btn {
	width: 64rpx;
	height: 64rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

/* ===== 滚动区域 ===== */
.scroll {
	flex: 1;
	height: 0;
}

.content {
	padding: 0 24rpx;
}

.scroll-bottom {
	height: 200rpx;
}

/* ===== 卡片 ===== */
.card {
	background: #fff;
	border-radius: 20rpx;
	padding: 28rpx 28rpx 24rpx;
	margin-bottom: 24rpx;
	box-shadow: 0 2rpx 16rpx rgba(0, 0, 0, 0.05);
}

.card-title {
	display: flex;
	align-items: center;
	gap: 12rpx;
	font-size: 30rpx;
	font-weight: 600;
	color: #1f2937;
	margin-bottom: 24rpx;
}

/* 法律说明 */
.notice-card {
	display: flex;
	gap: 16rpx;
	align-items: flex-start;
	background: #bfdbfe;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
	position: relative;
	z-index: 10;
	margin: calc(-100px + 50rpx + 50px) 24rpx 24rpx;
}

.notice-icon {
	flex-shrink: 0;
	margin-top: 4rpx;
}

.notice-text {
	font-size: 26rpx;
	color: #374151;
	line-height: 1.7;
	flex: 1;
}

/* 信息行 */
.info-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #f3f4f6;

	&:last-child {
		border-bottom: none;
	}
}

.label {
	font-size: 28rpx;
	color: #6b7280;
}

.value {
	font-size: 28rpx;
	color: #1f2937;
	font-weight: 500;

	&.blue {
		color: #2563eb;
	}

	&.orange {
		color: #e67e22;
	}

	&.green {
		color: #22c55e;
	}

	&.big {
		font-size: 32rpx;
		font-weight: 700;
	}
}

/* 状态标签 */
.status-tag {
	display: flex;
	align-items: center;
	gap: 8rpx;
	background: #fff7ed;
	border: 1rpx solid #fed7aa;
	border-radius: 32rpx;
	padding: 8rpx 20rpx;
	font-size: 26rpx;
	color: #e67e22;

	&.done {
		background: #f0fdf4;
		border-color: #bbf7d0;
		color: #22c55e;
	}
}

/* 提示框 */
.alert-box {
	display: flex;
	align-items: flex-start;
	gap: 12rpx;
	background: #eff6ff;
	border-radius: 12rpx;
	padding: 20rpx;
	margin-top: 16rpx;
	font-size: 24rpx;
	color: #374151;
	line-height: 1.6;
}

/* 纳税人认证 */
.verify-box {
	display: flex;
	align-items: center;
	gap: 20rpx;
	border-radius: 16rpx;
	padding: 24rpx;

	&.verified {
		background: #f0fdf4;
		border: 1rpx solid #bbf7d0;

		.verify-title {
			color: #166534;
		}

		.verify-desc {
			color: #4ade80;
		}
	}

	&.unverified {
		background: #fffbeb;
		border: 1rpx solid #fde68a;

		.verify-title {
			color: #92400e;
		}

		.verify-desc {
			color: #d97706;
		}
	}
}

.verify-icon {
	flex-shrink: 0;
}

.verify-text {
	flex: 1;
}

.verify-title {
	font-size: 28rpx;
	font-weight: 600;
	margin-bottom: 6rpx;
}

.verify-desc {
	font-size: 24rpx;
}

/* 温馨提示 */
.tips-card {
	position: relative;
	overflow: hidden;
}

.tips-watermark {
	position: absolute;
	right: 20rpx;
	bottom: 20rpx;
	font-size: 200rpx;
	font-weight: 900;
	color: rgba(37, 99, 235, 0.06);
	line-height: 1;
	pointer-events: none;
}

.tips-list {
	position: relative;
	z-index: 1;
}

.tips-item {
	display: flex;
	align-items: flex-start;
	gap: 16rpx;
	margin-bottom: 20rpx;

	&:last-child {
		margin-bottom: 0;
	}
}

.tips-num {
	flex-shrink: 0;
	width: 36rpx;
	height: 36rpx;
	border-radius: 50%;
	background: #2563eb;
	color: #fff;
	font-size: 22rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: 600;
}

.tips-text {
	font-size: 26rpx;
	color: #374151;
	line-height: 1.7;
	flex: 1;
}

/* 页脚 */
.footer-text {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8rpx;
	font-size: 22rpx;
	color: #9ca3af;
	padding: 16rpx 0 8rpx;
}

/* ===== 底部按钮 ===== */
.bottom-bar {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	gap: 24rpx;
	padding: 20rpx 32rpx;
	padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
	background: #fff;
	box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.06);
}

.btn {
	flex: 1;
	height: 88rpx;
	border-radius: 44rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 30rpx;
	font-weight: 500;
}

.btn-outline {
	background: #fff;
	border: 2rpx solid #2563eb;
	color: #2563eb;
}

.btn-primary {
	background: linear-gradient(135deg, #1a56db, #2563eb);
	color: #fff;

	&.disabled {
		opacity: 0.6;
	}
}

.tax-tip-content {
	line-height: 1.6;
	text-align: left;
	padding: 0 10rpx;
}
</style>
