<template>
	<view class="container" style="background:#c8131e url(/static/new/bg.jpg) no-repeat center top / 100%;">
		<headerView>
			<template #leftIcon><u-icon name="arrow-left" color="#fff" size="24"></u-icon></template>
			<view>转账中心</view>
			<template #rightIcon>
				<view class="icon" @click="$utils.toPage('/pages/mine/withdraw/history?type=3')">
					<image src="/static/new/history.png" mode="heightFix" style="height: 36rpx; display: block; margin: 0 auto 5rpx;"></image>
					<view class="text" style="font-size: .6em;line-height: 1;">记录</view>
				</view>
			</template>
		</headerView>
		<view class="content">
			<view class="main">
				<view class="title">选择钱包</view>
				<view class="ul" v-if="form.paytype">
					<radio-group @change="wallIDChange" class="moneyList">
						<label class="li" :class="form.paytype==item.id?'on':''" v-for="(item,index) in priceList" :key="index">
							<view class="img">
								<image src="/static/new/money.png" mode="widthFix"></image>
							</view>
							<view class="name">{{item.name}}</view>
							<view class="num">{{item.price}}</view>
							<view class="radio">
								<radio :value="String(item.id)" :checked="form.paytype == item.id" activeBackgroundColor="rgba(0, 0, 0, 1)" style="transform:scale(0.7)" />
							</view>
						</label>
					</radio-group>
				</view>
				<u-skeleton :loading="true" :animate="true" :rows="3" :title="false" v-else></u-skeleton>
				<view class="form">
					<view class="item">
						<view class="item-name">互转金额</view>
						<view class="item-input flex_between">
							<input type="number" v-model="form.price" class="input" placeholder="输入互转金额" placeholder-class="placeholder" />
							<view class="all" @click="allPrice">全部</view>
						</view>
					</view>
					<view class="item">
						<view class="item-name">对方姓名</view>
						<view class="item-input flex_between">
							<input type="text" v-model="form.name" class="input" placeholder="输入对方姓名" placeholder-class="placeholder" />
						</view>
					</view>
					<view class="item">
						<view class="item-name">对方手机号</view>
						<view class="item-input flex_between">
							<input type="number" v-model="form.phone" class="input" placeholder="输入对方手机号" placeholder-class="placeholder" maxlength="11" />
						</view>
					</view>
					<view class="item">
						<view class="item-name">提款密码</view>
						<view class="item-input flex_between">
							<input type="password" v-if="pwdShow" v-model="form.security_password" class="input" placeholder="输入提款密码" placeholder-class="placeholder" />
							<input type="text" v-else v-model="form.security_password" class="input" placeholder="输入提款密码" placeholder-class="placeholder" />
							<view @click="pwdShow=!pwdShow">
								<image src="@/static/public/eye-off.svg" mode="widthFix" v-if="pwdShow"></image>
								<image src="@/static/public/eye.svg" mode="widthFix" v-else></image>
							</view>
						</view>
					</view>
					<view class="footer col_center">
						<view class="button" @click="transfer">确定</view>
					</view>
				</view>
			</view>
			<view class="m-tips">
				<view class="text">
					<view class="desc"><u-parse :content="settingInfo.transfer_notice"></u-parse></view>
				</view>
			</view>
		</view>
		<!-- 密码提示 -->
		<u-popup :show="pswShow" mode="center" round="32">
			<view class="van-dialog van-dialog2">
				<view class="van-dialog__header">提示</view>
				<view class="van-dialog__content">请先设置或修改支付密码</view>
				<view class="van-dialog__footer">
					<view class="button" @click="toPsw">去设置</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		userTransferApi,
		userTransferWalletApi
	} from '@/api/api.js'
	export default {
		data() {
			return {
				settingInfo: uni.getStorageSync('settingInfo'),
				UserInfo: uni.getStorageSync('user_info'),
				rechargePrice: {
					name: '',
				},
				teamPrice: {},
				priceList: {},
				priceIndex: 0,
				form: {
					price: '',
					phone: '',
					security_password: null,
					paytype: ''
				},
				pswShow: false,
				pwdShow: true
			};
		},
		onShow() {
			userTransferWalletApi().then(res => {
				this.priceList = Object.values(res.data.data)
				this.form.paytype = res.data.data[0].id
				// console.log("this.form.paytype", this.form.paytype)
			})
			// getUserInfoAPI().then(res => {
			// 	//this.priceList = Object.values(res.data.data.price_list)
			// 	// let paytype = Object.values(res.data.data.price_list)
			// 	// console.log("res.data.data.price_list[0].moneytype",paytype[0].moneytype)
			// 	//this.form.paytype = this.priceList[0].moneytype
			// 	// this.rechargePrice = res.data.data.price_list.recharge_price
			// 	// this.teamPrice = res.data.data.price_list.team_price
			// 	uni.setStorageSync('UserInfo', res.data.data)
			// 	if (res.data.data.is_pay_password == 0) {
			// 		// 支付密码 1有 0 没有 
			// 		this.pswShow = true;
			// 	}
			// })
			// getSettingApi().then(res => {
			// 	this.settingInfo = res.data.data
			// 	uni.setStorageSync('settingInfo', res.data.data)
			// })
		},
		methods: {
			// 去在线客服页
			toLoads(url) {
				uni.navigateTo({
					url: `/pages/noPage/index?url=${url.split("&").join("$")}`
				})
			},
			toPsw() {
				this.pswshow = false;
				this.$utils.toPage('/pages/mine/account/paymentPassword')
			},
			wallIDChange(e) {
				// console.log("moneyChange",e)
				this.form.price = ''
				this.form.paytype = e.detail.value;
				for (let i = 0; i < this.priceList.length; i++) {
					if (this.priceList[i].id === e.detail.value) {
						this.priceIndex = i;
						break;
					}
				}
			},
			// 切换钱包
			popupClick(text, index) {
				this.form.price = ''
				this.form.paytype = text
				this.priceIndex = index
			},
			// 全部
			allPrice() {
				this.form.price = this.priceList[this.priceIndex].price
				// if (this.form.paytype == 'recharge') {
				// 	this.form.price = this.rechargePrice.price
				// } else {
				// 	this.form.price = this.teamPrice.price
				// }
			},
			// 互转
			transfer() {
				if (!this.form.price) {
					return uni.$u.toast('请输入转账金额');
				}
				if (!this.form.phone) {
					return uni.$u.toast('请输入收款账号');
				}
				if (!this.form.security_password) {
					return uni.$u.toast('请输入密码');
				}
				this.$utils.throttle(() => {
					userTransferApi(this.form).then(res => {
						uni.$u.toast(res.data.msg);
						setTimeout(() => {
							uni.redirectTo({
								url: "/pages/mine/withdraw/history?type=3"
							})
						}, 1000)
					})
				}, 2000)()
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
			.main {
				background: #fff;
				padding: 30rpx;
				border-radius: 20rpx;
				margin-bottom: 30rpx;
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
					width: 300rpx;
					flex: none;
					text-align: center;
					padding: 40rpx 20rpx;
					border-radius: 20rpx;
					background: linear-gradient(to left, rgba(247, 247, 247, 1), rgba(216, 216, 216, .5));
					font-size: .8em;
					font-weight: 300;
					color: rgba(17, 24, 38, 1);
					.name {
						font-weight: 300;
						line-height: 1;
						margin-bottom: 10rpx;
					}
					.num {
						line-height: 1;
						font-weight: bold;
						font-size: 1.4em;
					}
				}
				.li.on {
					background: linear-gradient(to left, rgba(255, 98, 75, 1), rgba(255, 54, 80, 1));
					color: #fff;
					font-weight: 500;
				}
			}
			.moneyList {
				flex: 1;
				.li {
					width: 100%;
					display: flex;
					align-items: center;
					margin-bottom: 0;
					background: none;
					text-align: left;
					padding: 0;
					.img {
						image {
							width: 100rpx;
							display: block;
						}
					}
					.name {
						flex: 1;
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
			// .ul::after { content: ''; flex: auto; }
			.form {
				margin-bottom: 30rpx;
				.item {
					.item-name {
						margin-bottom: 16rpx;
						font-family: Roboto;
						font-size: var(--font-14);
						font-weight: 400;
						line-height: 48rpx;
						color: rgba(34, 34, 34, 1);
						margin-top: 20rpx;
					}
					.item-input {
						width: 100%;
						height: 100rpx;
						padding: 26rpx 32rpx;
						border-radius: 20rpx;
						border: 2rpx solid rgba(232, 235, 238, 1);
						background: rgba(243, 240, 241, 1);
						.input {
							color: rgba(111, 115, 116, 1);
							flex: 1;
							font-size: var(--font-14);
							font-weight: 500;
							line-height: 48rpx;
						}
						.all {
							background: rgba(246, 42, 45, 1);
							color: #fff;
							padding: 10rpx 30rpx;
							border-radius: 90rpx;
						}
						.placeholder {
							color: rgba(187, 189, 193, 1);
						}
					}
					.item-input:focus,
					.item-input:hover {
						background: #fff;
					}
					.item-list {
						// flex-wrap: wrap;
						&>view {
							flex: 1;
							height: 60rpx;
							margin: 20rpx 20rpx 20rpx 0;
							border-radius: 8rpx;
							background: rgba(250, 60, 49, 0.1);
							font-family: Roboto;
							font-size: var(--font-11);
							font-weight: 400;
							line-height: 60rpx;
							text-align: center;
							color: rgba(250, 60, 49, 1);
						}
						&>view:nth-child(6n) {
							margin-right: 0;
						}
						.active {
							background: rgba(250, 60, 49, 1);
							color: rgba(255, 255, 255, 1);
						}
					}
				}
			}
		}
		.footer {
			padding: 50rpx 0 0;
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
	.m-tips {
		background: #fff;
	}
</style>