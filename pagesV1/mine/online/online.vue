<template>
	<view class="container">
		<view class="content">
			<view class="form">
				<view class="item" style="margin-top: 0;">
					<view class="item-name">要捐款的类目</view>
					<view class="item-input flex_between" @click="navShow = !navShow">
						<input type="text" v-model="cateActive.name" class="input" placeholder="请选择项目名称"
							placeholder-class="placeholder" />
					</view>
				</view>
				<view class="item">
					<view class="item-name">捐款人</view>
					<view class="item-input flex_between">
						<input type="text" v-model="form.realname" class="input" placeholder="请输入捐款人姓名"
							placeholder-class="placeholder" @blur="containsChinese" />
					</view>
				</view>
				<view class="item">
					<view class="item-name">手机号</view>
					<view class="item-input flex_between">
						<input type="number" v-model="form.phone" class="input" placeholder="请输入捐款人手机号" maxlength="11"
							placeholder-class="placeholder" />
					</view>
				</view>
				<view class="item">
					<view class="item-name">金额</view>
					<view class="item-input flex_between">
						<input type="number" v-model="form.price" class="input" placeholder="请输入金额"
							placeholder-class="placeholder" />
					</view>
					<view class="item-list flex">
						<view :class="form.price==item.id?'active':''" v-for="item in priceList"
							@click="priceClick(item)">{{item.id}}</view>
					</view>
					<!-- <view class="rule_title">{{priceActive.name}}</view> -->
				</view>
				<view class="item">
					<view class="item-name">支付密码</view>
					<view class="item-input flex_between">
						<input type="password" v-if="pwdShow" v-model="form.security_password" class="input"
							placeholder="请输入支付密码" placeholder-class="placeholder" />
						<input type="text" v-else v-model="form.security_password" class="input" placeholder="请输入支付密码"
							placeholder-class="placeholder" />
						<view @click="pwdShow=!pwdShow">
							<image src="@/static/public/eye-off.svg" mode="widthFix" v-if="pwdShow"></image>
							<image src="@/static/public/eye.svg" mode="widthFix" v-else></image>
						</view>
					</view>
				</view>
				<view class="ul">
					<view class="title">是否匿名</view>
					<view class="flex">
						<view class="li flex_between" @click="form.niming=1">
							<view>是</view>
							<view class="flex_center">
								<view class="li-box flex_center" :class="form.niming==1?'active':''">
									<view></view>
								</view>
							</view>
						</view>
						<view class="li flex_between" @click="form.niming=2">
							<view>否</view>
							<view class="flex_center">
								<view class="li-box flex_center" :class="form.niming==2?'active':''">
									<view></view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="rule">
					<view class="rule_header flex" @click="isAgree=!isAgree">
						<view class="rule_check" :class="isAgree?'active':''">
							<uni-icons type="checkmarkempty" color="#fff" size="14"></uni-icons>
						</view>
						<text>我已阅读并同意协议内容</text>
					</view>
					<view class="rule_content">
						<view class="rule_title">捐赠规则</view>
						<view class="rule_detail" v-html="settingInfo.juankuan_rule"></view>
					</view>
				</view>
			</view>
		</view>
		<view class="footer col_center">
			<view class="button" @click="recharge()">捐款</view>
		</view>

		<u-popup :show="show" mode="center" @close="show=false">
			<view class="mask">
				<view class="close" @tap="show=false">
					<image class="img" src="@/static/image/dream/x.svg"></image>
				</view>
				<view class="status">
					<view class="status_img">
						<image v-if="tips.code==1" class="img" src="@/static/image/dream/success.svg"></image>
						<image v-else class="img" src="@/static/image/dream/fail.svg"></image>
					</view>
					<view class="status_txt">{{tips.title}}</view>
					<view class="status_detail">{{tips.text}}</view>
				</view>
			</view>
		</u-popup>

		<!-- 添加导航 -->
		<u-popup :show="navShow" mode="bottom" @close="navShow=false">
			<view class="van-dialog col_center">
				<view class="van-dialog__header"></view>
				<view class="van-dialog__item" v-for="item in cateList" :key="item.id" @click="cateClick(item)">
					{{item.name}}
				</view>
			</view>
		</u-popup>

		<!-- 提示 -->
		<u-popup :show="isNewShow" mode="center" round="32">
			<view class="van-dialog-new">
				<view class="van-dialog__header" style="color: rgba(241, 55, 36, 1);">温馨提示</view>
				<view class="van-dialog__content">{{isNewTips}}</view>
				<view class="van-dialog__footer">
					<view class="button" @click="$utils.toPage('/pages/mine/mine')">确定</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		getSettingApi,
		juankuanCateListAPI,
		juankuanAddAPI
	} from '@/api/api.js'
	export default {
		data() {
			return {
				settingInfo: uni.getStorageSync('settingInfo'),

				navShow: false,
				cateList: [],
				cateActive: {},

				priceActive: {},
				priceList: [], // 充值金额列表;
				form: {
					realname: '',
					phone: '',
					niming: 1,
					security_password: '',
					price: ''
				},
				pwdShow: true,

				show: false,
				tips: {
					code: 0,
					title: '',
					text: ''
				},
				isAgree: false,

				isNewShow: false,
				isNewTips: ''
			}
		},
		onLoad() {
			// 获取配置
			getSettingApi().then(res => {
				uni.setStorageSync('settingInfo', res.data.data)
				this.settingInfo = res.data.data
				this.priceList = res.data.data.juankuan_config
				this.priceActive = this.priceList[0]
				this.form.price = this.priceList[0].id
			})

			// 捐款类目
			juankuanCateListAPI().then(res => {
				this.cateList = res.data.data

			}).catch(err => {
				console.log(err.data.code);
				if (err.data.code == -8) {
					this.isNewShow = true
					this.isNewTips = err.data.msg
				}
			})
		},
		methods: {
			// 验证中文
			containsChinese(str) {
				if (!this.$utils.containsChinese(str)) {
					this.form.realname = ''
					uni.$u.toast('请输入正确姓名');
				}
			},
			priceClick(item) {
				this.form.price = item.id
				this.priceActive = item
			},
			// 确认充值
			recharge() {
				if (!this.isAgree) {
					return uni.$u.toast('请先同意中国社会福利');
				}

				if (!this.cateActive.id) {
					return uni.$u.toast('请先选择类目');
				}

				if (!this.form.realname) {
					return uni.$u.toast('请输入捐款人姓名');
				}
				if (!this.form.phone) {
					return uni.$u.toast('请输入捐款人手机号');
				}
				if (!this.form.security_password) {
					return uni.$u.toast('请输入支付密码');
				}

				this.$utils.throttle(() => {
					juankuanAddAPI({
						...this.form,
						cate_id: this.cateActive.id
					}).then(res => {
						if (res.data.data.with_state == 1) {
							this.isNewShow = true
							this.isNewTips = res.data.data.tips2
						} else {
							this.tips.code = 1
							this.tips.title = res.data.msg
							this.tips.text = res.data.data.tips2
							this.show = true
						}
					}).catch(err => {
						this.tips.code = 2
						this.tips.title = err.data.msg
						this.tips.text = err.data.data.tips2
						this.show = true
					})
				}, 2000)()
			},
			cateClick(item) {
				this.navShow = false
				this.cateActive = item
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		.content { padding: 30rpx; margin: 30rpx 0;
			background-color: rgba(255, 255, 255, 1);

			.ul {
				.title {
					font-family: Roboto;
					font-size: var(--font-14);
					font-weight: 400;
					line-height: 48rpx;
					color: rgba(34, 34, 34, 1);
				}

				.li {
					height: 64rpx;
					margin: 16rpx 0 0;
					padding-right: 32rpx;
					border-radius: 20rpx;
					background: rgba(255, 255, 255, 1);
					// box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.05);
					font-size: var(--font-14);
					font-weight: 500;
					color: rgba(17, 24, 38, 1);

					.li-box {
						width: 36rpx;
						height: 36rpx;
						border-radius: 36rpx;
						border: 2rpx solid rgba(177, 177, 177, 1);
						margin-left: 24rpx;
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
			}

			.form {
				.rule_title {
					font-family: Roboto;
					font-size: var(--font-14);
					font-weight: 500;
					line-height: 32rpx;
					color: rgba(250, 60, 49, 1);
					margin-bottom: 16rpx;
				}

				.item {
					margin-bottom: 20rpx;

					.item-name {
						margin-bottom: 16rpx;
						font-family: Roboto;
						font-size: var(--font-14);
						font-weight: 400;
						line-height: 48rpx;
						color: rgba(34, 34, 34, 1);
					}

					.item-input {
						width: 100%;
						height: 100rpx;
						padding: 26rpx 32rpx;
						border-radius: 16rpx;
						border: 2rpx solid rgba(232, 235, 238, 1);

						.input {
							color: rgba(111, 115, 116, 1);
							flex: 1;
							font-size: var(--font-14);
							font-weight: 500;
							line-height: 48rpx;
						}

						.placeholder {
							color: rgba(187, 189, 193, 1);
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

			.rule {
				margin-top: 28rpx;

				.rule_header {
					font-size: var(--font-14);
					font-weight: 400;
					line-height: 40rpx;
					color: #6F7374;

					.rule_check {
						width: 36rpx;
						height: 36rpx;
						box-sizing: border-box;
						border: 2rpx solid rgba(177, 177, 177, 1);
						border-radius: 8rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						margin-right: 20rpx;
					}

					.active {
						border: 2rpx solid rgba(243, 62, 49, 1);
						background: rgba(243, 62, 49, 1);
					}
				}

				.rule_content {
					margin-top: 20rpx;

					.rule_title {
						font-family: Roboto;
						font-size: var(--font-14);
						font-weight: 500;
						line-height: 32rpx;
						color: rgba(250, 60, 49, 1);
						margin-bottom: 16rpx;
					}

					.rule_detail {
						font-family: Roboto;
						font-size: var(--font-13);
						font-weight: 500;
						line-height: 52rpx;
						text-align: left;
						color: #BBBDC1;
					}
				}
			}
		}

		.footer {
			width: 750rpx;
			padding: 20rpx 32rpx;
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

		.mask {
			position: relative;
			width: 500rpx;
			border-radius: 24rpx;
			background: #fff;
			padding-bottom: 48rpx;

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

				.status_detail {
					font-family: Roboto;
					font-size: var(--font-14);
					font-weight: 400;
					line-height: 40rpx;
					text-align: center;
					color: #82868C;
					margin-top: 16rpx;
				}
			}
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

		.van-dialog-new {
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
				color: rgba(0, 186, 19, 1);
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