<template>
	<view class="container" style="background:#c8131e url(/static/new/bg.jpg) no-repeat center top / 100%;">
		<headerView>
			<template #leftIcon>
				<u-icon name="arrow-left" color="#fff" size="24"></u-icon>
			</template>
			<view>电子证书</view>
		</headerView>
		<view class="content">
			<view class="preview" v-if="imagePath">
				<image :src="imagePath" mode="widthFix" class="preview-img"></image>
			</view>
			<view class="placeholder" v-else>
				<u-icon name="file-text" color="rgba(255,255,255,.4)" size="64"></u-icon>
				<text class="tip">点击下方按钮生成证书</text>
			</view>
			<view class="actions">
				<view class="btn primary" @tap="generateCert">生成证书</view>
				<view class="btn" v-if="imagePath" @tap="saveToAlbum">保存到相册</view>
			</view>
		</view>
		<!-- 离屏 canvas：以 zhengshu.png 为底图合成 -->
		<canvas
			canvas-id="certCanvas"
			id="certCanvas"
			class="cert-canvas"
			:style="{ width: canvasW + 'px', height: canvasH + 'px' }"
		></canvas>
	</view>
</template>

<script>
const CERT_BG = '/static/zhengshu.png';

/** 无路由参数、无 user_info 时的展示默认值 */
const CERT_DEFAULTS = {
	name: '张三封22222222222',
	idcard: '130000000000000000',
	ordersno: '1122222222222222222',
	gpnum: '10000',
	price: '100000.00',
	createtime: '2026年01月01日',
	fztime: '2026年04月03日'
};

export default {
	data() {
		return {
			imagePath: '',
			canvasW: 300,
			canvasH: 400,
			/** 路由参数可覆盖：?name=&idcard=&ordersno=&gpnum=&price=&createtime=&fztime= */
			certFromQuery: {},
			/**
			 * 各字段在画布上的位置（0~1）
			 * 若与 zhengshu.png 对不齐，只调这里的 x、y、fontRatio
			 */
			layout: {
				name: { x: 0.36, y: 0.25, align: 'center', fontRatio: 0.024 },
				idcard: { x: 0.47, y: 0.28, align: 'center', fontRatio: 0.024 },
				ordersno: { x: 0.47, y: 0.31, align: 'center', fontRatio: 0.024 },
				gpnum: { x: 0.33, y: 0.38, align: 'center', fontRatio: 0.024 },
				price: { x: 0.40, y: 0.42, align: 'center', fontRatio: 0.024 },
				createtime: { x: 0.51, y: 0.48, align: 'center', fontRatio: 0.024 },
				fztime: { x: 0.45, y: 0.65, align: 'center', fontRatio: 0.024 }
			}
		};
	},
	onLoad(options) {
		this.certFromQuery = {
			name: options.name ? decodeURIComponent(options.name) : '',
			idcard: options.idcard ? decodeURIComponent(options.idcard) : '',
			ordersno: options.ordersno ? decodeURIComponent(options.ordersno) : '',
			gpnum: options.gpnum ? decodeURIComponent(options.gpnum) : '',
			price: options.price ? decodeURIComponent(options.price) : '',
			createtime: options.createtime ? decodeURIComponent(options.createtime) : '',
			fztime: options.fztime ? decodeURIComponent(options.fztime) : ''
		};
	},
	methods: {
		/** 认购时间 / 发证时间：支持时间戳(秒/毫秒)或日期字符串，统一为「yyyy年MM月dd日」展示 */
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
		/** 优先路由参数，其次本地 user_info */
		getCertFields() {
			const q = this.certFromQuery || {};
			const user = uni.getStorageSync('user_info') || {};
			const name = (q.name || user.name || user.realname || user.nickname || '').trim();
			const idcard = (q.idcard || user.idcard || user.id_card || '').trim();
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

			return {
				name: name || CERT_DEFAULTS.name,
				idcard: idcard || CERT_DEFAULTS.idcard,
				ordersno: ordersno || CERT_DEFAULTS.ordersno,
				gpnum,
				price,
				createtime: createtimeStr || CERT_DEFAULTS.createtime,
				fztime: fztimeStr || CERT_DEFAULTS.fztime
			};
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
		generateCert() {
			uni.showLoading({ title: '生成中...', mask: true });
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
					this.canvasW = w;
					this.canvasH = h;
					this.$nextTick(() => {
						setTimeout(() => this.drawCert(img.path, w, h), 80);
					});
				}
			});
		},
		drawCert(bgPath, w, h) {
			const ctx = uni.createCanvasContext('certCanvas', this);
			const { layout } = this;
			ctx.drawImage(bgPath, 0, 0, w, h);

			const { name, idcard, ordersno, gpnum, price, createtime, fztime } = this.getCertFields();
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
						canvasId: 'certCanvas',
						width: w,
						height: h,
						destWidth: w,
						destHeight: h,
						fileType: 'png',
						quality: 1,
						success: (res) => {
							this.imagePath = res.tempFilePath;
							uni.hideLoading();
							uni.showToast({ title: '生成成功', icon: 'success' });
						},
						fail: () => {
							uni.hideLoading();
							uni.showToast({ title: '导出图片失败', icon: 'none' });
						}
					},
					this
				);
			});
		},
		saveToAlbum() {
			if (!this.imagePath) return;
			uni.saveImageToPhotosAlbum({
				filePath: this.imagePath,
				success: () => uni.showToast({ title: '已保存到相册', icon: 'success' }),
				fail: (err) => {
					if (err.errMsg && err.errMsg.indexOf('auth deny') !== -1) {
						uni.showModal({
							title: '提示',
							content: '需要相册权限才能保存',
							showCancel: false
						});
					} else {
						uni.showToast({ title: '保存失败', icon: 'none' });
					}
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.content {
	padding: 32rpx 28rpx;
	min-height: 60vh;
}

.preview {
	background: rgba(255, 255, 255, 0.95);
	border-radius: 16rpx;
	overflow: hidden;
	margin-bottom: 40rpx;
}

.preview-img {
	display: block;
	width: 100%;
	vertical-align: top;
}

.placeholder {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	min-height: 360rpx;
	background: rgba(255, 255, 255, 0.12);
	border-radius: 16rpx;
	margin-bottom: 40rpx;
}

.tip {
	margin-top: 24rpx;
	font-size: 28rpx;
	color: rgba(255, 255, 255, 0.75);
}

.actions {
	display: flex;
	flex-direction: column;
}

.btn {
	text-align: center;
	padding: 26rpx;
	font-size: 30rpx;
	color: #c8131e;
	background: #fff;
	border-radius: 12rpx;
	font-weight: 500;
	margin-bottom: 24rpx;
}

.btn.primary {
	background: linear-gradient(180deg, #fff5f5 0%, #ffffff 100%);
	border: 2rpx solid rgba(255, 255, 255, 0.6);
}

.btn:last-child {
	margin-bottom: 0;
}

.cert-canvas {
	position: fixed;
	left: -2000px;
	top: 0;
	pointer-events: none;
}
</style>
