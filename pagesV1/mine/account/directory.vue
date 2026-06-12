<template>
	<view class="container" style="background:#c8131e url(/static/new/bg.jpg) no-repeat center top / 100%;">
		<headerView>
			<template #leftIcon><u-icon name="arrow-left" color="#fff" size="24"></u-icon></template>
			<view>修改信息</view>
		</headerView>
		<view class="content">
			<view class="item flex_between avatar" @click="$utils.toPage('/pages/mine/realName')">
				<view class="flex" style="flex: 1;">
					<image :src="UserInfo.avatar" mode="widthFix"></image>
					<view>{{UserInfo.realname}}</view>
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
					<view class="desc">{{UserInfo.phone}}</view>
				</view>
			</view>
			<view class="item flex_between" @click="$utils.toPage('/pages/mine/realName')">
				<view class="flex" style="flex: 1;">
					<image src="@/static/new/st4.png" mode="widthFix"></image>
					<view>实名认证</view>
				</view>
				<view class="more">
					<view class="desc" :class="UserInfo.is_auth==1?'yes':'no'">{{UserInfo.is_auth==1?'已认证':'未认证'}}</view>
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
					<view class="desc">修改</view>
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
					<view>当前版本:{{settingInfo.app.app_ver}}</view>
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
		<!-- 是否实名认证 -->
		<Real-Name></Real-Name>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				settingInfo: uni.getStorageSync('settingInfo'),
				UserInfo: uni.getStorageSync('UserInfo'),
				version: '',
				show: false
			};
		},
		onLoad() {
			const systemInfo = uni.getSystemInfoSync();
			this.version = systemInfo.appVersion;
			console.log("systemInfo.version", systemInfo.appVersion)
		},
		methods: {
			signOut() {
				uni.removeStorageSync('token')
				uni.removeStorageSync('UserInfo')
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
				image {
					width: 120rpx;
					height: 120rpx;
				}
			}
		}
	}
</style>