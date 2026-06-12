<template>
	<view class="container" style="background:#c8131e url(/static/new/bg.jpg) no-repeat center top / 100%;">
		<headerView>
			<template #leftIcon><u-icon name="arrow-left" color="#fff" size="24"></u-icon></template>
			<view>修改信息</view>
		</headerView>
		<view class="content">
			<view class="item flex_between avatar">
				<view class="flex">
					<u-upload class="upAvatar" :fileList="fileListZ" @afterRead="afterRead" @delete="deletePic" name="Z"
						multiple :maxCount="1" width="120rpx" height="120rpx">
						<image :src="UserInfo.avatar" mode="aspectFill"></image>
						<view class="edit"><u-icon name="camera-fill" color="rgba(0, 0, 0, .3)"></u-icon></view>
					</u-upload>
					<view>头像</view>
				</view>
				<view class="more">
					<u-icon name="arrow-right" bold color="rgba(90, 98, 116, 1)"></u-icon>
				</view>
			</view>
			<view class="item flex_between">
				<view class="flex" style="flex: 1;">
					<image src="@/static/new/st1.png" mode="widthFix"></image>
					<view>用户名</view>
				</view>
				<view class="more">
					<view class="desc">{{UserInfo.realname}}</view>
				</view>
			</view>
			<view class="item flex_between">
				<view class="flex" style="flex: 1;">
					<image src="@/static/new/st2.png" mode="widthFix"></image>
					<view>手机号</view>
				</view>
				<view class="more">
					<view class="desc">{{UserInfo.phone}}</view>
				</view>
			</view>
			<view class="item flex_between">
				<view class="flex" style="flex: 1;">
					<image src="@/static/new/st3.png" mode="widthFix"></image>
					<view>性别</view>
				</view>
				<view class="more">
					<view class="desc">{{UserInfo.sex}}</view>
				</view>
			</view>
			<view class="item flex_between" @click="$utils.toPage('/pages/mine/realName')">
				<view class="flex" style="flex: 1;">
					<image src="@/static/new/st4.png" mode="widthFix"></image>
					<view>实名认证</view>
				</view>
				<view class="more">
					<view class="desc" :class="UserInfo.is_auth==1?'yes':'no'">{{UserInfo.is_auth==1?'已认证':'未认证'}}
					</view>
					<u-icon name="arrow-right" bold color="rgba(90, 98, 116, 1)"></u-icon>
				</view>
			</view>
			<view class="item flex_between" @click="$utils.toPage('/pages/mine/account/loginPassword')">
				<view class="flex" style="flex: 1;">
					<image src="@/static/new/st5.png" mode="widthFix"></image>
					<view>登录密码</view>
				</view>
				<view class="more">
					<view class="desc">修改</view>
					<u-icon name="arrow-right" bold color="rgba(90, 98, 116, 1)"></u-icon>
				</view>
			</view>
			<view class="item flex_between" @click="$utils.toPage('/pages/mine/account/paymentPassword')">
				<view class="flex" style="flex: 1;">
					<image src="@/static/new/st6.png" mode="widthFix"></image>
					<view>支付密码</view>
				</view>
				<view class="more">
					<view class="desc">{{UserInfo.is_pay_password?'修改':'设置'}}</view>
					<u-icon name="arrow-right" bold color="rgba(90, 98, 116, 1)"></u-icon>
				</view>
			</view>
			<view class="item flex_between" @click="$utils.toPage('/pages/mine/card/list')">
				<view class="flex" style="flex: 1;">
					<image src="@/static/new/st7.png" mode="widthFix"></image>
					<view>收款绑定</view>
				</view>
				<view class="more">
					<view class="desc">修改</view>
					<u-icon name="arrow-right" bold color="rgba(90, 98, 116, 1)"></u-icon>
				</view>
			</view>
			<view class="item flex_between" @click="$utils.toPage('/pages/mine/address/list')">
				<view class="flex" style="flex: 1;">
					<image src="@/static/new/st8.png" mode="widthFix"></image>
					<view>收货地址</view>
				</view>
				<view class="more">
					<view class="desc">修改</view>
					<u-icon name="arrow-right" bold color="rgba(90, 98, 116, 1)"></u-icon>
				</view>
			</view>
			<view class="item flex_between" @click="upVersion">
				<view class="flex" style="flex: 1;">
					<image src="@/static/new/st9.png" mode="widthFix"></image>
					<view>当前版本:{{app.app_ver}}</view>
				</view>
				<view class="more">
					<view class="desc">已更新</view>
					<u-icon name="arrow-right" bold color="rgba(90, 98, 116, 1)"></u-icon>
				</view>
			</view>
		</view>

		<!-- 提示 -->
		<u-popup :show="show" mode="center" round="32" @close="show = false">
			<view class="van-dialog van-dialog2">
				<view class="van-dialog__header">提示</view>
				<view class="van-dialog__content">您要退出账号吗</view>
				<view class="van-dialog__footer">
					<view class="van-cancel" @click="show = false">取消</view>
					<view class="van-success" @click="signOut">确定</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		userInfoApi,
		servicesAppVersionApi,
		userAvatarApi
	} from '@/api/api.js'
	export default {
		data() {
			return {
				settingInfo: uni.getStorageSync('settingInfo'),
				UserInfo: uni.getStorageSync('user_info'),
				savedAccounts: uni.getStorageSync('savedAccounts') || [],
				fileListZ: [],
				version: '',
				app: '',
				show: false
			};
		},
		onLoad() {
			const systemInfo = uni.getSystemInfoSync();
			this.version = systemInfo.appVersion;
			// console.log("systemInfo.version", systemInfo.appVersion)
			servicesAppVersionApi().then(res => {
				this.app = res.data.data
			})
		},
		methods: {
			signOut() {
				uni.removeStorageSync('token')
				uni.removeStorageSync('user_info')
				uni.reLaunch({
					url: '/pages/login/login'
				})
			},
			//版本更新
			upVersion() {
				// #ifdef APP-PLUS
				plus.runtime.getProperty(plus.runtime.appid, (widgetInfo) => {
					this.version = widgetInfo.version;
				});
				if (this.version != this.settingInfo.app_ver) {
					// this.toLoads(this.settingInfo.android_url);
					plus.runtime.openURL(this.settingInfo.android_url);
				} else {
					uni.$u.toast("已是最新版本");
				}
				// #endif

				// #ifdef H5
				uni.$u.toast("已是最新版本");
				// #endif
			},
			// 删除图片
			deletePic(event) {
				this[`fileList${event.name}`].splice(event.index, 1)
			},
			// 新增图片
			async afterRead(event) {
				let lists = [].concat(event.file)
				// console.log("afterRead",lists)
				let fileListLen = this[`fileList${event.name}`].length
				lists.map((item) => {
					this[`fileList${event.name}`].push({
						...item,
						status: 'uploading',
						message: '如果上传图片过大请耐心等待'
					})
				})
				for (let i = 0; i < lists.length; i++) {
					const result = await this.uploadFilePromise(lists[i].url)
					// console.log("result",result)
					if (!!result) {
						let item = this[`fileList${event.name}`][fileListLen]
						this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
							status: 'success',
							message: '',
							url: result.url,
							upload: result.path
						}))
						fileListLen++
					} else {
						this[`fileList${event.name}`] = []
					}
				}
				this.upAvatar();
			},
			uploadFilePromise(url) {
				return new Promise((resolve, reject) => {
					let a = uni.uploadFile({
						url: uni.getStorageSync("baseUrl") + '/api/services/upload/file',
						filePath: url,
						name: 'file',
						formData: {
							site: uni.getStorageSync("baseUrl"),
							app_ver: '102'
						},
						success: (res) => {
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
			upAvatar() {
				userAvatarApi({
					avatar: this.fileListZ[0].upload
				}).then(res => {
					uni.$u.toast(res.data.msg);
					this.getUserInfo()
				})
			},
			getUserInfo() {
				userInfoApi().then(res => {
					uni.setStorageSync('user_info', res.data.data)
					this.savedAccounts[0].avatar = res.data.data.avatar
					uni.setStorageSync('savedAccounts', this.savedAccounts)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		.content {
			background-color: rgba(255, 255, 255, 1);
			border-radius: 20rpx;
			margin: 0 30rpx 30rpx;

			.item {
				padding: 10rpx 30rpx;
				font-weight: 500;
				color: rgba(0, 0, 0, 1);

				image {
					width: 90rpx;
					height: 90rpx;
					display: block;
					flex-shrink: 0;
					margin-right: 20rpx;
				}

				.more {
					display: flex;
					align-items: center;

					.desc {
						margin-right: 10rpx;
						opacity: .5;
						line-height: 1;
					}

					.yes {
						color: rgba(7, 193, 96, 1);
					}

					.no {
						color: rgba(246, 42, 45, 1);
					}
				}
			}

			.avatar {
				border-bottom: 2rpx solid #e5e5e5;
				padding: 30rpx;
				margin-bottom: 15rpx;

				.upAvatar {
					position: relative;
				}

				image {
					width: 120rpx;
					height: 120rpx;
					border-radius: 120rpx;
				}

				.edit {
					position: absolute;
					left: 90rpx;
					top: 0;
				}
			}
		}
	}
</style>