<template>
	<view class="page">
		<headerView>
			<template #leftIcon>
				<u-icon name="arrow-left" color="#333" size="24"></u-icon>
			</template>
			<view class="nav-title">投保成功</view>
		</headerView>

		<scroll-view scroll-y class="scroll" :style="{ height: scrollHeight }">
			<!-- 顶部图片 -->
			<image class="top-banner-img" src="/static/baoxian/threetop.png" mode="widthFix"></image>

			<!-- 顶部成功提示 -->
			
			<!-- 投保信息 -->
			<view class="info-card">
				<view class="card-head">
					<u-icon name="file-text-fill" color="#2ba245" size="18"></u-icon>
					<text class="card-title">投保信息</text>
				</view>
				<view class="info-row" v-for="(row, i) in policyRows" :key="'p-' + i">
					<text class="info-label">{{ row.label }}</text>
					<text class="info-value">{{ row.value }}</text>
				</view>
			</view>

			<!-- 投保人信息 -->
			<view class="info-card">
				<view class="card-head">
					<u-icon name="account-fill" color="#2ba245" size="18"></u-icon>
					<text class="card-title">投保人信息</text>
				</view>
				<view class="info-row" v-for="(row, i) in holderRows" :key="'h-' + i">
					<text class="info-label">{{ row.label }}</text>
					<text class="info-value">{{ row.value }}</text>
				</view>
			</view>

			<!-- 被保险人信息 -->
			<view class="info-card" v-for="(ins, idx) in displayInsuredList" :key="'ins-' + idx">
				<view class="card-head">
					<view class="card-head-left">
						<u-icon name="account-fill" color="#2ba245" size="18"></u-icon>
						<text class="card-title">被保险人信息</text>
						<text class="card-sub" v-if="displayInsuredList.length > 1">{{ idx + 1 }}</text>
					</view>
				</view>
				<view class="info-row" v-for="(row, i) in personRows(ins)" :key="'i-' + idx + '-' + i">
					<text class="info-label">{{ row.label }}</text>
					<text class="info-value">{{ row.value }}</text>
				</view>
			</view>

			<!-- 保障权益 -->
			<view class="info-card">
				<view class="card-head">
					<u-icon name="heart-fill" color="#2ba245" size="18"></u-icon>
					<text class="card-title">保障权益</text>
				</view>
				<view class="benefits">
					<view class="benefit-item" v-for="(b, i) in benefits" :key="i">
						<view class="benefit-icon">
							<u-icon :name="b.icon" color="#2ba245" size="28"></u-icon>
						</view>
						<view class="benefit-title">{{ b.title }}</view>
						<view class="benefit-desc">{{ b.desc }}</view>
					</view>
				</view>
			</view>

			<!-- 温馨提示 -->
			<view class="tips-box">
				<view class="tips-head">
					<u-icon name="info-circle-fill" color="#2ba245" size="18"></u-icon>
					<text class="tips-title">温馨提示</text>
				</view>
				<view class="tips-item" v-for="(t, i) in warmTips" :key="i">
					<text class="tips-dot">•</text>
					<text class="tips-text">{{ t }}</text>
				</view>
			</view>

			<view class="scroll-bottom"></view>
		</scroll-view>

		<view class="footer">
			<view class="submit-btn" @click="viewPolicy">查看保单</view>
		</view>
	</view>
</template>

<script>
	const WAIT_DAYS = 90;

	export default {
		data() {
			return {
				scrollHeight: 'calc(100vh - 120rpx - var(--status-bar-height))',
				currentStep: 4,
				steps: ['填写资料', '提交资料', '上传体检报告', '投保完成'],
				holder: {
					name: '',
					idType: '身份证',
					idNo: '',
					phone: '',
					birthday: '',
					gender: ''
				},
				insured: {
					name: '',
					idType: '身份证',
					idNo: '',
					phone: '',
					birthday: '',
					gender: ''
				},
				insuredList: [],
				orderNo: '',
				appDate: '',
				effectiveDate: '',
				benefits: [
					{
						icon: 'heart-fill',
						title: '重大疾病保障',
						desc: '确诊重大疾病 立即给付50万元'
					},
					{
						icon: 'star-fill',
						title: '身故保障',
						desc: '投保人身故 家属获赔50万元'
					},
					{
						icon: 'red-packet-fill',
						title: '满期返还',
						desc: '十年期满 返还12.16万元/份'
					}
				],
				warmTips: [
					'等待期为90天，等待期内发生保险事故，我们将不承担保险责任',
					'等待期后(第91天及之后)发生保险事故，我们将按照保险合同约定进行理赔',
					'您可以在“我的保单”中查看保单详情',
					'电子保单和纸质合同将通过邮寄方式发送给您'
				],
				policyInfo: {
					product: '无忧两全保险',
					shares: '1份',
					sumInsured: '50万元',
					premium: '1万元',
					paymentTerm: '10年',
					coverageTerm: '10年'
				}
			};
		},
		computed: {
			policyRows() {
				return [
					{ label: '订单号', value: this.orderNo },
					{ label: '保险产品', value: this.policyInfo.product },
					{ label: '投保份数', value: this.policyInfo.shares },
					{ label: '每份保额', value: this.policyInfo.sumInsured },
					{ label: '每份费用', value: this.policyInfo.premium },
					{ label: '交费年期', value: this.policyInfo.paymentTerm },
					{ label: '保障期限', value: this.policyInfo.coverageTerm },
					{ label: '投保日期', value: this.appDate },
					{
						label: '保单生效日',
						value: `${this.effectiveDate}（等待期${WAIT_DAYS}天）`
					}
				];
			},
			holderRows() {
				return this.personRows(this.holder);
			},
			displayInsuredList() {
				return this.insuredList && this.insuredList.length ? this.insuredList : [this.insured];
			}
		},
		onLoad(options) {
			this.initDates();
			this.loadFormData();
			if (options && options.orderNo) {
				this.orderNo = options.orderNo;
			}
		},
		onShow() {
			this.loadFormData();
		},
		methods: {
			initDates() {
				const now = new Date();
				const y = now.getFullYear();
				const m = String(now.getMonth() + 1).padStart(2, '0');
				const d = String(now.getDate()).padStart(2, '0');
				this.appDate = `${y}-${m}-${d}`;
				const effective = new Date(now);
				effective.setDate(effective.getDate() + WAIT_DAYS);
				const ey = effective.getFullYear();
				const em = String(effective.getMonth() + 1).padStart(2, '0');
				const ed = String(effective.getDate()).padStart(2, '0');
				this.effectiveDate = `${ey}-${em}-${ed}`;
				this.orderNo = `${y}${m}${d}-${String(Math.floor(1000000 + Math.random() * 9000000))}`;
			},
			normalizeDisplayPerson(p) {
				if (!p) return {};
				return {
					name: p.name || '',
					idType: p.id_type || p.idType || '身份证',
					idNo: p.id_no || p.idNo || '',
					phone: p.phone || '',
					birthday: p.birthday || '',
					gender: p.gender || ''
				};
			},
			applyPersonData(holder, insuredList) {
				if (holder) {
					this.holder = { ...this.holder, ...this.normalizeDisplayPerson(holder) };
				}
				if (insuredList && insuredList.length) {
					this.insuredList = insuredList.map((p) => this.normalizeDisplayPerson(p));
					this.insured = { ...this.insured, ...this.insuredList[0] };
				}
			},
			loadFormData() {
				const saved = uni.getStorageSync('baodanone_form');
				if (saved) {
					if (saved.holder) {
						this.holder = { ...this.holder, ...this.normalizeDisplayPerson(saved.holder) };
					}
					if (saved.insured) {
						this.insured = { ...this.insured, ...this.normalizeDisplayPerson(saved.insured) };
						this.insuredList = [this.insured];
					} else if (saved.insuredList && saved.insuredList.length) {
						this.insuredList = saved.insuredList.map((p) => this.normalizeDisplayPerson(p));
						this.insured = { ...this.insured, ...this.insuredList[0] };
					}
					if (saved.plan && saved.plan.length) {
						saved.plan.forEach((p) => {
							const label = p.label || '';
							const value = p.value || '';
							if (label.includes('产品') || label === '投保产品') {
								this.policyInfo.product = value;
							}
							if (label.includes('保费')) this.policyInfo.premium = value;
							if (label.includes('交费') || label.includes('缴费')) {
								this.policyInfo.paymentTerm = value;
							}
							if (label.includes('保障') || label.includes('保险期间')) {
								this.policyInfo.coverageTerm = value;
							}
						});
					}
				}
				const confirmed = uni.getStorageSync('baodantwo_confirmed');
				if (confirmed) {
					const insuredSrc =
						(confirmed.insured_list && confirmed.insured_list.length && confirmed.insured_list) ||
						(confirmed.insuredList && confirmed.insuredList.length && confirmed.insuredList) ||
						(confirmed.insured ? [confirmed.insured] : null);
					this.applyPersonData(confirmed.holder, insuredSrc);
				}
				const cached = uni.getStorageSync('baodanthree_order');
				if (cached && cached.orderNo) {
					this.orderNo = cached.orderNo;
					if (cached.appDate) this.appDate = cached.appDate;
					if (cached.effectiveDate) this.effectiveDate = cached.effectiveDate;
				} else {
					uni.setStorageSync('baodanthree_order', {
						orderNo: this.orderNo,
						appDate: this.appDate,
						effectiveDate: this.effectiveDate
					});
				}
			},
			personRows(person) {
				const p = person || {};
				return [
					{ label: '姓名', value: p.name || '-' },
					{ label: '证件类型', value: p.idType || '身份证' },
					{ label: '证件号码', value: this.maskId(p.idNo) },
					{ label: '手机号', value: this.maskPhone(p.phone) },
					{ label: '出生日期', value: p.birthday || '-' },
					{ label: '性别', value: p.gender || '-' }
				];
			},
			maskId(id) {
				if (!id) return '-';
				const s = String(id);
				if (s.length <= 8) return s;
				return s.slice(0, 6) + '****' + s.slice(-4);
			},
			maskPhone(phone) {
				if (!phone) return '-';
				const s = String(phone);
				if (s.length < 7) return s;
				return s.slice(0, 3) + '****' + s.slice(-4);
			},
			viewPolicy() {
				const confirmed = uni.getStorageSync('baodantwo_confirmed') || {};
				const applicationId = confirmed.applicationId || '';
				const url = applicationId
					? `/pages/baoxian/baodanfour?application_id=${encodeURIComponent(applicationId)}`
					: '/pages/baoxian/baodanfour';
				uni.navigateTo({ url });
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

	.scroll {
		flex: 1;
		padding: 0 0 24rpx;
		box-sizing: border-box;
	}

	.scroll-bottom {
		height: 160rpx;
	}

	.top-banner-img {
		display: block;
		width: 100%;
	}

	.success-banner {
		margin: 16rpx 24rpx 0;
		background: linear-gradient(180deg, #e8f7eb 0%, #f0faf2 50%, $page-bg 100%);
		border-radius: 20rpx;
		padding: 48rpx 32rpx 36rpx;
		text-align: center;
		position: relative;
		overflow: hidden;

		&::before,
		&::after {
			content: '';
			position: absolute;
			width: 140rpx;
			height: 140rpx;
			border-radius: 50%;
			background: rgba(43, 162, 69, 0.06);
			top: -30rpx;
		}

		&::before {
			left: -40rpx;
		}

		&::after {
			right: -40rpx;
		}
	}

	.shield-box {
		position: relative;
		display: inline-flex;
		margin-bottom: 20rpx;
	}

	.shield-ring {
		width: 140rpx;
		height: 140rpx;
		border-radius: 50%;
		background: rgba(43, 162, 69, 0.12);
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 0 0 12rpx rgba(43, 162, 69, 0.06);
	}

	.shield-badge {
		position: absolute;
		right: -4rpx;
		bottom: 4rpx;
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
		background: $page-green;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 4rpx solid #fff;
	}

	.success-title {
		font-size: 44rpx;
		font-weight: 700;
		color: $page-green;
		line-height: 1.3;
	}

	.success-ribbon {
		display: inline-block;
		margin-top: 20rpx;
		padding: 10rpx 36rpx;
		background: linear-gradient(90deg, #2ba245, #3bc45a);
		border-radius: 8rpx;
		position: relative;

		text {
			font-size: 24rpx;
			color: #fff;
			letter-spacing: 1rpx;
		}

		&::before,
		&::after {
			content: '';
			position: absolute;
			top: 50%;
			width: 0;
			height: 0;
			border: 12rpx solid transparent;
			transform: translateY(-50%);
		}

		&::before {
			left: -8rpx;
			border-right-color: #2ba245;
		}

		&::after {
			right: -8rpx;
			border-left-color: #3bc45a;
		}
	}

	.steps-wrap {
		margin: 20rpx 24rpx 0;
		background: #fff;
		border-radius: 16rpx;
		padding: 28rpx 12rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
	}

	.steps {
		display: flex;
		justify-content: space-between;
		position: relative;
	}

	.step-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		z-index: 1;

		&.active .step-dot {
			background: $page-green;
			border-color: $page-green;
			color: #fff;
		}

		&.done .step-dot {
			background: $page-green;
			border-color: $page-green;
		}

		&.active .step-label,
		&.done .step-label {
			color: $page-green;
		}
	}

	.step-dot {
		width: 44rpx;
		height: 44rpx;
		border-radius: 50%;
		border: 2rpx solid #ddd;
		background: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 22rpx;
		color: #999;
	}

	.step-label {
		font-size: 20rpx;
		color: #999;
		margin-top: 10rpx;
		text-align: center;
		white-space: nowrap;
		transform: scale(0.85);
		max-width: 120rpx;
	}

	.step-line {
		position: absolute;
		top: 22rpx;
		left: 55%;
		width: 90%;
		height: 0;
		border-top: 2rpx dashed #ddd;
		z-index: 0;
	}

	.info-card {
		margin: 20rpx 24rpx 0;
		background: #fff;
		border-radius: 16rpx;
		padding: 28rpx 24rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
	}

	.card-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 8rpx;
		padding-bottom: 16rpx;
		border-bottom: 1rpx solid #f0f0f0;
	}

	.card-head-left {
		display: flex;
		align-items: center;
	}

	.card-sub {
		font-size: 24rpx;
		color: #999;
		margin-left: 8rpx;
	}

	.card-title {
		font-size: 30rpx;
		font-weight: 600;
		color: #333;
		margin-left: 10rpx;
	}

	.info-row {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		padding: 18rpx 0;
		border-bottom: 1rpx solid #f5f5f5;

		&:last-child {
			border-bottom: none;
		}
	}

	.info-label {
		font-size: 26rpx;
		color: #888;
		flex-shrink: 0;
	}

	.info-value {
		font-size: 26rpx;
		color: #333;
		text-align: right;
		flex: 1;
		margin-left: 24rpx;
		word-break: break-all;
	}

	.benefits {
		display: flex;
		margin-top: 16rpx;
		gap: 12rpx;
	}

	.benefit-item {
		flex: 1;
		text-align: center;
		padding: 20rpx 8rpx;
		background: rgba(43, 162, 69, 0.06);
		border-radius: 12rpx;
	}

	.benefit-icon {
		width: 64rpx;
		height: 64rpx;
		margin: 0 auto 12rpx;
		border-radius: 50%;
		background: rgba(43, 162, 69, 0.12);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.benefit-title {
		font-size: 24rpx;
		font-weight: 600;
		color: #333;
		margin-bottom: 8rpx;
	}

	.benefit-desc {
		font-size: 20rpx;
		color: #888;
		line-height: 1.5;
	}

	.tips-box {
		margin: 20rpx 24rpx 0;
		background: #faf6ef;
		border-radius: 16rpx;
		padding: 28rpx 24rpx;
		border: 1rpx solid #f0e8d8;
	}

	.tips-head {
		display: flex;
		align-items: center;
		margin-bottom: 16rpx;
	}

	.tips-title {
		font-size: 28rpx;
		font-weight: 600;
		color: #333;
		margin-left: 10rpx;
	}

	.tips-item {
		display: flex;
		align-items: flex-start;
		margin-bottom: 12rpx;

		&:last-child {
			margin-bottom: 0;
		}
	}

	.tips-dot {
		color: $page-green;
		font-size: 28rpx;
		line-height: 1.4;
		margin-right: 8rpx;
		flex-shrink: 0;
	}

	.tips-text {
		font-size: 24rpx;
		color: #666;
		line-height: 1.6;
		flex: 1;
	}

	.footer {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 16rpx 32rpx calc(20rpx + env(safe-area-inset-bottom));
		background: #fff;
		box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.06);
		z-index: 10;
	}

	.submit-btn {
		height: 88rpx;
		line-height: 88rpx;
		text-align: center;
		background: linear-gradient(90deg, #2ba245, #3bc45a);
		color: #fff;
		font-size: 32rpx;
		font-weight: 600;
		border-radius: 44rpx;
	}
</style>
