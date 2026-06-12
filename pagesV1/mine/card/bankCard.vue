<template>
	<view class="container" style="background:#c8131e url(/static/new/bg.jpg) no-repeat center top / 100%;">
		<headerView>
			<template #leftIcon><u-icon name="arrow-left" color="#fff" size="24"></u-icon></template>
			<view>添加银行卡</view>
		</headerView>
		<view class="main">
			<view class="content">
				<view class="form">
					<view class="item">
						<view class="item-name">姓名</view>
						<view class="item-input flex_between">
							<input type="text" v-model="form.name" class="input" placeholder="请输入您的真实姓名"
								placeholder-class="placeholder" @blur="containsChinese" />
						</view>
					</view>
					<view class="item">
						<view class="item-name">银行</view>
						<view class="item-input flex_between">
							<input type="text" v-model="form.bankname" class="input" placeholder="请输入银行名称(例:建设银行)"
								placeholder-class="placeholder" />
						</view>
					</view>
					<view class="item">
						<view class="item-name">开户行</view>
						<view class="item-input flex_between">
							<input type="text" v-model="form.bank" class="input" placeholder="请输入开户行名称(例:建设银行XXXX支行)"
								placeholder-class="placeholder" />
						</view>
					</view>
					<view class="item">
						<view class="item-name">卡号</view>
						<view class="item-input flex_between">
							<input type="number" v-model="form.cardno" class="input" placeholder="请输入卡号"
								placeholder-class="placeholder" />
						</view>
					</view>
				</view>
			</view>
			<view class="footer col_center">
				<view class="button" @click="submit">绑定</view>
				<view class="footer-tips">无法绑定联系？<span @click="toLoads(settingInfo.service.service_url)">在线客服</span></view>
			</view>
		</view>

		<!-- 实名提示 -->
		<u-popup :show="show" mode="center" round="32">
			<view class="van-dialog van-dialog2">
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
		getUserInfoAPI,
		walletInfoApi,
		saveWalletApi
	} from '@/api/api.js'
	export default {
		data() {
			return {
				settingInfo: uni.getStorageSync('settingInfo'),
				userInfo: {},
				form: {
					id: '',
					name: '',
					bankname: '',
					bank: '',
					cardno: '',
					type: 3,
					security_password: ''
				},
				pswShow: false,
				show: false,
				securityPassword: false,
				opt:{
					id: '',
				}
			};
		},
		onLoad(opt) {
			this.opt.id = opt.id
		},
		onShow() {
			getUserInfoAPI().then(res => {
				this.userInfo = res.data.data
				// this.securityPassword = res.data.data.security_password == 1 ? false : true
				let isAuth = res.data.data.is_auth
				if (isAuth == 1) {
					if (!!this.opt.id) {
						walletInfoApi({
							id: this.opt.id
						}).then(res => {
							let info = res.data.data
							this.form.id = info.id
							this.form.name = info.name
							this.form.bankname = info.bankname
							this.form.bank = info.bank
							this.form.cardno = info.cardno
						})
					}
				} else {
					this.show = true
				}
			})			
		},
		methods: {
			toPage() {
				this.show = false;
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
				if (!this.form.bankname) {
					return uni.$u.toast('请输入银行名称');
				}
				if (!this.form.bank) {
					return uni.$u.toast('请输入开户行名称');
				}
				if (!this.form.cardno) {
					return uni.$u.toast('请输入卡号');
				}
				this.$utils.throttle(() => {
					saveWalletApi(this.form).then(res => {
						uni.$u.toast(res.data.msg);
						if(this.userInfo.is_pay_password == 0){
							// 支付密码 1有 0 没有 
							this.pswShow = true;
						} else{
							setTimeout(() => {
								uni.navigateBack()
							}, 1000)
						}
					})
				}, 2000)()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		.main{ display: flex; flex-direction: column; flex: 1;margin:0 30rpx 30rpx; background-color: rgba(255, 255, 255, 1); border-radius: 20rpx;}
		.content {
			.title{ font-weight: bold; border-bottom: 2rpx solid #e5e5e5; padding: 30rpx; font-size: 1.2em;}
			.form { padding: 30rpx; 
				.item { margin-bottom: 20rpx;
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

		.footer { padding: 30rpx;
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
	}
</style>