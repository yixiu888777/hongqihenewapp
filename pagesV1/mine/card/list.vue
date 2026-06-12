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
							<view class="img"><image :src="item.type==2?require('@/static/mine/alipay.png'):require('@/static/mine/bank.png')" mode="heightFix" class="icon"></image></view>
							<view class="text">
								<view class="name">{{item.bankname || item.type_str}}</view>
								<view class="num">{{item.cardno_x_list}}</view>
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
				<view class="button" @click="navShow=true">添加</view>
			</view>
		</view>
		<!-- 添加导航 -->
		<u-popup :show="navShow" mode="bottom" @close="navShow=false">
			<view class="van-dialog col_center">
				<view class="van-dialog__header"></view>
				<view class="van-dialog__item" @click="$utils.toPage('/pages/mine/card/alipay')">支付宝</view>
				<view class="van-dialog__item" @click="$utils.toPage('/pages/mine/card/bankCard')">银行卡</view>
			</view>
		</u-popup>
		<!-- 是否实名认证 -->
		<Real-Name></Real-Name>
	</view>
</template>

<script>
	import {
		walletApi,
		walletDelApi
	} from '@/api/api.js'
	export default {
		data() {
			return {
				settingInfo: uni.getStorageSync('settingInfo'),
				list: [],
				navShow: false
			};
		},
		onShow() {
			this.getWallet()
		},
		onHide() {
			this.navShow = false
		},
		methods: {
			// 获取列表
			getWallet() {
				walletApi().then(res => {
					this.list = res.data.data
					this.list.forEach(item => {
						item.delShow = false
					})
				})
			},
			// 操作按钮显示
			delShowClick(item) {
				item.delShow = !item.delShow
				this.$forceUpdate();
			},
			// 编辑
			toForm(item) {
				if (item.type == 2) {
					this.$utils.toPage(`/pages/mine/card/alipay?id=${item.id}`)
				} else {
					this.$utils.toPage(`/pages/mine/card/bankCard?id=${item.id}`)
				}
				this.delShowClick(item)
			},
			// 删除
			walletDel(id) {
				this.$utils.throttle(() => {
					walletDelApi({
						id: id
					}).then(res => {
						uni.$u.toast(res.data.msg);
						setTimeout(() => {
							this.getWallet()
						}, 1000)
					})
				}, 2000)()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		.main{ display: flex; flex-direction: column; flex: 1;margin:0 30rpx 30rpx;  }
		.content { margin-bottom: 30rpx;
			.list {
				.item { background: #fff; border-radius: 20rpx; position: relative; margin-bottom: 30rpx; padding: 30rpx;
					.img{
						image{ width: 60rpx; height: 60rpx;}
					}
					.text{padding: 0 30rpx; flex: 1;
						.name{}
						.num{font-size: .8em;}
					}
					.operate {
						image{ width: 40rpx;}
					}
				}
			}

			.noData { background: #fff; border-radius: 20rpx; padding: 10vh 0; flex: 1; height: 100%;
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
			.button { background: rgba(255, 255, 255, 1); color: rgba(246, 42, 45, 1); }
		}

		.van-dialog {
			width: 750rpx;
			padding: 20rpx 48rpx;
			border-radius: 60rpx 60rpx 0px 0px;
			background: rgba(255, 255, 255, 1);
			box-shadow: 0px -8rpx 8rpx 0px rgba(0, 0, 0, 0.05);

			.van-dialog__header {
				width: 70rpx;
				height: 12rpx;
				border-radius: 60rpx;
				background: rgba(240, 240, 240, 1);
			}

			.van-dialog__item {
				margin-top: 20rpx;
				height: 80rpx;
				font-family: Roboto;
				font-size: var(--font-14);
				font-weight: 400;
				line-height: 80rpx;
				text-align: center;
				color: rgba(34, 34, 34, 1);
			}
		}
	}
</style>