<template>
	<view class="page">
		<headerView>
			<template #leftIcon>
				<u-icon name="arrow-left" color="#333" size="24"></u-icon>
			</template>
			<view class="nav-title">无忧两全保险</view>
			<template #rightIcon>
				<view class="nav-right" @tap.stop="goMyPolicy">
					<u-icon name="file-text" color="#2ba245" size="16"></u-icon>
					<text class="nav-right-text">我的保单</text>
				</view>
			</template>
		</headerView>

		<scroll-view scroll-y class="scroll" :style="{ height: scrollHeight }">
			<!-- 顶部图片 -->
			<image class="top-banner-img" src="/static/baoxian/baoxianbng.png" mode="widthFix"></image>

			<!-- 顶部 Banner -->
			<!-- <view class="banner">
				<view class="banner-top">
					<image class="banner-logo" src="/static/logo.png" mode="heightFix"></image>
					<view class="banner-brand">中国人寿</view>
				</view>
				<view class="banner-body">
					<view class="banner-left">
						<view class="banner-title">无忧两全保险</view>
						<view class="banner-slogan">双重守护，安心无忧，未来可期</view>
						<view class="banner-tags">
							<view class="tag-item" v-for="(t, i) in featureTags" :key="i">
								<view class="tag-icon">
									<u-icon :name="t.icon" color="#2ba245" size="14"></u-icon>
								</view>
								<text>{{ t.label }}</text>
							</view>
						</view>
					</view>
					<view class="banner-right">
						<view class="shield-wrap">
							<u-icon name="account-fill" color="#e8b84a" size="48"></u-icon>
						</view>
					</view>
				</view>
			</view>
 -->
			<!-- 产品亮点 -->
			<view class="highlights">
				<view class="highlight-card" v-for="(h, i) in highlights" :key="i">
					<view class="h-head">
						<view class="h-icon">
							<image v-if="i === 0" class="h-icon-img" src="/static/baoxian/fuwu.png" mode="aspectFit"></image>
							<image v-else-if="i === 1" class="h-icon-img" src="/static/baoxian/baoxian.png" mode="aspectFit"></image>
							<image v-else-if="i === 2" class="h-icon-img" src="/static/baoxian/caiwu.png" mode="aspectFit"></image>
							<image v-else-if="i === 3" class="h-icon-img" src="/static/baoxian/riqi.png" mode="aspectFit"></image>
							<u-icon v-else :name="h.icon" color="#2ba245" size="22"></u-icon>
						</view>
						<view class="h-title">
							<text class="h-title-main">{{ h.title }}</text>
							<text class="h-title-sub">{{ h.subtitle }}</text>
						</view>
					</view>
					<view class="h-value" v-html="formatValue(h.value)"></view>
					<view class="h-desc" v-html="formatDesc(h.desc)"></view>
				</view>
			</view>

			<!-- 步骤条 -->
			<view class="steps-wrap">
				<view class="steps">
					<view
						class="step-item"
						v-for="(s, i) in steps"
						:key="i"
						:class="{ active: currentStep === i + 1, done: currentStep > i + 1 }"
					>
						<view class="step-dot">
							<text v-if="currentStep <= i + 1">{{ i + 1 }}</text>
							<u-icon v-else name="checkmark" color="#fff" size="12"></u-icon>
						</view>
						<view class="step-label">{{ s }}</view>
						<view class="step-line" v-if="i < steps.length - 1"></view>
					</view>
				</view>
			</view>

			<!-- 投保人信息 -->
			<view class="form-card">
				<view class="card-head">
					<u-icon name="account-fill" color="#2ba245" size="18"></u-icon>
					<text class="card-title">投保人信息</text>
				</view>
				<view class="form-grid">
					<view class="field">
						<view class="label">姓名</view>
						<input class="input" v-model="holder.name" placeholder="请输入姓名" placeholder-class="ph" />
					</view>
					<view class="field" @click="openPicker('idType', 'holder')">
						<view class="label">证件类型</view>
						<view class="picker-val">
							<text>{{ holder.idType }}</text>
							<u-icon name="arrow-down" color="#999" size="12"></u-icon>
						</view>
					</view>
					<view class="field full">
						<view class="label">证件号码</view>
						<input class="input" v-model="holder.idNo" placeholder="请输入证件号码" placeholder-class="ph" maxlength="18" />
					</view>
					<view class="field">
						<view class="label">手机号码</view>
						<input class="input" v-model="holder.phone" type="number" placeholder="请输入手机号码" placeholder-class="ph" maxlength="11" />
					</view>
					<view class="field" @click="openDatePicker('holder')">
						<view class="label">出生日期</view>
						<view class="picker-val">
							<text :class="{ ph: !holder.birthday }">{{ holder.birthday || '请选择出生日期' }}</text>
							<u-icon name="calendar" color="#2ba245" size="16"></u-icon>
						</view>
					</view>
					<view class="field">
						<view class="label">性别</view>
						<view class="gender-row">
							<view class="gender-opt" :class="{ on: holder.gender === '男' }" @click="holder.gender = '男'">
								<view class="radio" :class="{ on: holder.gender === '男' }"></view>
								<text>男</text>
							</view>
							<view class="gender-opt" :class="{ on: holder.gender === '女' }" @click="holder.gender = '女'">
								<view class="radio" :class="{ on: holder.gender === '女' }"></view>
								<text>女</text>
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 被保险人信息（仅一人） -->
			<view class="form-card">
				<view class="card-head">
					<view class="card-head-left">
						<u-icon name="account-fill" color="#2ba245" size="18"></u-icon>
						<text class="card-title">被保险人信息</text>
					</view>
				</view>
				<view class="form-grid">
					<view class="field">
						<view class="label">姓名</view>
						<input class="input" v-model="insured.name" placeholder="请输入姓名" placeholder-class="ph" />
					</view>
					<view class="field" @click="openPicker('idType', 'insured')">
						<view class="label">证件类型</view>
						<view class="picker-val">
							<text>{{ insured.idType }}</text>
							<u-icon name="arrow-down" color="#999" size="12"></u-icon>
						</view>
					</view>
					<view class="field full">
						<view class="label">证件号码</view>
						<input class="input" v-model="insured.idNo" placeholder="请输入证件号码" placeholder-class="ph" maxlength="18" />
					</view>
					<view class="field">
						<view class="label">手机号码</view>
						<input class="input" v-model="insured.phone" type="number" placeholder="请输入手机号码" placeholder-class="ph" maxlength="11" />
					</view>
					<view class="field" @click="openDatePicker('insured')">
						<view class="label">出生日期</view>
						<view class="picker-val">
							<text :class="{ ph: !insured.birthday }">{{ insured.birthday || '请选择出生日期' }}</text>
							<u-icon name="calendar" color="#2ba245" size="16"></u-icon>
						</view>
					</view>
					<view class="field">
						<view class="label">性别</view>
						<view class="gender-row">
							<view class="gender-opt" :class="{ on: insured.gender === '男' }" @click="insured.gender = '男'">
								<view class="radio" :class="{ on: insured.gender === '男' }"></view>
								<text>男</text>
							</view>
							<view class="gender-opt" :class="{ on: insured.gender === '女' }" @click="insured.gender = '女'">
								<view class="radio" :class="{ on: insured.gender === '女' }"></view>
								<text>女</text>
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 受益人信息 -->
			<view class="form-card" v-for="(ben, idx) in beneficiaryList" :key="'ben-' + idx">
				<view class="card-head">
					<view class="card-head-left">
						<u-icon name="account-fill" color="#2ba245" size="18"></u-icon>
						<text class="card-title">受益人信息</text>
						<text class="card-sub" v-if="beneficiaryList.length > 1">{{ idx + 1 }}</text>
					</view>
					<view class="card-add" v-if="idx === 0 && beneficiaryList.length < 2" @click="addBeneficiary">+ 添加受益人</view>
					<view class="card-del" v-else @click="removeBeneficiary(idx)">删除</view>
				</view>
				<view class="form-grid">
					<view class="field" @click="openPicker('relation', 'beneficiary', idx)">
						<view class="label">受益人关系</view>
						<view class="picker-val">
							<text :class="{ ph: !ben.relation }">{{ ben.relation || '请选择与被保人关系' }}</text>
							<u-icon name="arrow-down" color="#999" size="12"></u-icon>
						</view>
					</view>
					<view class="field">
						<view class="label">受益人姓名</view>
						<input class="input" v-model="ben.name" placeholder="请输入姓名" placeholder-class="ph" />
					</view>
					<view class="field full">
						<view class="label">证件号码</view>
						<input class="input" v-model="ben.idNo" placeholder="请输入证件号码" placeholder-class="ph" maxlength="18" />
					</view>
					<view class="field">
						<view class="label">收益比例</view>
						<view class="ratio-wrap">
							<input class="input ratio-input" v-model="ben.ratio" type="number" />
							<text class="ratio-suffix">%</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 投保方案 -->
			<view class="form-card">
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
				<view class="agree-row" @click="agreed = !agreed">
					<view class="agree-check" :class="{ on: agreed }">
						<u-icon v-if="agreed" name="checkmark" color="#fff" size="12"></u-icon>
					</view>
					<view class="agree-text">
						我已阅读并同意
						<text class="link" @click.stop="openDoc('terms')">《保险条款》</text>
						<text class="link" @click.stop="openDoc('notice')">《投保须知》</text>
						<text class="link" @click.stop="openDoc('privacy')">《隐私声明》</text>
					</view>
				</view>
			</view>

			<view class="scroll-bottom"></view>
		</scroll-view>

		<view class="footer">
			<view class="submit-btn" @click="onSubmit">提交信息</view>
		</view>

		<!-- 证件类型 / 关系选择 -->
		<u-picker
			:show="pickerShow"
			:columns="pickerColumns"
			keyName="label"
			@confirm="onPickerConfirm"
			@cancel="pickerShow = false"
			@close="pickerShow = false"
		></u-picker>

		<u-datetime-picker
			:show="dateShow"
			v-model="dateValue"
			mode="date"
			:minDate="minBirthDate"
			:maxDate="maxBirthDate"
			selectedColor="#ffffff"
			@confirm="onDateConfirm"
			@cancel="dateShow = false"
			@close="dateShow = false"
		></u-datetime-picker>
	</view>
</template>

<script>
	const emptyPerson = () => ({
		name: '',
		idType: '身份证',
		idNo: '',
		phone: '',
		birthday: '',
		gender: '男'
	});

	const emptyBeneficiary = () => ({
		relation: '',
		name: '',
		idNo: '',
		ratio: '100'
	});

	export default {
		data() {
			return {
				scrollHeight: 'calc(100vh - 120rpx - var(--status-bar-height))',
				currentStep: 1,
				steps: ['确认信息', '提交资料', '投保成功', '查看详情'],
				featureTags: [
					{ icon: 'heart-fill', label: '健康守护' },
					{ icon: 'plus-circle-fill', label: '安心医疗' },
					{ icon: 'checkmark-circle-fill', label: '高额保障' },
					{ icon: 'red-packet-fill', label: '满期返还' }
				],
				highlights: [
					{
						icon: 'heart-fill',
						title: '重大疾病',
						subtitle: '全球保障',
						value: '50万',
						desc: '发生重大疾病 立即赔付50万元'
					},
					{
						icon: 'star-fill',
						title: '身故保障',
						subtitle: '家庭无忧',
						value: '50万',
						desc: '发生身故保障 立即赔付50万元'
					},
					{
						icon: 'red-packet-fill',
						title: '满期返还',
						subtitle: '可达高额',
						value: '12-15万',
						desc: '保险期满 返还累计保费'
					},
					{
						icon: 'calendar-fill',
						title: '保费金额',
						subtitle: '共缴十年',
						value: '1万元/年',
						desc: '年交保费 共缴纳10年'
					}
				],
				holder: emptyPerson(),
				insured: emptyPerson(),
				beneficiaryList: [emptyBeneficiary()],
				planSummary: [
					{ label: '投保产品', value: '无忧两全保险' },
					{ label: '年交保费', value: '1万元' },
					{ label: '交费年限', value: '10年' },
					{ label: '保险期间', value: '10年' }
				],
				agreed: false,
				pickerShow: false,
				pickerColumns: [],
				pickerType: '',
				pickerTarget: '',
				pickerIndex: 0,
				idTypeOptions: [
					{ label: '身份证' },
					{ label: '护照' },
					{ label: '港澳通行证' },
					{ label: '台湾通行证' }
				],
				relationOptions: [
					{ label: '配偶' },
					{ label: '子女' },
					{ label: '父母' },
					{ label: '兄弟姐妹' },
					{ label: '其他' }
				],
				dateShow: false,
				dateValue: Number(new Date('1990-01-01')),
				dateTarget: '',
				dateIndex: 0,
				minBirthDate: Number(new Date('1920-01-01')),
				maxBirthDate: Number(new Date())
			};
		},
		onLoad() {
			this.loadSavedForm();
		},
		methods: {
			loadSavedForm() {
				const saved = uni.getStorageSync('baodanone_form');
				if (!saved) return;
				if (saved.holder) {
					this.holder = { ...emptyPerson(), ...saved.holder };
				}
				if (saved.insured) {
					this.insured = { ...emptyPerson(), ...saved.insured };
				} else if (saved.insuredList && saved.insuredList.length) {
					this.insured = { ...emptyPerson(), ...saved.insuredList[0] };
				}
				if (saved.beneficiaryList && saved.beneficiaryList.length) {
					this.beneficiaryList = saved.beneficiaryList
						.slice(0, 2)
						.map((b) => ({ ...emptyBeneficiary(), ...b }));
				}
				if (saved.plan && saved.plan.length) {
					this.planSummary = saved.plan.map((p) => ({ label: p.label, value: p.value }));
				}
			},
			formatValue(val) {
				if (val === undefined || val === null) return '';
				return String(val).replace(/([0-9.\-]+)/g, '<text class="h-value-num">$1</text>');
			},
			formatDesc(val) {
				if (val === undefined || val === null) return '';
				return String(val).replace(/([0-9.\-]+)/g, '<text class="h-desc-num">$1</text>');
			},
			addBeneficiary() {
				if (this.beneficiaryList.length >= 2) {
					uni.$u.toast('受益人最多填写两人');
					return;
				}
				this.beneficiaryList.push(emptyBeneficiary());
			},
			removeBeneficiary(idx) {
				this.beneficiaryList.splice(idx, 1);
			},
			openPicker(type, target, index = 0) {
				this.pickerType = type;
				this.pickerTarget = target;
				this.pickerIndex = index;
				this.pickerColumns = [type === 'relation' ? this.relationOptions : this.idTypeOptions];
				this.pickerShow = true;
			},
			onPickerConfirm(e) {
				const val = e.value[0].label;
				if (this.pickerTarget === 'holder') {
					if (this.pickerType === 'idType') this.holder.idType = val;
				} else if (this.pickerTarget === 'insured') {
					if (this.pickerType === 'idType') this.insured.idType = val;
				} else if (this.pickerTarget === 'beneficiary') {
					this.beneficiaryList[this.pickerIndex].relation = val;
				}
				this.pickerShow = false;
			},
			openDatePicker(target, index = 0) {
				this.dateTarget = target;
				this.dateIndex = index;
				const person = target === 'holder' ? this.holder : this.insured;
				if (person.birthday) {
					this.dateValue = Number(new Date(person.birthday.replace(/-/g, '/')));
				}
				this.dateShow = true;
			},
			onDateConfirm(e) {
				const d = new Date(e.value);
				const str = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
				if (this.dateTarget === 'holder') {
					this.holder.birthday = str;
				} else {
					this.insured.birthday = str;
				}
				this.dateShow = false;
			},
			goMyPolicy() {
				uni.navigateTo({ url: '/pages/baoxian/baodanlist' });
			},
			openDoc(type) {
				const urlMap = {
					terms: 'https://www.e-chinalife.com/xxpl/dhxs/dxcp/',
					notice: 'https://www.e-chinalife.com/c/2023-04-25/a2b4bb5e-24ce-4ead-aaab-e5584522d750.shtml',
					privacy: 'https://www.chinalife.com.cn/chinalife/xytk/yhysbhzc/'
				};
				const url = urlMap[type];
				if (!url) return;
				// #ifdef H5
				window.open(url, '_blank');
				// #endif
				// #ifdef APP-PLUS
				plus.runtime.openURL(url);
				// #endif
				// #ifndef H5 || APP-PLUS
				uni.setClipboardData({
					data: url,
					success: () => uni.$u.toast('链接已复制，请在浏览器中打开')
				});
				// #endif
			},
			validateForm() {
				const phoneReg = /^1[3-9]\d{9}$/;
				if (!this.holder.name.trim()) {
					uni.$u.toast('请输入投保人姓名');
					return false;
				}
				if (!this.holder.idNo.trim()) {
					uni.$u.toast('请输入投保人证件号码');
					return false;
				}
				if (!this.holder.phone.trim()) {
					uni.$u.toast('请输入投保人手机号');
					return false;
				}
				if (!phoneReg.test(this.holder.phone.trim())) {
					uni.$u.toast('投保人手机号格式不正确');
					return false;
				}
				const ins = this.insured;
				if (!ins.name.trim()) {
					uni.$u.toast('请输入被保险人姓名');
					return false;
				}
				if (!ins.idNo.trim()) {
					uni.$u.toast('请输入被保险人证件号码');
					return false;
				}
				if (!ins.phone || !ins.phone.trim()) {
					uni.$u.toast('请输入被保险人手机号');
					return false;
				}
				if (!phoneReg.test(ins.phone.trim())) {
					uni.$u.toast('被保险人手机号格式不正确');
					return false;
				}
				for (let i = 0; i < this.beneficiaryList.length; i++) {
					const ben = this.beneficiaryList[i];
					if (!ben.relation) {
						uni.$u.toast(`请选择受益人${i + 1}关系`);
						return false;
					}
					if (!ben.name.trim()) {
						uni.$u.toast(`请输入受益人${i + 1}姓名`);
						return false;
					}
				}
				const totalRatio = this.beneficiaryList.reduce((s, b) => s + (parseFloat(b.ratio) || 0), 0);
				if (totalRatio !== 100) {
					uni.$u.toast('受益人收益比例合计须为100%');
					return false;
				}
				if (!this.agreed) {
					uni.$u.toast('请先阅读并同意相关协议');
					return false;
				}
				return true;
			},
			onSubmit() {
				if (!this.validateForm()) return;
				uni.setStorageSync('baodanone_form', {
					holder: this.holder,
					insured: this.insured,
					insuredList: [this.insured],
					beneficiaryList: this.beneficiaryList,
					plan: this.planSummary
				});
				uni.navigateTo({ url: '/pages/baoxian/baodantwo' });
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

	.nav-right {
		display: inline-flex;
		align-items: center;
		gap: 6rpx;
		padding: 6rpx 14rpx;
		border-radius: 999rpx;
		background: rgba(43, 162, 69, 0.08);

		.nav-right-text {
			font-size: 24rpx;
			color: #2ba245;
			line-height: 1;
		}
	}

	.scroll {
		flex: 1;
		padding: 0 0 24rpx;
		box-sizing: border-box;
	}

	.banner,
	.highlights,
	.steps-wrap,
	.form-card {
		margin-left: 24rpx;
		margin-right: 24rpx;
	}

	.scroll-bottom {
		height: 160rpx;
	}

	.top-banner-img {
		display: block;
		width: 100%;
	}

	/* Banner */
	.banner {
		margin-top: 16rpx;
		background: linear-gradient(135deg, #fff 0%, #e8f7eb 100%);
		border-radius: 20rpx;
		padding: 28rpx;
		box-shadow: 0 4rpx 20rpx rgba(43, 162, 69, 0.08);
	}

	.banner-top {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.banner-logo {
		height: 48rpx;
		width: 48rpx;
		margin-right: 12rpx;
	}

	.banner-brand {
		font-size: 26rpx;
		color: $page-green;
		font-weight: 600;
	}

	.banner-body {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
	}

	.banner-title {
		font-size: 44rpx;
		font-weight: 700;
		color: $page-green;
		line-height: 1.3;
	}

	.banner-slogan {
		font-size: 24rpx;
		color: #666;
		margin-top: 8rpx;
	}

	.banner-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 16rpx;
		margin-top: 20rpx;
	}

	.tag-item {
		display: flex;
		align-items: center;
		font-size: 20rpx;
		color: #555;
	}

	.tag-icon {
		width: 36rpx;
		height: 36rpx;
		background: rgba(43, 162, 69, 0.12);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 8rpx;
	}

	.banner-right {
		flex-shrink: 0;
		padding-left: 16rpx;
	}

	.shield-wrap {
		width: 120rpx;
		height: 120rpx;
		background: linear-gradient(145deg, #fff8e6, #ffe9a8);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 8rpx 24rpx rgba(232, 184, 74, 0.35);
	}

	/* 亮点卡片 */
	.highlights {
		display: flex;
		flex-wrap: nowrap;
		margin-top: 20rpx;
		background: #fff;
		border-radius: 16rpx;
		border: 1rpx solid #eee;
		overflow: hidden;
	}

	.highlight-card {
		flex: 1;
		min-width: 0;
		padding: 20rpx 12rpx;
		box-sizing: border-box;
		border-right: 1rpx solid #eee;

		&:last-child {
			border-right: none;
		}
	}

	.h-head {
		display: flex;
		align-items: center;
		gap: 8rpx;
		margin-bottom: 6rpx;
	}

	.h-icon {
		flex-shrink: 0;
		line-height: 1;
	}

	.h-icon-img {
		width: 44rpx;
		height: 44rpx;
		display: block;
	}

	.h-title {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		font-size: 18rpx;
		line-height: 1.3;
	}

	.h-title-main {
		color: #222;
		font-weight: 700;
	}

	.h-title-sub {
		color: $page-green;
		font-weight: 500;
		margin-top: 2rpx;
	}

	.h-value {
		font-size: 24rpx;
		font-weight: 500;
		color: $page-green;
		margin: 6rpx 0 4rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		text-align: center;
	}

	::v-deep .h-value-num {
		font-size: 30rpx;
		font-weight: 800;
	}

	.h-desc {
		font-size: 14rpx;
		color: #999;
		line-height: 1.3;
	}

	::v-deep .h-desc-num {
		font-size: 12rpx;
	}

	/* 步骤条 */
	.steps-wrap {
		margin-top: 24rpx;
		background: #fff;
		border-radius: 16rpx;
		padding: 28rpx 16rpx;
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
		transform: scale(0.9);
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

	/* 表单卡片 */
	.form-card {
		margin-top: 20rpx;
		background: #fff;
		border-radius: 16rpx;
		padding: 28rpx 24rpx;
		border: 1rpx solid #eee;
	}

	.card-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 24rpx;
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

	.card-add {
		font-size: 24rpx;
		color: $page-green;
		border: 1rpx dashed $page-green;
		padding: 8rpx 16rpx;
		border-radius: 8rpx;
	}

	.card-del {
		font-size: 24rpx;
		color: #e54d42;
	}

	.form-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 20rpx 16rpx;
	}

	.field {
		width: calc(50% - 8rpx);
		box-sizing: border-box;

		&.full {
			width: 100%;
		}
	}

	.label {
		font-size: 24rpx;
		color: #666;
		margin-bottom: 10rpx;
	}

	.input {
		height: 72rpx;
		line-height: 72rpx;
		background: #f7f8fa;
		border-radius: 8rpx;
		padding: 0 20rpx;
		font-size: 26rpx;
		color: #333;
		border: 1rpx solid #eee;
	}

	.ph {
		color: #bbb;
	}

	.picker-val {
		height: 72rpx;
		background: #f7f8fa;
		border-radius: 8rpx;
		padding: 0 20rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 26rpx;
		color: #333;
		border: 1rpx solid #eee;

		.ph {
			color: #bbb;
		}
	}

	.gender-row {
		display: flex;
		gap: 32rpx;
		height: 72rpx;
		align-items: center;
	}

	.gender-opt {
		display: flex;
		align-items: center;
		font-size: 26rpx;
		color: #666;

		&.on {
			color: $page-green;
		}
	}

	.radio {
		width: 32rpx;
		height: 32rpx;
		border-radius: 50%;
		border: 2rpx solid #ccc;
		margin-right: 10rpx;
		box-sizing: border-box;

		&.on {
			border-color: $page-green;
			background: $page-green;
			box-shadow: inset 0 0 0 6rpx #fff;
		}
	}

	.ratio-wrap {
		display: flex;
		align-items: center;
		background: #f7f8fa;
		border-radius: 8rpx;
		border: 1rpx solid #eee;
		padding-right: 20rpx;
	}

	.ratio-input {
		flex: 1;
		border: none;
		background: transparent;
	}

	.ratio-suffix {
		font-size: 26rpx;
		color: #666;
	}

	/* 投保方案 */
	.plan-box {
		display: flex;
		background: rgba(43, 162, 69, 0.08);
		border-radius: 12rpx;
		padding: 24rpx 12rpx;
		margin-bottom: 24rpx;
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

	.agree-row {
		display: flex;
		align-items: flex-start;
	}

	.agree-check {
		width: 32rpx;
		height: 32rpx;
		border: 2rpx solid #ccc;
		border-radius: 6rpx;
		margin-right: 12rpx;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 4rpx;

		&.on {
			background: $page-green;
			border-color: $page-green;
		}
	}

	.agree-text {
		font-size: 24rpx;
		color: #666;
		line-height: 1.6;
		flex: 1;
	}

	.link {
		color: $page-green;
	}

	/* 底部按钮 */
	.footer {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 20rpx 32rpx calc(20rpx + env(safe-area-inset-bottom));
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
