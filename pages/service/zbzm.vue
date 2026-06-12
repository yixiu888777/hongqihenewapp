<template>
	<view class="container" style="background:#c8131e url(/static/new/bg.jpg) no-repeat center top / 100%;">
		<headerView>
			<template #leftIcon><u-icon name="arrow-left" color="#fff" size="24"></u-icon></template>
			<view>{{settingInfo.name}}纪元·全国直播招募令</view>
		</headerView>
		<view class="tip" style="margin-bottom: 30rpx;">让团队的力量，汇入时代的洪流</view>
		<view class="count-box" @click="showImg(settingInfo.live_ad_image)">
			<image :src="settingInfo.live_ad_image" mode="widthFix"></image>
		</view>
		<view class="reward">
			<view class="tit">请认真填写以下信息，我们将尽快与您联系</view>
			<view class="item">
				<view class="name">姓名/昵称</view>
				<view class="input-code" style="margin: 20rpx 0;">
					<image src="/static/zbzm/1.png" style="width: 50rpx;height: 40rpx;margin-right: 30rpx;"
						mode="aspectFit" />
					</image>
					<input class="input" type="text" placeholder="真实姓名或常用直播昵称" v-model="form.name" />
				</view>
			</view>
			<view class="item">
				<view class="name">手机号/新纪元账户</view>
				<view class="input-code" style="margin:20rpx 0">
					<image src="/static/zbzm/2.png" style="width: 40rpx;height: 40rpx;margin-right: 40rpx;"
						mode="aspectFit" />
					</image>
					<input class="input" type="text" maxlength="11" placeholder="主要联系方式" v-model="form.phone" />
				</view>
			</view>
			<view class="item">
				<view class="name">直播记录/会议链接</view>
				<view class="input-code" style="margin: 20rpx 0;position: relative;">
					<image src="/static/zbzm/3.png" style="width: 50rpx;height: 40rpx;margin-right: 30rpx;"
						mode="aspectFit" />
					</image>
					<input class="input" type="text" placeholder="上传视频或填写链接" v-model="form.url" />
					<!-- <image @click="upVideo" src="/static/zbzm/3_1.png"
						style="width: 50rpx;height: 50rpx;margin-right: 30rpx;" mode="">
					</image> -->
				</view>
			</view>
			<view class="item">
				<view class="name">自我介绍(200字内)</view>
				<view class="input-code" style="margin: 20rpx 0;">
					<textarea name="" id="" cols="30" rows="10" placeholder="展示个人特点与风格"
						v-model="form.introduction"></textarea>
				</view>
			</view>
			<view class="btn" @click="add" v-if="code == 0">
				提交报名
			</view>
			<view class="btn no" v-if="code == 1">
				已报名
			</view>
		</view>
		<!-- 提示 -->
		<u-popup :show="show" mode="center" round="32" :closeable="true" @close="show = false">
			<view class="van-dialog van-dialog2">
				<view class="img" style="margin: 20rpx 0 30rpx;">
					<image src="/static/new/yes.png" mode="aspectFill" style="width: 90rpx; height: 90rpx;"></image>
				</view>
				<view class="van-dialog__header">
					<view class="h2">报名成功！</view>
					<view class="desc">请等待工作人员联系您！</view>
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
		userLiveAddApi,
		userLiveInfoApi,
		userLiveUpdateApi
	} from '@/api/api.js'
	export default {
		data() {
			return {
				settingInfo: uni.getStorageSync('settingInfo'),
				UserInfo: uni.getStorageSync('user_info'),
				nameShow: false, // 实名认证
				form: {
					name: '',
					phone: '',
					url: '',
					introduction: '',
				},
				info: [],
				code: 0,
				uploadFile: {},
				show: false, // 弹窗
			};
		},
		onLoad() {
			userLiveInfoApi().then(res => {
				// console.log("getInviteInfoAPI",res.data)
				this.code = res.data.code;
				this.form = res.data.data;
			})
		},
		methods: {
			add() {
				if (this.UserInfo.is_auth == 1) {
					userLiveAddApi(this.form).then(res => {
						// uni.$u.toast(res.data.msg)
						this.show = true
					})
				} else {
					this.nameShow = true
				}
			},
			upVideo() {
				var self = this;
				uni.chooseVideo({
					sourceType: ['album'],
					compressed: true,
					success: function(res) {
						self.src = res.tempFilePath;
						self.videoShow = true;
						self.isLoading = true;
						// self.videoSuccess()

						// console.log("uploadFile ks",res.tempFilePath)
						const maxSize = 50 * 1024 * 1024; // 50MB
						if (res.size > maxSize) {
							uni.showToast({
								title: '视频超过50MB，无法上传',
								icon: 'none'
							});
						} else {
							self.uploadVideo(res.tempFilePath);
						}
					},
					fail: (err) => {
						uni.showToast({
							title: '上传视频失败',
							icon: 'none'
						});
					}
				});
			},
			uploadVideo(url) {
				// console.log("filePath", url)
				return new Promise((resolve, reject) => {
					let baseUrl = uni.getStorageSync('baseUrl') ? uni.getStorageSync('baseUrl') : ''
					console.log("===", url)
					let a = uni.uploadFile({
						url: baseUrl + '/api/services/upload/file',
						filePath: url,
						name: 'file',
						formData: {
							site: baseUrl
						},
						success: (res) => {
							this.uploadFile = JSON.parse(res.data)
							this.videoSuccess()
							resolve(JSON.parse(res.data).data)
						},
						fail: (err) => {
							uni.$u.toast('请求超时，请重新再试')
							setTimeout(() => {
								resolve('')
							}, 1000)
						}
					});


				})
			},
			videoSuccess() {
				this.form.url = this.uploadFile.data.url
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
	.count-box {
		padding: 30rpx;
		margin: 0 30rpx 30rpx;
		border-radius: 20rpx;
		background: #fff;

		image {
			width: 100%;
			border-radius: 20rpx;
		}
	}

	.container {
		min-height: 100vh;
		height: auto;
		padding-bottom: 120rpx;
	}

	.tip {
		text-align: center;
		color: #fff;
		font-size: 28rpx;
		line-height: 1;
	}

	.input-code {
		display: flex;
		align-items: center;
		background: rgba(246, 247, 249, 1);
		padding: 30rpx;
		border-radius: 10rpx 20rpx;

		.input {
			flex: 1;
			overflow: hidden;
			white-space: nowrap;
			overflow: hidden;
		}
	}

	.reward {
		padding: 30rpx;
		margin: 0 30rpx 30rpx;
		border-radius: 20rpx;
		background: #fff;

		.tit {
			font-size: 32rpx;
			font-weight: bold;
			margin-bottom: 30rpx;
		}

		.item {
			margin-bottom: 20rpx;

			.name {
				font-size: 30rpx;
				color: #333;
				font-weight: 800;
				margin-right: 20rpx;
			}
		}

		.desc-tip {
			text-align: center;
			color: rgba(246, 42, 45, 1);
			line-height: 1;
			margin: 60rpx 0 30rpx;
			font-size: .9em;
		}

		.btn {
			background: rgba(246, 42, 45, 1);
			color: #fff;
			text-align: center;
			padding: 30rpx;
			border-radius: 20rpx;
		}
	}

	.nav-list {
		grid-template-columns: 1fr 1fr 1fr;
		margin-bottom: 30rpx;
		display: flex;
		justify-content: space-between;

		.nav-item {
			width: 31%;
			height: 104rpx;
			padding: 12rpx 20rpx;
			;
			border-radius: 20rpx;
			background: linear-gradient(to left, rgba(255, 49, 80, 0.1), rgba(255, 100, 75, 0.1));
			border-top: 1px solid rgba(255, 255, 255, 1);
			font-family: Roboto;
			font-size: 28rpx;
			font-weight: 400;
			line-height: 40rpx;
			color: rgba(175, 21, 0, 1);

			image {
				width: 28rpx;
				height: 28rpx;
			}
		}
	}
</style>