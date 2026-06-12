<template>
	<view class="page">
		<headerView>
			<template #leftIcon>
				<u-icon name="arrow-left" color="#333" size="24"></u-icon>
			</template>
			<view class="nav-title">无忧两全保险</view>
		</headerView>

		<scroll-view scroll-y class="scroll" :style="{ height: scrollHeight }">
			<!-- 顶部图片 -->
			<image class="top-banner-img" src="/static/baoxian/twotop.png" mode="widthFix"></image>

			<!-- 顶部完成提示 -->
			

			<!-- 步骤条 -->
			

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
					<text class="card-edit" @click="goEdit">编辑</text>
				</view>
				<view class="info-row" v-for="(row, i) in personRows(ins)" :key="'i-' + idx + '-' + i">
					<text class="info-label">{{ row.label }}</text>
					<text class="info-value">{{ row.value }}</text>
				</view>
			</view>

			<!-- 受益人信息 -->
			<view class="info-card" v-for="(ben, idx) in displayBeneficiaryList" :key="'ben-' + idx">
				<view class="card-head">
					<view class="card-head-left">
						<u-icon name="account-fill" color="#2ba245" size="18"></u-icon>
						<text class="card-title">受益人信息</text>
						<text class="card-sub" v-if="displayBeneficiaryList.length > 1">{{ idx + 1 }}</text>
					</view>
					<text class="card-edit" @click="goEdit">编辑</text>
				</view>
				<view class="info-row" v-for="(row, i) in beneficiaryRowsFor(ben)" :key="'b-' + idx + '-' + i">
					<text class="info-label">{{ row.label }}</text>
					<text class="info-value">{{ row.value }}</text>
				</view>
			</view>

			<!-- 投保方案 -->
			<view class="info-card">
				<view class="card-head">
					<u-icon name="file-text-fill" color="#2ba245" size="18"></u-icon>
					<text class="card-title">投保方案</text>
				</view>
				<view class="plan-box">
					<view class="plan-col" v-for="(p, i) in planSummary" :key="i">
						<view class="plan-label">{{ p.label }}</view>
						<view class="plan-value">{{ p.value }}</view>
					</view>
				</view>
			</view>

			<view class="scroll-bottom"></view>
		</scroll-view>

		<view class="footer">
			<view class="agree-row" @click="confirmed = !confirmed">
				<view class="agree-check" :class="{ on: confirmed }">
					<u-icon v-if="confirmed" name="checkmark" color="#fff" size="12"></u-icon>
				</view>
				<text class="agree-text">本人已确认以上填报内容无误</text>
			</view>
			<view class="submit-btn" @click="onSubmit">提交资料</view>
		</view>
	</view>
</template>

<script>
	import { baoxianOrderAddApi } from '@/api/api.js';

	const defaultPlan = [
		{ label: '投保产品', value: '无忧两全保险' },
		{ label: '年交保费', value: '1万元' },
		{ label: '交费年限', value: '10年' },
		{ label: '保障期间', value: '10年' }
	];

	const defaultHolder = {
		name: '张三',
		idType: '身份证',
		idNo: '1103344151558451554',
		phone: '13812341548',
		birthday: '1990-01-01',
		gender: '男'
	};

	const defaultInsured = { ...defaultHolder };

	const defaultBeneficiary = {
		relation: '配偶',
		name: '张三',
		idNo: '1103344151558451554',
		ratio: '100'
	};

	export default {
		data() {
			return {
				scrollHeight: 'calc(100vh - 120rpx - var(--status-bar-height))',
				currentStep: 2,
				steps: ['填写资料', '提交资料',  '投保成功', '查看详情'],
				holder: { ...defaultHolder },
				insured: { ...defaultInsured },
				insuredList: [],
				beneficiary: { ...defaultBeneficiary },
				beneficiaryList: [],
				planSummary: [...defaultPlan],
				confirmed: true,
				submitting: false
			};
		},
		computed: {
			holderRows() {
				return this.personRows(this.holder);
			},
			displayInsuredList() {
				return this.insuredList && this.insuredList.length ? this.insuredList : [this.insured];
			},
			displayBeneficiaryList() {
				return this.beneficiaryList && this.beneficiaryList.length ? this.beneficiaryList : [this.beneficiary];
			}
		},
		onLoad() {
			this.loadFormData();
		},
		onShow() {
			this.loadFormData();
		},
		methods: {
			loadFormData() {
				const saved = uni.getStorageSync('baodanone_form');
				if (!saved) return;
				if (saved.holder) this.holder = { ...this.holder, ...saved.holder };
				if (saved.insured) {
					this.insured = { ...this.insured, ...saved.insured };
					this.insuredList = [this.insured];
				} else if (saved.insuredList && saved.insuredList.length) {
					this.insuredList = saved.insuredList.slice(0, 1);
					this.insured = { ...this.insured, ...this.insuredList[0] };
				}
				if (saved.beneficiaryList && saved.beneficiaryList.length) {
					this.beneficiaryList = saved.beneficiaryList;
					this.beneficiary = { ...this.beneficiary, ...saved.beneficiaryList[0] };
				}
				if (saved.plan && saved.plan.length) {
					this.planSummary = saved.plan.map((p) => ({
						label: p.label === '保险期间' ? '保障期间' : p.label,
						value: p.value
					}));
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
			beneficiaryRowsFor(ben) {
				const b = ben || {};
				return [
					{ label: '受益人关系', value: b.relation || '-' },
					{ label: '受益人姓名', value: b.name || '-' },
					{ label: '证件号码', value: this.maskId(b.idNo) },
					{ label: '收益比例', value: (b.ratio || '0') + '%' }
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
			goEdit() {
				const pages = getCurrentPages();
				if (pages && pages.length >= 2) {
					const prev = pages[pages.length - 2];
					const route = prev && (prev.route || (prev.$page && prev.$page.fullPath) || '');
					if (route && route.indexOf('pages/baoxian/baodanone') !== -1) {
						uni.navigateBack();
						return;
					}
				}
				uni.navigateTo({ url: '/pages/baoxian/baodanone' });
			},
			appendHistory(params, applicationId, submitTime) {
				const planMap = {};
				(this.planSummary || []).forEach((p) => {
					if (p && p.label) planMap[p.label] = p.value;
				});
				const holder = params.holder || {};
				const firstInsured = (params.insured_list && params.insured_list[0]) || {};

				const now = new Date(submitTime);
				const y = now.getFullYear();
				const m = String(now.getMonth() + 1).padStart(2, '0');
				const d = String(now.getDate()).padStart(2, '0');
				const orderNo = applicationId
					? String(applicationId)
					: `${y}${m}${d}-${String(Math.floor(1000000 + Math.random() * 9000000))}`;
				const appDate = `${y}-${m}-${d}`;
				const WAIT_DAYS = 90;
				const eff = new Date(submitTime);
				eff.setDate(eff.getDate() + WAIT_DAYS);
				const effectiveDate = `${eff.getFullYear()}-${String(eff.getMonth() + 1).padStart(2, '0')}-${String(eff.getDate()).padStart(2, '0')}`;

				const record = {
					orderNo,
					applicationId,
					submitTime,
					appDate,
					effectiveDate,
					status: 'submitted',
					product: planMap['投保产品'] || '无忧两全保险',
					premium: planMap['年交保费'] || '',
					paymentTerm: planMap['交费年限'] || '',
					coverageTerm: planMap['保障期间'] || planMap['保险期间'] || '',
					holderName: holder.name || '',
					holderIdNo: holder.id_no || '',
					insuredName: firstInsured.name || '',
					insuredIdNo: firstInsured.id_no || ''
				};

				const prev = uni.getStorageSync('baodan_history');
				const list = Array.isArray(prev) ? prev.slice() : [];
				const idx = list.findIndex((it) => it && it.orderNo && it.orderNo === orderNo);
				if (idx >= 0) {
					list[idx] = { ...list[idx], ...record };
				} else {
					list.unshift(record);
				}
				uni.setStorageSync('baodan_history', list);
				uni.setStorageSync('baodanthree_order', {
					orderNo,
					appDate,
					effectiveDate
				});
			},
			normalizePerson(p) {
				if (!p) return {};
				return {
					name: (p.name || '').trim(),
					id_type: p.id_type || p.idType || '身份证',
					id_no: (p.id_no || p.idNo || '').trim(),
					phone: (p.phone || '').trim(),
					birthday: p.birthday || '',
					gender: p.gender || '男'
				};
			},
			normalizeBeneficiary(b) {
				if (!b) return {};
				const ratioNum = parseFloat(b.ratio);
				return {
					relation: (b.relation || '').trim(),
					name: (b.name || '').trim(),
					id_no: (b.id_no || b.idNo || '').trim(),
					ratio: isNaN(ratioNum) ? 0 : ratioNum
				};
			},
			normalizePlan(list) {
				const map = {
					投保产品: 'product_name',
					年交保费: 'annual_premium',
					交费年限: 'payment_term',
					保险期间: 'coverage_term',
					保障期间: 'coverage_term'
				};
				const plan = {};
				(list || []).forEach((p) => {
					const key = map[p.label];
					if (key) plan[key] = p.value || '';
				});
				return plan;
			},
			async onSubmit() {
				if (!this.confirmed) {
					uni.$u.toast('请先确认填报内容无误');
					return;
				}
				if (this.submitting) return;
				this.submitting = true;

				const insuredSrc = this.displayInsuredList;
				const beneficiarySrc = this.displayBeneficiaryList;

				const params = {
					submit: true,
					agreed: true,
					holder: this.normalizePerson(this.holder),
					insured_list: insuredSrc.map((p) => this.normalizePerson(p)),
					beneficiary_list: beneficiarySrc.map((b) => this.normalizeBeneficiary(b)),
					plan: this.normalizePlan(this.planSummary)
				};

				try {
					const res = await baoxianOrderAddApi(params);
					const data = res && res.data ? res.data : res;
					if (data && (data.code === 1 || data.code === 0 || data.success)) {
						const applicationId = (data.data && (data.data.application_id || data.data.id)) || '';
						const submitTime = Date.now();
						uni.setStorageSync('baodantwo_confirmed', {
							...params,
							applicationId,
							submitTime
						});
						this.appendHistory(params, applicationId, submitTime);
						uni.removeStorageSync('baodanone_form');
						uni.$u.toast('资料提交成功');
						setTimeout(() => {
							uni.navigateTo({ url: '/pages/baoxian/baodanthree' });
						}, 800);
					}
				} catch (err) {
					console.error('保险投保提交失败：', err);
				} finally {
					this.submitting = false;
				}
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
		height: 220rpx;
	}

	.top-banner-img {
		display: block;
		width: 100%;
	}

	/* 完成提示区 */
	.complete-banner {
		margin: 16rpx 24rpx 0;
		background: linear-gradient(180deg, #e8f7eb 0%, #f5faf6 60%, $page-bg 100%);
		border-radius: 20rpx;
		padding: 48rpx 32rpx 40rpx;
		text-align: center;
		position: relative;
		overflow: hidden;

		&::before,
		&::after {
			content: '';
			position: absolute;
			width: 120rpx;
			height: 120rpx;
			border-radius: 50%;
			background: rgba(43, 162, 69, 0.06);
			top: -20rpx;
		}

		&::before {
			left: -30rpx;
		}

		&::after {
			right: -30rpx;
		}
	}

	.shield-box {
		position: relative;
		display: inline-flex;
		margin-bottom: 24rpx;
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

	.complete-title {
		font-size: 40rpx;
		font-weight: 700;
		color: $page-green;
		line-height: 1.3;
	}

	.complete-sub {
		font-size: 26rpx;
		color: #888;
		margin-top: 12rpx;
	}

	/* 步骤条 */
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

	/* 信息卡片 */
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

	.card-title {
		font-size: 30rpx;
		font-weight: 600;
		color: #333;
		margin-left: 10rpx;
	}

	.card-sub {
		font-size: 24rpx;
		color: #999;
		margin-left: 8rpx;
	}

	.card-edit {
		font-size: 26rpx;
		color: $page-green;
	}

	.info-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
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

	/* 投保方案 */
	.plan-box {
		display: flex;
		background: rgba(43, 162, 69, 0.08);
		border-radius: 12rpx;
		padding: 24rpx 8rpx;
		margin-top: 16rpx;
	}

	.plan-col {
		flex: 1;
		text-align: center;
	}

	.plan-label {
		font-size: 22rpx;
		color: #888;
		margin-bottom: 8rpx;
	}

	.plan-value {
		font-size: 24rpx;
		color: #333;
		font-weight: 600;
	}

	/* 底部 */
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

	.agree-row {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.agree-check {
		width: 32rpx;
		height: 32rpx;
		border: 2rpx solid #ccc;
		border-radius: 50%;
		margin-right: 12rpx;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;

		&.on {
			background: $page-green;
			border-color: $page-green;
		}
	}

	.agree-text {
		font-size: 24rpx;
		color: #666;
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
