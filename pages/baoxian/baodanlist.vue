<template>
	<view class="page">
		<headerView>
			<template #leftIcon>
				<u-icon name="arrow-left" color="#333" size="24"></u-icon>
			</template>
			<view class="nav-title">我的保单</view>
		</headerView>

		<scroll-view scroll-y class="scroll" :style="{ height: scrollHeight }">
			<view v-if="list.length" class="list">
				<view class="card" v-for="(item, idx) in list" :key="item.orderNo || idx" @click="onItemClick(item)">
					<view class="card-top">
						<view class="card-title">
							<u-icon name="file-text-fill" color="#2ba245" size="18"></u-icon>
							<text class="card-title-text">{{ item.product || '无忧两全保险' }}</text>
						</view>
						<view class="card-status" :class="statusClass(item.status)">{{ statusText(item.status) }}</view>
					</view>

					<view class="card-rows">
						<view class="row">
							<text class="row-label">订单号</text>
							<text class="row-value">{{ item.orderNo || '—' }}</text>
						</view>
						<view class="row">
							<text class="row-label">投保人</text>
							<text class="row-value">{{ maskName(item.holderName, item.holderIdNo) }}</text>
						</view>
						<view
							class="row"
							v-for="(ins, i) in (item.insuredList && item.insuredList.length ? item.insuredList : [{}])"
							:key="'ins-' + (item.orderNo || idx) + '-' + i"
						>
							<text class="row-label">{{ item.insuredList && item.insuredList.length > 1 ? `被保人${i + 1}` : '被保人' }}</text>
							<text class="row-value">{{ maskName(ins.name, ins.idNo) }}</text>
						</view>
						<view class="row">
							<text class="row-label">年交保费</text>
							<text class="row-value">{{ item.premium || '—' }}</text>
						</view>
						<view class="row">
							<text class="row-label">提交时间</text>
							<text class="row-value">{{ formatTime(item.createdAt) }}</text>
						</view>
					</view>

					<view class="card-foot">
						<view class="foot-btn primary" @click.stop="onItemClick(item)">
							<u-icon name="eye-fill" color="#fff" size="14"></u-icon>
							<text class="foot-btn-text">查看保单</text>
						</view>
					</view>
				</view>
			</view>

			<view v-else class="empty">
				<image class="empty-img" src="/static/baoxian/baoxianbng.png" mode="widthFix"></image>
				<view class="empty-title">暂无已提交的保单</view>
				<view class="empty-desc">您还没有提交过投保信息，去完成一份吧</view>
				<view class="empty-btn" @click="goSubmit">去投保</view>
			</view>

			<view class="scroll-bottom"></view>
		</scroll-view>
	</view>
</template>

<script>
	import { baoxianOrderlistsApi } from '@/api/api.js';

	export default {
		data() {
			return {
				scrollHeight: 'calc(100vh - 120rpx - var(--status-bar-height))',
				list: [],
				loading: false
			};
		},
		onShow() {
			this.loadList();
		},
		methods: {
			async loadList() {
				if (this.loading) return;
				this.loading = true;
				uni.showLoading({ title: '加载中...', mask: true });
				try {
					const res = await baoxianOrderlistsApi({});
					const payload = res && res.data ? res.data : res;
					let rows = [];
					if (payload) {
						if (Array.isArray(payload)) {
							rows = payload;
						} else if (Array.isArray(payload.data)) {
							rows = payload.data;
						} else if (payload.data && Array.isArray(payload.data.list)) {
							rows = payload.data.list;
						} else if (Array.isArray(payload.list)) {
							rows = payload.list;
						} else if (Array.isArray(payload.result)) {
							rows = payload.result;
						}
					}
					this.list = rows.map((it) => this.normalizeItem(it))
						.sort((a, b) => this.toTimestamp(b.createdAt) - this.toTimestamp(a.createdAt));
				} catch (err) {
					console.error('保单列表获取失败：', err);
					uni.showToast({ title: '加载失败', icon: 'none' });
					this.list = [];
				} finally {
					uni.hideLoading();
					this.loading = false;
				}
			},
			normalizeItem(it) {
				if (!it || typeof it !== 'object') return {};
				const holder = it.holder || {};
				const rawInsuredList = Array.isArray(it.insuredList)
					? it.insuredList
					: (Array.isArray(it.insured_list) ? it.insured_list : []);
				let insuredList = rawInsuredList
					.filter((p) => p && typeof p === 'object')
					.map((p) => ({
						name: p.name || '',
						idNo: p.idNo || p.id_no || ''
					}));
				if (!insuredList.length && it.insured && typeof it.insured === 'object') {
					insuredList = [{
						name: it.insured.name || '',
						idNo: it.insured.idNo || it.insured.id_no || ''
					}];
				}
				const plan = it.plan || {};
				return {
					applicationId: it.application_id || it.id || '',
					orderNo: it.order_sn || it.orderNo || it.application_id || '',
					product: plan.product_name || it.product_name || it.product || '',
					status: it.status || 'submitted',
					holderName: holder.name || '',
					holderIdNo: holder.id_no || holder.idNo || '',
					insuredList,
					premium: plan.annual_premium || it.annual_premium || it.premium || '',
					createdAt: it.created_at || it.create_at || it.createdAt || '',
					appDate: it.application_date || it.app_date || '',
					effectiveDate: it.effective_date || ''
				};
			},
			toTimestamp(v) {
				if (!v) return 0;
				if (typeof v === 'number') {
					return v < 1e12 ? v * 1000 : v;
				}
				const t = new Date(String(v).trim()).getTime();
				return isNaN(t) ? 0 : t;
			},
			statusText(status) {
				const map = {
					submitted: '已提交',
					waiting: '等待期',
					effective: '生效中',
					expired: '已到期'
				};
				return map[status] || '已提交';
			},
			statusClass(status) {
				return `status-${status || 'submitted'}`;
			},
			maskName(name, idNo) {
				if (!name) return '—';
				if (!idNo) return name;
				const s = String(idNo);
				if (s.length <= 4) return `${name} ****`;
				return `${name} ****${s.slice(-4)}`;
			},
			formatTime(v) {
				if (!v) return '—';
				const s = String(v).trim();
				const match = s.match(/^(\d{4}-\d{2}-\d{2})/);
				if (match) return match[1];
				const ts = typeof v === 'number' ? (v < 1e12 ? v * 1000 : v) : this.toTimestamp(v);
				if (!ts) return '—';
				const d = new Date(ts);
				const y = d.getFullYear();
				const m = String(d.getMonth() + 1).padStart(2, '0');
				const day = String(d.getDate()).padStart(2, '0');
				return `${y}-${m}-${day}`;
			},
			onItemClick(item) {
				if (item && item.orderNo) {
					uni.setStorageSync('baodanthree_order', {
						orderNo: item.orderNo,
						appDate: item.appDate || '',
						effectiveDate: item.effectiveDate || ''
					});
				}
				const appId = item && item.applicationId ? item.applicationId : '';
				const url = appId
					? `/pages/baoxian/baodanfour?application_id=${encodeURIComponent(appId)}`
					: '/pages/baoxian/baodanfour';
				uni.navigateTo({ url });
			},
			goSubmit() {
				uni.navigateBack({
					fail: () => {
						uni.switchTab({ url: '/pages/index/index' });
					}
				});
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
		padding: 24rpx 0;
		box-sizing: border-box;
	}

	.scroll-bottom {
		height: 60rpx;
	}

	.list {
		padding: 0 24rpx;
	}

	.card {
		background: #fff;
		border-radius: 20rpx;
		padding: 28rpx 28rpx 24rpx;
		margin-bottom: 24rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
	}

	.card-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 20rpx;
		border-bottom: 1rpx dashed #eee;
	}

	.card-title {
		display: flex;
		align-items: center;
		gap: 12rpx;
	}

	.card-title-text {
		font-size: 30rpx;
		font-weight: 600;
		color: #222;
	}

	.card-status {
		font-size: 22rpx;
		padding: 4rpx 16rpx;
		border-radius: 999rpx;
		background: #e8f7eb;
		color: $page-green;

		&.status-waiting {
			background: #fff5e6;
			color: #e8924a;
		}
		&.status-effective {
			background: #e8f7eb;
			color: $page-green;
		}
		&.status-expired {
			background: #f0f0f0;
			color: #999;
		}
	}

	.card-rows {
		padding: 20rpx 0 8rpx;
	}

	.row {
		display: flex;
		justify-content: space-between;
		font-size: 26rpx;
		line-height: 1.8;
	}

	.row-label {
		color: #888;
	}

	.row-value {
		color: #333;
		max-width: 60%;
		text-align: right;
		word-break: break-all;
	}

	.card-foot {
		display: flex;
		justify-content: flex-end;
		margin-top: 16rpx;
	}

	.foot-btn {
		display: inline-flex;
		align-items: center;
		gap: 8rpx;
		padding: 12rpx 28rpx;
		border-radius: 999rpx;
		font-size: 26rpx;

		&.primary {
			background: $page-green;
			color: #fff;
		}
	}

	.foot-btn-text {
		color: inherit;
	}

	.empty {
		padding: 80rpx 48rpx;
		text-align: center;
	}

	.empty-img {
		width: 60%;
		opacity: 0.5;
	}

	.empty-title {
		margin-top: 24rpx;
		font-size: 30rpx;
		color: #333;
		font-weight: 600;
	}

	.empty-desc {
		margin-top: 12rpx;
		font-size: 24rpx;
		color: #888;
	}

	.empty-btn {
		margin: 40rpx auto 0;
		width: 280rpx;
		height: 80rpx;
		line-height: 80rpx;
		border-radius: 999rpx;
		background: $page-green;
		color: #fff;
		font-size: 28rpx;
	}
</style>
