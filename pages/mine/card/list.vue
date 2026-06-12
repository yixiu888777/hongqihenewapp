<template>
	<view class="container" style="background:#c8131e url(/static/new/bg.jpg) no-repeat center top / 100%;">
		<headerView>
			<template #leftIcon><u-icon name="arrow-left" color="#fff" size="24"></u-icon></template>
			<view>收款管理</view>
		</headerView>
		<view class="main">
			<view class="content">
				<view class="list" v-if="list.length>0">
					<view class="item" v-for="item in list" :key="item.id">
						<!-- 银行卡信息 -->
						<view class="info flex_between" :class="item.type==2?'onAlipay':'onBank'">
							<view class="img">
								<image
									:src="item.type==2?require('@/static/mine/alipay.png'):require('@/static/mine/bank.png')"
									mode="heightFix" class="icon"></image>
							</view>
							<view class="text">
								<view class="name">{{item.bankname || item.type_str}}</view>
								<view class="num">{{item.card_no}}</view>
							</view>
							<view class="operate" @click="toForm(item)">
								<image src="@/static/new/icon-edit.png" mode="widthFix"></image>
							</view>
						</view>
					</view>
				</view>
				<view class="noData col_center" v-else>
					<image src="@/static/mine/card.png" mode="widthFix"></image>
					<view>您还没有绑定收款账户，请前往添加。</view>
				</view>
			</view>

			<view class="footer flex_center">
				<view class="button" @click="onShowClick">添加</view>
			</view>
		</view>
		<!-- 添加导航 -->
		<u-popup :show="navShow" mode="bottom" @close="navShow=false">
			<view class="van-dialog van-dialog2 van-dialog3 col_center">
				<!-- <view class="van-dialog__header">请选择</view> 2=支付宝,3=银行卡 -->
				<view class="van-dialog__item" @click="toPay(2)">支付宝</view>
				<view class="van-dialog__item" @click="toPay(3)">银行卡</view>
			</view>
		</u-popup>
		<!-- 密码提示 -->
		<u-popup :show="pswShow" mode="center" round="32" @close="pswShow=false">
			<view class="van-dialog van-dialog2">
				<view class="van-dialog__header">提示</view>
				<view class="van-dialog__content">请先设置提款密码</view>
				<view class="van-dialog__footer">
					<view class="button" @click="toPsw">去设置</view>
				</view>
			</view>
		</u-popup>
		<!-- 实名提示 -->
		<u-popup :show="nameShow" mode="center" round="32" @close="nameShow = false">
			<view class="van-dialog van-dialog2">
				<view class="van-dialog__header">提示</view>
				<view class="van-dialog__content">请先完成实名认证！</view>
				<view class="van-dialog__footer">
					<view class="button" @click="$utils.toPage(`/pages/mine/realName`)">去认证</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		userBankListApi,
		userBankDeleteApi
	} from '@/api/api.js'
	export default {
		data() {
			return {
				settingInfo: uni.getStorageSync('settingInfo'),
				UserInfo: uni.getStorageSync('user_info'),
				nameShow: false, // 实名认证
				list: [],
				navShow: false,
				pswShow: false,
			};
		},
		onShow() {
			this.UserInfo = uni.getStorageSync('user_info')
			this.getWallet()
		},
		onHide() {
			this.navShow = false
		},
		methods: {
			// 获取列表
			getWallet() {
				userBankListApi().then(res => {
					this.list = res.data.data
					this.list.forEach(item => {
						item.delShow = false
					})
				})
			},
			// 操作按钮显示
			onShowClick(item) {
				if (this.UserInfo.is_pay_password == 0) {
					this.pswShow = true;
				} else {
					this.navShow = true;
				}
			},
			// 编辑
			toForm(item) {
				if (item.type == 2) {
					this.$utils.toPage(`/pages/mine/card/alipay?id=${item.id}`)
				} else {
					this.$utils.toPage(`/pages/mine/card/bankCard?id=${item.id}`)
				}
				// this.delShowClick(item)
			},
			// 删除
			walletDel(id) {
				this.$utils.throttle(() => {
					userBankDeleteApi({
						id: id
					}).then(res => {
						uni.$u.toast(res.data.msg);
						setTimeout(() => {
							this.getWallet()
						}, 1000)
					})
				}, 2000)()
			},
			toPsw() {
				this.pswShow = false;
				uni.navigateTo({
					url: '/pages/mine/account/paymentPassword'
				})
			},
			toPay(e) {
				if (this.UserInfo.is_auth == 1) {
					// 2=支付宝,3=银行卡
					var targetIndex = this.list.findIndex(item => item.type === e);
					if (targetIndex == -1) {
						if (e == 2) {
							uni.navigateTo({
								url: '/pages/mine/card/alipay'
							})
						}
						if (e == 3) {
							uni.navigateTo({
								url: '/pages/mine/card/bankCard'
							})
						}
					} else {
						uni.$u.toast("只能添加一个帐号");
					}
				} else {
					this.nameShow = true
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
		}

		.content {
			margin-bottom: 30rpx;

			.list {
				.item {
					background: #fff;
					border-radius: 20rpx;
					position: relative;
					margin-bottom: 30rpx;
					padding: 30rpx;

					.img {
						image {
							width: 60rpx;
							height: 60rpx;
							display: block;
						}
					}

					.text {
						padding: 0 30rpx;
						flex: 1;

						.name {}

						.num {
							font-size: .8em;
						}
					}

					.operate {
						image {
							width: 40rpx;
						}
					}
				}
			}

			.noData {
				background: #fff;
				border-radius: 20rpx;
				padding: 10vh 0;
				flex: 1;
				height: 100%;
				font-weight: 400;
				line-height: 40rpx;
				text-align: center;
				color: rgba(111, 115, 116, 1);

				image {
					width: 200rpx;
					margin-bottom: 40rpx;
				}
			}
		}

		.footer {
			.button {
				background: rgba(255, 255, 255, 1);
				color: rgba(246, 42, 45, 1);
				font-weight: bold;
			}
		}
	}

	.van-dialog3 {
		width: 100%;
		border-radius: 20rpx 20rpx 0 0;

		.van-dialog__item {
			padding: 10px 0;
			border-bottom: 2rpx solid #e5e5e5;
		}

		.van-dialog__item:last-child {
			border-bottom: none;
		}
	}
</style>