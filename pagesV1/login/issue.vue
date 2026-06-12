<template>
	<view class="container">
		<headerView>遇到问题</headerView>
		<view class="content">
			<view class="content_header flex">
				<view class="_title">{{settingInfo.login_title}}</view>
				<view class="_tip">{{settingInfo.login_content}}</view>
			</view>
			<view class="form">
				<view class="title">请填写以下信息</view>
				<view class="item">
					<view class="item-name">姓名</view>
					<view class="item-input flex_between">
						<input type="text" v-model="form.name" class="input" placeholder="请输入姓名"
							placeholder-class="placeholder" @blur="containsChinese" />
					</view>
				</view>
				<view class="item">
					<view class="item-name">电话</view>
					<view class="item-input flex_between">
						<input type="number" v-model="form.phone" class="input" placeholder="请输入电话"
							placeholder-class="placeholder" maxlength="11" />
					</view>
				</view>
				<view class="item">
					<view class="item-name">备注</view>
					<view class="item-input flex_between">
						<input type="text" v-model="form.content" class="input" placeholder="请输入"
							placeholder-class="placeholder" />
					</view>
				</view>
			</view>
			<view class="button" @click="submit">提交</view>
		</view>
		<view class="fixedBtn">
			<view class="btn" @click="toLoads(settingInfo.service.service_url)" style="margin-bottom: 24rpx;">
				<image class="img" src="@/static/image/login/tab1.svg"></image>
			</view>
			<view class="btn" @click="$utils.toPage('/pages/login/signal')">
				<image class="img" src="@/static/image/login/tab2.svg"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		feedBackAPI
	} from '@/api/api.js'
	export default {
		data() {
			return {
				settingInfo: uni.getStorageSync('settingInfo'),
				form: {
					name: '',
					phone: '',
					content: ''
				}
			};
		},
		methods: {
			// 提交问题
			submit() {
				if (!this.form.name) {
					return uni.$u.toast('请输入姓名');
				}
				if (!this.form.phone) {
					return uni.$u.toast('请输入您的手机号码');
				}
				this.$utils.throttle(() => {
					feedBackAPI(this.form).then(res => {
						uni.$u.toast('已提交');
					})
				}, 2000)()
			},
			// 验证中文
			containsChinese(str) {
				if (!this.$utils.containsChinese(str)) {
					this.form.name = ''
					uni.$u.toast('请输入正确姓名');
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		display: block;
		background: linear-gradient(180deg, #D42410 25.86%, #F2E7DF 100%);
		position: relative;

		&::after {
			content: "";
			background: url("/static/login/login-header.svg") no-repeat center / 100%;
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 374rpx;
			z-index: 1;
		}

		.header {
			position: absolute;
			left: 0;
			top: var(--status-bar-height);
			z-index: 3;
		}

		.content {
			// width: 750rpx;
			// padding: 32rpx;
			// background: url('@/static/image/bg.png') no-repeat bottom / cover;
			// background-color: rgba(255, 198, 171, 1);

			.content_header {
				height: calc(374rpx - var(--status-bar-height));
				position: relative;
				z-index: 2;
				justify-content: center;
				align-items: flex-end;
				padding-right: 60rpx;
				flex-direction: column;
				line-height: 40rpx;
				font-family: Roboto;
				color: rgba(177, 35, 39, 1);

				._title {
					font-size: var(--font-20);
					font-weight: 700;
					margin-bottom: 12rpx;
				}

				._tip {
					font-size: var(--font-14);
					font-weight: 400;
				}
			}

			.form {
				margin: 66rpx auto 0;
				padding: 32rpx 32rpx 0;

				.title {
					font-family: Roboto;
					font-size: var(--font-14);
					font-weight: 500;
					line-height: 64rpx;
					letter-spacing: 0.2px;
					text-align: left;
					color: #fff;
				}

				.item {
					font-weight: 500;
					margin-bottom: 20rpx;

					.item-name {
						letter-spacing: 0.4rpx;
						font-family: Roboto;
						font-size: var(--font-14);
						line-height: 48rpx;
						color: rgba(255, 255, 255, 1);
						margin-bottom: 16rpx;
					}

					.item-input {
						width: 100%;
						height: 100rpx;
						padding: 26rpx 32rpx;
						border-radius: 20rpx;
						border: 2rpx solid rgba(232, 235, 238, 1);
						background: #fff;

						.input {
							letter-spacing: 0.4rpx;
							font-family: Roboto;
							font-size: var(--font-14);
							line-height: 48rpx;
							font-weight: 400;
							color: #6f7374;
							flex: 1;
						}

						.placeholder {
							color: rgba(187, 189, 193, 1);
						}

						image {
							width: 40rpx;
							height: 40rpx;
							margin-left: 24rpx;
						}
					}
				}

				.item:last-child {
					margin-bottom: 0;
				}
			}

			.button {
				height: 100rpx;
				font-size: var(--font-16);
				margin: 80rpx 32rpx 0;
				width: auto;
				font-weight: 600;
				border-radius: 24rpx;
			}
		}

		.fixedBtn {
			position: fixed;
			right: 0;
			bottom: 5.5%;

			.btn {
				width: 150rpx;
				height: 72rpx;
				background: rgba(255, 255, 255, 0.5);
				backdrop-filter: blur(8rpx);
				padding: 6rpx 8rpx;
				border-radius: 72rpx 0 0 72rpx;

				.img {
					width: 60rpx;
					height: 60rpx;
				}
			}

		}
	}
</style>