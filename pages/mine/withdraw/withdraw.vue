<template>
	<view class="container" style="background:#c8131e url(/static/new/bg.jpg) no-repeat center top / 100%;">
		<headerView>
			<template #leftIcon><u-icon name="arrow-left" color="#fff" size="24"></u-icon></template>
			<view>提款中心</view>
			<template #rightIcon>
				<view class="icon" @click="$utils.toPage('/pages/mine/withdraw/history?type=2')">
					<image src="/static/new/history.png" mode="heightFix"
						style="height: 36rpx; display: block; margin: 0 auto 5rpx;"></image>
					<view class="text" style="font-size: .6em;line-height: 1;">记录</view>
				</view>
			</template>
		</headerView>
		<view class="content">
			<view class="main">
				<view class="title">选择提款方式</view>
				<view class="cardno" v-if="payList.length > 0">
					<radio-group @change="wallIDChange" class="cardList">
						<label class="li flex_between" :class="wallID==item.type?'on':''"
							v-for="(item,index) in payList" :key="index">
							<view class="name">
								<image class="icon"
									:src="item.type==2?require('@/static/mine/alipay2.png'):require('@/static/mine/bank2.png')"
									mode="widthFix" :class="item.type==2?'alipay':'bank'"></image>
								<image class="icon2"
									:src="item.type==2?require('@/static/mine/alipay2.png'):require('@/static/mine/bank2.png')"
									mode="widthFix" :class="item.type==2?'alipay':'bank'"></image>
								{{item.type_str}}
							</view>
							<!-- <view class="num">{{item.cardno}}</view> -->
							<view class="radio">
								<radio :value="String(item.type)" :checked="wallID == item.type"
									activeBackgroundColor="rgba(0, 0, 0, 1)" style="transform:scale(0.7)" />
							</view>
						</label>
					</radio-group>
				</view>
				<view class="sbtn" v-else @click="$utils.toPage('/pages/mine/card/list')">请先绑定支付宝或银行卡</view>
				<!-- <u-skeleton :loading="true" :animate="true" :rows="3" :title="false" v-else></u-skeleton> -->
				<view class="title">选择提款钱包</view>
				<view class="ul" v-if="moneyList.length > 0">
					<radio-group @change="moneyChange" class="moneyList">
						<label class="li" :class="moneyIndex==index?'on':''" v-for="(item,index) in moneyList"
							:key="index">
							<view class="img">
								<image src="/static/new/money.png" mode="widthFix"></image>
							</view>
							<view class="name">{{item.name}}</view>
							<view class="num">{{item.price}}</view>
							<view class="radio">
								<radio :value="String(item.id)" :checked="moneyIndex == index"
									activeBackgroundColor="rgba(0, 0, 0, 1)" style="transform:scale(1)" />
							</view>
						</label>
					</radio-group>
				</view>
				<u-skeleton :loading="true" :animate="true" :rows="3" :title="false" v-else></u-skeleton>
				<view class="title">提款金额</view>
				<view class="form">
					<view class="item flex_between">
						<view class="item-input flex_between">
							<input type="number" v-model="price" class="input" placeholder="请输入提款金额"
								placeholder-class="placeholder" />
						</view>
					</view>
					<!-- <view class="ul">
						<view class="li" :class="txIndex==index?'on':''" v-for="(item,index) in txList" :key="index" @click="price=item,txIndex=index">{{item}}</view>
					</view> -->
				</view>
				<view class="title">提款密码</view>
				<view class="form">
					<view class="item flex_between">
						<view class="item-input flex_between">
							<input type="password" v-model="security_password" class="input" placeholder="请输入提款密码"
								placeholder-class="placeholder" />
						</view>
					</view>
				</view>
				<!-- <view class="li flex_between">
					<view class="item-input flex_between">
						<input type="password" v-if="pwdShow" v-model="security_password" class="input"
							placeholder="请输入提款密码" placeholder-class="placeholder" />
						<input type="text" v-else v-model="security_password" class="input" placeholder="请输入提款密码"
							placeholder-class="placeholder" />
						<view @click="pwdShow=!pwdShow">
							<image src="@/static/public/eye-off.svg" mode="widthFix" v-if="pwdShow"></image>
							<image src="@/static/public/eye.svg" mode="widthFix" v-else></image>
						</view>
					</view>
				</view> -->
				<view class="footer col_center">
					<view class="button" @click="withdrawal">提现</view>
					<!-- <view class="button no" v-else>请先输入金额</view>  v-if="price" onPsw-->
					<!-- <view class="footer-tips">无法提现请联系<span @click="toLoads(settingInfo.service_url)">在线客服</span></view> -->
				</view>
			</view>
			<view class="m-tips">
				<view class="text">
					<view class="desc"><u-parse :content="settingInfo.withdraw_note"></u-parse></view>
				</view>
			</view>
		</view>



		<!-- 输入支付密码提示 -->
		<u-popup :show="pswShow" mode="center" round="32" @close="closePSW">
			<view class="van-dialog van-dialog2">
				<view class="van-dialog__header">提示</view>
				<view class="van-dialog__content">
					<view class="pswbox">
						<input type="password" v-model="security_password" class="input" placeholder="请输入支付密码"
							placeholder-class="placeholder" />
					</view>
				</view>
				<view class="van-dialog__footer">
					<view class="button" @click="withdrawal('')" v-if="security_password">立即提现</view>
					<view class="button no" v-else>请输入支付密码</view>
				</view>
			</view>
		</u-popup>

		<!-- 提示 -->
		<u-popup :show="show" mode="center" round="32" @close="show = false">
			<view class="van-dialog van-dialog2">
				<view class="van-dialog__header">提示</view>
				<view class="van-dialog__content" v-html="tipMsg"></view>
				<view class="van-dialog__footer">
					<view class="button" @click="confirmSub">知道了</view>
				</view>
			</view>
		</u-popup>

		<!-- 支付密码修改提示 -->
		<u-popup :show="isPswShow" mode="center" round="32" @close="isPswShow = false">
			<view class="van-dialog van-dialog2">
				<view class="van-dialog__header">提示</view>
				<view class="van-dialog__content">请先设置支付密码</view>
				<view class="van-dialog__footer flex_center">
					<view class="van-success" @click="toPsw">设置密码</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		userInfoApi,
		userWithdrawalWalletApi,
		userBankListApi,
		userWithdrawalApi
	} from '@/api/api.js'
	export default {
		data() {
			return {
				isPageShow: false,
				settingInfo: uni.getStorageSync('settingInfo'),
				UserInfo: uni.getStorageSync('user_info'),
				price: null, // 提款金额
				payIndex: 3,
				payList: [{
					type_str: '银行卡',
					type: 3
				}, {
					type_str: '支付宝',
					type: 2
				}], // 提款方式
				wallID: 3,
				txList: [100, 500, 1000, 3000, 10000, 50000], // 请输或选择提现金额
				txIndex: -1,
				pswShow: false,
				isPswShow: false,
				moneyType: '',
				moneyIndex: 0,
				moneyList: [], // 提款钱包
				moneyID: 0,
				security_password: '', // 提款密码
				finish_password: false,
				pwdShow: true,
				show: false, // 弹窗
				tipMsg: "", // 弹窗文本
				cate_id: '', // 项目id
				codeType: null, // 提现接口code类型
				sxf_yes: 0, // 手续费

				NewForm: {
					show: false,
					tip: '',
					jump_juankuan: 0
				},
				walletForm: {
					show: false
				},

				fellShow1: false,
				fellShow2: false,
				fellInfo: {
					ratelist: {}
				},
				fellId: null,

				newAddInfo: {},
				newAddShow: false,

				moneyTypes: [],
				withthreeInfo: {},
				withInfo: {
					show: false,
					tips: '',
					status: null
				},

				bxInfo: {
					show: false,
					bx_list: []
				},

				loanInfo: {
					show: false,
					tips: '',
					status: -1
				},
				loanTip: ''
			};
		},
		onLoad(opt) {
			// console.log("opt",opt)
			if (opt.type == 'state') {
				this.moneyType = opt.type;
			}
			this.getMoneyType();
		},
		onShow() {
			this.getUserInfo()
			/* getUserInfoAPI().then(res => {
				this.UserInfo = res.data.data
				uni.setStorageSync('UserInfo', res.data.data)
				if(this.UserInfo.is_pay_password == 0){
					// 支付密码 1有 0 没有
					this.isPswShow = true;
				}
			}) */
			// userBankListApi().then(res => {
			// 	if (res.data.data.length == 0) {
			// 		uni.$u.toast('请先绑定支付宝或银行卡');
			// 		// setTimeout(() => {
			// 		// 	uni.navigateTo({
			// 		// 		url: '/pages/mine/card/list'
			// 		// 	})
			// 		// }, 1000)
			// 	} else {
			// 		this.payList = res.data.data
			// 		this.wallID = res.data.data[0].id;
			// 	}
			// })
		},
		onHide() {
			this.isNewShow = false
			this.fellShow1 = false
		},
		methods: {
			getUserInfo() {
				userInfoApi().then(res => {
					this.UserInfo = res.data.data
					uni.setStorageSync('user_info', res.data.data)
					if (this.UserInfo.is_pay_password == 0) {
						// 支付密码 1有 0 没有
						this.isPswShow = true;
					}
				})
			},
			getMoneyType() {
				userWithdrawalWalletApi().then(res => {
					this.moneyList = res.data.data
					this.moneyID = res.data.data[0].id;
				})
			},
			wallIDChange(e) {
				// console.log("moneyChange", e.detail.value)
				this.wallID = e.detail.value;
			},
			moneyChange(e) {
				// console.log("moneyChange",e.detail.value)
				this.moneyID = e.detail.value;
			},
			// 去在线客服页
			toLoads(url) {
				uni.navigateTo({
					url: `/pages/noPage/index?url=${url.split("&").join("$")}`
				})
			},
			toRedirectPage(url) {
				uni.redirectTo({
					url: url
				})
			},
			closePSW() {
				this.pswShow = false;
				this.security_password = ''
			},
			onPsw() {
				if (this.UserInfo.is_pay_password == 0) {
					// 支付密码 1有 0 没有
					this.isPswShow = true;
				} else {
					this.pswShow = true;
				}
			},
			// 申请提现
			withdrawal(text) {
				this.$utils.throttle(() => {
					if (this.payList.length == 0) {
						uni.$u.toast('请先绑定银行卡');
					} else if (this.withthreeInfo.status == 3 && this.moneyTypes.includes(this.moneyList[this
							.moneyIndex].id)) {
						if (!this.price) {
							return uni.$u.toast('请输入提现金额');
						}
						if (!this.security_password) {
							return uni.$u.toast('请输入提款密码');
						}
						// console.log("form",form)
					} else {
						if (this.moneyIndex == -1) {
							return uni.$u.toast('选择提款钱包');
						}
						let form = {
							money_type: this.moneyID,
							wallet_type: this.wallID,
							price: this.price,
							security_password: this.security_password
						}
						// console.log("form2", form)
						userWithdrawalApi(form).then(res => {
							console.log(res)
							uni.$u.toast(res.data.msg);
							console.log(res.data.code)
							console.log(res.data.data)
							if(res.data.code ==-122){
								uni.navigateTo({
									url: "/pages/policy/buy?id="+res.data.data
								})
								return;
							}
							if (this.moneyType == 'state') {
								uni.navigateBack()
							} else {
								setTimeout(() => {
									uni.redirectTo({
										url: "/pages/mine/withdraw/history?type=2"
									})
								}, 1000)
							}
						})
					}
				}, 1000)()
			},
			moneyClick(item, index) {
				console.log("moneyClick", index)
				this.moneyIndex = index
			},
			toPsw() {
				this.isPswShow = false;
				uni.navigateTo({
					url: '/pages/mine/account/paymentPassword'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		min-height: 100vh;
		background-size: cover;
		height: auto;
	}

	.container {
		.content {
			padding: 0 30rpx 30rpx;
			border-radius: 20rpx;

			.main {
				background: #fff;
				padding: 30rpx;
				border-radius: 20rpx;
				margin-bottom: 30rpx;

				.sbtn {
					background: #eee;
					color: #f62a2d;
					text-align: center;
					border-radius: 20rpx;
					padding: 20rpx;
					margin-bottom: 30rpx;
				}
			}

			.title {
				font-weight: bold;
				margin-bottom: 20rpx;
			}

			.ul {
				margin-bottom: 60rpx;
				display: flex;
				justify-content: space-between;
				gap: 30rpx;
				flex-wrap: wrap;

				.li {
					flex: 1;
					min-width: 190rpx;
					text-align: center;
					padding: 30rpx 20rpx;
					border-radius: 20rpx;
					background: linear-gradient(to left, rgba(247, 247, 247, 1), rgba(216, 216, 216, .5));
					font-weight: 500;
					color: rgba(17, 24, 38, 1);

					.name {
						font-weight: 300;
						font-size: .8em;
						line-height: 1;
						margin-bottom: 10rpx;
					}

					.num {
						line-height: 1;
						font-weight: bold;
					}

					.li-box {
						width: 36rpx;
						height: 36rpx;
						border-radius: 36rpx;
						border: 2rpx solid rgba(177, 177, 177, 1);
						background: #fff;
					}
				}

				.li.on {
					background: linear-gradient(to left, rgba(255, 98, 75, 1), rgba(255, 54, 80, 1));
					color: #fff;
				}
			}

			// .ul::after { content: ''; flex: auto; }
			.cardno {
				margin-bottom: 60rpx;

				.cardList {
					display: flex;
					flex-wrap: wrap;
					gap: 30rpx;
					justify-content: center;
					align-items: center;
				}

				.li {
					background: rgba(243, 240, 241, 1);
					padding: 30rpx;
					border-radius: 20rpx;
					font-size: .8em;
					min-width: 200rpx;
					flex: 1;

					.name {
						image {
							width: 36rpx;
							height: 36rpx;
							vertical-align: middle;
							margin-right: 10rpx;
						}

						.icon {
							display: none;
						}

						.icon2 {
							display: inline-block;
						}
					}
				}

				.li.on {
					.icon {
						display: inline-block;
					}

					.icon2 {
						display: none;
					}
				}
			}

			.moneyList {
				flex: 1;

				.li {
					display: flex;
					align-items: center;
					margin-bottom: 0;
					background: none;
					text-align: left;
					padding: 0;

					.img {
						image {
							margin-left: -20rpx;
							width: 100rpx;
							display: block;
						}
					}

					.name {
						width: 260rpx;
						font-weight: bold;
					}

					.num {
						flex: 1;
						color: rgba(246, 42, 45, 1);
					}

					.radio {}
				}

				.li.on {
					background: none;
					color: #000;
				}
			}

			.form {
				margin-bottom: 30rpx;

				.item {
					margin-bottom: 30rpx;

					.item-input {
						width: 100%;
						padding: 26rpx 32rpx;
						border-radius: 20rpx;
						background: linear-gradient(to left, rgba(247, 247, 247, 1), rgba(216, 216, 216, .5));

						.input {
							flex: 1;
							font-weight: 500;
							line-height: 48rpx;
						}

						.placeholder {
							font-weight: 300;
							color: rgba(0, 0, 0, .7);
						}
					}
				}
			}
		}

		.footer {
			padding: 30rpx 0 0;
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
	}

	.pswbox {
		border: 2rpx solid #e5e5e5;
		padding: 20rpx;
		border-radius: 20rpx;

		::v-deep .u-code-input {
			justify-content: space-evenly;
		}

		::v-deep .u-code-input__item {
			border-radius: 5rpx;
		}
	}

	.m-tips {
		background: #fff;
	}

	::v-deep .header {
		color: #fff;

		.title {
			text-align: center;
		}
	}

	::v-deep .uni-page-head {
		display: none !important;
	}
</style>