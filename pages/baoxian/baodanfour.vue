<template>
	<view class="page">
		<headerView>
			<template #leftIcon>
				<u-icon name="arrow-left" color="#fff" size="24"></u-icon>
			</template>
			<view class="nav-title">电子保单</view>
		</headerView>

		<scroll-view scroll-y class="scroll" :style="{ height: scrollHeight }">
			<!-- 顶部图片 -->
			<image class="top-banner-img" src="/static/baoxian/topfour.png" mode="widthFix"></image>

			<!-- 顶部品牌栏 -->
			
			<!-- 保单概要 -->
			<view class="card summary-card">
				
				<view class="kv-row" >
					<text class="kv-label">订单号</text>
					<text class="kv-value" :class="{ active: true }">{{this.orderNo1  }}</text>
				</view>
				<view class="kv-row" >
					<text class="kv-label">保险产品</text>
					<text class="kv-value" :class="{ active: true }">{{this.policyInfo.product  }}</text>
				</view>
				<view class="kv-row" >
					<text class="kv-label">保单状态</text>
					<text class="kv-value" :class="{ active: true }">有效</text>
				</view>
				<!-- <view class="kv-row" v-for="(row, i) in summaryRows" :key="'s-' + i">
					<text class="kv-label">{{ row.label }}</text>
					<text class="kv-value" :class="{ active: row.active }">{{ row.value }}</text>
				</view> -->
			</view>

			<!-- 投保信息 -->
			<view class="card">
				<view class="card-title">投保信息</view>
				<view class="kv-row" v-for="(row, i) in insureRows" :key="'i-' + i">
					<text class="kv-label">{{ row.label }}</text>
					<text class="kv-value">{{ row.value }}</text>
				</view>
			</view>

			<!-- 保障责任 -->
			<view class="card">
				<view class="card-title">保障责任</view>
				<view class="coverage-item" v-for="(item, i) in coverages" :key="'c-' + i">
					<view class="coverage-left">
						<view class="coverage-name">{{ item.title }}</view>
						<view class="coverage-desc">{{ item.desc }}</view>
					</view>
					<text class="coverage-amount">{{ item.amount }}</text>
				</view>
			</view>

			<!-- 保障期间及交费 -->
			<view class="card">
				<view class="card-title">保障期间及交费</view>
				<view class="kv-row" v-for="(row, i) in periodRows" :key="'p-' + i">
					<text class="kv-label">{{ row.label }}</text>
					<text class="kv-value">{{ row.value }}</text>
				</view>
			</view>

			<!-- 特别约定 -->
			<view class="card">
				<view class="card-title">特别约定</view>
				<view class="special-text">{{ specialProvision }}</view>
			</view>

			<!-- 签发信息 -->
			<view class="issuer">
				<text>中国人寿保险股份有限公司</text>
				<text>签发日期：{{ issueDate }}</text>
			</view>

			<view class="scroll-bottom"></view>
		</scroll-view>

		<view class="footer">
			<view class="btn-outline" @click="viewPolicyNo">查看保单号</view>
			<view class="btn-solid" @click="generatePaperPolicyNo">生成纸质保单号</view>
		</view>

		<!-- 查看保单号弹窗（内容沿用 baodanfive 设计） -->
		<u-popup :show="policyPopupShow" mode="center" round="32" closeable @close="policyPopupShow = false">
			<view class="policy-popup">
				<view class="pp-card">
					<view class="pp-illus-wrap">
						<view class="pp-illus-deco pp-deco-left"></view>
						<view class="pp-illus-deco pp-deco-right"></view>
						<view class="pp-orbit pp-orbit-outer"></view>
						<view class="pp-orbit pp-orbit-inner"></view>
						<view class="pp-shield-box">
							<view class="pp-shield-body">
								<u-icon name="clock-fill" color="#fff" size="56"></u-icon>
							</view>
							<view class="pp-shield-badge">
								<u-icon name="checkmark" color="#fff" size="14"></u-icon>
							</view>
						</view>
					</view>

					<view class="pp-main-title">保单号生成倒计时</view>
					<view class="pp-sub-title">保单生效后进入90天等待期</view>

					<view class="pp-days-row">
						<view class="pp-days-box">
							<text class="pp-days-num">{{ waitDays }}</text>
						</view>
						<text class="pp-days-unit">天</text>
					</view>

					<view class="pp-notice">
						<text>等待期内(含第90天)发生保险事故，</text>
						<text>我们将不承担保险责任。</text>
					</view>

					<view class="pp-confirm-btn" @click="policyPopupShow = false">我知道了</view>
				</view>
			</view>
		</u-popup>

		<!-- 生成纸质保单弹窗（内容沿用 baodansix 设计） -->
		<u-popup :show="paperPopupShow" mode="center" round="32" closeable @close="paperPopupShow = false">
			<view class="paper-popup">
				<scroll-view scroll-y class="paper-scroll">
					<!-- 顶部说明 -->
					<view class="paper-hero">
						<view class="paper-doc-box">
							<view class="paper-doc-icon">
								<u-icon name="file-text-fill" color="#2ba245" size="56"></u-icon>
							</view>
							<view class="paper-doc-badge">
								<u-icon name="checkmark" color="#fff" size="14"></u-icon>
							</view>
						</view>
						<view class="paper-hero-title">生成纸质保单</view>
						<view class="paper-hero-sub">请填写收货地址，我们将尽快为您寄出</view>
					</view>

					<!-- 收货地址表单 -->
					<view class="paper-form-card">
						<view class="paper-form-row">
							<view class="paper-form-label"><text class="paper-req">*</text>收件人</view>
							<view class="paper-form-input-wrap">
								<input
									class="paper-form-input"
									v-model="paperForm.name"
									placeholder="请输入收件人姓名"
									placeholder-class="paper-ph"
									@blur="onPaperNameBlur"
								/>
							</view>
						</view>

						<view class="paper-form-row">
							<view class="paper-form-label"><text class="paper-req">*</text>手机号码</view>
							<view class="paper-form-input-wrap">
								<input
									class="paper-form-input"
									v-model="paperForm.phone"
									type="number"
									maxlength="11"
									placeholder="请输入收件人手机号"
									placeholder-class="paper-ph"
								/>
							</view>
						</view>

						<view class="paper-form-row" @click="paperEhShowClike">
							<view class="paper-form-label"><text class="paper-req">*</text>所在地区</view>
							<view class="paper-form-input-wrap paper-picker-wrap">
								<text class="paper-picker-text" :class="{ 'paper-ph': !paperAreaSelected }">{{ paperForm.area }}</text>
								<u-icon name="arrow-right" color="#bbb" size="14"></u-icon>
							</view>
						</view>

						<view class="paper-form-row paper-form-row-tall">
							<view class="paper-form-label"><text class="paper-req">*</text>详细地址</view>
							<view class="paper-form-input-wrap paper-tall">
								<textarea
									class="paper-form-textarea"
									v-model="paperForm.address"
									placeholder="请输入详细地址，如:街道、楼牌号、单元、门牌号等"
									placeholder-class="paper-ph"
									:auto-height="false"
									maxlength="200"
								/>
							</view>
						</view>

						<view class="paper-form-row">
							<view class="paper-form-label"><text class="paper-req">*</text>邮政编码</view>
							<view class="paper-form-input-wrap">
								<input
									class="paper-form-input"
									v-model="paperForm.zipCode"
									type="number"
									maxlength="6"
									placeholder="请输入邮政编码（选填）"
									placeholder-class="paper-ph"
								/>
							</view>
						</view>

						<view class="paper-form-row paper-form-row-tall">
							<view class="paper-form-label"><text class="paper-req">*</text>备注信息</view>
							<view class="paper-form-input-wrap paper-tall">
								<textarea
									class="paper-form-textarea"
									v-model="paperForm.remark"
									placeholder="如有特殊配送要求，请留言（选填）"
									placeholder-class="paper-ph"
									:auto-height="false"
									maxlength="200"
								/>
							</view>
						</view>
					</view>

					<!-- 温馨提示 -->
					<view class="paper-tips-box">
						<view class="paper-tips-head">
							<u-icon name="info-circle-fill" color="#2ba245" size="18"></u-icon>
							<text class="paper-tips-title">温馨提示</text>
						</view>
						<text class="paper-tips-content">纸质保单将在您提交地址后的3-5个工作日内寄出，请您耐心等待。</text>
					</view>
				</scroll-view>

				<view class="paper-footer">
					<view class="paper-btn-cancel" @click="paperPopupShow = false">取消</view>
					<view class="paper-btn-submit" @click="onPaperSubmit">确认提交</view>
				</view>
			</view>
		</u-popup>

		<ehPicker v-if="paperEhShow" :max-level="3" @conceal="onPaperConceal" @showClike="paperEhShowClike" />

	</view>
</template>

<script>
	import ehPicker from '@/components/erha-picker/erha-picker.vue';

	import { baoxianAddressApi,baoxianOrderdetailApi } from '@/api/api.js';
	const WAIT_DAYS = 90;
	const PAPER_AREA_PLACEHOLDER = '请选择省市区';

	export default {
		components: {
			ehPicker
		},
		data() {
			return {
				scrollHeight: 'calc(100vh - 120rpx - var(--status-bar-height))',
				policyPopupShow: false,
				paperPopupShow: false,
				paperEhShow: false,
				paperSubmitting: false,
				detailLoading: false,
				applicationId: '',
				addresscount:0,
				paperForm: {
					name: '',
					phone: '',
					area: PAPER_AREA_PLACEHOLDER,
					address: '',
					zipCode: '',
					remark: ''
				},
				holder: { name: '张三', idNo: '' },
				insured: { name: '张三', idNo: '' },
				insuredList: [],
				orderNo: '20250520-87345678',
				orderNo1: '20260528-81125678',
				policyNo: '',
				paperPolicyNo: '',
				appDate: '2025-05-20',
				effectiveDate: '2025-08-21',
				maturityDate: '2035-08-20',
				issueDate: '2025年05月20日',
				policyInfo: {
					product: '无忧两全保险',
					status: '有效',
					shares: '1份',
					sumInsured: '50万元',
					premium: '1万元',
					paymentTerm: '10年',
					coverageTerm: '10年'
				},
				coverages: [
					{
						title: '重大疾病保险金',
						desc: '确诊合同约定的重大疾病',
						amount: '50万元'
					},
					{
						title: '身故保险金',
						desc: '投保人身故 家属获赔',
						amount: '50万元'
					},
					{
						title: '满期返还',
						desc: '十年期满 返还',
						amount: '12-15万元/份'
					}
				],
				specialProvision:
					'等待期内（含第90天）发生保险事故，我们将不承担保险责任。'
			};
		},
		computed: {
			paperAreaSelected() {
				return this.paperForm.area && this.paperForm.area !== PAPER_AREA_PLACEHOLDER;
			},
			waitDays() {
				const dateStr = this.formatDate(this.appDate);
				if (!dateStr) return WAIT_DAYS;
				const parts = dateStr.split('-').map(Number);
				if (parts.length !== 3 || parts.some(isNaN)) return WAIT_DAYS;
				const created = new Date(parts[0], parts[1] - 1, parts[2]);
				const effective = new Date(created.getFullYear(), created.getMonth(), created.getDate());
				effective.setDate(effective.getDate() + WAIT_DAYS);
				const now = new Date();
				const todayMid = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
				const effectiveMid = new Date(
					effective.getFullYear(),
					effective.getMonth(),
					effective.getDate()
				).getTime();
				const remain = Math.floor((effectiveMid - todayMid) / 86400000);
				return remain > 0 ? remain : 0;
			},
			summaryRows() {
				return [
					{ label: '订单号', value: this.orderNo },
					{ label: '保险产品', value: this.policyInfo.product },
					{ label: '保单状态', value:'有效', active: true }
				];
			},
			displayInsuredList() {
				if (this.insuredList && this.insuredList.length) return this.insuredList;
				return [this.insured];
			},
			insureRows() {
				const rows = [
					{ label: '投保人', value: this.maskName(this.holder.name, this.holder.idNo) }
				];
				const list = this.displayInsuredList;
				const multi = list.length > 1;
				list.forEach((ins, idx) => {
					rows.push({
						label: multi ? `被保人${idx + 1}` : '被保人',
						value: this.maskName(ins.name, ins.idNo)
					});
				});
				rows.push(
					{ label: '交费年限', value: this.policyInfo.paymentTerm },
					{ label: '保险期间', value: this.policyInfo.coverageTerm },
					{ label: '每份保额', value: this.policyInfo.sumInsured },
					{ label: '每份保费', value: this.policyInfo.premium },
					{ label: '投保份数', value: this.policyInfo.shares },
					{ label: '投保日期', value: this.appDate },
					{
						label: '保单生效日',
						value: `${this.effectiveDate}（等待期${WAIT_DAYS}天）`
					}
				);
				return rows;
			},
			periodRows() {
				return [
					{ label: '交费年限', value: this.policyInfo.paymentTerm },
					{ label: '保险期间', value: this.policyInfo.coverageTerm },
					{ label: '每份保额', value: this.policyInfo.sumInsured },
					{ label: '每份保费', value: this.policyInfo.premium },
					{ label: '保单生效日', value: this.effectiveDate },
					{ label: '保单满期日', value: this.maturityDate },
					{ label: '等待期', value: `${WAIT_DAYS}天` }
				];
			}
		},
		onLoad(options) {
			this.loadFormData();
			if (options && options.orderNo) {
				this.orderNo = options.orderNo;
			}
			if (options && options.application_id) {
				this.applicationId = options.application_id;
			}
			if (!this.policyNo) {
				this.policyNo = this.buildPolicyNo();
			}
			if (this.appDate) this.calcEffectiveDate();
			this.calcMaturityDate();
			this.syncIssueDate();
			this.fetchOrderDetail();
		},
		methods: {
			loadFormData() {
				const cached = uni.getStorageSync('baodanthree_order');
				if (cached) {
					if (cached.orderNo) this.orderNo = cached.orderNo;
					if (cached.appDate) {
						this.appDate = this.formatDate(cached.appDate);
						this.calcEffectiveDate();
					}
					if (cached.policyNo) this.policyNo = cached.policyNo;
					if (cached.paperPolicyNo) this.paperPolicyNo = cached.paperPolicyNo;
				}

				const saved = uni.getStorageSync('baodanone_form');
				if (saved) {
					if (saved.holder) this.holder = { ...this.holder, ...saved.holder };
					if (saved.insured) {
						this.insured = { ...this.insured, ...this.normalizeInsured(saved.insured) };
						this.insuredList = [this.insured];
					} else if (saved.insuredList && saved.insuredList.length) {
						this.insuredList = saved.insuredList.slice(0, 1).map((p) => this.normalizeInsured(p));
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
					if (confirmed.holder) {
						this.holder = { ...this.holder, ...this.normalizeInsured(confirmed.holder) };
					}
					const confirmedInsured = confirmed.insuredList || confirmed.insured_list;
					if (Array.isArray(confirmedInsured) && confirmedInsured.length) {
						this.insuredList = confirmedInsured.map((p) => this.normalizeInsured(p));
						this.insured = { ...this.insured, ...this.insuredList[0] };
					} else if (confirmed.insured) {
						this.insured = { ...this.insured, ...this.normalizeInsured(confirmed.insured) };
						this.insuredList = [this.insured];
					}
					if (!this.applicationId && confirmed.applicationId) {
						this.applicationId = confirmed.applicationId;
					}
				}

				this.syncAddressCountFromCache();
				this.persistOrder();
			},
			syncAddressCountFromCache() {
				const cached = uni.getStorageSync('baodansix_address');
				if (!cached || !cached.submitTime) return;
				if (this.orderNo && cached.orderNo && cached.orderNo !== this.orderNo) return;
				this.addresscount = Math.max(this.addresscount, 1);
			},
			async fetchOrderDetail() {
				if (!this.applicationId) return;
				if (this.detailLoading) return;
				this.detailLoading = true;
				try {
					const res = await baoxianOrderdetailApi({ application_id: this.applicationId });
					const data = res && res.data ? res.data : res;
					this.addresscount = data.address
					this.orderNo1 = data.data.order_sn
					console.log(data )
					if (data && (data.code === 1 || data.code === 0 || data.success)) {
						this.applyOrderDetail(data.data || data.result || {});
					}
				} catch (err) {
					console.error('保单详情获取失败：', err);
				} finally {
					this.detailLoading = false;
				}
			},
			applyOrderDetail(info) {
				if (!info || typeof info !== 'object') return;

				if (info.order_no) this.orderNo = String(info.order_no);
				else if (info.application_id) this.orderNo = String(info.application_id);

				if (info.policy_no) this.policyNo = info.policy_no;
				if (info.paper_policy_no) this.paperPolicyNo = info.paper_policy_no;

				if (info.holder) {
					this.holder = {
						name: info.holder.name || this.holder.name,
						idNo: info.holder.id_no || info.holder.idNo || this.holder.idNo
					};
				}

				const insuredArr = info.insuredList || info.insured_list;
				if (Array.isArray(insuredArr) && insuredArr.length) {
					this.insuredList = insuredArr.map((p) => this.normalizeInsured(p));
					this.insured = { ...this.insured, ...this.insuredList[0] };
				} else if (info.insured) {
					const single = this.normalizeInsured(info.insured);
					this.insured = { ...this.insured, ...single };
					this.insuredList = [this.insured];
				}

				const plan = info.plan || {};
				if (plan.product_name || info.product_name) {
					this.policyInfo.product = plan.product_name || info.product_name;
				}
				if (plan.annual_premium || info.annual_premium || info.premium) {
					this.policyInfo.premium = plan.annual_premium || info.annual_premium || info.premium;
				}
				if (plan.payment_term || info.payment_term) {
					this.policyInfo.paymentTerm = plan.payment_term || info.payment_term;
				}
				if (plan.coverage_term || info.coverage_term) {
					this.policyInfo.coverageTerm = plan.coverage_term || info.coverage_term;
				}
				if (info.status) this.policyInfo.status = info.status;
				if (info.sum_insured) this.policyInfo.sumInsured = info.sum_insured;
				if (info.shares) this.policyInfo.shares = info.shares;

				if (info.created_at || info.create_at || info.createdAt) {
					this.appDate = this.formatDate(info.created_at || info.create_at || info.createdAt);
				} else if (info.application_date || info.app_date) {
					this.appDate = this.formatDate(info.application_date || info.app_date);
				}
				if (this.appDate) {
					this.calcEffectiveDate();
				}
				if (info.maturity_date) {
					this.maturityDate = this.formatDate(info.maturity_date);
				} else if (this.effectiveDate) {
					this.calcMaturityDate();
				}
				if (Array.isArray(info.coverages) && info.coverages.length) {
					this.coverages = info.coverages.map((c) => ({
						title: c.title || c.name || '',
						desc: c.desc || c.description || '',
						amount: c.amount || c.sum_insured || ''
					}));
				}

				if (info.special_provision) {
					this.specialProvision = info.special_provision;
				}

				const addressCount = info.addresscount ?? info.address_count;
				if (addressCount !== undefined && addressCount !== null) {
					this.addresscount = Number(addressCount) || 0;
				}
				this.syncAddressCountFromCache();

				this.syncIssueDate();
				this.persistOrder();
			},
			persistOrder() {
				uni.setStorageSync('baodanthree_order', {
					orderNo: this.orderNo,
					appDate: this.appDate,
					effectiveDate: this.effectiveDate,
					policyNo: this.policyNo,
					paperPolicyNo: this.paperPolicyNo
				});
			},
			buildPolicyNo() {
				const base = String(this.orderNo || '').replace(/-/g, '');
				if (base.length >= 12) {
					return `P${base.slice(0, 12)}${String(Math.floor(1000 + Math.random() * 9000))}`;
				}
				const now = new Date();
				const y = now.getFullYear();
				const m = String(now.getMonth() + 1).padStart(2, '0');
				const d = String(now.getDate()).padStart(2, '0');
				return `P${y}${m}${d}${String(Math.floor(10000000 + Math.random() * 90000000))}`;
			},
			buildPaperPolicyNo() {
				return `Z${this.policyNo.replace(/^P/, '')}`;
			},
			calcEffectiveDate() {
				const appStr = this.formatDate(this.appDate);
				if (!appStr) return;
				const parts = appStr.split('-').map(Number);
				if (parts.length !== 3 || parts.some(isNaN)) return;
				const effective = new Date(parts[0], parts[1] - 1, parts[2]);
				effective.setDate(effective.getDate() + WAIT_DAYS);
				const y = effective.getFullYear();
				const m = String(effective.getMonth() + 1).padStart(2, '0');
				const d = String(effective.getDate()).padStart(2, '0');
				this.effectiveDate = `${y}-${m}-${d}`;
			},
			calcMaturityDate() {
				const effectiveStr = this.formatDate(this.effectiveDate);
				if (!effectiveStr) return;
				const parts = effectiveStr.split('-').map(Number);
				if (parts.length !== 3) return;
				const end = new Date(parts[0] + 10, parts[1] - 1, parts[2]);
				end.setDate(end.getDate() - 1);
				const y = end.getFullYear();
				const m = String(end.getMonth() + 1).padStart(2, '0');
				const d = String(end.getDate()).padStart(2, '0');
				this.maturityDate = `${y}-${m}-${d}`;
			},
			syncIssueDate() {
				const dateStr = this.formatDate(this.appDate);
				if (!dateStr) return;
				const parts = dateStr.split('-');
				if (parts.length === 3) {
					this.issueDate = `${parts[0]}年${parts[1]}月${parts[2]}日`;
				}
			},
			formatDate(v) {
				if (!v) return '';
				const s = String(v).trim();
				// 纯日期无时区歧义，直接返回
				if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
				const ts =
					typeof v === 'number'
						? v < 1e12
							? v * 1000
							: v
						: Date.parse(s);
				if (!ts || isNaN(ts)) {
					const match = s.match(/^(\d{4}-\d{2}-\d{2})/);
					return match ? match[1] : '';
				}
				const d = new Date(ts);
				const y = d.getFullYear();
				const m = String(d.getMonth() + 1).padStart(2, '0');
				const day = String(d.getDate()).padStart(2, '0');
				return `${y}-${m}-${day}`;
			},
			normalizeInsured(p) {
				if (!p || typeof p !== 'object') return {};
				return {
					name: p.name || '',
					idNo: p.idNo || p.id_no || ''
				};
			},
			maskName(name, idNo) {
				const n = name || '—';
				if (!idNo) return `${n} ****5678`;
				const s = String(idNo);
				if (s.length <= 4) return `${n} ****`;
				return `${n} ****${s.slice(-4)}`;
			},
			showPolicyModal(title, content) {
				uni.showModal({
					title,
					content,
					showCancel: false,
					confirmText: '知道了'
				});
			},
			viewPolicyNo() {
				if (!this.policyNo) {
					this.policyNo = this.buildPolicyNo();
					this.persistOrder();
				}
				this.policyPopupShow = true;
			},
			generatePaperPolicyNo() {
				if (this.addresscount > 0) {
					uni.$u.toast('已经填写地址');
					return;
				}
				if (!this.policyNo) {
					this.policyNo = this.buildPolicyNo();
				}
				this.paperPolicyNo = this.buildPaperPolicyNo();
				this.persistOrder();
				this.loadPaperFormCached();
				this.paperPopupShow = true;
			},
			loadPaperFormCached() {
				const cached = uni.getStorageSync('baodansix_address');
				if (!cached) return;
				this.paperForm = {
					...this.paperForm,
					name: cached.name || '',
					phone: cached.phone || '',
					area: cached.area || PAPER_AREA_PLACEHOLDER,
					address: cached.address || '',
					zipCode: cached.zipCode || '',
					remark: cached.remark || ''
				};
			},
			onPaperNameBlur() {
				const name = (this.paperForm.name || '').trim();
				if (!name) return;
				if (this.$utils && !this.$utils.containsChinese(name)) {
					this.paperForm.name = '';
					uni.$u.toast('请输入正确姓名');
				}
			},
			paperEhShowClike() {
				this.paperEhShow = !this.paperEhShow;
			},
			onPaperConceal(param) {
				this.paperForm.area = `${param.province} ${param.city} ${param.area}`.trim();
				this.paperEhShowClike();
			},
			validatePaperForm() {
				const name = (this.paperForm.name || '').trim();
				if (!name) {
					uni.$u.toast('请输入收件人姓名1');
					return false;
				}
				const phone = String(this.paperForm.phone || '').trim();
				if (!phone) {
					uni.$u.toast('请输入收件人手机号');
					return false;
				}
				if (!/^1\d{10}$/.test(phone)) {
					uni.$u.toast('请输入正确的手机号');
					return false;
				}
				if (!this.paperAreaSelected) {
					uni.$u.toast('请选择省市区');
					return false;
				}
				const address = (this.paperForm.address || '').trim();
				if (!address) {
					uni.$u.toast('请输入详细地址');
					return false;
				}
				return true;
			},
			async onPaperSubmit() {
				if (!this.validatePaperForm()) return;
				if (this.paperSubmitting) return;
				this.paperSubmitting = true;

				const recipient_name = this.paperForm.name.trim();
				const recipient_phone = String(this.paperForm.phone).trim();
				const area_text = this.paperForm.area;
				const detail_address = this.paperForm.address.trim();
				const zip_code = (this.paperForm.zipCode || '').trim();
				const remark = (this.paperForm.remark || '').trim();

				const params = {
					order_no: this.orderNo,
					policy_no: this.policyNo,
					paper_policy_no: this.paperPolicyNo,
					recipient_name,
					recipient_phone,
					area_text,
					detail_address,
					zip_code: zip_code,
					remark
				};

				try {
					const res = await baoxianAddressApi(params);
					const data = res && res.data ? res.data : res;
					if (data && (data.code === 1 || data.code === 0 || data.success)) {
						this.addresscount = 1;
						// this.orderNo1 = data.order_sn
						uni.setStorageSync('baodansix_address', {
							orderNo: this.orderNo,
							name: recipient_name,
							phone: recipient_phone,
							area: area_text,
							address: detail_address,
							zipCode: zip_code,
							remark,
							submitTime: Date.now()
						});
						this.paperPopupShow = false;
						uni.showModal({
							title: '提交成功',
							content: '收货地址已提交。',
							showCancel: false,
							confirmText: '知道了'
						});
						//this.paperPopupShow 
					}
				} catch (err) {
					console.error('保险地址提交失败：', err);
				} finally {
					this.paperSubmitting = false;
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	$green: #008b45;
	$green-dark: #006b36;
	$page-bg: #f5f5f5;
	$red: #e64340;

	.page {
		min-height: 100vh;
		background: $page-bg;
		display: flex;
		flex-direction: column;
	}

	::v-deep .header {
		color: #fff !important;
		background: $green-dark !important;
		box-shadow: none;
	}

	.nav-title {
		color: #fff;
		font-size: 32rpx;
	}

	.scroll {
		flex: 1;
		box-sizing: border-box;
	}

	.scroll-bottom {
		height: 180rpx;
	}

	.top-banner-img {
		display: block;
		width: 100%;
	}

	.ep-header {
		background: linear-gradient(135deg, $green-dark 0%, $green 100%);
		padding: 28rpx 32rpx 36rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.ep-brand {
		display: flex;
		align-items: center;
		gap: 16rpx;
	}

	.ep-logo {
		height: 56rpx;
		width: 56rpx;
		border-radius: 50%;
		background: #fff;
	}

	.ep-brand-text {
		display: flex;
		flex-direction: column;
	}

	.ep-cn {
		color: #fff;
		font-size: 30rpx;
		font-weight: 600;
		line-height: 1.3;
	}

	.ep-en {
		color: rgba(255, 255, 255, 0.85);
		font-size: 20rpx;
		letter-spacing: 1rpx;
	}

	.ep-tag {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}

	.ep-tag-cn {
		color: #fff;
		font-size: 28rpx;
		font-weight: 600;
	}

	.ep-tag-en {
		color: rgba(255, 255, 255, 0.8);
		font-size: 20rpx;
		margin-top: 4rpx;
	}

	.card {
		margin: 20rpx 24rpx 0;
		background: #fff;
		border-radius: 16rpx;
		padding: 28rpx 28rpx 8rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
	}

	.summary-card {
		margin-top: -12rpx;
		position: relative;
		z-index: 1;
	}

	.card-title {
		font-size: 32rpx;
		font-weight: 700;
		color: #222;
		margin-bottom: 16rpx;
		padding-bottom: 16rpx;
		border-bottom: 1rpx solid #f0f0f0;
	}

	.kv-row {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		padding: 18rpx 0;
		border-bottom: 1rpx solid #f5f5f5;

		&:last-child {
			border-bottom: none;
			padding-bottom: 24rpx;
		}
	}

	.kv-label {
		font-size: 28rpx;
		color: #999;
		flex-shrink: 0;
		margin-right: 24rpx;
	}

	.kv-value {
		font-size: 28rpx;
		color: #333;
		text-align: right;
		flex: 1;
		word-break: break-all;

		&.active {
			color: $green;
			font-weight: 600;
		}
	}

	.coverage-item {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		padding: 20rpx 0 24rpx;
		border-bottom: 1rpx solid #f5f5f5;

		&:last-child {
			border-bottom: none;
		}
	}

	.coverage-left {
		flex: 1;
		margin-right: 20rpx;
	}

	.coverage-name {
		font-size: 28rpx;
		font-weight: 600;
		color: #222;
		margin-bottom: 8rpx;
	}

	.coverage-desc {
		font-size: 24rpx;
		color: #999;
		line-height: 1.5;
	}

	.coverage-amount {
		font-size: 28rpx;
		font-weight: 600;
		color: $red;
		flex-shrink: 0;
	}

	.special-text {
		font-size: 28rpx;
		color: #444;
		line-height: 1.7;
		padding-bottom: 24rpx;
	}

	.issuer {
		margin: 32rpx 24rpx 0;
		text-align: center;
		display: flex;
		flex-direction: column;
		gap: 12rpx;

		text {
			font-size: 24rpx;
			color: #999;
		}
	}

	.footer {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 20rpx 24rpx calc(20rpx + env(safe-area-inset-bottom));
		background: #fff;
		display: flex;
		gap: 20rpx;
		box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.06);
		z-index: 10;
	}

	.btn-outline,
	.btn-solid {
		flex: 1;
		height: 88rpx;
		line-height: 88rpx;
		text-align: center;
		border-radius: 44rpx;
		font-size: 28rpx;
		font-weight: 500;
	}

	.btn-outline {
		background: #fff;
		color: $green;
		border: 2rpx solid $green;
	}

	.btn-solid {
		background: $green;
		color: #fff;
	}

	/* ===== 查看保单号弹窗样式（沿用 baodanfive 视觉） ===== */
	$pp-green: #2ba245;

	.policy-popup {
		width: 620rpx;
		max-width: 86vw;
		box-sizing: border-box;
	}

	.pp-card {
		width: 100%;
		background: #fff;
		border-radius: 40rpx;
		padding: 64rpx 48rpx 56rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.pp-illus-wrap {
		position: relative;
		width: 280rpx;
		height: 280rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 40rpx;
	}

	.pp-orbit {
		position: absolute;
		border-radius: 50%;
		border: 2rpx dashed rgba(43, 162, 69, 0.2);
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}

	.pp-orbit-outer {
		width: 260rpx;
		height: 260rpx;
	}

	.pp-orbit-inner {
		width: 200rpx;
		height: 200rpx;
		border-style: dotted;
		opacity: 0.6;
	}

	.pp-illus-deco {
		position: absolute;
		top: 50%;
		width: 28rpx;
		height: 40rpx;
		background: $pp-green;
		border-radius: 0 100% 0 100%;
		opacity: 0.75;

		&.pp-deco-left {
			left: 0;
			transform: translateY(-50%) rotate(-30deg);
		}

		&.pp-deco-right {
			right: 0;
			transform: translateY(-50%) scaleX(-1) rotate(-30deg);
		}
	}

	.pp-shield-box {
		position: relative;
		z-index: 2;
	}

	.pp-shield-body {
		width: 160rpx;
		height: 180rpx;
		background: linear-gradient(180deg, #3bc45a 0%, $pp-green 100%);
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

	.pp-shield-badge {
		position: absolute;
		right: -12rpx;
		bottom: 8rpx;
		width: 44rpx;
		height: 44rpx;
		border-radius: 50%;
		background: $pp-green;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 4rpx solid #fff;
		box-shadow: 0 4rpx 12rpx rgba(43, 162, 69, 0.3);
	}

	.pp-main-title {
		font-size: 40rpx;
		font-weight: 700;
		color: #222;
		text-align: center;
		line-height: 1.4;
	}

	.pp-sub-title {
		font-size: 28rpx;
		color: #666;
		text-align: center;
		margin-top: 16rpx;
		line-height: 1.5;
	}

	.pp-days-row {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 48rpx;
	}

	.pp-days-box {
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

	.pp-days-num {
		font-size: 72rpx;
		font-weight: 700;
		color: $pp-green;
		line-height: 1;
	}

	.pp-days-unit {
		font-size: 32rpx;
		color: #333;
		margin-left: 16rpx;
	}

	.pp-notice {
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

	.pp-confirm-btn {
		width: 100%;
		height: 96rpx;
		line-height: 96rpx;
		text-align: center;
		margin-top: 56rpx;
		background: $pp-green;
		color: #fff;
		font-size: 32rpx;
		font-weight: 600;
		border-radius: 48rpx;
	}

	/* ===== 生成纸质保单弹窗样式（沿用 baodansix 视觉） ===== */
	.paper-popup {
		width: 680rpx;
		max-width: 92vw;
		max-height: 80vh;
		background: #fff;
		border-radius: 32rpx;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		overflow: hidden;
	}

	.paper-scroll {
		flex: 1;
		max-height: calc(80vh - 140rpx);
		padding: 0 32rpx;
		box-sizing: border-box;
	}

	.paper-hero {
		padding: 32rpx 0 32rpx;
		text-align: center;
	}

	.paper-doc-box {
		position: relative;
		display: inline-flex;
		margin-bottom: 20rpx;
	}

	.paper-doc-icon {
		width: 120rpx;
		height: 120rpx;
		border-radius: 24rpx;
		background: rgba(43, 162, 69, 0.1);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.paper-doc-badge {
		position: absolute;
		right: -8rpx;
		bottom: -4rpx;
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
		background: $pp-green;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 4rpx solid #fff;
	}

	.paper-hero-title {
		font-size: 36rpx;
		font-weight: 700;
		color: #222;
		line-height: 1.3;
	}

	.paper-hero-sub {
		margin-top: 12rpx;
		font-size: 26rpx;
		color: #999;
		line-height: 1.5;
	}

	.paper-form-card {
		background: #fff;
	}

	.paper-form-row {
		display: flex;
		align-items: center;
		margin-bottom: 24rpx;

		&.paper-form-row-tall {
			align-items: flex-start;
		}
	}

	.paper-form-label {
		width: 160rpx;
		flex-shrink: 0;
		font-size: 28rpx;
		color: #333;
		line-height: 80rpx;

		.paper-req {
			color: #e64340;
			margin-right: 4rpx;
		}
	}

	.paper-form-input-wrap {
		flex: 1;
		min-height: 80rpx;
		padding: 0 24rpx;
		border: 1rpx solid #e5e5e5;
		border-radius: 12rpx;
		display: flex;
		align-items: center;
		box-sizing: border-box;

		&.paper-tall {
			min-height: 140rpx;
			padding: 16rpx 24rpx;
			align-items: flex-start;
		}

		&.paper-picker-wrap {
			justify-content: space-between;
		}
	}

	.paper-form-input {
		flex: 1;
		width: 100%;
		height: 80rpx;
		font-size: 28rpx;
		color: #333;
	}

	.paper-form-textarea {
		flex: 1;
		width: 100%;
		height: 108rpx;
		font-size: 28rpx;
		color: #333;
		line-height: 1.5;
	}

	.paper-picker-text {
		flex: 1;
		font-size: 28rpx;
		color: #333;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;

		&.paper-ph {
			color: #bbb;
		}
	}

	.paper-ph {
		color: #bbb;
	}

	.paper-tips-box {
		margin-top: 8rpx;
		margin-bottom: 24rpx;
		background: #f2f9f4;
		border-radius: 16rpx;
		padding: 24rpx 24rpx;
	}

	.paper-tips-head {
		display: flex;
		align-items: center;
		margin-bottom: 10rpx;
	}

	.paper-tips-title {
		font-size: 28rpx;
		font-weight: 600;
		color: #333;
		margin-left: 10rpx;
	}

	.paper-tips-content {
		font-size: 26rpx;
		color: #444;
		line-height: 1.6;
	}

	.paper-footer {
		display: flex;
		gap: 24rpx;
		padding: 20rpx 32rpx 28rpx;
		background: #fff;
		border-top: 1rpx solid #f0f0f0;
	}

	.paper-btn-cancel,
	.paper-btn-submit {
		flex: 1;
		height: 88rpx;
		line-height: 88rpx;
		text-align: center;
		font-size: 30rpx;
		border-radius: 12rpx;
	}

	.paper-btn-cancel {
		background: #fff;
		color: #333;
		border: 1rpx solid #ddd;
	}

	.paper-btn-submit {
		background: $pp-green;
		color: #fff;
		font-weight: 600;
	}
</style>
