<template>
	<view class="container" style="background:#c8131e url(/static/new/bg.jpg) no-repeat center top / 100%;">
		<headerView>
			<template #leftIcon><u-icon name="arrow-left" color="#fff" size="24"></u-icon></template>
			<view>添加支付宝</view>
		</headerView>
		<view class="main">
			<view class="content">
				<view class="form">
					<view class="item" style="margin-top: 0;">
						<view class="item-name">姓名</view>
						<view class="item-input flex_between">
							<input type="text" v-model="form.name" class="input" placeholder="请输入您的真实姓名"
								placeholder-class="placeholder" @blur="containsChinese" />
						</view>
					</view>
					<view class="item">
						<view class="item-name">支付宝账号</view>
						<view class="item-input flex_between">
							<input type="text" v-model="form.card_no" class="input" placeholder="请输入您的支付宝账号(手机号/邮箱)"
								placeholder-class="placeholder" />
						</view>
					</view>
					<view class="m-tips warning">
						<view class="text" v-html="settingInfo.bindwallet_rule"></view>
					</view>
				</view>
			</view>
			<view class="footer col_center">
				<view class="button" @click="submit">绑定</view>
				<view class="footer-tips">无法绑定联系？<span @click="toLoads(settingInfo.service_url)">在线客服</span>
				</view>
			</view>
		</view>

		<!-- 提示 -->
		<u-popup :show="show" mode="center" round="32" @close="show = false">
			<view class="van-dialog">
				<view class="van-dialog__header">提示</view>
				<view class="van-dialog__content">您还未实名认证，请先实名认证</view>
				<view class="van-dialog__footer">
					<view class="button" @click="toPage">去认证</view>
				</view>
			</view>
		</u-popup>
		<!-- 密码提示 -->
		<u-popup :show="pswShow" mode="center" round="32">
			<view class="van-dialog van-dialog2">
				<view class="van-dialog__header">提示</view>
				<view class="van-dialog__content">添加成功，请设置修改支付密码</view>
				<view class="van-dialog__footer">
					<view class="button" @click="toPsw">去设置</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		userBankDetaileApi, //卡-详情
		userBankApi,
		userBankUpdateApi
	} from '@/api/api.js'
	export default {
		data() {
			return {
				settingInfo: uni.getStorageSync('settingInfo'),
				UserInfo: uni.getStorageSync('user_info'),
				form: {
					id: '',
					name: '',
					card_no: '',
					type: 2,
				},
				pswShow: false,
				show: false,
				securityPassword: false,
				opt: {
					id: '',
				}
			};
		},
		onLoad(opt) {
			this.opt.id = opt.id
		},
		onShow() {
			if (!!this.opt.id) {
				userBankDetaileApi({
					id: this.opt.id
				}).then(res => {
					let info = res.data.data
					this.form.id = info.id
					this.form.name = info.name
					this.form.bank_name = info.bank_name
					this.form.bank = info.bank
					this.form.card_no = info.card_no
				})
			}
		},
		methods: {
			toPage() {
				this.show = false
				this.$utils.toPage('/pages/mine/realName')
			},
			toPsw() {
				this.pswshow = false;
				uni.redirectTo({
					url: '/pages/mine/account/paymentPassword'
				})
				// this.$utils.toPage('/pages/mine/account/paymentPassword')
			},
			// 去在线客服页
			toLoads(url) {
				uni.navigateTo({
					url: `/pages/noPage/index?url=${url.split("&").join("$")}`
				})
			},
			// 验证中文
			containsChinese(str) {
				if (!this.$utils.containsChinese(str)) {
					this.form.realname = ''
					uni.$u.toast('请输入正确姓名');
				}
			},
			// 绑定
			submit() {
				if (!this.form.name) {
					return uni.$u.toast('请输入您的真实姓名');
				}
				if (!this.form.card_no) {
					return uni.$u.toast('请输入您的支付宝账号');
				}
				if (this.opt.id) {
					this.$utils.throttle(() => {
						userBankUpdateApi(this.form).then(res => {
							uni.$u.toast(res.data.msg);
							setTimeout(() => {
								uni.navigateBack()
							}, 1000)
						})
					}, 2000)()
				} else {
					this.$utils.throttle(() => {
						userBankApi(this.form).then(res => {
							uni.$u.toast(res.data.msg);
							setTimeout(() => {
								uni.navigateBack()
							}, 1000)
						})
					}, 2000)()
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		.main {
			display: flex;
			flex-direction: column;
			flex: 1;
			margin: 0 30rpx 30rpx;
			background-color: rgba(255, 255, 255, 1);
			border-radius: 20rpx;
		}

		.content {
			.title {
				font-weight: bold;
				border-bottom: 2rpx solid #e5e5e5;
				padding: 30rpx;
				font-size: 1.2em;
			}

			.form {
				padding: 30rpx;

				.item {
					margin-bottom: 20rpx;

					.item-name {
						margin-bottom: 16rpx;
						line-height: 48rpx;
						font-weight: 500;
						color: rgba(17, 24, 38, 1);
					}

					.item-input {
						width: 100%;
						height: 100rpx;
						padding: 26rpx 32rpx;
						border-radius: 20rpx;
						border: 1px solid rgba(232, 235, 238, 1);

						.input {
							color: rgba(17, 24, 38, 1);
							flex: 1;
							font-size: var(--font-14);
						}

						.placeholder {
							color: rgba(187, 189, 193, 1);
						}

						image {
							width: 40rpx;
							height: 40rpx;
							margin-left: 20rpx;
						}
					}
				}
			}
		}

		.footer {
			padding: 30rpx;

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
			width: 540rpx;
			padding: 48rpx;
			border-radius: 16rpx;
			background: rgba(255, 255, 255, 1);
			font-family: Roboto;
			font-weight: 400;
			line-height: 40rpx;
			text-align: center;
			color: rgba(27, 28, 30, 1);

			.van-dialog__header {
				font-size: var(--font-18);
			}

			.van-dialog__content {
				margin: 34rpx auto;
				font-size: var(--font-16);
			}

			.van-dialog__footer {
				display: flex;

				.button {
					height: 72rpx;
					font-size: var(--font-14);
				}
			}
		}
	}
</style>