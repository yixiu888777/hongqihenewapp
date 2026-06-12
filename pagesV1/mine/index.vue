<!-- 有用  v-if="UserInfo.level > 0"-->
<template>
	<!-- <view class="container" :style="'background: url('+ settingInfo.background.my_bg_image +') no-repeat center top / cover;background-attachment: fixed;'"> -->
	<view class="container" style="background:#c8131e url(/static/new/bg.jpg) no-repeat center top / 100%;">
		<view class="user">
			<view class="statusbar"></view>
			<view class="header">
				<view class="item" @click="toPage(`/pages/mine/switch`)">
					<view class="icon">
						<image src="/static/new/icon-switch.png" mode="heightFix"></image>
					</view>
					<view class="text">切换账号</view>
				</view>
				<view class="item">
					<view class="icon">
						<image src="/static/new/icon-service.png" mode="heightFix"></image>
					</view>
					<view class="text">最新咨询</view>
				</view>
			</view>
			<view class="mine">
				<view class="avatar">
					<image :src="UserInfo.avatar || settingInfo.member_avatar" mode="aspectFill"></image>
					<view class="real" :class="UserInfo.is_auth==1?'yes':'no'">{{UserInfo.is_auth==1?'已实名':'未实名'}}
					</view>
				</view>
				<view class="text">
					<view class="name">{{UserInfo.realname}}</view>
					<view class="vip" v-show="UserInfo.invite_level>0">{{UserInfo.invite_level_name}}</view>
				</view>
				<view class="singin" @click="toPage(`/pages/mine/singIn/index`)">签到</view>
			</view>
			<view class="card">
				<view class="title">资产管理</view>
				<view class="list">
					<view class="item" v-for="(item,index) in typeList" :key="index"
						@click="toPage(`/pages/mine/assetDetail?type=${item.moneytype}&index=${index}`)">
						<view class="text">
							<view class="desc">{{item.name}}</view>
							<view class="num">{{item.price}}</view>
						</view>
					</view>
				</view>
				<view class="m-btn">
					<view class="sbtn" @tap="toPage('/pages/mine/recharge/recharge')"
						v-if="settingInfo.program.recharge_status ==1">充值</view>
					<view class="sbtn" @tap="toPage('/pages/mine/withdraw/withdraw')"
						v-if="settingInfo.program.withdrawal_status ==1">提现</view>
					<view class="sbtn" @tap="toPage('/pages/mine/transfer/transfers')"
						v-if="settingInfo.program.transfer_status ==1">转账</view>
				</view>
			</view>
		</view>
		<view class="main">
			<view class="old" @tap="toPage('/pages/mine/pension/index')" v-if="settingInfo.pension.pension_status ==1">
				<view class="img">
					<image :src="settingInfo.pension.pension_img" mode="widthFix"></image>
				</view>
			</view>
			<view class="operate">
				<view class="title">服务于工具</view>
				<view class="item" @tap="$utils.toPage('/pages/index/policyDetail')">
					<view class="icon">
						<image src="/static/new/me1.png" mode="aspectFit"></image>
					</view>
					<view class="text">政策文件</view>
					<view class="more"><u-icon name="arrow-right"></u-icon></view>
				</view>
				<view class="item" @tap="$utils.toPage('/pages/mine/realName')">
					<view class="icon">
						<image src="/static/new/me2.png" mode="aspectFit"></image>
					</view>
					<view class="text">实名认证</view>
					<view class="more"><u-icon name="arrow-right"></u-icon></view>
				</view>
				<view class="item" @tap="toPage('/pages/mine/card/list')">
					<view class="icon">
						<image src="/static/new/me3.png" mode="aspectFit"></image>
					</view>
					<view class="text">提现绑定</view>
					<view class="more"><u-icon name="arrow-right"></u-icon></view>
				</view>
				<view class="item" @tap="toPage('/pages/mine/assetDetail')">
					<view class="icon">
						<image src="/static/new/me4.png" mode="aspectFit"></image>
					</view>
					<view class="text">资产明细</view>
					<view class="more"><u-icon name="arrow-right"></u-icon></view>
				</view>
				<view class="item" @tap="toPage('/pages/mine/recharge/history')"
					v-if="settingInfo.pension.pension_status ==1">
					<view class="icon">
						<image src="/static/new/me5.png" mode="aspectFit"></image>
					</view>
					<view class="text">交易明细</view>
					<view class="more"><u-icon name="arrow-right"></u-icon></view>
				</view>
				<view class="item" @tap="$utils.toPage('/pages/mine/account/directory')">
					<view class="icon">
						<image src="/static/new/me6.png" mode="aspectFit"></image>
					</view>
					<view class="text">修改信息</view>
					<view class="more"><u-icon name="arrow-right"></u-icon></view>
				</view>
				<view class="item" @tap="toPage('/pages/team/invite')"
					v-if="settingInfo.program.subscription_status ==1">
					<view class="icon">
						<image src="/static/new/me7.png" mode="aspectFit"></image>
					</view>
					<view class="text">邀请链接</view>
				</view>
				<view class="item" @tap="toPage('/pages/mine/address/list')">
					<view class="icon">
						<image src="/static/new/me8.png" mode="aspectFit"></image>
					</view>
					<view class="text">收货地址</view>
					<view class="more"><u-icon name="arrow-right"></u-icon></view>
				</view>
				<view class="item" @click="toPage('/pages/mine/service')">
					<view class="icon">
						<image src="/static/new/me9.png" mode="aspectFit"></image>
					</view>
					<view class="text">人工客服</view>
					<view class="more"><u-icon name="arrow-right"></u-icon></view>
				</view>
			</view>
			<view class="btn" @click="logout">安全退出</view>
			<view class="footer">
				<view class="desc">主办单位:国家发展和改革委员会</view>
				<view class="desc">承办单位:红旗河工程建设指挥部</view>
				<view class="desc">ICP备案号:京ICP备05052393号</view>
				<view class="desc">
					<image src="/static/new/f1.png" mode="heightFix" style="height: 50rpx;"></image>
					京公网安备11010202000002号
				</view>
				<view class="desc">
					<image src="/static/new/f2.png" mode="heightFix" style="height: 80rpx;"></image>
					<image src="/static/new/f3.png" mode="heightFix" style="height: 60rpx;"></image>
				</view>
			</view>
		</view>
		<!-- <view class="version">{{settingInfo.basic.beian}}</view> -->
		<tabBarView current="5"></tabBarView>
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
		<u-popup :show="rnShow" mode="center" round="32" @close="rnShow=false">
			<view class="van-dialog van-dialog2">
				<view class="van-dialog__header">提示</view>
				<view class="van-dialog__content">您还未实名认证，请先实名认证</view>
				<view class="van-dialog__footer">
					<view class="van-success" @tap="$utils.toPage('/pages/mine/realName')">认证</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		getSettingApi,
		getUserInfoAPI
	} from '@/api/api.js'
	export default {
		data() {
			return {
				isPageShow: false,
				settingInfo: uni.getStorageSync('settingInfo'),
				version: '',
				show: false,
				rnShow: false,
				UserInfo: {},
				typeList: [],
			}
		},
		onLoad() {
			this.loadData();
		},
		onShow() {
			this.rnShow = false;
			getUserInfoAPI().then(res => {
				this.UserInfo = res.data.data
				this.typeList = Object.values(res.data.data.price_list);
				uni.setStorageSync('UserInfo', res.data.data)
			})
		},
		onHide() {

		},
		onUnload() {
			// 页面卸载时
		},
		onReachBottom() {
			// 上拉触底时
		},
		methods: {
			async loadData() {
				// getSettingApi().then(res => {
				// 	this.settingInfo = res.data.data
				// 	uni.setStorageSync('settingInfo', res.data.data)
				// 	this.isPageShow = true;
				// })
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
			// 跳转在线客服
			toLoads(url) {
				uni.navigateTo({
					url: `/pages/noPage/index?url=${url.split("&").join("$")}`
				})
			},
			logout() {
				this.show = true
			},
			// 退出登录
			signOut() {
				uni.removeStorageSync('token')
				uni.removeStorageSync('UserInfo')
				uni.reLaunch({
					url: '/pages/login/login'
				})
			},
			// 实名页面跳转
			toPage(url) {
				if (this.UserInfo.is_auth == 1) {
					this.$utils.toPage(url)
				} else {
					this.rnShow = true;
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		min-height: 100vh;
		height: auto;
		padding: 0 0 150rpx;
	}

	.user {
		padding: 30rpx 30rpx 120rpx;

		.header {
			margin-bottom: 30rpx;
			display: flex;
			justify-content: right;
			gap: 30rpx;
			color: #fff;

			.item {
				text-align: center;

				.icon {
					image {
						height: 40rpx;
					}
				}

				.text {
					font-size: .8em;
				}
			}
		}

		.mine {
			color: #fff;
			display: flex;
			margin-bottom: 30rpx;

			.avatar {
				width: 100rpx;
				height: 100rpx;
				border-radius: 100rpx;
				position: relative;

				image,
				img {
					width: 100rpx;
					height: 100rpx;
					border-radius: 100rpx;
					display: block;
				}

				.real {
					position: absolute;
					left: 10rpx;
					bottom: 0;
					background: rgba(7, 183, 91, .5);
					color: #fff;
					border-radius: 30rpx;
					padding: 5rpx 10rpx;
					width: 80rpx;
					text-align: center;
					font-size: .6em;
					line-height: 1;
				}

				.real.yes {
					background: rgba(7, 183, 91, 1);
				}
			}

			.text {
				padding-left: 20rpx;
				flex: 1;

				.name {
					font-weight: bold;
					font-size: 1.2em;
				}

				.vip {
					font-size: .8em;
					background: rgba(0, 0, 0, 0.3);
					display: inline-block;
					padding: 5rpx 20rpx;
					border-radius: 90rpx;
					color: #fff;
				}

				.tel {
					line-height: 1;
				}

				.code {
					line-height: 1;
				}
			}

			.singin {
				line-height: 80rpx;
				background: #fff;
				color: #000;
				padding: 0 50rpx;
				margin: 10rpx 0;
				border-radius: 90rpx;
			}
		}

		.card {
			background: #fff;
			padding: 30rpx;
			border-radius: 20rpx;
			margin-bottom: 30rpx;

			.title {
				font-weight: bold;
				margin-bottom: 20rpx;
				font-size: 1.2em;
			}

			.list {
				display: flex;
				flex-wrap: wrap;
				gap: 30rpx;
				margin-bottom: 30rpx;
			}

			.item {
				background: rgba(246, 42, 45, .15);
				border-radius: 20rpx;
				padding: 30rpx;
				min-width: 300rpx;
				flex: 1;
				overflow: hidden;
				display: flex;
				position: relative;

				.icon {

					image,
					img {
						width: 50rpx;
						height: 50rpx;
						display: block;
					}
				}

				.text {
					line-height: 1;
					padding-left: 10rpx;

					.desc {
						margin-bottom: 10px;
						opacity: .7;
						white-space: nowrap;
					}

					.num {
						color: #FF374F;
						font-size: 1.4em;
						font-weight: bold;
					}
				}

				.tips {
					padding: 5rpx 10rpx;
					position: absolute;
					top: 0;
					right: 0;
					background: linear-gradient(to left, #FF624B, #FF3650);
					color: #fff;
					font-size: .8em;
					font-weight: 100;
					border-radius: 0 0 0 20rpx;
				}
			}

			.m-btn {
				display: flex;
				flex-wrap: wrap;
				gap: 30rpx;
				text-align: center;

				.sbtn {
					background: rgba(246, 42, 45, 1);
					color: #fff;
					min-width: 180rpx;
					flex: 1;
					border-radius: 20rpx;
					padding: 20rpx;
				}

				.sbtn:active {
					opacity: .8;
				}
			}
		}
	}

	.main {
		padding: 30rpx;
		color: #040A13;
		margin-top: -150rpx;
	}

	.old {
		margin-bottom: 30rpx;

		.img {

			image,
			img {
				width: 100%;
				display: block;
				border-radius: 20rpx;
			}
		}

	}

	.recharge {
		display: flex;
		align-items: center;
		gap: 30rpx;
		text-align: center;
		margin-bottom: 30rpx;

		.item {
			background: linear-gradient(to left, #FF624B, #FF3650);
			color: #fff;
			border-radius: 20rpx;
			padding: 30rpx;
			width: 330rpx;
			flex: 1;
		}
	}

	.operate {
		margin-bottom: 30rpx;

		.title {
			font-weight: bold;
			color: #fff;
			margin-bottom: 20rpx;
			font-size: 1.2em;
		}

		.item {
			background: #fff;
			padding: 30rpx;
			margin-bottom: 30rpx;
			border-radius: 20rpx;
			display: flex;
			align-items: center;

			.icon {

				image,
				img {
					width: 50rpx;
					height: 50rpx;
					display: block;
					margin: 0 auto;
				}
			}

			.text {
				line-height: 1;
				flex: 1;
				padding: 0 20rpx;
			}

			.more {}
		}
	}

	.operate::after {
		content: '';
		flex: auto;
	}

	.btn {
		background: rgba(255, 255, 255, 0.4);
		color: #fff;
		text-align: center;
		padding: 20rpx;
		border-radius: 20rpx;
		box-shadow: 0 2rpx 5rpx rgba(255, 77, 77, 0.30);
		margin-bottom: 30rpx;
	}

	.footer {
		background: #fff;
		padding: 30rpx;
		border-radius: 20rpx;
		text-align: center;

		.desc {
			padding: 10rpx;
		}

		image {
			align-items: center;
			vertical-align: middle;
			margin: 0 10rpx;
		}
	}

	.version {
		font-size: .6em;
		text-align: center;
		font-weight: 100;
		color: #fff;
		margin-top: auto;
		margin-bottom: 150rpx;
	}
</style>