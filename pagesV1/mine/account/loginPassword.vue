<template>
	<view class="container" style="background:#c8131e url(/static/new/bg.jpg) no-repeat center top / 100%;">
		<headerView>
			<template #leftIcon><u-icon name="arrow-left" color="#fff" size="24"></u-icon></template>
			<view>修改登录密码</view>
		</headerView>
		<view class="main">
			<view class="content">
				<view class="title">登录密码修改</view>
				<view class="form">
					<view class="item">
						<view class="item-name">旧登录密码</view>
						<view class="item-input flex_between">
							<input type="password" v-if="oldShow" v-model="form.old" class="input" placeholder="请输入旧登录密码" placeholder-class="placeholder" />
							<input type="text" v-else v-model="form.old" class="input" placeholder="请输入旧登录密码" placeholder-class="placeholder" />
							<view @click="oldShow=!oldShow">
								<image src="@/static/public/eye-off.svg" mode="widthFix" v-if="oldShow"></image>
								<image src="@/static/public/eye.svg" mode="widthFix" v-else></image>
							</view>
						</view>
					</view>
					<view class="item">
						<view class="item-name">新登录密码</view>
						<view class="item-input flex_between">
							<input type="password" v-if="newShow" v-model="form.new" class="input" placeholder="请输入新登录密码" placeholder-class="placeholder" />
							<input type="text" v-else v-model="form.new" class="input" placeholder="请输入新登录密码" placeholder-class="placeholder" />
							<view @click="newShow=!newShow">
								<image src="@/static/public/eye-off.svg" mode="widthFix" v-if="newShow"></image>
								<image src="@/static/public/eye.svg" mode="widthFix" v-else></image>
							</view>
						</view>
					</view>
					<view class="item">
						<view class="item-name">确认登录密码</view>
						<view class="item-input flex_between">
							<input type="password" v-if="show" v-model="form.confirm" class="input" placeholder="请确认登录密码" placeholder-class="placeholder" />
							<input type="text" v-else v-model="form.confirm" class="input" placeholder="请确认登录密码" placeholder-class="placeholder" />
							<view @click="show=!show">
								<image src="@/static/public/eye-off.svg" mode="widthFix" v-if="show"></image>
								<image src="@/static/public/eye.svg" mode="widthFix" v-else></image>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="footer col_center">
				<view class="button" @click="submit">确定</view>
				<view class="footer-tips">忘记密码？<span @click="toLoads(settingInfo.service.service_url)">在线客服</span></view>
			</view>
		</view>
		<!-- 是否实名认证 -->
		<Real-Name></Real-Name>
	</view>
</template>

<script>
	import {
		updateLoginpassAPI
	} from '@/api/api.js'
	export default {
		data() {
			return {
				settingInfo: uni.getStorageSync('settingInfo'),
				oldShow: true,
				newShow: true,
				show: true,
				form: {
					old: '',
					new: '',
					confirm: ''
				}
			};
		},
		methods: {
			// 去在线客服页
			toLoads(url) {
				uni.navigateTo({
					url: `/pages/noPage/index?url=${url.split("&").join("$")}`
				})
			},
			submit() {
				if (this.form.new !== this.form.confirm) {
					return uni.$u.toast('两次密码不一致')
				}
				this.$utils.throttle(() => {
					updateLoginpassAPI({
						new_pass: this.form.new,
						old_pass: this.form.old
					}).then((res) => {
						uni.$u.toast('修改成功，请重新登录')
						uni.removeStorageSync('token')
						setTimeout(() => {
							uni.reLaunch({
								url: '/pages/login/login'
							})
						}, 1000)
					}).catch(err => {
						if (err.data.code == 0) {
							uni.$u.toast('旧密码错误')
						} else {
							uni.$u.toast(err.data.msg)
						}
					})
				}, 2000)()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		.main{ display: flex; flex-direction: column; flex: 1;margin:0 30rpx 30rpx; background-color: rgba(255, 255, 255, 1); border-radius: 20rpx;}
		.content {
			.title{ font-weight: bold; border-bottom: 2rpx solid #e5e5e5; padding: 30rpx; font-size: 1.2em;}
			.form { padding: 30rpx; 
				.item { margin-bottom: 20rpx;
					.item-name {
						margin-bottom: 16rpx;
						line-height: 48rpx;
						font-weight: 500;
						color: rgba(17, 24, 38, 1);
					}
					.item-input {
						width: 100%;
						height: 100rpx;
						padding: 26rpx 32rpx;
						border-radius: 20rpx;
						border: 1px solid rgba(232, 235, 238, 1);

						.input {
							color: rgba(17, 24, 38, 1);
							flex: 1;
							font-size: var(--font-14);
						}

						.placeholder {
							color: rgba(187, 189, 193, 1);
						}

						image {
							width: 40rpx;
							height: 40rpx; display: block;
							margin-left: 20rpx;
						}
					}
				}
			}
		}

		.footer {
			padding: 30rpx;
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
</style>