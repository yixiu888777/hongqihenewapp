<template>
	<view class="page">
		<view class="page-bg"></view>
		<view class="page-inner">
		<headerView :hideBack="true">
			<view class="nav-title">红旗河股权专区</view>
		</headerView>

		<scroll-view scroll-y class="scroll" :show-scrollbar="false" enable-flex>
			<view class="content">
				<!-- 主数据卡片 -->
				<view class="card main-card">
					<view class="card-head">所持股权市值</view>
					<view class="stats-row">
						<view class="stat-col">
							<view class="stat-val">{{ gqMonthChangeText }} </view>
							<view class="stat-label">股权信息</view>
						</view>
					</view>

					<view class="chart-block" @touchstart="onGqChartTouchRedraw">
						<view class="chart-title">
							<text class="chart-bar"></text>
							<text>价格走势</text>
						</view>
						<view class="chart-wrap">
							<view class="y-labels">
								<text v-for="(t, i) in yLabelList" :key="i">{{ t }}</text>
							</view>
							<view class="canvas-box">
								<canvas
									canvas-id="gqLineChart"
									id="gqLineChart"
									class="line-canvas"
									:style="{ width: canvasW + 'px', height: canvasH + 'px' }"
									:width="canvasW"
									:height="canvasH"
								></canvas>
							</view>
						</view>
						<view v-if="xLabels.length === 5" class="x-labels">
							<text
								v-for="(lab, xi) in xLabels"
								:key="'xlab' + xi"
								class="x-lab"
								:class="{
									'x-lab--start': xi === 0,
									'x-lab--end': xi === xLabels.length - 1,
									'x-lab--mid': xi > 0 && xi < xLabels.length - 1
								}"
							>{{ lab }}</text>
						</view>
					</view>

					<view class="card-footer-bar">
						<view class="footer-item">
							<text class="dot red"></text>
							<text class="footer-label">股权价格</text>
							<text class="footer-val">{{ gqNowPriceText }}</text>
						</view>
						<view class="footer-item">
							<text class="dot blue"></text>
							<text class="footer-label">持有份额</text>
							<text class="footer-val">{{ gqHoldShareText }}</text>
						</view>
					</view>
				</view>

				<!-- 功能入口 -->
				<view class="card menu-card">
					<view class="menu-grid">
						<view
							v-for="(item, index) in menuList"
							:key="index"
							class="menu-item"
							@tap="onMenuTap(item)"
						>
							<view class="menu-icon" :class="[item.iconClass, item.iconSrc && 'menu-icon--bare']">
								<image
									v-if="item.iconSrc"
									class="menu-icon-img"
									:src="item.iconSrc"
									mode="aspectFit"
								/>
								<u-icon
									v-else
									:name="item.uicon"
									:color="item.iconColor"
									size="40"
								></u-icon>
							</view>
							<text class="menu-text">{{ item.name }}</text>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		</view>

		<!-- 持股证明：股权证明书弹窗 -->
		<u-popup
			:show="certPopupShow"
			mode="center"
			:round="0"
			bgColor="transparent"
			:zoom="false"
			:closeOnClickOverlay="true"
			overlayOpacity="0.55"
			@close="closeCertPopup"
		>
			<view class="cert-popup" @tap.stop>
				<view class="cert-panel">
					<swiper
						class="cert-swiper"
						:current="certCurrent"
						:duration="300"
						@change="onCertSwiperChange"
					>
						<swiper-item
							v-for="(slide, si) in certSlideConfigs"
							:key="'cs' + si"
							class="cert-swiper-item"
						>
							<scroll-view scroll-y class="cert-scroll" :show-scrollbar="false">
								<text class="cert-slide-title">{{ slide.title }}</text>
								<image
									v-if="certImagePaths[si]"
									:src="certImagePaths[si]"
									mode="widthFix"
									class="cert-slide-img"
								/>
								<view v-else class="cert-gen-placeholder">
									<u-icon name="file-text" color="#ccc" size="56"></u-icon>
									<text class="cert-gen-tip">正在打印电子版</text>
								</view>
							</scroll-view>
						</swiper-item>
					</swiper>
					<view class="cert-swiper-nav">
						<view class="cert-nav-btn" @tap="certPrev">
							<u-icon name="arrow-left" color="#fff" size="18"></u-icon>
						</view>
						<view class="cert-dots">
							<view
								v-for="(dot, di) in certSlideConfigs"
								:key="'d' + di"
								class="cert-dot"
								:class="{ active: di === certCurrent }"
								@tap="certGo(di)"
							/>
						</view>
						<view class="cert-nav-btn" @tap="certNext">
							<u-icon name="arrow-right" color="#fff" size="18"></u-icon>
						</view>
					</view>
				</view>
				<view class="cert-actions">
					<view class="cert-btn cert-btn--ghost" @tap="closeCertPopup">关闭</view>
					<view class="cert-btn cert-btn--primary" @tap="saveCertSlide">保存</view>
				</view>
			</view>
		</u-popup>

		<!-- 合同证明：多页（与持股证明同结构，按 orderlist 链式生成） -->
		<u-popup
			:show="htContractPopupShow"
			mode="center"
			:round="0"
			bgColor="transparent"
			:zoom="false"
			:closeOnClickOverlay="true"
			overlayOpacity="0.55"
			@close="closeHtContractPopup"
		>
			<view class="cert-popup" @tap.stop>
				<view class="cert-panel">
					<swiper
						class="cert-swiper"
						:current="htCurrent"
						:duration="300"
						@change="onHtSwiperChange"
					>
						<swiper-item
							v-for="(slide, hi) in certSlideConfigs"
							:key="'ht' + hi"
							class="cert-swiper-item"
						>
							<scroll-view scroll-y class="cert-scroll" :show-scrollbar="false">
								<text class="cert-slide-title">{{ slide.title }}</text>
								<image
									v-if="htContractImagePaths[hi]"
									:src="htContractImagePaths[hi]"
									mode="widthFix"
									class="cert-slide-img"
								/>
								<view v-else class="cert-gen-placeholder">
									<u-icon name="file-text" color="#ccc" size="56"></u-icon>
									<text class="cert-gen-tip">正在打印电子版</text>
								</view>
							</scroll-view>
						</swiper-item>
					</swiper>
					<view class="cert-swiper-nav">
						<view class="cert-nav-btn" @tap="htPrev">
							<u-icon name="arrow-left" color="#fff" size="18"></u-icon>
						</view>
						<view class="cert-dots">
							<view
								v-for="(h, hdi) in certSlideConfigs"
								:key="'hd' + hdi"
								class="cert-dot"
								:class="{ active: hdi === htCurrent }"
								@tap="htGo(hdi)"
							/>
						</view>
						<view class="cert-nav-btn" @tap="htNext">
							<u-icon name="arrow-right" color="#fff" size="18"></u-icon>
						</view>
					</view>
				</view>
				<view class="cert-actions">
					<view class="cert-btn cert-btn--ghost" @tap="closeHtContractPopup">关闭</view>
					<view class="cert-btn cert-btn--primary" @tap="saveHtContractSlide">保存</view>
				</view>
			</view>
		</u-popup>

		<!-- 股权回购 / 对赌协议：各固定 1 页轮播（左右键与圆点均保留） -->
		<u-popup
			:show="staticGalleryShow"
			mode="center"
			:round="0"
			bgColor="transparent"
			:zoom="false"
			:closeOnClickOverlay="true"
			overlayOpacity="0.55"
			@close="closeStaticGallery"
		>
			<view class="cert-popup" @tap.stop>
				<view class="cert-panel">
					<swiper
						class="cert-swiper"
						:current="staticGalleryCurrent"
						:duration="300"
						@change="onStaticGalleryChange"
					>
						<swiper-item
							v-for="(gs, gi) in staticGallerySlides"
							:key="'gs' + gi"
							class="cert-swiper-item"
						>
							<scroll-view scroll-y class="cert-scroll" :show-scrollbar="false">
								<text class="cert-slide-title">{{ gs.title }}</text>
								<image :src="gs.src" mode="widthFix" class="cert-slide-img" />
							</scroll-view>
						</swiper-item>
					</swiper>
					<view class="cert-swiper-nav">
						<view class="cert-nav-btn" @tap="staticGalleryPrev">
							<u-icon name="arrow-left" color="#fff" size="18"></u-icon>
						</view>
						<view class="cert-dots">
							<view
								v-for="(g, gdi) in staticGallerySlides"
								:key="'gd' + gdi"
								class="cert-dot"
								:class="{ active: gdi === staticGalleryCurrent }"
								@tap="staticGalleryGo(gdi)"
							/>
						</view>
						<view class="cert-nav-btn" @tap="staticGalleryNext">
							<u-icon name="arrow-right" color="#fff" size="18"></u-icon>
						</view>
					</view>
				</view>
				<view class="cert-actions">
					<view class="cert-btn cert-btn--ghost" @tap="closeStaticGallery">关闭</view>
					<view class="cert-btn cert-btn--primary" @tap="saveStaticGallerySlide">保存</view>
				</view>
			</view>
		</u-popup>

		<!-- 持股证明：离屏 canvas，与 getpic.vue 同源逻辑合成证书 -->
		<canvas
			canvas-id="gqCertCanvas"
			id="gqCertCanvas"
			class="gq-cert-canvas"
			:style="{ width: certCanvasW + 'px', height: certCanvasH + 'px' }"
		></canvas>
		<!-- 合同证明：离屏 canvas -->
		<canvas
			canvas-id="htContractCanvas"
			id="htContractCanvas"
			class="gq-cert-canvas"
			:style="{ width: htCanvasW + 'px', height: htCanvasH + 'px' }"
		></canvas>
	</view>
</template>

<script>
/** 持股证明底图：下单/记录时间晚于阈值用新模板，否则旧模板 */
const CERT_BG_OLD = '/static/zhengshu.png';
const CERT_BG_NEW = '/static/zhengshu1.png';
const CERT_BG_NEW1 = '/static/zhengshu2.jpg';
/** 与业务约定一致：createtime > 2026-05-16 0:0:0 用 zhengshu1.png */
const CERT_TIME_THRESHOLD_MS = new Date(2026, 4, 16, 0, 0, 0).getTime();
const CERT_WATERMARK = '/static/shuiyin.png';
const HT_CONTRACT_BG = '/static/hetongzhengshu.png';
const HUIGOU_PIC = '/static/huigoupic.png';
const DUIDU_PIC = '/static/duidupng.png';
/** 走势图：取最近 N 天数据 */
const GQ_CHART_X_DAY_COUNT = 30;
/** X 轴底部展示的日期刻度数（与 canvas 横向 0%~100% 对齐） */
const GQ_CHART_X_LABEL_COUNT = 5;
/** 持股证明 / 合同证明弹窗：生成电子版时的加载文案 */
const CERT_POPUP_LOADING_TITLE = '正在打印电子版';

/** 合同证明：无用户信息时的占位（字段与底图错位时只调 htLayout） */
const HT_CONTRACT_DEFAULTS = {
	realname: '演示姓名',
	cardno: '110101199001011234'
};

const CERT_DEFAULTS = {
	name: '张三封22222222222',
	idcard: '130000000000000000',
	ordersno: '1122222222222222222',
	gpnum: '10000',
	price: '100000.00',
	createtime: '2026年01月01日',
	fztime: '2026年04月03日'
};

import {
		gqdateApi,
	} from '@/api/api.js'
export default {
	
	data() {
		return {
			servicesUnit: {},
			isPageShow: true,
			canvasW: 300,
			canvasH: 200,
			_gqSchedTimer: null,
			_gqLayoutKickTimers: [],
			_gqTouchRedrawTimer: null,
			/** 走势图 Y 轴：价格区间（与左侧刻度一致） */
			yAxisMax: 100,
			yAxisMin: 0,
			yTickCount: 4,
			xLabels: [],
			/** gq_list 的 nowprice 序列 */
			series: [],
			certPopupShow: false,
			certCurrent: 0,
			/** 持股证明：由 gqdate 接口 orderlist + member 构建，见 buildCertSlidesFromOrderlist */
			certSlideConfigs: [],
			certImagePaths: [],
			certCanvasW: 300,
			certCanvasH: 400,
			/** 证书顶部水印（getImageInfo 后的本地 path） */
			certWmPath: '',
			certWmNatural: null,
			htContractPopupShow: false,
			htCurrent: 0,
			htContractImagePaths: [],
			staticGalleryShow: false,
			staticGalleryCurrent: 0,
			staticGallerySlides: [],
			staticGalleryKind: '',
			htCanvasW: 300,
			htCanvasH: 400,
			/**
			 * 合同底图上的文字位置（0~1），与 hetongzhengshu.png 对不齐时只改这里
			 */
			htLayout: {
				realname: { x: 0.25, y: 0.286, align: 'left', fontRatio: 0.010 },
				cardno: { x: 0.281, y: 0.3085, align: 'left', fontRatio: 0.010 },
				/* 股数、发证/复制日期：与 hetongzhengshu.png 对不齐时只改坐标 */
				gpnum: { x: 0.351, y: 0.372, align: 'left', fontRatio: 0.010 },
				fztime: { x: 0.351, y: 0.427, align: 'left', fontRatio: 0.010 },
				httime: { x: 0.65, y: 0.916, align: 'left', fontRatio: 0.010 }
			},
			certFromQuery: {},
			certLayout: {
				name: { x: 0.285, y: 0.245, align: 'left', fontRatio: 0.019 },
				idcard: { x: 0.285, y: 0.28, align: 'left', fontRatio: 0.019 },
				ordersno: { x:0.285, y: 0.31, align: 'left', fontRatio: 0.019 },
				gpnum: { x: 0.285, y: 0.375, align: 'left', fontRatio: 0.019 },
				price: { x: 0.285, y: 0.41, align: 'left', fontRatio: 0.019 },
				createtime: { x: 0.285, y: 0.475, align: 'left', fontRatio: 0.019 },
				fztime: { x: 0.285, y: 0.643, align: 'left', fontRatio: 0.019 }
			},
			menuList: [
				{ name: '持股证明', iconSrc: '/static/chigu.png' },
				{ name: '合同证明', iconSrc: '/static/hetong.png' },
				{ name: '股权回购', iconSrc: '/static/huigou.png' },
				{ name: '对赌协议', iconSrc: '/static/duidu.png' }
			]
		};
	},
	computed: {
		yLabelList() {
			const { yAxisMax, yAxisMin, yTickCount } = this;
			const n = Math.max(2, yTickCount);
			const step = (yAxisMax - yAxisMin) / (n - 1);
			const list = [];
			for (let i = 0; i < n; i++) {
				const v = yAxisMax - i * step;
				list.push(this.formatGqAxisPrice(v));
			}
			return list;
		},
		gqSortedList() {
			const list = (this.servicesUnit && this.servicesUnit.gq_list) || [];
			if (!Array.isArray(list) || list.length === 0) return [];
			/* 按 date（缺省用 nowdate）时间正序：旧 → 新 */
			return [...list].sort((a, b) => this.gqRowTimeMs(a) - this.gqRowTimeMs(b));
		},
		/** 持有份额(gqall_price) × 股权价格(gqzz.nowprice) */
		gqMonthChangeText() {
			const share = this.servicesUnit && this.servicesUnit.gqall_price;
			const zz = this.servicesUnit && this.servicesUnit.gqzz;
			const priceRaw = zz && zz.nowprice;
			if (
				share === undefined ||
				share === null ||
				String(share).trim() === '' ||
				priceRaw === undefined ||
				priceRaw === null ||
				String(priceRaw).trim() === ''
			) {
				return '--';
			}
			const s = parseFloat(String(share).replace(/,/g, '').trim());
			const p = parseFloat(String(priceRaw).replace(/,/g, '').trim());
			if (isNaN(s) || isNaN(p)) return '--';
			const total = s * p;
			if (!isFinite(total)) return '--';
			return `${total.toFixed(2)}元`;
		},
		gqNowPriceText() {
			const zz = this.servicesUnit && this.servicesUnit.gqzz;
			if (!zz || zz.nowprice === undefined || zz.nowprice === null) return '--';
			return `${zz.nowprice}元`;
		},
		/** 接口 data.gqall_price，展示为整数（去小数） */
		gqHoldShareText() {
			const v = this.servicesUnit && this.servicesUnit.gqall_price;
			if (v === undefined || v === null || String(v).trim() === '') return '--';
			const n = parseFloat(String(v).replace(/,/g, '').trim());
			if (isNaN(n)) return '--';
			return String(Math.trunc(n));
		}
	},
	onLoad(options) {
		const qv = (k) => (options[k] ? decodeURIComponent(options[k]) : '');
		this.certFromQuery = {
			name: qv('name'),
			realName: qv('realName'),
			real_name: qv('real_name'),
			username: qv('username'),
			user_name: qv('user_name'),
			nickname: qv('nickname'),
			idcard: qv('idcard'),
			id_card: qv('id_card'),
			idCard: qv('idCard'),
			identity_card: qv('identity_card'),
			sfzh: qv('sfzh'),
			card_no: qv('card_no'),
			certificate_no: qv('certificate_no'),
			ordersno: qv('ordersno'),
			gpnum: qv('gpnum'),
			price: qv('price'),
			createtime: qv('createtime'),
			fztime: qv('fztime'),
			realname: qv('realname'),
			cardno: qv('cardno'),
			httime: qv('httime'),
			ht_time: qv('ht_time')
		};
		const sys = uni.getSystemInfoSync();
		const rpx = sys.windowWidth / 750;
		this.canvasW = Math.floor(520 * rpx);
		this.canvasH = Math.floor(270 * rpx);
	},
	/* App/小程序：每次进入页面（含从下级页返回、Tab 切换）重新拉取 */
	onShow() {
		this.clearGqChartTimers();
		this.loadData();
	},
	onReady() {
		this.scheduleGqChartRedraw(0);
		this.scheduleGqLayoutKickWaves();
	},
	onUnload() {
		this.clearGqChartTimers();
	},
	methods: {
		/** 排序用时间戳：优先 row.date，否则 nowdate(如 20260402) */
		gqRowTimeMs(row) {
			if (!row) return 0;
			const d = row.date;
			if (d !== undefined && d !== null && String(d).trim() !== '') {
				const s = String(d).trim().replace(/\//g, '-');
				let t = Date.parse(s);
				if (!isNaN(t)) return t;
				const m = s.match(/^(\d{4})[-.](\d{1,2})[-.](\d{1,2})/);
				if (m) {
					t = Date.parse(`${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`);
					if (!isNaN(t)) return t;
				}
			}
			const nd = row.nowdate;
			if (nd === undefined || nd === null || nd === '') return 0;
			const n = Number(nd);
			if (!isNaN(n) && n >= 10000101 && n <= 99991231) {
				const str = String(Math.floor(n));
				if (str.length === 8) {
					const t2 = Date.parse(`${str.slice(0, 4)}-${str.slice(4, 6)}-${str.slice(6, 8)}`);
					if (!isNaN(t2)) return t2;
				}
			}
			const ss = String(nd).trim();
			if (/^\d{8}$/.test(ss)) {
				const t3 = Date.parse(`${ss.slice(0, 4)}-${ss.slice(4, 6)}-${ss.slice(6, 8)}`);
				if (!isNaN(t3)) return t3;
			}
			return 0;
		},
		/** 走势图 Y 轴刻度：固定两位小数 */
		formatGqAxisPrice(v) {
			if (v === undefined || v === null || isNaN(v)) return '--';
			return Number(v).toFixed(2);
		},
		/** X 轴只显示月-日，去掉年份 */
		formatGqXAxisLabel(row) {
			if (!row) return '';
			const d = row.date;
			if (d !== undefined && d !== null && String(d).trim() !== '') {
				const s = String(d).trim();
				const m = s.match(/^(\d{4})[-/.年](\d{1,2})[-/.月](\d{1,2})/);
				if (m) {
					return `${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`;
				}
				if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
					return s.slice(5);
				}
			}
			const nd = row.nowdate;
			if (nd !== undefined && nd !== null) {
				const num = Number(nd);
				if (!isNaN(num) && num >= 10000101 && num <= 99991231) {
					const str = String(Math.floor(num));
					if (str.length === 8) {
						return `${str.slice(4, 6)}-${str.slice(6, 8)}`;
					}
				}
				const ss = String(nd).trim();
				if (/^\d{8}$/.test(ss)) {
					return `${ss.slice(4, 6)}-${ss.slice(6, 8)}`;
				}
			}
			return d !== undefined && d !== null ? String(d) : String(nd || '');
		},
		/** orderlist 每条一页证书：姓名/身份证 member；ordersno=gq_sno；gpnum=gqorder_num；createtime/fztime=下单日(年月日) */
		buildCertSlidesFromOrderlist(data) {
			const member = (data && data.member) || {};
			const orders = (data && data.orderlist) || [];
			const gqList = (data && data.gq_list) || [];
			const name = String(member.realname != null ? member.realname : '').trim();
			const idcard = String(member.cardno != null ? member.cardno : '').trim();
			if (!Array.isArray(orders) || orders.length === 0) {
				this.certSlideConfigs = [];
				this.certImagePaths = [];
				return;
			}
			this.certSlideConfigs = orders.map((o, idx) => {
				const dateYmd = this.formatOrderCreatetimeYMD(o && o.createtime);
				const gqSno = o && o.gq_sno != null && String(o.gq_sno).trim() !== '' && o.gq_sno !== '-';
				const ordersno = gqSno ? String(o.gq_sno).trim() : String((o && o.order_sn) || '').trim();
				const gpnum =
					o && o.gqorder_num !== undefined && o.gqorder_num !== null && String(o.gqorder_num).trim() !== ''
						? String(o.gqorder_num).trim()
						: '';
				const price =
					o && o.price !== undefined && o.price !== null && String(o.price).trim() !== ''
						? String(o.price).trim()
						: '';
				const title =
					(o && o.pro_name && String(o.pro_name).trim()) ||
					(o && o.order_sn && String(o.order_sn).trim()) ||
					`持股证明 ${idx + 1}`;
				//const ctRaw = this.pickCertBgCreatetimeRaw(o, gqList);
				const ctRaw = o;
				
				return {
					title,
					certBg: this.certBgForCreatetimeRaw(ctRaw),
					fields: {
						name,
						idcard,
						ordersno,
						gpnum,
						price,
						createtime: dateYmd,
						fztime: dateYmd
					}
				};
			});
			this.certImagePaths = this.certSlideConfigs.map(() => '');
		},
		/**
		 * 证书底图用的时间：优先 gq_list 中与当前订单 gq_sno / order_sn 匹配项的 createtime，否则用订单 createtime
		 */
		pickCertBgCreatetimeRaw(order, gqList) {
			const list = Array.isArray(gqList) ? gqList : [];
			const orderSn = order && order.order_sn != null ? String(order.order_sn).trim() : '';
			const gqSno =
				order && order.gq_sno != null && String(order.gq_sno).trim() !== '' && order.gq_sno !== '-'
					? String(order.gq_sno).trim()
					: '';
			for (let i = 0; i < list.length; i++) {
				const item = list[i];
				if (!item) continue;
				const ct = item.createtime;
				if (ct === undefined || ct === null || String(ct).trim() === '') continue;
				const ig =
					item.gq_sno != null && String(item.gq_sno).trim() !== '' && item.gq_sno !== '-'
						? String(item.gq_sno).trim()
						: '';
				const io = item.order_sn != null ? String(item.order_sn).trim() : '';
				if (gqSno && ig && gqSno === ig) return ct;
				if (orderSn && io && orderSn === io) return ct;
			}
			return order && order.createtime;
		},
		rawCreatetimeToMs(val) {
			if (val === undefined || val === null || val === '') return null;
			const str = String(val).trim();
			if (!str) return null;
			if (/^\d+$/.test(str)) {
				let n = Number(str);
				if (n < 1e11) n *= 1000;
				const d = new Date(n);
				return isNaN(d.getTime()) ? null : d.getTime();
			}
			let t = Date.parse(str);
			if (!isNaN(t)) return t;
			const m = str.match(
				/^(\d{4})[-/.年](\d{1,2})[-/.月](\d{1,2})(?:日)?(?:\s+(\d{1,2}):(\d{1,2}):(\d{1,2}))?/
			);
			if (m) {
				const d = new Date(
					parseInt(m[1], 10),
					parseInt(m[2], 10) - 1,
					parseInt(m[3], 10),
					m[4] != null ? parseInt(m[4], 10) : 0,
					m[5] != null ? parseInt(m[5], 10) : 0,
					m[6] != null ? parseInt(m[6], 10) : 0
				);
				return isNaN(d.getTime()) ? null : d.getTime();
			}
			return null;
		},
		certBgForCreatetimeRaw(raw) {
			//const ms = this.rawCreatetimeToMs(raw);
			//if (ms === null) return CERT_BG_OLD;
			if(raw.is_ff ==0){
				return	CERT_BG_OLD;
			}
			if(raw.is_ff ==1){
				return	CERT_BG_NEW;
			}
			if(raw.is_ff ==2){
				return	CERT_BG_NEW1;
			}
		//	return ms > CERT_TIME_THRESHOLD_MS ? CERT_BG_NEW : CERT_BG_OLD;
		},
		formatOrderCreatetimeYMD(val) {
			if (val === undefined || val === null || val === '' || val === '-') return '';
			const s = String(val).trim();
			const m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
			if (!m) return '';
			return `${m[1]}年${m[2].padStart(2, '0')}月${m[3].padStart(2, '0')}日`;
		},
		applyGqChartFromApi(data) {
			const list = (data && data.gq_list) || [];
			if (!Array.isArray(list) || list.length === 0) {
				this.series = [];
				this.xLabels = [];
				this.yAxisMin = 0;
				this.yAxisMax = 100;
				return;
			}
			/* 与 gqSortedList 一致：按 date/nowdate 正序，取最后 N 天 */
			const sortedAsc = [...list].sort((a, b) => this.gqRowTimeMs(a) - this.gqRowTimeMs(b));
			const chartRows =
				sortedAsc.length > GQ_CHART_X_DAY_COUNT
					? sortedAsc.slice(-GQ_CHART_X_DAY_COUNT)
					: sortedAsc;
			const prices = chartRows.map((row) => parseFloat(row.nowprice));
			if (prices.some((p) => isNaN(p))) {
				this.series = [];
				this.xLabels = [];
				this.yAxisMin = 0;
				this.yAxisMax = 100;
				return;
			}
			this.series = prices;
			/* X 轴：5 个刻度，对应数据序列 0%、25%、50%、75%、100% 位置（点少时索引会重合，文案可能重复） */
			const n = chartRows.length;
			const fmt = (row) => this.formatGqXAxisLabel(row);
			const k = GQ_CHART_X_LABEL_COUNT;
			if (n <= 1) {
				const one = fmt(chartRows[0]);
				this.xLabels = Array(k).fill(one);
			} else {
				this.xLabels = [];
				for (let j = 0; j < k; j++) {
					const idx = Math.round((j / (k - 1)) * (n - 1));
					this.xLabels.push(fmt(chartRows[idx]));
				}
			}
			this.yAxisMin = 0;
			let maxP = Math.max(...prices);
			const minP = Math.min(...prices);
			if (minP === maxP) {
				const pad = Math.max(Math.abs(maxP) * 0.08, 1);
				this.yAxisMax = maxP + pad;
			} else {
				const span = maxP - minP;
				const pad = Math.max(span * 0.12, span * 0.05);
				this.yAxisMax = maxP + pad;
			}
			if (this.yAxisMax <= 0) {
				this.yAxisMax = 1;
			}
		},
		valueToY(v, padT, ch, yMin, yMax) {
			const t = (v - yMin) / (yMax - yMin);
			return padT + (1 - t) * ch;
		},
		/** 三次贝塞尔穿过各顶点（Catmull-Rom / 6），需已 beginPath；从首点 moveTo 起画到末点 */
		canvasSplineThroughPoints(ctx, points) {
			const n = points.length;
			if (n < 2) return;
			ctx.moveTo(points[0].x, points[0].y);
			if (n === 2) {
				ctx.lineTo(points[1].x, points[1].y);
				return;
			}
			const k = 1 / 6;
			for (let i = 0; i < n - 1; i++) {
				const p0 = i === 0 ? points[0] : points[i - 1];
				const p1 = points[i];
				const p2 = points[i + 1];
				const p3 = i === n - 2 ? points[n - 1] : points[i + 2];
				const cp1x = p1.x + (p2.x - p0.x) * k;
				const cp1y = p1.y + (p2.y - p0.y) * k;
				const cp2x = p2.x - (p3.x - p1.x) * k;
				const cp2y = p2.y - (p3.y - p1.y) * k;
				ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
			}
		},
		loadData() {
			gqdateApi()
				.then((res) => {
					const body = res && res.data;
					if (body && body.code === 1 && body.data) {
						this.servicesUnit = body.data;
						this.applyGqChartFromApi(body.data);
						this.buildCertSlidesFromOrderlist(body.data);
					}
					this.isPageShow = true;
					this.scheduleGqChartRedraw(0);
					this.scheduleGqLayoutKickWaves();
				})
				.catch(() => {
					this.isPageShow = true;
				});
		},
		clearGqChartTimers() {
			if (this._gqSchedTimer) {
				clearTimeout(this._gqSchedTimer);
				this._gqSchedTimer = null;
			}
			if (this._gqTouchRedrawTimer) {
				clearTimeout(this._gqTouchRedrawTimer);
				this._gqTouchRedrawTimer = null;
			}
			(this._gqLayoutKickTimers || []).forEach((id) => clearTimeout(id));
			this._gqLayoutKickTimers = [];
		},
		/** 用户轻触图表区域时强制重测量（与「第二次点击后变全」同源：触发布局刷新） */
		onGqChartTouchRedraw() {
			if (this._gqTouchRedrawTimer) clearTimeout(this._gqTouchRedrawTimer);
			this._gqTouchRedrawTimer = setTimeout(() => {
				this._gqTouchRedrawTimer = null;
				this.measureAndDrawGqChart(0);
			}, 24);
		},
		/**
		 * 冷启动后多波次补量宽+绘制（scroll-view 内 canvas 首帧宽度常未稳定，需等效「第二次进入」）
		 */
		scheduleGqLayoutKickWaves() {
			this._gqLayoutKickTimers = this._gqLayoutKickTimers || [];
			this._gqLayoutKickTimers.forEach((id) => clearTimeout(id));
			this._gqLayoutKickTimers = [];
			const delays = [420, 920, 1800];
			delays.forEach((ms) => {
				const tid = setTimeout(() => {
					if (this.series && this.series.length) {
						this.measureAndDrawGqChart(0);
					}
				}, ms);
				this._gqLayoutKickTimers.push(tid);
			});
		},
		/** 合并 onReady / loadData 的连续触发，避免重复量宽打架 */
		scheduleGqChartRedraw(retry) {
			const r = typeof retry === 'number' ? retry : 0;
			if (r > 0) {
				this.measureAndDrawGqChart(r);
				return;
			}
			if (this._gqSchedTimer) clearTimeout(this._gqSchedTimer);
			this._gqSchedTimer = setTimeout(() => {
				this._gqSchedTimer = null;
				this.measureAndDrawGqChart(0);
			}, 64);
		},
		/**
		 * 同时量 #gqLineChart 与 .canvas-box（scroll-view 下 canvas 节点宽度更准），再延时多帧 draw。
		 */
		measureAndDrawGqChart(retry) {
			const r = typeof retry === 'number' ? retry : 0;
			const maxRetry = 20;
			this.$nextTick(() => {
				setTimeout(() => {
					const q = uni.createSelectorQuery().in(this);
					q.select('#gqLineChart').boundingClientRect();
					q.select('.canvas-box').boundingClientRect();
					q.exec((res) => {
						const rc = res && res[0];
						const rb = res && res[1];
						const rect =
							rc && rc.width > 0 ? rc : rb && rb.width > 0 ? rb : null;
						if (rect && rect.width > 0) {
							this.canvasW = Math.floor(rect.width);
							this.canvasH = Math.floor(rect.width * 0.54);
							const paint = () => {
								if (!this.series || !this.series.length) return;
								this.drawChart();
							};
							this.$nextTick(() => {
								setTimeout(paint, 16);
								setTimeout(paint, 120);
								setTimeout(paint, 280);
							});
							return;
						}
						if (r < maxRetry) {
							this.measureAndDrawGqChart(r + 1);
						} else {
							this.$nextTick(() => {
								this.drawChart();
								setTimeout(() => this.drawChart(), 200);
							});
						}
					});
				}, r === 0 ? 100 : 52);
			});
		},
		drawChart() {
			const w = this.canvasW;
			const h = this.canvasH;
			if (w < 10 || h < 10) return;
			/* 圆滑曲线略超出折点，左右多留避免贴边被裁 */
			const padExtra = this.series.length > 2 ? 4 : 0;
			const padL = 8 + padExtra;
			const padR = 8 + padExtra;
			const padT = 12;
			const padB = 8;
			const cw = w - padL - padR;
			const ch = h - padT - padB;
			const vals = this.series;
			const yMin = this.yAxisMin;
			const yMax = this.yAxisMax;
			const ctx = uni.createCanvasContext('gqLineChart', this);
			if (!vals.length) {
				ctx.setFillStyle('#999');
				ctx.setFontSize(12);
				ctx.setTextAlign('center');
				ctx.fillText('暂无走势数据', w / 2, h / 2);
				ctx.draw();
				return;
			}
			const xDenom = Math.max(1, vals.length - 1);
			const points = vals.map((v, i) => {
				const clamped = Math.min(yMax, Math.max(yMin, v));
				const x = padL + (i / xDenom) * cw;
				const y = this.valueToY(clamped, padT, ch, yMin, yMax);
				return { x, y };
			});
			const tickLines = Math.max(1, this.yTickCount - 1);
			ctx.setStrokeStyle('rgba(224, 32, 32, 0.15)');
			ctx.setLineWidth(1);
			for (let i = 0; i <= tickLines; i++) {
				const gy = padT + (i / tickLines) * ch;
				ctx.beginPath();
				ctx.moveTo(padL, gy);
				ctx.lineTo(padL + cw, gy);
				ctx.stroke();
			}
			/* 折线下方渐变填充（与主题色 #E02020 一致） */
			const bottomY = padT + ch;
			const grd = ctx.createLinearGradient(0, padT, 0, bottomY);
			grd.addColorStop(0, 'rgba(224, 32, 32, 0.38)');
			grd.addColorStop(1, 'rgba(224, 32, 32, 0)');
			if (points.length === 1) {
				const p = points[0];
				const half = Math.max(4, Math.min(40, cw * 0.06));
				ctx.setFillStyle(grd);
				ctx.beginPath();
				ctx.moveTo(p.x - half, p.y);
				ctx.lineTo(p.x + half, p.y);
				ctx.lineTo(p.x + half, bottomY);
				ctx.lineTo(p.x - half, bottomY);
				ctx.closePath();
				ctx.fill();
				ctx.setStrokeStyle('#E02020');
				ctx.setLineWidth(1.25);
				ctx.beginPath();
				ctx.moveTo(p.x - half, p.y);
				ctx.lineTo(p.x + half, p.y);
				ctx.stroke();
				ctx.draw();
				return;
			}
			ctx.setFillStyle(grd);
			ctx.beginPath();
			this.canvasSplineThroughPoints(ctx, points);
			ctx.lineTo(points[points.length - 1].x, bottomY);
			ctx.lineTo(points[0].x, bottomY);
			ctx.closePath();
			ctx.fill();
			ctx.setStrokeStyle('#E02020');
			ctx.setLineWidth(1.25);
			ctx.beginPath();
			this.canvasSplineThroughPoints(ctx, points);
			ctx.stroke();
			ctx.draw();
		},
		onMenuTap(item) {
			if (item.name === '持股证明') {
				if (!this.certSlideConfigs || this.certSlideConfigs.length === 0) {
					uni.showToast({ title: '暂无持股订单', icon: 'none' });
					return;
				}
				this.certCurrent = 0;
				this.resetCertImagePaths();
				this.certPopupShow = true;
				this.$nextTick(() => {
					setTimeout(() => this.generateAllCertSlides(), 100);
				});
				return;
			}
			if (item.name === '合同证明') {
				if (!this.certSlideConfigs || this.certSlideConfigs.length === 0) {
					uni.showToast({ title: '暂无持股订单', icon: 'none' });
					return;
				}
				this.htCurrent = 0;
				this.resetHtContractImagePaths();
				this.htContractPopupShow = true;
				this.$nextTick(() => {
					setTimeout(() => this.generateAllHtContractSlides(), 100);
				});
				return;
			}
			if (item.name === '股权回购') {
				this.openHuigouStaticGallery();
				return;
			}
			if (item.name === '对赌协议') {
				this.openDuiduStaticGallery();
				return;
			}
			uni.showToast({ title: item.name, icon: 'none' });
		},
		closeHtContractPopup() {
			this.htContractPopupShow = false;
		},
		resetHtContractImagePaths() {
			this.htContractImagePaths = this.certSlideConfigs.map(() => '');
		},
		/** 股权回购：仅 1 张 huigou 图，与订单无关；底部圆点与左右按钮保留（单页时仍可点，逻辑环回同一页） */
		openHuigouStaticGallery() {
			const src = String(HUIGOU_PIC || '').trim();
			if (!src) {
				uni.showToast({ title: '股权回购图片未配置', icon: 'none' });
				return;
			}
			uni.getImageInfo({
				src,
				fail: () => {
					uni.showToast({ title: '请放置 static/huigoupic.png', icon: 'none' });
				},
				success: () => {
					this.staticGalleryKind = 'huigou';
					this.staticGalleryCurrent = 0;
					this.staticGallerySlides = [{ title: '股权回购', src }];
					this.staticGalleryShow = true;
				}
			});
		},
		/** 对赌协议：仅 1 张 duidupng 图，与订单无关；底部圆点与左右按钮同股权回购 */
		openDuiduStaticGallery() {
			const src = String(DUIDU_PIC || '').trim();
			if (!src) {
				uni.showToast({ title: '对赌协议图片未配置', icon: 'none' });
				return;
			}
			uni.getImageInfo({
				src,
				fail: () => {
					uni.showToast({ title: '请放置 static/duidupng.png', icon: 'none' });
				},
				success: () => {
					this.staticGalleryKind = 'duidu';
					this.staticGalleryCurrent = 0;
					this.staticGallerySlides = [{ title: '对赌协议', src }];
					this.staticGalleryShow = true;
				}
			});
		},
		closeStaticGallery() {
			this.staticGalleryShow = false;
		},
		onStaticGalleryChange(e) {
			this.staticGalleryCurrent = e.detail.current;
		},
		staticGalleryPrev() {
			const n = this.staticGallerySlides.length;
			if (n <= 0) return;
			this.staticGalleryCurrent = (this.staticGalleryCurrent - 1 + n) % n;
		},
		staticGalleryNext() {
			const n = this.staticGallerySlides.length;
			if (n <= 0) return;
			this.staticGalleryCurrent = (this.staticGalleryCurrent + 1) % n;
		},
		staticGalleryGo(i) {
			this.staticGalleryCurrent = i;
		},
		saveStaticGallerySlide() {
			const slides = this.staticGallerySlides;
			const i = this.staticGalleryCurrent;
			if (!slides[i]) {
				uni.showToast({ title: '暂无图片', icon: 'none' });
				return;
			}
			const src = String((slides[i] && slides[i].src) || '').trim();
			if (!src) {
				uni.showToast({ title: '当前页图片为空', icon: 'none' });
				return;
			}
			const prefix =
				this.staticGalleryKind === 'huigou' ? '股权回购' : this.staticGalleryKind === 'duidu' ? '对赌协议' : '资料';
			const fileName =
				(this.staticGalleryKind === 'huigou' || this.staticGalleryKind === 'duidu') && slides.length === 1
					? `${prefix}.png`
					: `${prefix}_${i + 1}.png`;
			uni.showLoading({ title: '保存中', mask: true });
			const hide = () => uni.hideLoading();
			uni.getImageInfo({
				src,
				fail: () => {
					hide();
					uni.showToast({ title: '图片加载失败', icon: 'none' });
				},
				success: (img) => {
					const filePath = img.path;
					// #ifdef H5
					this.saveCertImageH5(filePath || src, fileName)
						.then(() => {
							hide();
							uni.showToast({ title: '图片已下载', icon: 'success' });
						})
						.catch(() => {
							hide();
							uni.showToast({ title: '保存失败，请长按图片另存为', icon: 'none' });
						});
					// #endif
					// #ifndef H5
					this.saveImageToPhotosAlbumWithFallback(filePath, {
						hide,
						okTitle: '已保存到相册',
						authContent: '保存图片需要允许访问相册'
					});
					// #endif
				}
			});
		},
		getHtContractFields() {
			const q = this.certFromQuery || {};
			const user = this.gqUserProfile();
			const nameRaw = this.pickDateField(q, user, [
				'realname',
				'realName',
				'real_name',
				'name',
				'username',
				'user_name',
				'nickname'
			]);
			const cardRaw = this.pickDateField(q, user, [
				'cardno',
				'CardNo',
				'idcard',
				'id_card',
				'idCard',
				'identity_card',
				'sfzh'
			]);
			const htRaw = this.pickDateField(q, user, ['httime', 'ht_time', 'contract_time', 'fztime', 'createtime']);
			let httime = '';
			if (htRaw) {
				httime = this.formatCertDateTime(htRaw) || String(htRaw).trim();
			}
			if (!httime) {
				const d = new Date();
				const y = d.getFullYear();
				const m = `${d.getMonth() + 1}`.padStart(2, '0');
				const day = `${d.getDate()}`.padStart(2, '0');
				httime = `${y}年${m}月${day}日`;
			}
			const realname = String(nameRaw || '').trim() || HT_CONTRACT_DEFAULTS.realname;
			const cardno = String(cardRaw || '').trim() || HT_CONTRACT_DEFAULTS.cardno;
			const c = this.getCertFields({});
			return {
				realname,
				cardno,
				httime,
				gpnum: c.gpnum,
				fztime: c.fztime
			};
		},
		/** 按持股证明同一页的 fields 填合同（含 gpnum、fztime，与 getCertFields 合并规则一致） */
		getHtContractFieldsFromSlide(slide) {
			const f = slide && slide.fields && typeof slide.fields === 'object' ? slide.fields : {};
			const c = this.getCertFields(f);
			const realname = String(c.name || '').trim() || HT_CONTRACT_DEFAULTS.realname;
			const cardno = String(c.idcard || '').trim() || HT_CONTRACT_DEFAULTS.cardno;
			let httime = String(c.createtime || c.fztime || '').trim();
			if (!httime) {
				httime = this.getHtContractFields().httime;
			}
			return {
				realname,
				cardno,
				httime,
				gpnum: String(c.gpnum != null ? c.gpnum : '').trim(),
				fztime: String(c.fztime != null ? c.fztime : '').trim()
			};
		},
		drawHtForSlide(bgPath, w, h, slideIndex, done) {
			const slide = this.certSlideConfigs[slideIndex];
			const { realname, cardno, httime, gpnum, fztime } = this.getHtContractFieldsFromSlide(slide);
			const ctx = uni.createCanvasContext('htContractCanvas', this);
			const { htLayout: layout } = this;
			ctx.drawImage(bgPath, 0, 0, w, h);
			this.fillTextAt(ctx, w, h, realname, layout.realname);
			this.fillTextAt(ctx, w, h, cardno, layout.cardno);
			this.fillTextAt(ctx, w, h, gpnum, layout.gpnum);
			this.fillTextAt(ctx, w, h, fztime, layout.fztime);
			this.fillTextAt(ctx, w, h, httime, layout.httime);
			ctx.draw(false, () => {
				uni.canvasToTempFilePath(
					{
						canvasId: 'htContractCanvas',
						width: w,
						height: h,
						destWidth: w,
						destHeight: h,
						fileType: 'png',
						quality: 1,
						success: (res) => {
							const paths = [...this.htContractImagePaths];
							paths[slideIndex] = res.tempFilePath;
							this.htContractImagePaths = paths;
							done && done();
						},
						fail: () => {
							uni.showToast({ title: '合同图导出失败', icon: 'none' });
							done && done();
						}
					},
					this
				);
			});
		},
		runHtSlideChain(i, bgPath, w, h, n) {
			if (i >= n) {
				uni.hideLoading();
				return;
			}
			uni.showLoading({ title: CERT_POPUP_LOADING_TITLE, mask: true });
			this.drawHtForSlide(bgPath, w, h, i, () => {
				this.runHtSlideChain(i + 1, bgPath, w, h, n);
			});
		},
		generateAllHtContractSlides() {
			const n = this.certSlideConfigs.length;
			if (n === 0) return;
			uni.showLoading({ title: CERT_POPUP_LOADING_TITLE, mask: true });
			uni.getImageInfo({
				src: HT_CONTRACT_BG,
				fail: () => {
					uni.hideLoading();
					uni.showToast({
						title: '请将合同底图放在 static/hetongzhengshu.png',
						icon: 'none',
						duration: 2800
					});
				},
				success: (img) => {
					const maxW = 750;
					let w = img.width;
					let h = img.height;
					if (w > maxW) {
						const r = maxW / w;
						w = Math.floor(maxW);
						h = Math.floor(h * r);
					}
					this.htCanvasW = w;
					this.htCanvasH = h;
					this.$nextTick(() => {
						setTimeout(() => this.runHtSlideChain(0, img.path, w, h, n), 80);
					});
				}
			});
		},
		ensureHtSlide(idx) {
			const n = this.certSlideConfigs.length;
			if (idx < 0 || idx >= n || this.htContractImagePaths[idx]) return;
			if (this._htEnsureBusy) return;
			this._htEnsureBusy = true;
			uni.showLoading({ title: CERT_POPUP_LOADING_TITLE, mask: true });
			uni.getImageInfo({
				src: HT_CONTRACT_BG,
				fail: () => {
					this._htEnsureBusy = false;
					uni.hideLoading();
					uni.showToast({
						title: '请将合同底图放在 static/hetongzhengshu.png',
						icon: 'none',
						duration: 2800
					});
				},
				success: (img) => {
					const maxW = 750;
					let w = img.width;
					let h = img.height;
					if (w > maxW) {
						const r = maxW / w;
						w = Math.floor(maxW);
						h = Math.floor(h * r);
					}
					this.htCanvasW = w;
					this.htCanvasH = h;
					this.$nextTick(() => {
						setTimeout(() => {
							this.drawHtForSlide(img.path, w, h, idx, () => {
								this._htEnsureBusy = false;
								uni.hideLoading();
							});
						}, 80);
					});
				}
			});
		},
		onHtSwiperChange(e) {
			this.htCurrent = e.detail.current;
			this.ensureHtSlide(this.htCurrent);
		},
		htPrev() {
			const n = this.certSlideConfigs.length;
			if (n <= 0) return;
			this.htCurrent = (this.htCurrent - 1 + n) % n;
			this.$nextTick(() => this.ensureHtSlide(this.htCurrent));
		},
		htNext() {
			const n = this.certSlideConfigs.length;
			if (n <= 0) return;
			this.htCurrent = (this.htCurrent + 1) % n;
			this.$nextTick(() => this.ensureHtSlide(this.htCurrent));
		},
		htGo(i) {
			this.htCurrent = i;
			this.$nextTick(() => this.ensureHtSlide(this.htCurrent));
		},
		saveHtContractSlide() {
			const filePath = this.htContractImagePaths[this.htCurrent];
			if (!filePath) {
				uni.showToast({ title: '请等待当前页生成完成', icon: 'none' });
				return;
			}
			const fileName = `合同证明_${this.htCurrent + 1}.png`;
			uni.showLoading({ title: '保存中', mask: true });
			const hide = () => uni.hideLoading();
			// #ifdef H5
			this.saveCertImageH5(filePath, fileName)
				.then(() => {
					hide();
					uni.showToast({ title: '图片已下载', icon: 'success' });
				})
				.catch(() => {
					hide();
					uni.showToast({ title: '保存失败，请长按图片另存为', icon: 'none' });
				});
			return;
			// #endif
			this.saveImageToPhotosAlbumWithFallback(filePath, {
				hide,
				okTitle: '已保存到相册',
				authContent: '保存图片需要允许访问相册，请在系统设置中开启相册权限'
			});
		},
		resetCertImagePaths() {
			this.certImagePaths = this.certSlideConfigs.map(() => '');
		},
		closeCertPopup() {
			this.certPopupShow = false;
		},
		onCertSwiperChange(e) {
			this.certCurrent = e.detail.current;
			/* 若某页未生成（例如批量中断），滑到该页时补生成 */
			this.ensureCertSlide(this.certCurrent);
		},
		formatCertDateTime(val) {
			if (val === undefined || val === null || val === '') return '';
			const str = String(val).trim();
			if (/^\d+$/.test(str)) {
				let n = Number(str);
				if (n < 1e11) n *= 1000;
				const d = new Date(n);
				if (!isNaN(d.getTime())) {
					const y = d.getFullYear();
					const m = `${d.getMonth() + 1}`.padStart(2, '0');
					const day = `${d.getDate()}`.padStart(2, '0');
					return `${y}年${m}月${day}日`;
				}
			}
			return str;
		},
		pickDateField(q, user, keys) {
			for (let i = 0; i < keys.length; i++) {
				const k = keys[i];
				const fromQ = q[k];
				if (fromQ !== undefined && fromQ !== null && String(fromQ).trim() !== '') return fromQ;
			}
			for (let i = 0; i < keys.length; i++) {
				const k = keys[i];
				const v = user[k];
				if (v !== undefined && v !== null && String(v).trim() !== '') return v;
			}
			return '';
		},
		/** gqdate 接口 data.member：realname、cardno 优先于本地 user_info */
		gqUserProfile() {
			const stored = uni.getStorageSync('user_info') || {};
			const mem = (this.servicesUnit && this.servicesUnit.member) || {};
			const rn = mem.realname != null && String(mem.realname).trim() !== '' ? String(mem.realname).trim() : '';
			const cn = mem.cardno != null && String(mem.cardno).trim() !== '' ? String(mem.cardno).trim() : '';
			return {
				...stored,
				...mem,
				...(rn ? { realname: rn, name: rn } : {}),
				...(cn ? { cardno: cn, idcard: cn, id_card: cn } : {})
			};
		},
		getCertFields(mergeFields) {
			const q = this.certFromQuery || {};
			const user = this.gqUserProfile();
			const nameRaw = this.pickDateField(q, user, [
				'name',
				'realname',
				'realName',
				'real_name',
				'username',
				'user_name',
				'nickname'
			]);
			const idRaw = this.pickDateField(q, user, [
				'idcard',
				'cardno',
				'id_card',
				'idCard',
				'identity_card',
				'sfzh',
				'card_no',
				'certificate_no'
			]);
			const name = String(nameRaw || '').trim();
			const idcard = String(idRaw || '').trim();
			const ordersno = (q.ordersno || user.ordersno || user.order_no || '').trim();
			const gpnumSrc = q.gpnum !== undefined && q.gpnum !== '' ? q.gpnum : user.gpnum;
			const gpnum =
				gpnumSrc === undefined || gpnumSrc === null || gpnumSrc === ''
					? CERT_DEFAULTS.gpnum
					: String(gpnumSrc).trim();
			const priceSrc = q.price !== undefined && q.price !== '' ? q.price : user.price;
			const price =
				priceSrc === undefined || priceSrc === null || priceSrc === ''
					? CERT_DEFAULTS.price
					: String(priceSrc).trim();
			const ctRaw = this.pickDateField(q, user, ['createtime', 'create_time']);
			const fzRaw = this.pickDateField(q, user, ['fztime', 'fz_time']);
			const createtimeStr = ctRaw ? this.formatCertDateTime(ctRaw) || String(ctRaw).trim() : '';
			const fztimeStr = fzRaw ? this.formatCertDateTime(fzRaw) || String(fzRaw).trim() : '';
			const base = {
				name: name || CERT_DEFAULTS.name,
				idcard: idcard || CERT_DEFAULTS.idcard,
				ordersno: ordersno || CERT_DEFAULTS.ordersno,
				gpnum,
				price,
				createtime: createtimeStr || CERT_DEFAULTS.createtime,
				fztime: fztimeStr || CERT_DEFAULTS.fztime
			};
			if (!mergeFields || typeof mergeFields !== 'object') return base;
			const keys = ['name', 'idcard', 'ordersno', 'gpnum', 'price', 'createtime', 'fztime'];
			const out = { ...base };
			keys.forEach((k) => {
				const v = mergeFields[k];
				if (v === undefined || v === null || String(v).trim() === '') return;
				const s = String(v).trim();
				if ((k === 'createtime' || k === 'fztime') && /^\d+$/.test(s)) {
					const formatted = this.formatCertDateTime(s);
					out[k] = formatted || s;
				} else {
					out[k] = s;
				}
			});
			return out;
		},
		fillTextAt(ctx, w, h, text, slot) {
			const align = slot.align || 'center';
			const font = Math.max(12, Math.floor(h * (slot.fontRatio || 0.032)));
			ctx.setTextAlign(align);
			ctx.setFillStyle('#1a1a1a');
			ctx.setFontSize(font);
			const x = w * (slot.x != null ? slot.x : 0.5);
			ctx.fillText(String(text), x, h * slot.y);
		},
		/** 持股证明 certLayout：黑体加粗（纯黑 + 描边加粗，兼容旧版 canvas） */
		fillCertTextAt(ctx, w, h, text, slot) {
			const align = slot.align || 'center';
			const fontSize = Math.max(12, Math.floor(h * (slot.fontRatio || 0.032)));
			const x = w * (slot.x != null ? slot.x : 0.5);
			const y = h * slot.y;
			const s = String(text);
			ctx.setTextAlign(align);
			ctx.setFillStyle('#000000');
			ctx.setFontSize(fontSize);
			// #ifdef H5
			try {
				if (ctx.font !== undefined) {
					ctx.font = `600 ${fontSize}px "STHeiti","SimHei","Microsoft YaHei","PingFang SC",sans-serif`;
				}
			} catch (e) {
				/* 旧版 canvas 无 font，走下方描边加粗 */
			}
			// #endif
			if (typeof ctx.strokeText === 'function' && typeof ctx.setLineWidth === 'function') {
				const lw = Math.max(0.28, fontSize * 0.03);
				ctx.setLineWidth(lw);
				ctx.setStrokeStyle('#000000');
				if (typeof ctx.setLineJoin === 'function') {
					ctx.setLineJoin('round');
				}
				ctx.strokeText(s, x, y);
			}
			ctx.fillText(s, x, y);
		},
		generateAllCertSlides() {
			const n = this.certSlideConfigs.length;
			if (n === 0) return;
			uni.showLoading({ title: CERT_POPUP_LOADING_TITLE, mask: true });
			this.prepareCertWatermark(() => {
				this.$nextTick(() => {
					setTimeout(() => this.runCertSlideChain(0, n), 80);
				});
			});
		},
		prepareCertWatermark(done) {
			if (this.certWmPath && this.certWmNatural) {
				done && done();
				return;
			}
			uni.getImageInfo({
				src: CERT_WATERMARK,
				success: (wm) => {
					this.certWmPath = wm.path;
					this.certWmNatural = { w: wm.width, h: wm.height };
					done && done();
				},
				fail: () => {
					this.certWmPath = '';
					this.certWmNatural = null;
					done && done();
				}
			});
		},
		drawCertWatermark(ctx, cw, ch) {
			if (!this.certWmPath || !this.certWmNatural) return;
			const iw = this.certWmNatural.w;
			const ih = this.certWmNatural.h;
			if (iw < 1 || ih < 1) return;
			const dw = cw;
			let dh = Math.round((ih / iw) * cw);
			if (dh > ch) dh = ch;
			ctx.drawImage(this.certWmPath, 0, 0, dw, dh);
		},
		runCertSlideChain(i, n) {
			if (i >= n) {
				uni.hideLoading();
				return;
			}
			const slide = this.certSlideConfigs[i];
			const src = (slide && slide.certBg) || CERT_BG_OLD;
			uni.showLoading({ title: CERT_POPUP_LOADING_TITLE, mask: true });
			uni.getImageInfo({
				src,
				fail: () => {
					uni.hideLoading();
					uni.showToast({
						title: '请将证书模板放在 static/zhengshu.png 与 static/zhengshu1.png',
						icon: 'none',
						duration: 2800
					});
				},
				success: (img) => {
					const maxW = 750;
					let w = img.width;
					let h = img.height;
					if (w > maxW) {
						const r = maxW / w;
						w = Math.floor(maxW);
						h = Math.floor(h * r);
					}
					this.certCanvasW = w;
					this.certCanvasH = h;
					this.$nextTick(() => {
						setTimeout(() => {
							this.drawCertForSlide(img.path, w, h, i, () => {
								this.runCertSlideChain(i + 1, n);
							});
						}, 80);
					});
				}
			});
		},
		drawCertForSlide(bgPath, w, h, slideIndex, done) {
			const merge =
				this.certSlideConfigs[slideIndex] && this.certSlideConfigs[slideIndex].fields
					? this.certSlideConfigs[slideIndex].fields
					: {};
			const ctx = uni.createCanvasContext('gqCertCanvas', this);
			const { certLayout: layout } = this;
			ctx.drawImage(bgPath, 0, 0, w, h);
			this.drawCertWatermark(ctx, w, h);
			const { name, idcard, ordersno, gpnum, price, createtime, fztime } = this.getCertFields(merge);
			this.fillCertTextAt(ctx, w, h, name, layout.name);
			this.fillCertTextAt(ctx, w, h, idcard, layout.idcard);
			this.fillCertTextAt(ctx, w, h, ordersno, layout.ordersno);
			this.fillCertTextAt(ctx, w, h, gpnum, layout.gpnum);
			this.fillCertTextAt(ctx, w, h, price, layout.price);
			this.fillCertTextAt(ctx, w, h, createtime, layout.createtime);
			this.fillCertTextAt(ctx, w, h, fztime, layout.fztime);
			ctx.draw(false, () => {
				uni.canvasToTempFilePath(
					{
						canvasId: 'gqCertCanvas',
						width: w,
						height: h,
						destWidth: w,
						destHeight: h,
						fileType: 'png',
						quality: 1,
						success: (res) => {
							const paths = [...this.certImagePaths];
							paths[slideIndex] = res.tempFilePath;
							this.certImagePaths = paths;
							done && done();
						},
						fail: () => {
							uni.showToast({ title: '导出图片失败', icon: 'none' });
							done && done();
						}
					},
					this
				);
			});
		},
		ensureCertSlide(idx) {
			const n = this.certSlideConfigs.length;
			if (idx < 0 || idx >= n || this.certImagePaths[idx]) return;
			if (this._certEnsureBusy) return;
			this._certEnsureBusy = true;
			const slide = this.certSlideConfigs[idx];
			const src = (slide && slide.certBg) || CERT_BG_OLD;
			uni.showLoading({ title: CERT_POPUP_LOADING_TITLE, mask: true });
			uni.getImageInfo({
				src,
				fail: () => {
					this._certEnsureBusy = false;
					uni.hideLoading();
					uni.showToast({
						title: '请将证书模板放在 static/zhengshu.png 与 static/zhengshu1.png',
						icon: 'none',
						duration: 2800
					});
				},
				success: (img) => {
					const maxW = 750;
					let w = img.width;
					let h = img.height;
					if (w > maxW) {
						const r = maxW / w;
						w = Math.floor(maxW);
						h = Math.floor(h * r);
					}
					this.certCanvasW = w;
					this.certCanvasH = h;
					this.prepareCertWatermark(() => {
						this.$nextTick(() => {
							setTimeout(() => {
								this.drawCertForSlide(img.path, w, h, idx, () => {
									this._certEnsureBusy = false;
									uni.hideLoading();
								});
							}, 80);
						});
					});
				}
			});
		},
		certPrev() {
			const n = this.certSlideConfigs.length;
			if (n <= 0) return;
			this.certCurrent = (this.certCurrent - 1 + n) % n;
			this.$nextTick(() => this.ensureCertSlide(this.certCurrent));
		},
		certNext() {
			const n = this.certSlideConfigs.length;
			if (n <= 0) return;
			this.certCurrent = (this.certCurrent + 1) % n;
			this.$nextTick(() => this.ensureCertSlide(this.certCurrent));
		},
		certGo(i) {
			this.certCurrent = i;
			this.$nextTick(() => this.ensureCertSlide(this.certCurrent));
		},
		saveCertSlide() {
			const filePath = this.certImagePaths[this.certCurrent];
			if (!filePath) {
				uni.showToast({ title: '请等待当前页证书生成完成', icon: 'none' });
				return;
			}
			const fileName = `股权证明_${this.certCurrent + 1}.png`;
			uni.showLoading({ title: '保存中', mask: true });
			const hide = () => uni.hideLoading();

			// #ifdef H5
			this.saveCertImageH5(filePath, fileName)
				.then(() => {
					hide();
					uni.showToast({ title: '图片已下载', icon: 'success' });
				})
				.catch(() => {
					hide();
					uni.showToast({ title: '保存失败，请长按图片另存为', icon: 'none' });
				});
			return;
			// #endif

			this.saveImageToPhotosAlbumWithFallback(filePath, {
				hide,
				okTitle: '已保存到相册',
				authContent: '保存证书图片需要允许访问相册，请在系统设置中开启相册权限'
			});
		},
		/** App/小程序保存到相册：App 失败时尝试 plus.gallery.save，去设置页用 openAppAuthorizeSetting */
		saveImageToPhotosAlbumWithFallback(filePath, opts) {
			const hide = (opts && opts.hide) || (() => {});
			const okTitle = (opts && opts.okTitle) || '已保存到相册';
			const authContent =
				(opts && opts.authContent) || '保存图片需要允许访问相册，请在系统设置中开启相关权限';

			const openAlbumSettings = () => {
				// #ifdef APP-PLUS
				if (typeof uni.openAppAuthorizeSetting === 'function') {
					uni.openAppAuthorizeSetting({});
					return;
				}
				if (typeof plus !== 'undefined' && plus.runtime && typeof plus.runtime.openURL === 'function') {
					plus.runtime.openURL('app-settings:');
				}
				return;
				// #endif
				// #ifdef MP-WEIXIN
				uni.openSetting({});
				// #endif
			};

			const failFinal = (err) => {
				hide();
				const msg = ((err && err.errMsg) || String(err || '')).toLowerCase();
				const needAuth =
					msg.indexOf('auth') !== -1 ||
					msg.indexOf('deny') !== -1 ||
					msg.indexOf('permission') !== -1 ||
					msg.indexOf('authorize') !== -1;
				if (needAuth) {
					uni.showModal({
						title: '需要相册权限',
						content: authContent,
						confirmText: '去设置',
						cancelText: '取消',
						success: (res) => {
							if (res.confirm) openAlbumSettings();
						}
					});
				} else {
					uni.showToast({ title: '保存失败，请重试', icon: 'none' });
				}
			};

			const onOk = () => {
				hide();
				uni.showToast({ title: okTitle, icon: 'success' });
			};

			uni.saveImageToPhotosAlbum({
				filePath,
				success: onOk,
				fail: (err) => {
					// #ifdef APP-PLUS
					if (typeof plus !== 'undefined' && plus.gallery && typeof plus.gallery.save === 'function') {
						plus.gallery.save(
							filePath,
							onOk,
							() => {
								failFinal(err);
							}
						);
						return;
					}
					// #endif
					failFinal(err);
				}
			});
		},
		saveCertImageH5(src, fileName) {
			return new Promise((resolve, reject) => {
				if (src.startsWith('blob:') || src.startsWith('data:')) {
					try {
						const a = document.createElement('a');
						a.href = src;
						a.download = fileName;
						a.rel = 'noopener';
						document.body.appendChild(a);
						a.click();
						document.body.removeChild(a);
						resolve();
					} catch (e) {
						reject(e);
					}
					return;
				}
				const xhr = new XMLHttpRequest();
				xhr.open('GET', src, true);
				xhr.responseType = 'blob';
				xhr.onload = () => {
					if (xhr.status !== 200) {
						reject(new Error('load fail'));
						return;
					}
					try {
						const url = URL.createObjectURL(xhr.response);
						const a = document.createElement('a');
						a.href = url;
						a.download = fileName;
						a.rel = 'noopener';
						document.body.appendChild(a);
						a.click();
						document.body.removeChild(a);
						URL.revokeObjectURL(url);
						resolve();
					} catch (e) {
						reject(e);
					}
				};
				xhr.onerror = () => reject(new Error('network'));
				xhr.send();
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	position: relative;
	background: transparent;
	display: flex;
	flex-direction: column;
}

.page-inner {
	flex: 1;
	display: flex;
	flex-direction: column;
	min-height: 0;
	position: relative;
	z-index: 1;
}

.page-bg {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	z-index: 0;
	background-color: #6b0c0c;
	background-image: url('/static/gqbng.png');
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
	pointer-events: none;
}

.nav-title {
	font-size: 34rpx;
	font-weight: bold;
	color: #fff;
}

.scroll {
	flex: 1;
	height: 0;
	box-sizing: border-box;
}

.content {
	padding: 0 28rpx 48rpx;
}

.card {
	background: #fff;
	border-radius: 20rpx;
	box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.12);
	overflow: hidden;
}

.main-card {
	margin-bottom: 28rpx;
}

.card-head {
	text-align: center;
	font-size: 30rpx;
	font-weight: bold;
	color: #333;
	padding: 36rpx 24rpx 28rpx;
}

.stats-row {
	display: flex;
	padding: 0 32rpx 32rpx;
}

.stat-col {
	flex: 1;
	text-align: center;
}

.stat-val {
	font-size: 48rpx;
	font-weight: bold;
	color: #c00000;
	line-height: 1.2;
}

.stat-label {
	margin-top: 12rpx;
	font-size: 24rpx;
	color: #999;
}

.chart-block {
	padding: 0 20rpx 24rpx;
}

.chart-title {
	display: flex;
	align-items: center;
	font-size: 28rpx;
	font-weight: 600;
	color: #333;
	margin-bottom: 16rpx;
}

.chart-bar {
	display: inline-block;
	width: 6rpx;
	height: 28rpx;
	background: #c00000;
	border-radius: 3rpx;
	margin-right: 12rpx;
}

.chart-wrap {
	display: flex;
	flex-direction: row;
	align-items: stretch;
}

.y-labels {
	width: 108rpx;
	flex-shrink: 0;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	/* 与 canvas 绘图区上下留白（约 12px / 8px）对齐，刻度与网格线一致 */
	padding: 24rpx 0 16rpx 4rpx;
	font-size: 20rpx;
	color: #999;
	line-height: 1.2;
	box-sizing: border-box;
}

.canvas-box {
	flex: 1;
	min-width: 0;
}

.line-canvas {
	display: block;
	/* 宽高由 :style + :width/:height 控制，避免与 flex 布局百分比冲突导致首次绘制错位 */
}

.x-labels {
	display: flex;
	align-items: center;
	padding: 8rpx 8rpx 0 108rpx;
	font-size: 20rpx;
	color: #999;
	box-sizing: border-box;
}

.x-lab {
	flex: 1;
	min-width: 0;
	line-height: 1.2;
}

.x-lab--start {
	text-align: left;
}

.x-lab--mid {
	text-align: center;
}

.x-lab--end {
	text-align: right;
}

.card-footer-bar {
	display: flex;
	background: #f8ece8;
	padding: 28rpx 24rpx;
}

.footer-item {
	flex: 1;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	font-size: 24rpx;
}

.footer-item:first-child {
	padding-right: 16rpx;
}

.dot {
	width: 12rpx;
	height: 12rpx;
	border-radius: 50%;
	margin-right: 8rpx;
}

.dot.red {
	background: #c00000;
}

.dot.blue {
	background: #2b6cb0;
}

.footer-label {
	color: #666;
	margin-right: 8rpx;
}

.footer-val {
	color: #c00000;
	font-weight: bold;
	font-size: 28rpx;
}

.menu-card {
	padding: 36rpx 12rpx 40rpx;
}

.menu-grid {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: flex-start;
}

.menu-item {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 0 4rpx;
}

.menu-icon {
	width: 88rpx;
	height: 88rpx;
	border-radius: 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 16rpx;
}

.menu-icon--bare {
	background: transparent;
}

.menu-icon-img {
	width: 80rpx;
	height: 80rpx;
}

.ic-a {
	background: linear-gradient(145deg, #e02020, #b01010);
}

.ic-b {
	background: linear-gradient(145deg, #ffd6e0, #ffb3c6);
}

.ic-c {
	background: linear-gradient(145deg, #c00000, #8b0000);
	border: 2rpx solid rgba(244, 208, 63, 0.6);
}

.ic-d {
	background: linear-gradient(145deg, #ff8c42, #e02020);
}

.ic-e {
	background: linear-gradient(145deg, #ff9f43, #e67e22);
}

.menu-emoji {
	font-size: 44rpx;
	line-height: 1;
}

.menu-text {
	font-size: 22rpx;
	color: #333;
	text-align: center;
	line-height: 1.35;
}

.cert-popup {
	width: 686rpx;
	max-width: 92vw;
	display: flex;
	flex-direction: column;
	align-items: stretch;
}

.cert-panel {
	background: #fff;
	border-radius: 24rpx;
	overflow: hidden;
	box-shadow: 0 16rpx 48rpx rgba(0, 0, 0, 0.18);
}

.cert-swiper {
	width: 100%;
	height: 68vh;
	max-height: 920rpx;
}

.cert-swiper-item {
	height: 100%;
}

.cert-scroll {
	height: 100%;
	width: 100%;
}

.cert-slide-img {
	display: block;
	width: 100%;
	vertical-align: top;
}

.cert-slide-title {
	display: block;
	text-align: center;
	font-size: 26rpx;
	font-weight: 600;
	color: #333;
	padding: 16rpx 20rpx 12rpx;
}

.cert-gen-placeholder {
	min-height: 400rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 48rpx 24rpx;
	box-sizing: border-box;
}

.cert-gen-tip {
	margin-top: 24rpx;
	font-size: 26rpx;
	color: #999;
}

.gq-cert-canvas {
	position: fixed;
	left: -2000px;
	top: 0;
	pointer-events: none;
}

.ht-contract-scroll {
	max-height: 72vh;
	width: 100%;
}

.cert-swiper-nav {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 28rpx 28rpx;
	box-sizing: border-box;
}

.cert-nav-btn {
	width: 72rpx;
	height: 72rpx;
	border-radius: 50%;
	background: linear-gradient(145deg, #ff8c42, #ff6b35);
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 6rpx 16rpx rgba(255, 107, 53, 0.35);
}

.cert-dots {
	flex: 1;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
}

.cert-dot {
	width: 12rpx;
	height: 12rpx;
	border-radius: 50%;
	background: #ddd;
	transition: background 0.2s;
}

.cert-dot + .cert-dot {
	margin-left: 14rpx;
}

.cert-dot.active {
	background: #ff6b35;
	width: 14rpx;
	height: 14rpx;
}

.cert-actions {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	margin-top: 32rpx;
	padding: 0 8rpx;
}

.cert-actions .cert-btn:first-child {
	margin-right: 24rpx;
}

.cert-btn {
	flex: 1;
	height: 88rpx;
	line-height: 88rpx;
	text-align: center;
	font-size: 30rpx;
	border-radius: 44rpx;
	font-weight: 600;
}

.cert-btn--ghost {
	background: #fff;
	color: #333;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
}

.cert-btn--primary {
	background: #e02020;
	color: #fff;
	box-shadow: 0 8rpx 24rpx rgba(224, 32, 32, 0.35);
}
</style>
