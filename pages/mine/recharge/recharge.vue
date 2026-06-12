<template>
	<view class="container" style="background:#c8131e url(/static/new/bg.jpg) no-repeat center top / 100%;">
		<headerView>
			<template #leftIcon><u-icon name="arrow-left" color="#fff" size="24"></u-icon></template>
			<view>充值中心</view>
			<template #rightIcon>
				<view class="icon" @click="$utils.toPage('/pages/mine/withdraw/history?type=1')">
					<image src="/static/new/history.png" mode="heightFix" style="height: 36rpx; display: block; margin: 0 auto 5rpx;"></image>
					<view class="text" style="font-size: .6em;line-height: 1;">记录</view>
				</view>
			</template>
		</headerView>
		<view class="content">
			<view class="form">
				<view class="tit">
					<view class="item-name">选择充值方式</view>
				</view>
				<view class="form-nav">
					<view class="item" :class="navIndex == item.id?'on':''" v-for="(item,index) in navList" @click="onNav(item.id)">{{item.name}}</view>
				</view>
				<view class="ul" v-if="payList.length > 0">
					<radio-group @change="wallIDChange" class="cardList">
						<label class="li" :class="channelId==item.id?'on':''" v-for="(item,index) in payList" :key="index" >
							<view class="icon zhifubao" v-if="item.pay_type_name == '支付宝'"><u-icon name="zhifubao" color="#fff" size="20"></u-icon>
							</view>
							<view class="icon weixin" v-else-if="item.pay_type_name == '微信'"><u-icon name="weixin-fill" color="#fff" size="20"></u-icon>
							</view>
							<view class="icon packet" v-else><u-icon name="red-packet" color="#fff" size="20"></u-icon>
							</view>
							<view class="name">{{item.name}}</view>
							<!-- <view class="num">{{ Number(item.price_min) }}-{{Number(item.price_max)}}</view> -->
							<view class="radio">
								
								<radio :value="String(item.id)" :checked="channelId == item.id" activeBackgroundColor="rgba(0, 0, 0, 1)" style="transform:scale(0.7)" />
							</view>
						</label>
					</radio-group>
				</view>
				<u-skeleton :loading="true" :animate="true" :rows="3" :title="false" v-else></u-skeleton>
				<view class="tit">
					<view class="item-name">充值</view>
					<!-- <view class="more"><image src="@/static/mine/record.svg" mode="heightFix" @click="$utils.toPage('/pages/mine/recharge/history')"></image></view> -->
				</view>
				<view class="item">
					<view class="item-input flex_between">
						<input type="number" v-model="price" class="input" placeholder="请输入充值金额" placeholder-class="placeholder" />
					</view>
					<!-- <view class="ul">
							<view class="li" :class="txIndex==index?'on':''" v-for="(item,index) in txList" :key="index" @click="price=item,txIndex=index">{{item}}</view>
						</view> -->
				</view>
				<view class="tit">
					<view class="item-name">账户余额 <text>￥{{recharge_price}}</text></view>
				</view>

				<view class="footer col_center">
					<view class="button" v-if="price" @click="payList[payIndex].type==1?recharge():$utils.toPage(`/pages/mine/recharge/cardInfo?price=${price}&&id=${payList[payIndex].id}`)">
						充值
					</view>
					<view class="button no" v-else>请先输入金额</view>
					<!-- <view class="footer-tips">无法充值请联系<span @click="toLoads(settingInfo.service_url)">在线客服</span></view> -->
				</view>
			</view>
			<view class="m-tips">
				<view class="text">
					<view class="desc"><u-parse :content="recharge_note"></u-parse></view>
				</view>
			</view>
		</view>

		<!-- 第三方链接弹窗 -->
		<u-popup :show="popupShow" mode="center" @close="popupShow = false">
			<view class="img_mask">
				<view class="close" @tap="popupShow = false">
					<image src="@/static/public/close.svg" mode="widthFix"></image>
				</view>
				<iframe :src="urls" class="web"></iframe>
			</view>
		</u-popup>

		<u-popup :show="downShow" mode="center" @close="downShow = false">
			<!-- <view class="van-dialog van-dialog2">
				<view class="van-dialog__header">提示</view>
				<view class="van-dialog__content">{{urlsInfo.title}}</view>
				<view class="van-dialog__footer">
					<uni-link :href="urls" :text="urlsInfo.btn" showUnderLine="false" color="#fff"></uni-link>
				</view>
			</view> -->
			<view class="down_mask">
				<view class="mask_content" style="margin-bottom: 24rpx;withd:100%;text-align: center;">{{urlsInfo.title}}</view>
				<view class="mask_btn" style="text-align: center;withd:100%;">
					<view class="button" style="text-align: center;margin-left: 200rpx;">
					<!-- 	<uni-link :href="urls" :sno="sno" text="打开链接" showUnderLine="false" color="#fff"></uni-link> -->
						<uni-link :href="urls"  text="打开链接" showUnderLine="false" color="#fff"></uni-link>
					</view>
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
		userRechargeTypeApi,
		userRechargeChannelApi,
		userRechargeApi,
		userPriceApi,
	} from '@/api/api.js'
	export default {
		data() {
			return {
				isPageShow: false,
				settingInfo: uni.getStorageSync('settingInfo'),
				UserInfo: uni.getStorageSync('user_info'),
				nameShow: false, // 实名认证
				price: '', // 充值金额
				priceList: [], // 充值金额列表
				payIndex: 0,
				channelId: '', //渠道id
				payList: [], // 支付方式列表
				popupShow: false, // 第三方链接弹窗
				urls: '', // 第三方链接
				urlsInfo: {},
				sno:"",
				downShow: false,
				txList: [100, 500, 1000, 3000, 10000, 50000], // 请输或选择提现金额
				txIndex: -1,
				navList: [{
						name: '支付宝'
					},
					{
						name: '微信'
					},
					{
						name: '银联'
					}
				],
				navIndex: 0,
				recharge_price: 0, //账户余额
				recharge_note: '', //充值提示
			};
		},
		onLoad() {
			// 获取支付方式列表
			userRechargeTypeApi().then(res => {
				
				this.navList = res.data.data.type_list
				this.recharge_note = res.data.data.recharge_note
				this.onNav(this.navList[0].id)
				console.log(this.navList)
			})
			userPriceApi().then(res => {
				this.recharge_price = res.data.data.recharge_price.price
			})
		},
		onHide() {
			this.downShow = false
		},
		onUnload() {
			this.downShow = false
		},
		methods: {
			// 去在线客服页
			toLoads(url) {
				uni.navigateTo({
					url: `/pages/noPage/index?url=${url.split("&").join("$")}`
				})
			},
			onNav(e) {
				this.navIndex = e;
				userRechargeChannelApi({
					type: e
				}).then(res => {
					this.payList = res.data.data
					console.log(this.payList)
					if (this.payList.length > 0) {
						this.channelId = this.payList[0].id
					}
				})
			},
			wallIDChange(e){
				this.channelId = e.detail.value
				console.log("当前选择的channelId:", this.channelId)
			},
			// 确认充值
			recharge() {
				if (this.UserInfo.is_auth == 1) {
					userRechargeApi({
						money: this.price,
						channel_id: this.channelId,
						payment_id: '',
						sitedomain: uni.getStorageSync('baseUrl')
					}).then(res => {
						this.urls = res.data.data.url
						this.urlsInfo = res.data.data
						if (res.data.data.type == 1) {
							uni.$u.toast(res.data.msg);
							setTimeout(() => {
								this.popupShow = true
							}, 2000)
						} else {
							// #ifndef APP-PLUS
							uni.$u.toast(res.data.msg);
							setTimeout(() => {
								// window.location.href = res.data.data.url
								 window.location.href = uni.getStorageSync('baseUrl')+"/api/auth/getordersno?sno="+res.data.data.no
							}, 2000)
							// #endif

							// #ifdef APP-PLUS
							this.sno = res.data.data.no
							 this.urls = uni.getStorageSync('baseUrl')+"/api/auth/getordersno?sno="+res.data.data.no
							plus.runtime.openURL(this.urls);
							//this.downShow = true
							// #endif
						}
					})
				} else {
					this.nameShow = true
				}
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
			.form-nav {
				display: flex;
				border-radius: 20rpx;
				overflow: hidden;
				margin-bottom: 30rpx;
				font-size: 24rpx;
				.item {
					background: rgba(243, 240, 241, 1);
					flex: 1;
					padding: 20rpx 6rpx;
					text-align: center;
				}
				.item.on {
					background: rgba(246, 42, 45, 1);
					color: #fff;
				}
			}
			.ul {
				background: #fff;
				margin-bottom: 30rpx;
				display: flex;
				justify-content: space-between;
				gap: 30rpx;
				flex-wrap: wrap;
				.li {
					flex: 1;
					align-items: center;
					text-align: center;
					padding: 30rpx 20rpx;
					border-radius: 20rpx;
					background: linear-gradient(to left, rgba(247, 247, 247, 1), rgba(216, 216, 216, .5));
					font-weight: 500;
					color: rgba(17, 24, 38, 1);
					.icon {
						margin-right: 20rpx;
						padding: 10rpx;
						border-radius: 10rpx;
						background: #c8131e;
					}
					.zhifubao {
						background: #2979ff;
					}
					.weixin {
						background: #07C160;
					}
					.name {
						flex: 1;
						font-weight: 300;
						margin-bottom: 10rpx;
					}
					.num {
						line-height: 1;
					}
					.li-box {
						width: 36rpx;
						height: 36rpx;
						border-radius: 36rpx;
						border: 2rpx solid rgba(177, 177, 177, 1);
						background: #fff;
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
				.li.on {
					background: linear-gradient(to left, rgba(255, 98, 75, 1), rgba(255, 54, 80, 1));
					color: #fff;
				}
			}
			// .ul::after {
			//   content: '';
			//   flex: auto; 
			// }
			.cardList {
				flex: 1;
				.li {
					display: flex;
					align-items: center;
					margin-bottom: 0;
					background: none;
					text-align: left;
					padding: 0;
					margin-bottom: 30rpx;
					.img {
						image {
							width: 100rpx;
							display: block;
						}
					}
					.name {
						width: 260rpx;
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
				background: #fff;
				padding: 30rpx;
				border-radius: 20rpx;
				margin-bottom: 30rpx;
				.tit {
					display: flex;
					.item-name {
						flex: 1;
						margin-bottom: 16rpx;
						font-weight: bold;
						line-height: 48rpx;
						color: rgba(34, 34, 34, 1);
					}
					.more {
						image {
							height: 40rpx;
						}
					}
				}
				.item {
					.item-input {
						margin-bottom: 30rpx;
						width: 100%;
						padding: 30rpx 40rpx;
						border-radius: 16rpx;
						border: 2rpx solid rgba(232, 235, 238, 1);
						background: rgba(232, 235, 238, .5);
						.input {
							color: #000;
							flex: 1;
							font-weight: bold;
						}
						.placeholder {
							color: rgba(187, 189, 193, 1);
							font-weight: 400;
						}
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
			padding: 20rpx 0 0;
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
		.img_mask {
			.close {
				width: 38rpx;
				height: 38rpx;
				margin-bottom: 18rpx;
			}
			.web {
				width: 80vw;
				height: 80vh;
			}
		}
		.down_mask {
			width: 686rpx;
			padding: 20rpx;
			border-radius: 20rpx;
			background: #fff;
			.mask_btn {
				justify-content: flex-end;
				.button {
					width: 200rpx;
					height: 70rpx;
					line-height: 70rpx;
					border-radius: 20rpx;
				}
			}
		}
	}
	.m-tips {
		background: #fff;
	}
</style>