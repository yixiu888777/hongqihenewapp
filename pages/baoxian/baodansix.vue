<template>
	<view class="page">
		<headerView>
			<template #leftIcon>
				<u-icon name="arrow-left" color="#333" size="24"></u-icon>
			</template>
			<view class="nav-title">生成纸质保单</view>
		</headerView>

		<scroll-view scroll-y class="scroll" :style="{ height: scrollHeight }">
			<!-- 顶部说明 -->
			<view class="hero">
				<view class="doc-box">
					<view class="doc-icon">
						<u-icon name="file-text-fill" color="#2ba245" size="56"></u-icon>
					</view>
					<view class="doc-badge">
						<u-icon name="checkmark" color="#fff" size="14"></u-icon>
					</view>
				</view>
				<view class="hero-title">生成纸质保单</view>
				<view class="hero-sub">请填写收货地址，我们将尽快为您寄出</view>
			</view>

			<!-- 收货地址表单 -->
			<view class="form-card">
				<view class="form-row">
					<view class="form-label"><text class="req">*</text>收件人</view>
					<view class="form-input-wrap">
						<input
							class="form-input"
							v-model="form.name"
							placeholder="请输入收件人姓名"
							placeholder-class="ph"
							@blur="onNameBlur"
						/>
					</view>
				</view>

				<view class="form-row">
					<view class="form-label"><text class="req">*</text>手机号码</view>
					<view class="form-input-wrap">
						<input
							class="form-input"
							v-model="form.phone"
							type="number"
							maxlength="11"
							placeholder="请输入收件人手机号"
							placeholder-class="ph"
						/>
					</view>
				</view>

				<view class="form-row" @click="ehShowClike">
					<view class="form-label"><text class="req">*</text>所在地区</view>
					<view class="form-input-wrap picker-wrap">
						<text class="picker-text" :class="{ ph: !areaSelected }">{{ form.area }}</text>
						<u-icon name="arrow-right" color="#bbb" size="14"></u-icon>
					</view>
				</view>

				<view class="form-row form-row-tall">
					<view class="form-label"><text class="req">*</text>详细地址</view>
					<view class="form-input-wrap tall">
						<textarea
							class="form-textarea"
							v-model="form.address"
							placeholder="请输入详细地址，如:街道、楼牌号、单元、门牌号等"
							placeholder-class="ph"
							:auto-height="false"
							maxlength="200"
						/>
					</view>
				</view>

				<view class="form-row">
					<view class="form-label"><text class="req">*</text>邮政编码</view>
					<view class="form-input-wrap">
						<input
							class="form-input"
							v-model="form.zipCode"
							type="number"
							maxlength="6"
							placeholder="请输入邮政编码（选填）"
							placeholder-class="ph"
						/>
					</view>
				</view>

				<view class="form-row form-row-tall">
					<view class="form-label"><text class="req">*</text>备注信息</view>
					<view class="form-input-wrap tall">
						<textarea
							class="form-textarea"
							v-model="form.remark"
							placeholder="如有特殊配送要求，请留言（选填）"
							placeholder-class="ph"
							:auto-height="false"
							maxlength="200"
						/>
					</view>
				</view>
			</view>

			<!-- 温馨提示 -->
			<view class="tips-box">
				<view class="tips-head">
					<u-icon name="info-circle-fill" color="#2ba245" size="18"></u-icon>
					<text class="tips-title">温馨提示</text>
				</view>
				<text class="tips-content">纸质保单将在您提交地址后的3-5个工作日内寄出，请您耐心等待。</text>
			</view>

			<view class="scroll-bottom"></view>
		</scroll-view>

		<view class="footer">
			<view class="btn-cancel" @click="onCancel">取消</view>
			<view class="btn-submit" @click="onSubmit">确认提交</view>
		</view>

		<ehPicker v-if="ehShow" @conceal="conceal" @showClike="ehShowClike" />
	</view>
</template>

<script>
	import ehPicker from '@/components/erha-picker/erha-picker.vue';

	const AREA_PLACEHOLDER = '请选择省市区';

	export default {
		components: {
			ehPicker
		},
		data() {
			return {
				scrollHeight: 'calc(100vh - 120rpx - var(--status-bar-height))',
				ehShow: false,
				orderNo: '',
				form: {
					name: '',
					phone: '',
					area: AREA_PLACEHOLDER,
					address: '',
					zipCode: '',
					remark: ''
				}
			};
		},
		computed: {
			areaSelected() {
				return this.form.area && this.form.area !== AREA_PLACEHOLDER;
			}
		},
		onLoad(options) {
			if (options && options.orderNo) {
				this.orderNo = options.orderNo;
			}
			this.loadCached();
		},
		methods: {
			loadCached() {
				const cached = uni.getStorageSync('baodansix_address');
				if (!cached) return;
				if (cached.orderNo) this.orderNo = cached.orderNo;
				this.form = {
					...this.form,
					...cached,
					area: cached.area || AREA_PLACEHOLDER
				};
			},
			onNameBlur() {
				const name = (this.form.name || '').trim();
				if (!name) return;
				if (this.$utils && !this.$utils.containsChinese(name)) {
					this.form.name = '';
					uni.$u.toast('请输入正确姓名');
				}
			},
			ehShowClike() {
				this.ehShow = !this.ehShow;
			},
			conceal(param) {
				this.form.area = `${param.province} ${param.city} ${param.area} ${param.street || ''}`.trim();
				this.ehShowClike();
			},
			onCancel() {
				const pages = getCurrentPages();
				if (pages.length > 1) {
					uni.navigateBack();
					return;
				}
				uni.switchTab({ url: '/pages/index/index' });
			},
			validate() {
				const name = (this.form.name || '').trim();
				if (!name) {
					uni.$u.toast('请输入收件人姓名');
					return false;
				}
				const phone = String(this.form.phone || '').trim();
				if (!phone) {
					uni.$u.toast('请输入收件人手机号');
					return false;
				}
				if (!/^1\d{10}$/.test(phone)) {
					uni.$u.toast('请输入正确的手机号');
					return false;
				}
				if (!this.areaSelected) {
					uni.$u.toast('请选择省市区');
					return false;
				}
				const address = (this.form.address || '').trim();
				if (!address) {
					uni.$u.toast('请输入详细地址');
					return false;
				}
				return true;
			},
			onSubmit() {
				if (!this.validate()) return;
				const payload = {
					orderNo: this.orderNo,
					name: this.form.name.trim(),
					phone: String(this.form.phone).trim(),
					area: this.form.area,
					address: this.form.address.trim(),
					zipCode: (this.form.zipCode || '').trim(),
					remark: (this.form.remark || '').trim(),
					submitTime: Date.now()
				};
				uni.setStorageSync('baodansix_address', payload);
				uni.showModal({
					title: '提交成功',
					content: '收货地址已提交，纸质保单将在3-5个工作日内寄出。',
					showCancel: false,
					confirmText: '知道了',
					success: () => {
						this.onCancel();
					}
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	$page-green: #2ba245;

	.page {
		min-height: 100vh;
		background: #fff;
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
		padding: 0 32rpx;
		box-sizing: border-box;
	}

	.scroll-bottom {
		height: 180rpx;
	}

	.hero {
		padding: 32rpx 0 40rpx;
		text-align: center;
	}

	.doc-box {
		position: relative;
		display: inline-flex;
		margin-bottom: 24rpx;
	}

	.doc-icon {
		width: 120rpx;
		height: 120rpx;
		border-radius: 24rpx;
		background: rgba(43, 162, 69, 0.1);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.doc-badge {
		position: absolute;
		right: -8rpx;
		bottom: -4rpx;
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
		background: $page-green;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 4rpx solid #fff;
	}

	.hero-title {
		font-size: 40rpx;
		font-weight: 700;
		color: #222;
		line-height: 1.3;
	}

	.hero-sub {
		margin-top: 16rpx;
		font-size: 26rpx;
		color: #999;
		line-height: 1.5;
	}

	.form-card {
		background: #fff;
	}

	.form-row {
		display: flex;
		align-items: center;
		margin-bottom: 28rpx;

		&.form-row-tall {
			align-items: flex-start;
		}
	}

	.form-label {
		width: 168rpx;
		flex-shrink: 0;
		font-size: 28rpx;
		color: #333;
		line-height: 80rpx;

		.form-row-tall & {
			line-height: 80rpx;
		}

		.req {
			color: #e64340;
			margin-right: 4rpx;
		}
	}

	.form-input-wrap {
		flex: 1;
		min-height: 80rpx;
		padding: 0 24rpx;
		border: 1rpx solid #e5e5e5;
		border-radius: 12rpx;
		display: flex;
		align-items: center;
		box-sizing: border-box;

		&.tall {
			min-height: 160rpx;
			padding: 16rpx 24rpx;
			align-items: flex-start;
		}

		&.picker-wrap {
			justify-content: space-between;
		}
	}

	.form-input {
		flex: 1;
		width: 100%;
		height: 80rpx;
		font-size: 28rpx;
		color: #333;
	}

	.form-textarea {
		flex: 1;
		width: 100%;
		height: 128rpx;
		font-size: 28rpx;
		color: #333;
		line-height: 1.5;
	}

	.picker-text {
		flex: 1;
		font-size: 28rpx;
		color: #333;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;

		&.ph {
			color: #bbb;
		}
	}

	.ph {
		color: #bbb;
	}

	.tips-box {
		margin-top: 8rpx;
		background: #f2f9f4;
		border-radius: 16rpx;
		padding: 28rpx 24rpx;
	}

	.tips-head {
		display: flex;
		align-items: center;
		margin-bottom: 12rpx;
	}

	.tips-title {
		font-size: 28rpx;
		font-weight: 600;
		color: #333;
		margin-left: 10rpx;
	}

	.tips-content {
		font-size: 26rpx;
		color: #444;
		line-height: 1.6;
	}

	.footer {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		gap: 24rpx;
		padding: 20rpx 32rpx calc(20rpx + env(safe-area-inset-bottom));
		background: #fff;
		box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.06);
		z-index: 10;
	}

	.btn-cancel,
	.btn-submit {
		flex: 1;
		height: 88rpx;
		line-height: 88rpx;
		text-align: center;
		font-size: 30rpx;
		border-radius: 12rpx;
	}

	.btn-cancel {
		background: #fff;
		color: #333;
		border: 1rpx solid #ddd;
	}

	.btn-submit {
		background: $page-green;
		color: #fff;
		font-weight: 600;
	}
</style>
