<template>
	<view class="container">
		<view class="content">
			<view class="item">
				<view class="item-name">
					<span>*</span>姓名
				</view>
				<view class="item-input flex_between">
					<input v-model="form.realname" class="input" placeholder="请输入姓名" placeholder-class="placeholder"
						@blur="containsChinese" />
				</view>
			</view>
			<view class="item">
				<view class="item-name">
					<span>*</span>身份证号码
				</view>
				<view class="item-input flex_between">
					<input v-model="form.cardno" type="text" class="input" placeholder="请输入身份证号码"
						placeholder-class="placeholder" @blur="isValidID" />
				</view>
			</view>
			<view class="item">
				<view class="item-name">
					<span>*</span>手机号
				</view>
				<view class="item-input flex_between">
					<input v-model="form.phone" type="number" class="input" placeholder="请输入手机号"
						placeholder-class="placeholder" maxlength="11" />
				</view>
			</view>
			<view class="item">
				<view class="item-name">
					<span>*</span>住址
				</view>
				<view class="item-input flex_between">
					<input v-model="form.address" class="input" placeholder="请输入住址" placeholder-class="placeholder" />
				</view>
			</view>
			<view class="item">
				<view class="item-name">
					<span>*</span>领取房产理由
				</view>
				<view class="item-textarea flex_between">
					<textarea v-model="form.note" placeholder="请输入" placeholder-class="placeholder" />
				</view>
			</view>
			<view class="item">
				<view class="item-name">
					<span>*</span>申请表必须附上以下材料
				</view>
				<view class="ul">
					<view class="flex">
						<view class="li flex_between" @click="isIdentity=true">
							<view>身份证</view>
							<view class="flex_center">
								<view class="li-box flex_center" :class="isIdentity?'active':''">
									<view></view>
								</view>
							</view>
						</view>
						<view class="li flex_between" @click="isIdentity=false">
							<view>护照</view>
							<view class="flex_center">
								<view class="li-box flex_center" :class="!isIdentity?'active':''">
									<view></view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view v-if="isIdentity">
					<view class="col_center" style="margin-top: 28rpx;">
						<u-upload :fileList="fileListZ" @afterRead="afterRead" @delete="deletePic" name="Z" multiple
							:maxCount="1" width="343" height="191">
							<image src="@/static/image/mine/id1.png" mode="widthFix"
								style="width: 343px;height: 191px;"></image>
						</u-upload>
					</view>
					<view class="col_center" style="margin-top: 28rpx;">
						<u-upload :fileList="fileListF" @afterRead="afterRead" @delete="deletePic" name="F" multiple
							:maxCount="1" width="343" height="191">
							<image src="@/static/image/mine/id2.png" mode="widthFix"
								style="width: 343px;height: 191px;"></image>
						</u-upload>
					</view>
				</view>
				<view v-else>
					<view class="col_center" style="margin-top: 28rpx;">
						<u-upload :fileList="fileListH" @afterRead="afterRead" @delete="deletePic" name="H" multiple
							:maxCount="1" width="343" height="191">
							<image src="@/static/image/mine/id5.png" mode="widthFix"
								style="width: 343px;height: 191px;"></image>
						</u-upload>
					</view>
				</view>
				<view class="item-tips">
					<view>温馨提示</view>
					<view class="tips upload-text">身份证和护照必须要上传一份</view>
				</view>
			</view>
			<view class="item">
				<view class="item-name">材料证明</view>
				<view class="ul">
					<view class="flex">
						<view class="li flex_between" @click="isRevenue=true">
							<view>收入证明</view>
							<view class="flex_center">
								<view class="li-box flex_center" :class="isRevenue?'active':''">
									<view></view>
								</view>
							</view>
						</view>
						<view class="li flex_between" @click="isRevenue=false">
							<view>贫困证明</view>
							<view class="flex_center">
								<view class="li-box flex_center" :class="!isRevenue?'active':''">
									<view></view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view v-if="isRevenue">
					<view class="col_center" style="margin-top: 28rpx;">
						<u-upload :fileList="fileListS" @afterRead="afterRead" @delete="deletePic" name="S" multiple
							:maxCount="1" width="343" height="191">
							<image src="@/static/image/mine/id3.png" mode="widthFix"
								style="width: 343px;height: 191px;"></image>
						</u-upload>
					</view>
				</view>
				<view v-else>
					<view class="col_center" style="margin-top: 28rpx;">
						<u-upload :fileList="fileListP" @afterRead="afterRead" @delete="deletePic" name="P" multiple
							:maxCount="1" width="343" height="191">
							<image src="@/static/image/mine/id4.png" mode="widthFix"
								style="width: 343px;height: 191px;"></image>
						</u-upload>
					</view>
				</view>
				<view class="item-tips">
					<view>温馨提示</view>
					<view class="tips upload-text">请提供收入证明和贫困证明（非必要上传）</view>
				</view>
			</view>
		</view>
		<view class="footer flex_center">
			<view class="button" @click="houseAdd">确定</view>
		</view>

		<u-popup :show="tipsShow" mode="center" round="32" @close="tipsInfo.status==2?tipsShow=false:back()">
			<view class="van-dialog">
				<view class="van-dialog__header">温馨提示</view>
				<view class="van-dialog__content">
					<view>{{tipsInfo.msg}}</view>
					<view class="text">{{tipsInfo.tips2}}</view>
				</view>
				<view class="van-dialog__footer">
					<view class="button" @click="tipsInfo.status==2?tipsShow=false:back()">
						确定
					</view>
				</view>
			</view>
		</u-popup>

		<u-popup :show="btnShow" mode="center" round="32" @close="back">
			<view class="van-dialog">
				<view class="van-dialog__header">温馨提示</view>
				<view class="van-dialog__content">
					<view>{{tipsInfo.msg}}</view>
					<view class="text">{{tipsInfo.tips2}}</view>
				</view>
				<view class="van-dialog__footer">
					<view class="button" @click="tipsInfo.status==1?houseJiaofei():toBuy()">
						{{tipsInfo.status==1?'去缴费':'去购买'}}
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		houseAddAPI,
		houseOrderinfoAPI,
		houseJiaofeiAPI
	} from '@/api/api.js'
	export default {
		data() {
			return {
				settingInfo: uni.getStorageSync('settingInfo'),

				isIdentity: true,
				isRevenue: true,
				fileListZ: [], // 身份证正面
				fileListF: [], // 身份证反面
				fileListH: [], // 护照
				fileListS: [], // 收入
				fileListP: [], // 贫困
				form: {
					realname: '',
					cardno: '',
					phone: '',
					address: '',
					note: ''
				},

				// 提示语
				tipsShow: false,
				tipsInfo: {
					msg: '',
					status: -1,
					tips2: ''
				},

				// 有按钮的
				btnShow: false
			};
		},
		onShow() {
			houseOrderinfoAPI().then(res => {
				let info = res.data

				this.tipsInfo = {
					msg: info.msg,
					status: info.data.status,
					tips2: info.data.tips2
				}
				if (info.data.status == -1) {
					return
				} else {
					this.form.realname = info.data.realname
					this.form.cardno = info.data.cardno
					this.form.phone = info.data.phone
					this.form.address = info.data.address
					this.form.note = info.data.note

					if (info.data.type == 1) {
						this.isIdentity = true
						this.fileListZ = [{
							upload: info.data.zm_image,
							url: info.data.zm_image_url
						}]
						this.fileListF = [{
							upload: info.data.fm_image,
							url: info.data.fm_image_url
						}]
					} else {
						this.isIdentity = false
						this.fileListH = [{
							upload: info.data.zm_image,
							url: info.data.zm_image_url
						}]
					}

					if (info.data.cl_type == 1) {
						this.isRevenue = true
						this.fileListS = [{
							upload: info.data.cl_image,
							url: info.data.cl_image_url
						}]
					} else {
						this.isRevenue = false
						this.fileListP = [{
							upload: info.data.cl_image,
							url: info.data.cl_image_url
						}]
					}

					if (info.data.status == 1 || info.data.status == 3) {
						this.btnShow = true
					} else {
						this.tipsShow = true
					}
				}
			})
		},
		methods: {
			back() {
				// #ifndef APP-PLUS
				let backPage = getCurrentPages()
				if (backPage.length == 1) {
					uni.reLaunch({
						url: "/pages/index/index"
					})
				} else {
					uni.navigateBack()
				}
				// #endif

				// #ifdef APP-PLUS
				uni.navigateBack()
				// #endif
			},
			// 验证中文
			containsChinese(str) {
				if (!this.$utils.containsChinese(str)) {
					this.form.realname = ''
					uni.$u.toast('请输入正确姓名');
				}
			},
			// 验证身份证号
			isValidID(str) {
				if (!this.$utils.isValidID(str)) {
					this.form.cardno = ''
					uni.$u.toast('请输入正确身份证号码');
				}
			},
			// 删除图片
			deletePic(event) {
				this[`fileList${event.name}`].splice(event.index, 1)
			},
			// 新增图片
			async afterRead(event) {
				let lists = [].concat(event.file)
				let fileListLen = this[`fileList${event.name}`].length
				lists.map((item) => {
					this[`fileList${event.name}`].push({
						...item,
						status: 'uploading',
						message: '如果上传图片过大请耐心等待'
					})
				})
				for (let i = 0; i < lists.length; i++) {
					const result = await this.uploadFilePromise(lists[i].url)
					if (!!result) {
						let item = this[`fileList${event.name}`][fileListLen]
						this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
							status: 'success',
							message: '',
							url: result.fullurl,
							upload: result.url
						}))
						fileListLen++
					} else {
						this[`fileList${event.name}`] = []
					}
				}
			},
			uploadFilePromise(url) {
				return new Promise((resolve, reject) => {
					let a = uni.uploadFile({
						url: uni.getStorageSync("baseUrl") + '/api/common/upload',
						filePath: url,
						name: 'file',
						formData: {
							site: uni.getStorageSync("baseUrl"),
							app_ver: '102'
						},
						success: (res) => {
							setTimeout(() => {
								resolve(JSON.parse(res.data).data)
							}, 1000)
						},
						fail: (err) => {
							uni.$u.toast('请求超时，请重新再试')
							setTimeout(() => {
								resolve('')
							}, 1000)
						}
					});
				})
			},
			//提交
			houseAdd() {
				if (this.isIdentity) {
					if (!this.fileListZ[0]) {
						return uni.$u.toast('上传身份证人像面');
					}
					if (!this.fileListF[0]) {
						return uni.$u.toast('上传身份证国徽面');
					}
				} else {
					if (!this.fileListH[0]) {
						return uni.$u.toast('上传护照首页');
					}
				}

				if (!this.form.realname) {
					return uni.$u.toast('请输入姓名');
				}
				if (!this.form.cardno) {
					return uni.$u.toast('请输入证件号码');
				}
				if (!this.form.phone) {
					return uni.$u.toast('请输入手机号');
				}
				if (!this.form.address) {
					return uni.$u.toast('请输入地址');
				}
				if (!this.form.note) {
					return uni.$u.toast('请输入领取房产理由');
				}
				this.$utils.throttle(() => {
					houseAddAPI({
						...this.form,
						type: this.isIdentity ? 1 : 2,
						zm_image: this.isIdentity ? this.fileListZ[0].upload : this.fileListH[0].upload,
						fm_image: this.isIdentity ? this.fileListF[0].upload : '',
						cl_type: this.isRevenue ? 1 : 2,
						cl_image: this.isRevenue ? (!!this.fileListS[0] ? this.fileListS[0].upload : '') :
							(!!this.fileListP[0] ? this.fileListP[0].upload : ''),
					}).then(res => {
						let info = res.data
						this.tipsInfo = {
							msg: info.msg,
							status: info.data.status,
							tips2: info.data.tips2
						}
						this.tipsShow = true
					})
				}, 2000)()
			},
			// 缴费
			houseJiaofei() {
				this.$utils.throttle(() => {
					houseJiaofeiAPI().then(res => {
						let info = res.data
						this.tipsInfo = {
							msg: info.msg,
							status: info.data.status,
							tips2: info.data.tips2
						}
						this.btnShow = false
						this.tipsShow = true
					})
				}, 2000)()
			},
			// 去申购页
			toBuy() {
				this.btnShow = false
				this.$utils.toPage(`/pages/dream/authentication?id=${this.settingInfo.house_pro_id}`)
				// uni.redirectTo({
				// 	url: `/pages/dream/authentication?id=${this.settingInfo.house_pro_id}`
				// })
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		.content { 
			padding: 30rpx; 
			background-color: rgba(255, 255, 255, 1);
				margin-top: 30rpx;
			&::after{ content: ''; display: block; height: 30rpx; background: #F0F1F3; margin: 0 -30rpx; }
			.ul {
				.title {
					font-family: Roboto;
					font-size: var(--font-14);
					font-weight: 400;
					line-height: 48rpx;
					color: rgba(34, 34, 34, 1);
				}

				.li {
					height: 64rpx;
					padding-right: 32rpx;
					border-radius: 20rpx;
					background: rgba(255, 255, 255, 1);
					// box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.05);
					font-size: var(--font-14);
					font-weight: 500;
					color: rgba(17, 24, 38, 1);

					.li-box {
						width: 36rpx;
						height: 36rpx;
						border-radius: 36rpx;
						border: 2rpx solid rgba(177, 177, 177, 1);
						margin-left: 24rpx;
					}

					.active {
						border: 2rpx solid rgba(250, 60, 49, 1);

						&>view {
							width: 24rpx;
							height: 24rpx;
							border-radius: 24rpx;
							background: rgba(250, 60, 49, 1);
						}
					}
				}
			}

			.item {
				font-weight: 400;
				margin-bottom: 20rpx;

				.item-name {
					font-family: Roboto;
					font-size: var(--font-14);
					line-height: 48rpx;
					color: rgba(17, 24, 38, 1);
					margin-bottom: 16rpx;
					font-weight: 500;

					span {
						color: rgba(250, 60, 49, 1);
						padding-right: 10rpx;
					}
				}

				.item-input {
					width: 100%;
					height: 100rpx;
					padding: 26rpx 32rpx;
					border-radius: 20rpx;
					border: 2rpx solid rgba(232, 235, 238, 1);

					.input {
						color: rgba(17, 24, 38, 1);
						flex: 1;
						font-size: var(--font-14);
					}

					.placeholder {
						color: rgba(187, 189, 193, 1);
					}
				}

				.item-textarea {
					border: 2rpx solid rgba(232, 235, 238, 1);
					padding: 26rpx 32rpx;
					border-radius: 20rpx;

					textarea {
						color: rgba(17, 24, 38, 1);
						font-size: var(--font-14);
					}

					.placeholder {
						color: rgba(187, 189, 193, 1);
					}
				}

				.item-tips {
					font-family: Roboto;
					font-size: var(--font-14);
					line-height: 48rpx;
					color: rgba(250, 60, 49, 1);
					margin-top: 20rpx;
					font-weight: 500;
				}

				.upload-text {
					padding: 10rpx 0 20rpx;
					font-family: Roboto;
					font-size: var(--font-12);
					font-weight: 400;
					line-height: 32rpx;
					color: rgba(90, 98, 116, 1);
				}
			}
		}

		.footer {
			padding: 30rpx; 
			background-color: rgba(255, 255, 255, 1);

			.button {}

			.footer-tips {
				font-family: Roboto;
				font-size: var(--font-12);
				font-weight: 400;
				line-height: 40rpx;
				color: rgba(133, 133, 151, 1);
				margin-top: 8rpx;

				span {
					margin-left: 10rpx;
					color: rgba(243, 62, 49, 1);
				}
			}
		}

		.van-dialog {
			width: 560rpx;
			padding: 48rpx 32rpx;
			border-radius: 32rpx;
			background: url("/static/mine/popup_bg.svg") no-repeat left top / 100%;
			background-color: rgba(255, 255, 255, 1);
			font-family: Roboto;
			font-weight: 400;
			line-height: 40rpx;
			text-align: center;
			color: rgba(27, 28, 30, 1);

			.van-dialog__header {
				font-size: var(--font-15);
				color: rgba(210, 17, 15, 1);
				font-weight: 700;
			}

			.van-dialog__content {
				margin: 32rpx auto;
				font-size: var(--font-14);
				line-height: 42rpx;
			}

			.van-dialog__footer {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.btn {
					flex: 1;
					height: 80rpx;
					border-radius: 24rpx;
					background: rgba(178, 180, 181, 1);
					font-family: Roboto;
					font-size: var(--font-14);
					font-weight: 400;
					line-height: 80rpx;
					text-align: center;
					color: rgba(255, 255, 255, 1);
					margin-right: 32rpx;
				}

				.button {
					flex: 1;
					height: 80rpx;
					font-size: var(--font-14);
				}
			}
		}
	}
</style>