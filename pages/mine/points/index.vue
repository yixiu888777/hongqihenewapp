<template>
	<view class="container" style="background:#c8131e url(/static/new/bg.jpg) no-repeat center top / 100%;">
		<headerView>
			<template #leftIcon><u-icon name="arrow-left" color="#fff" size="24"></u-icon></template>
			<view>积分兑换</view>
		</headerView>
		<view class="main">
			<view class="points">
				<view class="tips">
					<view class="item" v-for="(item,index) in wallet.price_list" :key="index">
						<view class="desc">{{item.name}}</view>
						<view class="num">{{item.price}}</view>
					</view>
				</view>
				<view class="form">
					<view class="item">
						<view class="name">自动换算</view>
						<view class="text">
							<!-- {{wallet.price_list.points_price.price}} 积分可兑换 {{wallet.price_list.points_price.price * wallet.exchange_rate}} 元 -->
							<input type="text" v-model="autoPrice" class="input"
								:placeholder="'1积分可兑换' + wallet.exchange_rate + '元'" placeholder-class="placeholder"
								disabled="" />
							<image src="/static/new/refresh.png" mode="heightFix" class="refresh" @click="onRefresh">
							</image>
						</view>
					</view>
					<view class="item">
						<view class="name">输入积分</view>
						<view class="text">
							<input type="number" v-model="form.price" class="input" placeholder="请输入积分"
								placeholder-class="placeholder" @input="onInput" />
						</view>
					</view>
					<view class="btn" @click="onExchange">兑换</view>
				</view>
			</view>
			<view class="m-tips">
				<view class="text">
					<view class="desc"><u-parse :content="wallet.exchange_rule"></u-parse></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		exchangeWalletApi,
		exchangeApi
	} from '@/api/api.js'
	export default {
		data() {
			return {
				settingInfo: uni.getStorageSync('settingInfo'),
				UserInfo: uni.getStorageSync('user_info'),
				form: {
					price: '',
				},
				wallet: {},
				num: 1,
				autoPrice: ''
			};
		},
		onLoad() {
			this.loadData();
			// this.getLists();
		},
		onShow() {
			// getUserInfoAPI().then(res => {
			// 	this.userInfo = res.data.data;
			// });
		},
		methods: {
			loadData() {
				exchangeWalletApi().then((res) => {
					this.wallet = res.data.data;
				})
			},
			onRefresh() {
				this.autoPrice = ''
			},
			onInput() {
				if (this.form.price == '') {
					this.autoPrice = ''
				} else {
					this.autoPrice = this.form.price + '积分可兑换' + Math.trunc(this.form.price * this.wallet.exchange_rate *
						100) / 100 + '元'
				}
			},
			onExchange(num) {
				exchangeApi({
					points: this.form.price
				}).then((res) => {
					uni.$u.toast(res.data.msg);
					this.loadData();
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		min-height: 100vh;
		height: auto;

		.main {
			padding: 0 30rpx 30rpx;

			.points {
				background: #fff;
				padding: 30rpx;
				margin-bottom: 30rpx;
				border-radius: 20rpx;
			}

			.tips {
				display: flex;
				gap: 30rpx;
				margin-bottom: 30rpx;

				.item {
					background: rgba(246, 42, 45, .2);
					padding: 20rpx;
					border-radius: 20rpx;
					width: 345rpx;
					text-align: center;
					flex: 1;
					font-weight: 500;

					.desc {}

					.num {
						color: #FF374F;
						font-size: 1.6em;
						font-weight: bold;
					}
				}
			}
		}
	}

	.form {
		.item {
			margin-bottom: 30rpx;

			.name {
				font-weight: bold;
				margin-bottom: 10rpx;
			}

			.text {
				background: rgba(243, 240, 241, 1);
				padding: 30rpx;
				border-radius: 20rpx;
				position: relative;

				.refresh {
					position: absolute;
					height: 40rpx;
					top: 30rpx;
					right: 30rpx;
				}
			}
		}

		.btn {
			background: rgba(246, 42, 45, 1);
			color: #fff;
			padding: 30rpx;
			border-radius: 20rpx;
			margin-top: 60rpx;
			text-align: center;
		}
	}

	.m-tips {
		background-color: #fff;
	}
</style>