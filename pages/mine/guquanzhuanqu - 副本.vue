<template>
	<view class="page">
		<view class="page-bg"></view>
		<view class="page-inner">
		<headerView>
			<template #leftIcon>
				<u-icon name="arrow-left" color="#fff" size="24"></u-icon>
			</template>
			<view class="nav-title">红旗河股权专区</view>
		</headerView>

		<scroll-view scroll-y class="scroll" :show-scrollbar="false">
			<view class="content">
				<!-- 主数据卡片 -->
				<view class="card main-card">
					<view class="card-head">红旗河工程·新上市确权</view>
					<view class="stats-row">
						<view class="stat-col">
							<view class="stat-val">+87.02%</view>
							<view class="stat-label">近1月涨跌幅</view>
						</view>
						<view class="stat-col">
							<view class="stat-val">+14%</view>
							<view class="stat-label">日涨跌幅</view>
						</view>
					</view>

					<view class="chart-block">
						<view class="chart-title">
							<text class="chart-bar"></text>
							<text>收益走势</text>
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
								></canvas>
							</view>
						</view>
						<view class="x-labels">
							<text v-for="(d, i) in xLabels" :key="i">{{ d }}</text>
						</view>
					</view>

					<view class="card-footer-bar">
						<view class="footer-item">
							<text class="dot red"></text>
							<text class="footer-label">股权价格</text>
							<text class="footer-val">88.2元</text>
						</view>
						<view class="footer-item">
							<text class="dot blue"></text>
							<text class="footer-label">持有份额</text>
							<text class="footer-val">524860股</text>
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
									<text class="cert-gen-tip">正在生成第 {{ si + 1 }} 页…</text>
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

		<!-- 合同证明：单图弹窗 -->
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
					<scroll-view scroll-y class="ht-contract-scroll" :show-scrollbar="false">
						<image
							v-if="htContractImagePath"
							:src="htContractImagePath"
							mode="widthFix"
							class="cert-slide-img"
						/>
						<view v-else class="cert-gen-placeholder">
							<u-icon name="file-text" color="#ccc" size="56"></u-icon>
							<text class="cert-gen-tip">正在生成合同证明…</text>
						</view>
					</scroll-view>
				</view>
				<view class="cert-actions">
					<view class="cert-btn cert-btn--ghost" @tap="closeHtContractPopup">关闭</view>
					<view class="cert-btn cert-btn--primary" @tap="saveHtContractImage">保存</view>
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
const CERT_BG = '/static/zhengshu.png';
const CERT_WATERMARK = '/static/shuiyin.png';
const HT_CONTRACT_BG = '/static/hetongzhengshu.png';

/** 合同证明：无用户信息时的占位（字段与底图错位时只调 htLayout） */
const HT_CONTRACT_DEFAULTS = {
	realname: '演示姓名',
	cardno: '110101199001011234',
	realnameend: '演示姓名'
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

/**
 * 轮播每一页 fields：可含 name、idcard；有值则覆盖当页证书，无则回退 certFromQuery + user_info + CERT_DEFAULTS。
 * 接口数据示例：{ title, fields: { name, idcard, ordersno, ... } }
 */
const CERT_SLIDE_EXAMPLES = [
	{
		title: '原始认购确权',
		fields: {
			name: '王立国',
			idcard: '110101199001011234',
			ordersno: 'HQH-GQ-2024-0001',
			gpnum: '10000',
			price: '100000.00',
			createtime: '2024年06月01日',
			fztime: '2024年06月18日'
		}
	},
	{
		title: '第一次增资',
		fields: {
			name: '陈秀英',
			idcard: '310115198805152468',
			ordersno: 'HQH-GQ-2024-0108',
			gpnum: '25000',
			price: '280000.00',
			createtime: '2025年03月12日',
			fztime: '2025年03月25日'
		}
	},
	{
		title: '第二次增资',
		fields: {
			name: '刘志远',
			idcard: '440104199203078915',
			ordersno: 'HQH-GQ-2025-0203',
			gpnum: '524860',
			price: '880200.00',
			createtime: '2025年09月01日',
			fztime: '2025年09月20日'
		}
	},
	{
		title: '当前持仓证明',
		fields: {
			name: '赵敏',
			idcard: '510104199611223017',
			ordersno: 'HQH-GQ-2026-0301',
			gpnum: '524860',
			price: '880200.00',
			createtime: '2026年01月10日',
			fztime: '2026年04月03日'
		}
	}
];
import {
		gqdateApi,
	} from '@/api/api.js'
export default {
	
	data() {
		return {
			canvasW: 300,
			canvasH: 200,
			// 与左侧 Y 轴刻度一致（收益百分比），折线映射使用同一区间
			yAxisMax: 301.4,
			yAxisMin: 68.75,
			yTickCount: 4,
			xLabels: ['2026-1-31', '2026-2-28', '2026-3-31'],
			// 各时点累计收益(%)，在 yAxisMin～yAxisMax 内波动上行
			series: [
				78, 92, 86, 101, 95, 108, 102, 118, 112, 125, 120, 132, 128, 142, 138, 152, 148, 162, 158, 172,
				168, 182, 178, 192, 188, 202, 198, 212, 208, 222, 218, 232, 228, 242, 238, 252, 248, 262, 258,
				268, 175, 282, 288, 293, 297, 199.5, 100.8, 100
			],
			certPopupShow: false,
			certCurrent: 0,
			/** 每页：title + fields 覆盖，见文件顶部 CERT_SLIDE_EXAMPLES */
			certSlideConfigs: CERT_SLIDE_EXAMPLES.map((s) => ({ ...s, fields: { ...s.fields } })),
			certImagePaths: CERT_SLIDE_EXAMPLES.map(() => ''),
			certCanvasW: 300,
			certCanvasH: 400,
			/** 证书顶部水印（getImageInfo 后的本地 path） */
			certWmPath: '',
			certWmNatural: null,
			htContractPopupShow: false,
			htContractImagePath: '',
			htCanvasW: 300,
			htCanvasH: 400,
			/**
			 * 合同底图上的文字位置（0~1），与 hetongzhengshu.png 对不齐时只改这里
			 */
			htLayout: {
				realname: { x: 0.27, y: 0.286, align: 'center', fontRatio: 0.010 },
				cardno: { x: 0.40, y: 0.31, align: 'center', fontRatio: 0.010 },
				httime: { x: 0.72, y: 0.916, align: 'center', fontRatio: 0.010 },
				realnameend: { x: 0.85, y: 0.895, align: 'center', fontRatio: 0.010 }
			},
			certFromQuery: {},
			certLayout: {
				name: { x: 0.36, y: 0.25, align: 'center', fontRatio: 0.024 },
				idcard: { x: 0.47, y: 0.28, align: 'center', fontRatio: 0.024 },
				ordersno: { x: 0.47, y: 0.31, align: 'center', fontRatio: 0.024 },
				gpnum: { x: 0.33, y: 0.38, align: 'center', fontRatio: 0.024 },
				price: { x: 0.4, y: 0.42, align: 'center', fontRatio: 0.024 },
				createtime: { x: 0.51, y: 0.48, align: 'center', fontRatio: 0.024 },
				fztime: { x: 0.45, y: 0.65, align: 'center', fontRatio: 0.024 }
			},
			menuList: [
				{ name: '持股证明', iconSrc: '/static/chigu.png' },
				{ name: '合同证明', iconSrc: '/static/hetong.png' },
				{ name: '股权回购', iconSrc: '/static/huigou.png' },
				{ name: '对赌协议', iconSrc: '/static/duidu.png' },
				{ name: '退出', iconSrc: '/static/tuichu.png' }
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
				list.push(`${v.toFixed(2)}%`);
			}
			return list;
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
			realnameend: qv('realnameend'),
			real_name_end: qv('real_name_end'),
			cardno: qv('cardno'),
			httime: qv('httime'),
			ht_time: qv('ht_time')
		};
		const sys = uni.getSystemInfoSync();
		const rpx = sys.windowWidth / 750;
		this.canvasW = Math.floor(520 * rpx);
		this.canvasH = Math.floor(270 * rpx);
		this.loadData()
	},
	
	onReady() {
		this.$nextTick(() => {
			setTimeout(() => {
				uni.createSelectorQuery()
					.in(this)
					.select('.canvas-box')
					.boundingClientRect((rect) => {
						if (rect && rect.width > 0) {
							this.canvasW = Math.floor(rect.width);
							this.canvasH = Math.floor(rect.width * 0.54);
						}
						this.$nextTick(() => this.drawChart());
					})
					.exec();
			}, 120);
		});
	},
	methods: {
		valueToY(v, padT, ch, yMin, yMax) {
			const t = (v - yMin) / (yMax - yMin);
			return padT + (1 - t) * ch;
		},
		async loadData() {
			gqdateApi().then(res => {
				this.servicesUnit = res.data.data
				this.isPageShow = true;
			})
		},
		drawChart() {
			const w = this.canvasW;
			const h = this.canvasH;
			if (w < 10 || h < 10) return;
			const padL = 8;
			const padR = 8;
			const padT = 12;
			const padB = 8;
			const cw = w - padL - padR;
			const ch = h - padT - padB;
			const vals = this.series;
			const yMin = this.yAxisMin;
			const yMax = this.yAxisMax;
			const ctx = uni.createCanvasContext('gqLineChart', this);
			const points = vals.map((v, i) => {
				const clamped = Math.min(yMax, Math.max(yMin, v));
				const x = padL + (i / (vals.length - 1)) * cw;
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
			ctx.setStrokeStyle('#E02020');
			ctx.setLineWidth(2.5);
			ctx.beginPath();
			points.forEach((p, i) => {
				if (i === 0) ctx.moveTo(p.x, p.y);
				else ctx.lineTo(p.x, p.y);
			});
			ctx.stroke();
			const midIdx = Math.floor(points.length / 2);
			const mid = points[midIdx];
			ctx.setStrokeStyle('#E02020');
			ctx.setLineWidth(1);
			ctx.beginPath();
			ctx.moveTo(mid.x, padT);
			ctx.lineTo(mid.x, padT + ch);
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(mid.x, mid.y, 5, 0, 2 * Math.PI);
			ctx.setFillStyle('#E02020');
			ctx.fill();
			ctx.setStrokeStyle('#fff');
			ctx.setLineWidth(2);
			ctx.stroke();
			ctx.draw();
		},
		onMenuTap(item) {
			if (item.name === '持股证明') {
				this.certCurrent = 0;
				this.resetCertImagePaths();
				this.certPopupShow = true;
				this.$nextTick(() => {
					setTimeout(() => this.generateAllCertSlides(), 100);
				});
				return;
			}
			if (item.name === '合同证明') {
				this.htContractImagePath = '';
				this.htContractPopupShow = true;
				this.$nextTick(() => {
					setTimeout(() => this.generateHtContractImage(), 100);
				});
				return;
			}
			uni.showToast({ title: item.name, icon: 'none' });
		},
		closeHtContractPopup() {
			this.htContractPopupShow = false;
		},
		getHtContractFields() {
			const q = this.certFromQuery || {};
			const user = uni.getStorageSync('user_info') || {};
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
			const endRaw = this.pickDateField(q, user, ['realnameend', 'real_name_end']);
			let realnameend = String(endRaw || '').trim();
			if (!realnameend) realnameend = realname;
			if (!realnameend) realnameend = HT_CONTRACT_DEFAULTS.realnameend;
			return { realname, cardno, httime, realnameend };
		},
		drawHtContractImage(bgPath, w, h, done) {
			const ctx = uni.createCanvasContext('htContractCanvas', this);
			const { htLayout: layout } = this;
			const { realname, cardno, httime, realnameend } = this.getHtContractFields();
			ctx.drawImage(bgPath, 0, 0, w, h);
			this.fillTextAt(ctx, w, h, realname, layout.realname);
			this.fillTextAt(ctx, w, h, cardno, layout.cardno);
			this.fillTextAt(ctx, w, h, httime, layout.httime);
			this.fillTextAt(ctx, w, h, realnameend, layout.realnameend);
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
							this.htContractImagePath = res.tempFilePath;
							uni.hideLoading();
							done && done();
						},
						fail: () => {
							uni.hideLoading();
							uni.showToast({ title: '合同图导出失败', icon: 'none' });
							done && done();
						}
					},
					this
				);
			});
		},
		generateHtContractImage() {
			uni.showLoading({ title: '生成中...', mask: true });
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
						setTimeout(() => this.drawHtContractImage(img.path, w, h, null), 80);
					});
				}
			});
		},
		saveHtContractImage() {
			const filePath = this.htContractImagePath;
			if (!filePath) {
				uni.showToast({ title: '请等待生成完成', icon: 'none' });
				return;
			}
			const fileName = '合同证明.png';
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
			uni.saveImageToPhotosAlbum({
				filePath,
				success: () => {
					hide();
					uni.showToast({ title: '已保存到相册', icon: 'success' });
				},
				fail: (err) => {
					hide();
					const msg = ((err && err.errMsg) || '').toLowerCase();
					const needAuth =
						msg.indexOf('auth') !== -1 ||
						msg.indexOf('deny') !== -1 ||
						msg.indexOf('permission') !== -1 ||
						msg.indexOf('authorize') !== -1;
					if (needAuth) {
						uni.showModal({
							title: '需要相册权限',
							content: '保存图片需要允许访问相册',
							confirmText: '去设置',
							cancelText: '取消',
							success: (res) => {
								if (res.confirm) uni.openSetting({});
							}
						});
					} else {
						uni.showToast({ title: '保存失败，请重试', icon: 'none' });
					}
				}
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
		getCertFields(mergeFields) {
			const q = this.certFromQuery || {};
			const user = uni.getStorageSync('user_info') || {};
			const nameRaw = this.pickDateField(q, user, [
				'name',
				'realName',
				'real_name',
				'username',
				'user_name',
				'nickname'
			]);
			const idRaw = this.pickDateField(q, user, [
				'idcard',
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
		generateAllCertSlides() {
			const n = this.certSlideConfigs.length;
			if (n === 0) return;
			uni.showLoading({ title: '生成证书 0/' + n, mask: true });
			uni.getImageInfo({
				src: CERT_BG,
				fail: () => {
					uni.hideLoading();
					uni.showToast({
						title: '请将证书模板放在 static/zhengshu.png',
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
							setTimeout(() => this.runCertSlideChain(0, img.path, w, h, n), 80);
						});
					});
				}
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
		runCertSlideChain(i, bgPath, w, h, n) {
			if (i >= n) {
				uni.hideLoading();
				return;
			}
			uni.showLoading({ title: `生成证书 ${i + 1}/${n}`, mask: true });
			this.drawCertForSlide(bgPath, w, h, i, () => {
				this.runCertSlideChain(i + 1, bgPath, w, h, n);
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
			this.fillTextAt(ctx, w, h, name, layout.name);
			this.fillTextAt(ctx, w, h, idcard, layout.idcard);
			this.fillTextAt(ctx, w, h, ordersno, layout.ordersno);
			this.fillTextAt(ctx, w, h, gpnum, layout.gpnum);
			this.fillTextAt(ctx, w, h, price, layout.price);
			this.fillTextAt(ctx, w, h, createtime, layout.createtime);
			this.fillTextAt(ctx, w, h, fztime, layout.fztime);
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
			uni.showLoading({ title: '生成中...', mask: true });
			uni.getImageInfo({
				src: CERT_BG,
				fail: () => {
					this._certEnsureBusy = false;
					uni.hideLoading();
					uni.showToast({ title: '请将证书模板放在 static/zhengshu.png', icon: 'none', duration: 2800 });
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

			uni.saveImageToPhotosAlbum({
				filePath,
				success: () => {
					hide();
					uni.showToast({ title: '已保存到相册', icon: 'success' });
				},
				fail: (err) => {
					hide();
					const msg = ((err && err.errMsg) || '').toLowerCase();
					const needAuth =
						msg.indexOf('auth') !== -1 ||
						msg.indexOf('deny') !== -1 ||
						msg.indexOf('permission') !== -1 ||
						msg.indexOf('authorize') !== -1;
					if (needAuth) {
						uni.showModal({
							title: '需要相册权限',
							content: '保存证书图片需要允许访问相册，请在设置中开启',
							confirmText: '去设置',
							cancelText: '取消',
							success: (res) => {
								if (res.confirm) {
									uni.openSetting({});
								}
							}
						});
					} else {
						uni.showToast({ title: '保存失败，请重试', icon: 'none' });
					}
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
	width: 100%;
}

.x-labels {
	display: flex;
	justify-content: space-between;
	padding: 8rpx 0 0 108rpx;
	font-size: 20rpx;
	color: #999;
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
