<!-- 有用  v-if="UserInfo.level > 0"-->
<template>
	<!-- <view class="container" :style="'background: url('+ settingInfo.background.my_bg_image +') no-repeat center top / cover;background-attachment: fixed;'"> -->
	<view class="container" style="background:#c8131e url(/static/new/bg.jpg) no-repeat center top / 100%;"
		v-if="isPageShow">
		<view class="user">
			<view class="statusbar"></view>
			<view class="header">
				<view class="item" @click="toPage(`/pages/mine/switch`)">
					<view class="icon">
						<image src="/static/new/icon-switch.png" mode="heightFix"></image>
					</view>
					<view class="text">切换账号</view>
				</view>
				<view class="item" @click="toPage('/pages/mine/messages/messages')">
					<view class="icon">
						<image src="/static/new/icon-service.png" mode="heightFix"></image>
					</view>
					<view class="text">最新咨询</view>
				</view>
			</view>
			<view class="mine">
				<view class="avatar" @tap="$utils.toPage('/pages/mine/account/directory')">
					<image :src="UserInfo.avatar" mode="aspectFill"></image>
					<view class="edit"><u-icon name="camera-fill" color="rgba(255, 255, 255, .5)"></u-icon></view>
					<view class="real" :class="UserInfo.is_auth==1?'yes':'no'">{{UserInfo.is_auth==1?'已实名':'未实名'}}
					</view>
				</view>
				<view class="text">
					<view class="name">{{UserInfo.realname}}</view>
					<view class="vip">{{UserInfo.invite_level_name}}</view>
				</view>
				<view class="singin" @click="toPage(`/pages/mine/singIn/index`)">签到</view>
			</view>
			<view class="card">
				<view class="title">
					<view class="h2">资产预览</view>
					<view class="more" v-if="typeList.total_price">{{typeList.total_price.price}}</view>
				</view>
				<view class="list">
					<view class="item" v-for="(item,index) in typeList" :key="index"
						@click="toPage(`/pages/mine/assetDetail?type=${item.moneytype}&index=${index}`)"
						v-if="item.moneytype != 'total'">
						<view class="text">
							<view class="desc">{{item.name}}</view>
							<view class="num">{{item.price}}</view>
						</view>
					</view>
				</view>
				<view class="m-btn">
					<view class="sbtn" @tap="toPage('/pages/mine/recharge/recharge')">充值</view>
					<view class="sbtn" @tap="toPage('/pages/mine/withdraw/withdraw')">提现</view>
					<view class="sbtn" @tap="toPage('/pages/mine/transfer/transfers')">转账</view>
				</view>
			</view>
		</view>
		<view class="main">
			<view class="old" @tap="toPage('/pages/mine/notarialList')">
				<view class="img">
					<image :src="settingInfo.rank_image" mode="widthFix"></image>
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
				<view class="item" @tap="toPage('/pages/mine/withdraw/history?type=1')">
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
				<view class="item" @tap="toPage('/pages/service/invite')">
					<view class="icon">
						<image src="/static/new/me7.png" mode="aspectFit"></image>
					</view>
					<view class="text">邀请链接</view>
					<view class="more"><u-icon name="arrow-right"></u-icon></view>
				</view>
				<view class="item" @tap="toPage('/pages/mine/address/list')">
					<view class="icon">
						<image src="/static/new/me8.png" mode="aspectFit"></image>
					</view>
					<view class="text">收货地址</view>
					<view class="more"><u-icon name="arrow-right"></u-icon></view>
				</view>
				<view class="item" @click="toPage('/pages/service/kf')">
					<view class="icon">
						<image src="/static/new/me9.png" mode="aspectFit"></image>
					</view>
					<view class="text">人工客服</view>
					<view class="more"><u-icon name="arrow-right"></u-icon></view>
				</view>
			</view>
			<view class="btn" @click="logout">安全退出</view>
			
			<!-- <view class="footer">
				<image :src="settingInfo.mine_footer_image" mode="widthFix" class="beian"></image>
			</view> -->

			<view class="footer">
				<view class="desc" @click="servicesUnit.organizer_url && $utils.toWeb(servicesUnit.organizer_url)">
					主办单位：{{servicesUnit.organizer}}
				</view>
				<view class="desc" @click="servicesUnit.undertaker_url && $utils.toWeb(servicesUnit.undertaker_url)">
					承办单位：{{servicesUnit.undertaker}}
				</view>
				<view class="desc" @click="servicesUnit.icp_beian_url && $utils.toWeb(servicesUnit.icp_beian_url)">
					ICP备案号：{{servicesUnit.icp_beian}}
				</view>
				<view class="desc"
					@click="servicesUnit.beijin_beian_url && $utils.toWeb(servicesUnit.beijin_beian_url)">
					<image :src="servicesUnit.beijin_beian_img" mode="heightFix" style="height: 50rpx;"></image>
					{{servicesUnit.beijin_beian}}
				</view>
				<view class="desc">
					<image :src="servicesUnit.government_img" mode="heightFix" style="height: 60rpx;"
						@click="servicesUnit.government_url && $utils.toWeb(servicesUnit.government_url)"></image>
					<image :src="servicesUnit.government_website_img" mode="heightFix" style="height: 80rpx;"
						@click="servicesUnit.government_website_url && $utils.toWeb(servicesUnit.government_website_url)">
					</image>
				</view>
			</view>
			<view class="version">1.7.5</view>
			
		</view>
		<!-- <view class="version">{{settingInfo.basic.beian}}</view> -->
		<!-- <tabBarView current="5"></tabBarView> -->
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
		userPriceApi,
		servicesUnitApi
	} from '@/api/api.js'
	export default {
		data() {
			return {
				isPageShow: true,
				settingInfo: uni.getStorageSync('settingInfo'),
				UserInfo: uni.getStorageSync('user_info'),
				show: false,
				rnShow: false,
				typeList: [],
				servicesUnit: {},
			}
		},
		onLoad() {
			this.loadData();
		},
		onShow() {
			this.loadData();
			this.onShowData();
			this.rnShow = false;
			this.UserInfo = uni.getStorageSync('user_info');
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
			setCache(key, value, expire = 0) {
			    const data = {
			        value: value,
			        expire: expire ? Date.now() + expire * 1000 : 0 // 秒 → 毫秒
			    };
			    uni.setStorageSync(key, data);
			},
			getCache(key) {
			    const data = uni.getStorageSync(key);
			
			    if (!data) return null;
			
			    // 判断是否有过期时间
			    if (data.expire && data.expire < Date.now()) {
			        uni.removeStorageSync(key); // 删除过期缓存
			        return null;
			    }
			
			    return data.value;
			},
			async loadData() {
				const unitconfig = this.getCache('unitconfig');
				if (!unitconfig) {
				   servicesUnitApi().then(res => {
				   	this.servicesUnit = res.data.data
					this.setCache('unitconfig',this.servicesUnit,6000)
				   	//this.isPageShow = true;
				   })
				}else{
					this.servicesUnit = this.getCache('unitconfig');
				}
				
			},
			async onShowData() {
				userPriceApi().then(res => {
					this.typeList = res.data.data
				})
			},
			logout() {
				this.show = true
			},
			// 退出登录
			signOut() {
				uni.removeStorageSync('token')
				uni.removeStorageSync('user_info')
				uni.reLaunch({
					url: '/pages/login/login'
				})
			},
			// 实名页面跳转
			toPage(url) {
				// if (this.UserInfo.is_auth == 1) {

				// } else {
				// 	this.rnShow = true;
				// }
				if (url == '/pages/mine/assetDetail?type=points&index=points_price') {
					this.$utils.toPage('/pages/mine/points/index')
				} else {
					this.$utils.toPage(url)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		min-height: 100vh;
		height: auto;
		padding: 0 0 32rpx;
		/* H5：原生 tabBar 为 fixed 叠在页面上方，内容区不会自动让位，需预留 tab 高度 + 安全区，否则底部备案区会被挡 */
		/* #ifdef H5 */
		padding-bottom: calc(130rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(130rpx + env(safe-area-inset-bottom));
		/* #endif */
		/* APP：系统已为 tab 预留，只需少量留白 + 底部安全区 */
		/* #ifdef APP-PLUS */
		padding-bottom: calc(32rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(32rpx + env(safe-area-inset-bottom));
		/* #endif */
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
			align-items: center;
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

				.edit {
					position: absolute;
					right: 10rpx;
					top: 0;
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
					line-height: 1;
					margin-bottom: 10rpx;
				}

				.vip {
					font-size: .8em;
					font-weight: 300;
					background: rgba(0, 0, 0, 0.3);
					display: inline-block;
					padding: 10rpx 30rpx;
					line-height: 1;
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
				margin-bottom: 20rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				color: #FF374F;
				background: rgba(246, 42, 45, .15);
				border-radius: 20rpx;
				padding: 10rpx 30rpx;

				.h2 {
					font-size: 1.2em;
					font-weight: bold;
				}

				.more {
					flex: none;
					// min-width: 300rpx;
					overflow: hidden;
					font-size: 1.4em;
					font-weight: bold;
				}
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
		background: rgba(255, 255, 255, 0.9);
		color: rgba(0, 0, 0, 1);
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

		.beian {
			width: 100%;
			display: block;
			border-radius: 20rpx;
		}

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
		font-size: 0.8em;
		text-align: center;
		font-weight: bold;
		color: #fff;
		margin-top: 16rpx;
		margin-bottom: 0;
	}
</style>