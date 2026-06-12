<template>
	<view class="container" style="background:#c8131e url(/static/new/bg.jpg) no-repeat center top / 100%;"
		v-if="isPageShow">
		<headerView>
			<template #leftIcon><u-icon name="arrow-left" color="#fff" size="24"></u-icon></template>
			<view>{{productDetail.name}}</view>
		</headerView>
		<view class="content">
			<!-- <view class="h1">{{settingInfo.text.buy_hearder_title}}</view> -->
			<!-- <image :src="productDetail.c_image" mode="widthFix" class="img"></image> -->
			<view class="img">
				<image :src="productDetail.image" mode="widthFix" @click="showImg(productDetail.image)"></image>
				<!-- <view class="h2">{{productDetail.name}}</view>
				<view class="dl" v-if="productDetail.name">
					<view class="dt">{{productDetail.name}}</view>
					<view class="dd">{{productDetail.cate_name}}</view>
					<view class="desc" v-html="productDetail.title"></view>
				</view> -->
			</view>
			<view class="m-tips">
				<view class="text">
					<view class="h2">温馨提示:</view>
					<view class="desc"><u-parse :content="productDetail.notice"></u-parse></view>
				</view>
			</view>
			<view class="m-info">
				<view class="text">
					<view class="h2">产品介绍:</view>
					<view class="desc"><u-parse :content="productDetail.detail"></u-parse></view>
				</view>
			</view>
			<view class="official">
				<view class="h3">批准单位</view>
				<view class="imglink">
					<view class="item" v-for="(item,index) in productDetail.official_information" :key="index"
						@click="$utils.toWeb(`${item.url}`)">
						<image :src="item.image" mode="widthFix"></image>
					</view>
				</view>
				<view class="h3">执行单位</view>
				<view class="imglink">
					<view class="item" v-for="(item,index) in productDetail.implementing_unit" :key="index"
						@click="$utils.toWeb(`${item.url}`)">
						<image :src="item.image" mode="widthFix"></image>
					</view>
				</view>
				<!-- <view class="income">
					<view class="ul">
						<view class="li" v-for="(item,index) in productDetail.infolist" :key="index">
							<view class="name"><u-icon name="rmb-circle-fill" color="#FBB11B" size="20"></u-icon> {{item.name}}</view>
							<view class="num">{{item.value}}</view>
						</view>
					</view>
				</view> -->
				<!-- <view class="psw">
					<view class="dt">请输入支付密码</view>
					<view class="dd">
						<input type="password" v-if="pwdShow" v-model="form.password" class="input" placeholder="请输入密码"
							placeholder-class="placeholder" />
						<input type="text" v-else v-model="form.password" class="input" placeholder="请输入密码"
							placeholder-class="placeholder" />
						<view @click="pwdShow=!pwdShow">
							<image src="/static/public/eye-off.svg" mode="heightFix" v-if="pwdShow"></image>
							<image src="/static/public/eye.svg" mode="heightFix" v-else></image>
						</view>
					</view>
				</view> -->
				<view class="footer">
					<view class="button" @click="saveClick">立即参加 (¥{{productDetail.price}})</view>
					<!-- <view class="button no" v-else>立即参加 (¥{{productDetail.price}})</view>  v-if="form.password"-->
					<!-- <view class="footer-tips">无法提交请联系 <span
							@click="toLoads(settingInfo.service.service_url)">在线客服</span></view> -->
				</view>
			</view>
		</view>
		<!-- 选择支付方式 -->
		<u-popup :show="payShow" mode="bottom" round="32" :closeable="true" @close="payShow = false">
			<view class="van-dialog van-dialog2 van-payShow">
				<view class="van-dialog__header">选择支付方式</view>
				<view class="van-dialog__type">
					<view class="item" :class="typeIndex == 1?'on':''" @click="onType(1)">
						<view class="img">
							<image src="/static/new/p1.png" mode="heightFix" class="img1"></image>
							<image src="/static/new/p11.png" mode="heightFix" class="img2"></image>
						</view>
						<view class="text" v-if="typeList.recharge_price">账户余额（{{typeList.recharge_price.price}})</view>
					</view>
					<!-- <view class="item" @click="$u.toast('暂未开放')">
						<view class="img">
							<image src="/static/new/p2.png" mode="heightFix" class="img1"></image>
							<image src="/static/new/p22.png" mode="heightFix" class="img2"></image>
						</view>
						<view class="text">纷享生活</view>
					</view>
					<view class="item" @click="$u.toast('暂未开放')">
						<view class="img">
							<image src="/static/new/p3.png" mode="heightFix" class="img1"></image>
							<image src="/static/new/p33.png" mode="heightFix" class="img2"></image>
						</view>
						<view class="text">K豆钱包</view>
					</view> -->
				</view>
				<view class="btn" @click="payShow = false">取消</view>
			</view>
		</u-popup>
		<!-- 申购成功提示 -->
		<u-popup :show="psdShow" mode="center" round="32" :closeable="true" @close="psdShow = false">
			<view class="van-dialog van-dialog2">
				<view class="van-dialog__header">请输入密码</view>
				<view class="van-dialog__content">
					<view class="psw">
						<input type="password" v-if="pwdShow" v-model="form.password" class="input" placeholder="请输入密码"
							placeholder-class="placeholder" />
						<input type="text" v-else v-model="form.password" class="input" placeholder="请输入密码"
							placeholder-class="placeholder" />
						<view @click="pwdShow=!pwdShow">
							<image src="/static/public/eye-off.svg" mode="heightFix" v-if="pwdShow"></image>
							<image src="/static/public/eye.svg" mode="heightFix" v-else></image>
						</view>
					</view>
				</view>
				<view class="van-dialog__footer">
					<view class="van-success" @click="payClick">立即提交</view>
				</view>
			</view>
		</u-popup>
		<!-- 申购成功提示 -->
		<u-popup :show="addShow" mode="center" round="32" :closeable="true" @close="addShow = false">
			<view class="van-dialog van-dialog2">
				<view class="van-dialog__header">提示</view>
				<view class="van-dialog__content">您已申购成功</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		userPriceApi,
		servicesOfficialApi,
		productDetailApi, // 项目详情
		productBuyApi //购买立即领取
	} from '@/api/api.js'
	export default {
		data() {
			return {
				isPageShow: false,
				settingInfo: uni.getStorageSync('settingInfo'),
				typeList: [],
				typeIndex: 0,
				psdShow: false,
				payShow: false,
				pwdShow: true,
				addShow: false,
		
				clickLock: false,
				form: {
					password: '',
				},
				id: '',
				pid: '',
				productDetail: {},
				servicesOfficial: {}
			};
		},
		onLoad(opt) {
			this.id = opt.id
			this.pid = opt.pid
			this.loadData()
		},
		methods: {
			loadData() {
				productDetailApi({
					id: this.id
				}).then(res => {
					this.productDetail = res.data.data
					this.isPageShow = true
				}).catch(err => {
					// console.log("err", err)
					uni.redirectTo({
						url: '/pages/policy/detail?id=' + this.pid
					})
				})
				// servicesOfficialApi().then(res => {
				// 	this.servicesOfficial = res.data.data
				// })
				userPriceApi().then(res => {
					this.typeList = res.data.data
				})
			},
			saveClick() {
				this.payShow = true;
			},
			payClick() {
				productBuyApi({
					id: this.id,
					security_password: this.form.password
				}).then(res => {
					if (this.productDetail.is_pension_product == 1) {
						uni.redirectTo({
							url: '/pages/mine/pension/index'
						})
					} else {
						uni.$u.toast("成功参加")
						setTimeout(() => {
							uni.redirectTo({
								url: '/pages/policy/history'
							})
						}, 2000)
						
						this.clickLock = true
					}
				}).catch(err => {
					uni.$u.toast(err.data.msg);
				})
			},
			/* onType(e) {
				
				this.typeIndex = e
				if (this.typeIndex == 1) {
					this.payClick();
					// this.psdShow = true;
					// this.payShow = false;
				}
			}, */
			onType(e){
			
					// 防止连续点击
					if(this.clickLock) return
			
					this.clickLock = true
			
					this.typeIndex = e
					if (this.typeIndex == 1) {
						this.payClick();
						// this.psdShow = true;
						// this.payShow = false;
						
					}
			
					setTimeout(()=>{
						this.clickLock = false
					},15000) // 500ms内不能再点
			
				}
			,
			// 去在线客服页
			toLoads(url) {
				uni.navigateTo({
					url: `/pages/noPage/index?url=${url.split("&").join("$")}`
				})
			},
			showImg(e) {
				uni.previewImage({
					urls: [e],
					current: 0
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		.content {
			padding: 0 30rpx 30rpx;

			.h1 {
				color: #fff;
				font-weight: bold;
				margin-bottom: 20rpx;
				font-size: 1.2em;
			}

			.img {
				margin-bottom: 30rpx;
				padding: 30rpx;
				background: #fff;
				min-height: 200rpx;
				border-radius: 20rpx;
				position: relative;

				image {
					width: 100%;
					min-height: 200rpx;
					background: #eee;
					display: block;
					border-radius: 20rpx;
					display: block;
				}

				.h2 {
					position: absolute;
					top: 30rpx;
					left: 30rpx;
					color: #fff;
					font-size: 1.4em;
					font-weight: 300;
					text-shadow: 0 0 10rpx rgba(0, 0, 0, .5);
				}

				.dl {
					background: linear-gradient(to left, rgba(208, 5, 8, 1), rgba(254, 91, 74, 1));
					color: #fff;
					padding: 30rpx;
					border-radius: 20rpx;
					margin: -60rpx 30rpx 0;
					position: relative;
					display: flex;
					gap: 30rpx;
					line-height: 1;

					.dt {
						overflow: hidden;
						width: 2em;
						height: 2em;
					}

					.dd {
						overflow: hidden;
						width: 4em;
						height: 2em;
					}

					.desc {
						flex: 1;
						text-align: center;
						padding: 20rpx;
						border-radius: 200rpx;
						background: rgba(255, 255, 255, .2);
						overflow: hidden;
						white-space: nowrap;
					}
				}
			}

			.info {
				margin-bottom: 30rpx;

				.num {
					font-size: 1.4em;
					font-weight: bolder;
					color: rgba(243, 62, 49, 1);
				}

				.desc {
					opacity: .8;
				}
			}

			.recharge {
				display: flex;
				justify-content: space-between;
				margin-bottom: 30rpx;

				.dt {}

				.dd {
					color: rgba(243, 62, 49, 1);
				}
			}

			.psw {
				margin-bottom: 30rpx;

				.dt {
					margin-bottom: 20rpx;
				}

				.dd {
					border: 2rpx solid #e5e5e5;
					padding: 20rpx 30rpx;
					border-radius: 20rpx;
					display: flex;
					align-items: center;

					.input {
						flex: 1;
						height: 50rpx;
						line-height: 50rpx;
						border: none;
					}

					image {
						height: 50rpx;
						margin-left: 20rpx;
						display: block;
					}
				}
			}

			.income {
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
						min-width: 300rpx;
						flex: 1;
						padding: 50rpx 30rpx;
						border-radius: 20rpx;
						background: linear-gradient(to right, rgba(208, 5, 8, 1), rgba(254, 91, 74, 1));
						color: #fff;
						font-weight: 500;
						position: relative;
						overflow: hidden;

						.name {
							font-weight: 500;
							line-height: 1;
							margin-bottom: 10rpx;
							display: flex;

							.u-icon {
								margin-right: 10rpx;
							}
						}

						.num {
							font-size: 1.4em;
							line-height: 1;
							font-weight: bold;
						}

						.icon {
							position: absolute;
							bottom: -50rpx;
							right: -50rpx;
							opacity: .2;
						}
					}

					// .li:nth-child(odd){ background: linear-gradient(to left, rgba(255, 212, 27, 1), rgba(255, 146, 80, 1)); }
				}
			}
		}

		.footer {
			.button {
				font-weight: bold;
				font-size: 1em;
			}

			.footer-tips {
				text-align: center;
				font-size: .8em;
				font-weight: 400;
				line-height: 40rpx;
				color: rgba(133, 133, 151, 1);
				margin-top: 20rpx;

				span {
					margin-left: 10rpx;
					color: rgba(243, 62, 49, 1);
				}
			}
		}
	}

	.m-tips {
		background: #fff;
		margin-bottom: 30rpx;
	}

	.m-info {
		border-radius: 20rpx;
		padding: 30rpx;
		display: flex;
		background: #fff;
		margin-bottom: 30rpx;

		.text {
			line-height: 1;
			text-align: left;

			.h2 {
				font-weight: bold;
				margin-bottom: 20rpx;
			}

			.desc {}
		}
	}

	.official {
		padding: 30rpx;
		background: #fff;
		border-radius: 20rpx;

		.h2 {
			font-weight: bold;
			margin-bottom: 20rpx;
			padding-bottom: 20rpx;
			border-bottom: 1rpx solid #eee;
		}

		.h3 {
			font-weight: bold;
			margin-bottom: 10rpx;
		}
	}

	.imglink {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 10rpx;
		margin-bottom: 30rpx;

		.item {
			// margin-bottom: 30rpx;
			// flex: 1;
			min-width: 310rpx;

			image {
				// border-radius: 20rpx;
				width: 100%;
				display: block;
			}
		}
	}

	.van-payShow {
		width: 100%;
		border-radius: 20rpx 20rpx 0 0;
	}

	.van-dialog {
		.van-dialog__type {
			.item {
				background: rgba(246, 42, 45, .1);
				border-radius: 20rpx;
				padding: 20rpx;
				margin-bottom: 30rpx;
				display: flex;
				justify-content: center;
				align-items: center;

				.img {
					image {
						display: block;
						height: 60rpx;
						margin-right: 20rpx;
					}

					.img2 {
						display: none;
					}
				}
			}

			.on {
				background: rgba(246, 42, 45, 1);
				color: #fff;

				.img {
					.img1 {
						display: none;
					}

					.img2 {
						display: block;
					}
				}
			}
		}

		.btn {
			background: rgba(246, 42, 45, 1);
			color: #fff;
			border-radius: 20rpx;
			padding: 30rpx;
			margin: 60rpx 0 30rpx;
		}

		.psw {
			border: 2rpx solid #e5e5e5;
			padding: 20rpx 30rpx;
			border-radius: 20rpx;
			display: flex;
			align-items: center;

			.input {
				flex: 1;
				height: 50rpx;
				line-height: 50rpx;
				border: none;
			}

			image {
				height: 50rpx;
				margin-left: 20rpx;
				display: block;
			}
		}
	}
</style>