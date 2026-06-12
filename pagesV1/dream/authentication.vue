<template>
	<view class="container">
		<headerView>{{info.name}}</headerView>
		<view class="content">
			<view class="title">
				<image class="img" :src="info.c_image"></image>
			</view>
			<view class="card">
				<view class="pay_info">
					<view class="pay_price">
						<view class="price">{{info.price}}</view>
						<view class="name">支付金额</view>
					</view>
					<view class="info_item flex_between">
						<view class="name">{{info.price_str}}</view>
						<view class="price">¥ {{info.recharge_price}}</view>
					</view>
					<view class="input_box">
						<view class="input_title">请输入支付密码</view>
						<view class="item-input flex_between">
							<input type="password" v-if="pwdShow" v-model="password" class="input" placeholder="请输入密码" placeholder-class="placeholder" />
							<input type="text" v-else v-model="password" class="input" placeholder="请输入密码" placeholder-class="placeholder" />
							<view @click="pwdShow=!pwdShow">
								<image src="@/static/public/eye-off.svg" mode="widthFix" v-if="pwdShow"></image>
								<image src="@/static/public/eye.svg" mode="widthFix" v-else></image>
							</view>
						</view>
					</view>
					<view class="info_item" v-if="!!info.dikou">
						<view class="price" style="color: rgba(250, 60, 49, 1);">{{info.dikou}}</view>
					</view>
					<view class="info_item flex_between" v-if="info.invite_num > 0">
						<view class="tips">达到邀请人数免费领取</view>
					</view>
				</view>
				<view class="income_info" v-if="shouyi.length != 0">
					<view class="income_title">预计收益</view>
					<view class="income_list">
						<view class="item" v-for="(item, index) in shouyi" :key="index">
							<image src="@/static/img/money.svg" mode="widthFix" v-if="index%2 == 1"></image>
							<image src="@/static/img/icon.svg" mode="widthFix" v-else></image>
							<view class="name">{{item.day_str}}</view>
							<view class="price">{{item.shouyi_str}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="footer col_center">
			<view class="button" @tap="buyAdd">购买</view>
			<view class="footer-tips">无法转账请请联系<span @click="toLoads(settingInfo.service.service_url)">在线客服</span></view>
		</view>
		<u-popup :show="show" mode="center" @close="show=false">
			<view class="mask">
				<view class="close" @click="show=false">
					<image class="img" src="../../static/image/dream/x.svg"></image>
				</view>
				<view class="status">
					<view class="status_img">
						<image v-if="showTips==1" class="img" src="@/static/image/dream/success.svg"></image>
						<image v-else class="img" src="@/static/image/dream/fail.svg"></image>
					</view>
					<view class="status_txt">{{showTips==1?'购买成功':tips}}</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import { productDetailAPI, addAPI, getSettingApi } from '@/api/api.js'
	export default {
		data() {
			return {
				settingInfo: uni.getStorageSync('settingInfo'),
				info: {},
				shouyi: [],
				pwdShow: true,
				password: "",
				show: false,
				showTips: 0,
				tips: ''
			};
		},
		onLoad(opt) {
			productDetailAPI({
				id: opt.id
			}).then(res=>{
				this.info = res.data.data
				this.shouyi = res.data.data.shouyi
			})
			
			// 获取配置
			getSettingApi().then(res => {
				uni.setStorageSync('settingInfo', res.data.data)
				this.settingInfo = res.data.data
			})
		},
		methods: {
			// 去在线客服页
			toLoads(url) {
				uni.navigateTo({
					url: `/pages/noPage/index?url=${url.split("&").join("$")}`
				})
			},
			buyAdd() {
				this.$utils.throttle(() => {
					addAPI({
						id: this.info.id,
						price: this.info.price,
						security_password: this.password
					}).then(res => {
						this.show = true
						this.showTips = 1
					}).catch(err => {
						if(err.data.code == -99){
							this.show = true
							this.showTips = 0
							this.tips = err.data.msg
						}
					})
				}, 5000)()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		background: url("/static/mine/recharge_bg.svg") no-repeat center top / 100%;
		background-color: rgba(255, 255, 255, 1);

		.content {
			width: 750rpx;
			background-color: rgba(255, 255, 255, 1);

			.title {
				width: 750rpx;
				height: 358rpx;

				.img {
					width: 100%;
					height: 100%;
				}
			}

			.card {
				margin-top: 20rpx;
				width: 750rpx;
				padding: 32rpx;
				
				.pay_info {
					.pay_price {
						.name {
							font-family: Roboto;
							font-size: 28rpx;
							font-weight: 400;
							line-height: 48rpx;
							text-align: center;
							color: rgba(0, 0, 0, 0.5);
						}

						.price {
							font-family: Roboto;
							font-size: 38rpx;
							font-weight: 700;
							line-height: 48rpx;
							text-align: center;
							color: rgba(250, 60, 49, 1);
						}
					}

					.info_item {
						margin-top: 20rpx;
						font-family: Roboto;
						font-size: 28rpx;
						font-weight: 400;
						line-height: 48rpx;
						letter-spacing: 0.20000000298023224px;
						color: #222222;
						
						.tips{
							height: 48rpx;
							padding: 0px 20rpx;
							border-radius: 120rpx;
							background: rgba(243, 62, 49, 0.1);
							border: 1px solid rgba(243, 62, 49, 0.5);
							font-family: Roboto;
							font-size: 24rpx;
							font-weight: 400;
							line-height: 48rpx;
							color: rgba(243, 62, 49, 1);
						}
					}

					.input_box {
						.input_title {
							font-family: Roboto;
							font-size: 28rpx;
							font-weight: 400;
							line-height: 48rpx;
							letter-spacing: 0.20000000298023224px;
							color: #222222;
							margin: 28rpx 0 12rpx;
						}

						.item-input {
							width: 100%;
							height: 100rpx;
							padding: 26rpx 32rpx;
							border-radius: 16rpx;
							border: 1px solid #CED5DA;
							background: #fff;

							.input {
								color: #6f7374;
								flex: 1;
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

				.income_info {
					
					.income_title {
						font-family: Roboto;
						font-size: 28rpx;
						font-weight: 500;
						line-height: 68rpx;
						color: #222222;
						margin: 16rpx 0;
					}

					.income_list {
						display: grid;
						grid-template-columns: 1fr 1fr;
						gap: 32rpx 20rpx;

						.item {
							width: 335rpx;
							height: 152rpx;
							padding: 28rpx 32rpx;
							border-radius: 20rpx;
							background: rgba(255, 146, 81, 1);
							box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.05);
							position: relative;

							.price {
								font-family: Roboto;
								font-size: 40rpx;
								font-weight: 500;
								line-height: 48rpx;
								color: #FFFFFF;
							}

							.name {
								font-family: Roboto;
								font-size: var(--font-14);
								font-weight: 500;
								line-height: 48rpx;
								color: #FFFFFF;
							}
							
							image {
								width: 112rpx;
								height: 112rpx;
								transform: scaleX(-1);
								position: absolute;
								top: -36rpx;
								right: -24rpx;
							}
						}
						
						.item:nth-child(2n){
							background: rgba(255, 100, 98, 1);

							image {
								width: 98rpx;
								height: 108rpx;
								transform: scaleX(1);
								position: absolute;
								top: -30rpx;
								right: -14rpx;
							}
						}
					}
				}
			}

		}

		.footer {
			width: 750rpx;
			padding: 20rpx 32rpx;
			box-shadow: 0px -8rpx 100rpx 0px rgba(100, 116, 139, 0.08);
			background-color: rgba(255, 255, 255, 1);

			.button {
				width: 670rpx;
			}
			
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

		.mask {
			position: relative;
			width: 500rpx;
			height: 320rpx;
			border-radius: 24rpx;
			background: #fff;

			.close {
				position: absolute;
				top: 20rpx;
				right: 24rpx;
				width: 40rpx;
				height: 40rpx;

			}

			.status {
				.status_img {
					margin: 24rpx auto 24rpx;
					width: 168rpx;
					height: 168rpx;

					.img {
						width: 100%;
						height: 100%;
					}
				}

				.status_txt {
					font-family: Roboto;
					font-size: var(--font-18);
					font-weight: 600;
					line-height: 56rpx;
					text-align: center;
					color: #1B1C1E;
				}
			}
		}
	}
</style>