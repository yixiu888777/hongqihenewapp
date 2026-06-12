<template>
	<view class="container" style="background:#c8131e url(/static/new/bg.jpg) no-repeat center top / 100%;">

		<headerView>
			<template #leftIcon><u-icon name="arrow-left" color="#fff" size="24"></u-icon></template>
			<view>邀请好友，共建纪元</view>
		</headerView>

		<view class="tip">{{info.invite_title}}</view>

		<!-- 专属码 -->
		<view class="count-box">
			<view style="font-weight: 800;margin-bottom: 40rpx;">
				邀请入口区
			</view>
			<view class="input-code">
				<view style="font-size: 28rpx;color: #333;font-weight: 800;margin-right: 20rpx;">邀请链接</view>
				<view class="input" style="color: #3670F7;">{{info.invite_url}}</view>
				<view class="icon">
					<image src="/static/invite/copy.png" mode="height" @tap="copyText(info.invite_url)"></image>
				</view>
			</view>
			<view class="input-code" style="margin-top: 40rpx;">
				<view style="font-size: 28rpx;color: #333;font-weight: 800;margin-right: 20rpx;">我的邀请码</view>
				<view class="input" style="color: #3670F7; text-align: right;">{{info.code}}</view>
				<view class="icon">
					<image src="/static/invite/copy.png" mode="height" @tap="copyText(info.code)"></image>
				</view>
			</view>
			<view style="font-weight: 800;margin: 40rpx 0;">
				下载二维码
			</view>
			<view class="qrcode">
				<l-painter pathType="url" ref="painter" @fail="fail" @done="done">
					<l-painter-qrcode :text="qrcode_url" css="width: 220rpx; height: 220rpx;" />
				</l-painter>
			</view>
			<view style="display: flex;justify-content: center;" @click="save">
				<text style="padding: 10rpx 40rpx;color:#fff;background: rgba(246, 42, 45, 1);border-radius: 40rpx;font-size: 24rpx;">保存</text>
			</view>
			<view style="font-size: 24rpx;color: rgba(246, 42, 45, 1);text-align: center;margin-top: 20rpx;">
				提示:扫码下载App并自动绑定我的邀请码 
			</view>

		</view>
	<!-- 	<view class="reward">
			<view class="tit">共建等级奖励</view>
			
			<view class="level">
				<view :class="'item lv'+(index+1)" v-for="(item,index) in InviteConfig" :key="index">
					<view class="icon">
						<image :src="item.icon" mode="widthFix"></image>
					</view>
					<view class="desc">{{item.title}}</view>
					<view class="btn" @click="$utils.toPage(`/pages/service/level?id=${item.id}&index=${index}`)" style="background: #fff;padding: 10rpx 20rpx;border-radius: 30rpx;font-size: 28rpx;color: #333;">
						<text>领取奖励</text>
					</view>
				</view>
			</view>
		</view> -->
		<view class="reward">
			<!-- <view class="tit">共建等级奖励</view>
			<view class="m-tips primary" style="padding: 0;">
				<view class="text"><u-parse :content="info.invite_reward_rule"></u-parse></view>
			</view> -->
			<view style="margin-top: 20rpx;
				margin-top:60rpx;
				background-color: rgba(246, 42, 45, 1);text-align: center;color: #fff;
				padding: 30rpx 0;border-radius: 20rpx;" @click="$utils.toPage(`/pages/service/level-detail?level=1`)">
				查看团队
			</view>
			<view style="margin-top: 20rpx;
				margin-top:60rpx;
				background-color: rgba(246, 42, 45, 1);text-align: center;color: #fff;
				padding: 30rpx 0;border-radius: 20rpx;" @tap="copyText(qrcode_url)">
				立即邀请好友
			</view>
		</view>
		<view style="color: #fff;text-align: center;margin-top: 60rpx;">
			{{settingInfo.beian}}
		</view>

		<uni-popup ref="PosterPopup" type="center">
			<view class="poster-wrap" @tap="onSaveImage">
				<view class="poster-img">
					<image class="img" :src="picture2" mode="widthFix"></image>
				</view>
				<!-- #ifdef APP-PLUS -->
				<view class="poster-text">点击保存图片</view>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<view class="poster-text">长按保存图片</view>
				<!-- #endif -->
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		getInviteInfoAPI,
		getInviteConfigAPI
	} from '@/api/api.js'
	export default {
		data() {
			return {
				settingInfo: uni.getStorageSync('settingInfo'),
				baseUrl: uni.getStorageSync('baseUrl'),
				info: {
					rate: {}
				},
				InviteConfig: [],
				qrcode_url: '',
				picture: '',
				picture2: '',
				show: false,
				codeShow: false,
			};
		},
		onLoad() {
			getInviteInfoAPI().then(res => {
				 console.log("getInviteInfoAPI",res.data)
				this.info = res.data.data
				//this.qrcode_url = this.baseUrl + '?share_code=' + res.data.data.code
				this.qrcode_url = res.data.data.android_down_url
			})
			getInviteConfigAPI().then(res => {
				this.InviteConfig = res.data.data
			})
		},
		methods: {
			// 跳转在线客服
			toLoads(url) {
				// #ifndef APP-PLUS
				window.open(url)
				// #endif
				// #ifdef APP-PLUS
				uni.navigateTo({
					url: `/pages/noPage/index?url=${url.split("&").join("$")}`
				})
				// #endif
			},
			// 复制
			copyText(text) {
				uni.setClipboardData({
					data: text,
					success: () => {
						uni.$u.toast('复制成功')
					},
					fail: () => {
						uni.$u.toast('复制失败')
					}
				});
			},
			fail(v) {
				console.log(v)
			},
			done(v) {
				console.log('绘制完成:')
			},
			save() {
				uni.showLoading({
					title: '生成中...',
					mask: true
				});
				// console.log("ssss")
				this.$refs.painter.canvasToTempFilePathSync({
					fileType: "jpg",
					// 如果返回的是base64是无法使用 saveImageToPhotosAlbum，需要设置 pathType为url
					pathType: 'url',
					quality: 1,
					success: (res) => {
						console.log("canvasToTempFilePathSync", res.tempFilePath);
						this.picture2 = res.tempFilePath
						this.$refs.PosterPopup.open();
						uni.hideLoading();
					},
				});
			},
			// 保存图征
			onSaveImage() {
				uni.saveImageToPhotosAlbum({
					filePath: this.picture2,
					success: res => {
						uni.showToast({
							title: '保存成功',
							icon: 'success',
							duration: 2000
						});
					},
					fail: err => {
						uni.showToast({
							title: '保存失败',
							icon: 'none',
							duration: 2000
						});
					}
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
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
		margin: 0 0 40rpx;
	}
	.count-box {
		padding: 30rpx;
		margin: 0 30rpx 30rpx;
		border-radius: 20rpx;
		background: #fff;
		.qrcode {
			text-align: center;
			width: 220rpx;
			margin: 0 auto 20rpx;
		}
		.btn {
			display: flex;
			align-items: center;
			border-radius: 50rpx;
			background: linear-gradient(to left, #FF624B, #FF3650);
			color: #fff;
			width: 220rpx;
			margin: 0 auto 30rpx;
			text-align: center;
			padding: 10rpx 30rpx;
			image {
				height: 30rpx;
				margin-left: 10rpx;
				display: inline-block;
			}
		}
		.h2 {
			font-size: 32rpx;
			font-weight: bold;
			text-align: center;
			margin-bottom: 30rpx;
		}
		.h3 {
			font-size: 32rpx;
			font-weight: bold;
			margin-bottom: 10rpx;
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
			.icon {
				width: 50rpx;
				padding-left: 20rpx;
				image {
					height: 30rpx;
				}
			}
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
		.list {
			.item {
				padding: 30rpx;
				margin-bottom: 30rpx;
				border-radius: 20rpx;
				display: flex;
				align-items: center;
				background: rgba(249, 250, 251, 1);
				.icon {
					image {
						width: 100rpx;
					}
				}
				.text {
					flex: 1;
					padding: 0 30rpx;
					.h3 {
						font-weight: bold;
					}
					.desc {
						font-size: .8em;
					}
				}
				.btn {
					font-size: .8em;
					background: linear-gradient(to left, #FF624B, #FF3650);
					color: #fff;
					border-radius: 10rpx;
					padding: 10rpx 20rpx;
				}
			}
			.success {
				filter: grayscale(100%);
				-webkit-filter: grayscale(100%);
				opacity: .7;
				.btn {}
			}
			.ing {
				.btn {}
			}
		}
		.level {
			font-size: 0.8em;
			margin-bottom: 30rpx;
			.lv1 {
				background: linear-gradient(270deg, #7B90AD 0%, #B2C1D7 100%);
			}
			.lv2 {
				background: linear-gradient(270deg, #DDB999 0%, #F1D8BA 100%);
			}
			.lv3 {
				background: linear-gradient(90deg, #ADCAE8 0%, #CCE0F8 100%);
			}
			.lv4 {
				background: linear-gradient(90deg, #E8BE76 0%, #F4D59E 100%);
			}
			.lv5 {
				background: linear-gradient(90deg, #918EE5 0%, #A5A0F0 100%);
			}
			.lv6 {
				background: linear-gradient(90deg, #131313 0%, #48484A 100%);
			}
			.item {
				border-radius: 20rpx;
				padding: 30rpx;
				display: flex;
				align-items: center;
				margin-bottom: 30rpx;
				.icon {
					image {
						width: 90rpx;
					}
				}
				.desc {
					color: #fff;
					font-size: 1.2em;
					padding: 0 20rpx;
					flex: 1;
				}
				.btn {
					color: #FF374F;
					font-size: 1.2em;
					font-weight: bold;
				}
			}
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
	.poster-wrap {
		width: 600rpx;
		margin: 0 auto;
		// 海报图片
		.poster-img {
			padding: 30rpx;
			background: #fff;
			box-shadow: 0px 9rpx 26rpx 6rpx rgba(0, 0, 0, .3);
			border-radius: 20rpx;
			overflow: hidden;
			margin-bottom: 20rpx;
			.img {
				width: 100%;
			}
		}
		.poster-text {
			text-align: center;
			font-size: 36rpx;
			font-weight: bold;
			color: #fff;
		}
	}
</style>