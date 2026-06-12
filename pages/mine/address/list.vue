<template>
	<view class="container" style="background:#c8131e url(/static/new/bg.jpg) no-repeat center top / 100%;"
		v-if="isPageShow">
		<headerView>
			<template #leftIcon><u-icon name="arrow-left" color="#fff" size="24"></u-icon></template>
			<view>收货地址</view>
		</headerView>
		<view class="main">
			<scroll-view scroll-y @scrolltolower="scrollBottom" class="content">
				<view class="list" v-if="list.length > 0">
					<view class="item" v-for="item in list" :key="item.id">
						<view class="userInfo flex">
							<view>{{item.name}}</view>
							<view style="margin-left: 20rpx;">{{item.phone}}</view>
						</view>
						<view class="address">{{item.area + item.address}}</view>
						<view class="flex_between">
							<view class="choose flex">
								<view class="box flex_center" :class="!!item.is_default?'active':''">
									<u-icon name="checkbox-mark" color="#ffffff" size="12"></u-icon>
								</view>
								<view>默认地址</view>
							</view>
							<view class="icon">
								<view @click.stop="$utils.toPage(`/pages/mine/address/add?id=${item.id}`)">
									<image src="/static/new/icon-edit.png" mode="heightFix"></image>
								</view>
								<!-- <view @click.stop="showClick(item.id)">删除</view> -->
							</view>
						</view>
					</view>
				</view>
				<view class="noData col_center" v-else>
					<u-empty mode="address"></u-empty>
				</view>
			</scroll-view>
			<view class="footer flex_center">
				<view class="button" @click="toPage('/pages/mine/address/add')">添加</view>
			</view>
		</view>

		<!-- 提示 -->
		<u-popup :show="show" mode="center" round="32" @close="show = false">
			<view class="van-dialog van-dialog2">
				<view class="van-dialog__header">提示</view>
				<view class="van-dialog__content">您确定要删除该地址吗</view>
				<view class="van-dialog__footer">
					<view class="van-cancel" @click="show = false">取消</view>
					<view class="van-success" @click="addressDel">确定</view>
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
		userAddressListApi,
		userAddressDeleteApi
	} from '@/api/api.js'
	export default {
		data() {
			return {
				isPageShow: false,
				settingInfo: uni.getStorageSync('settingInfo'),
				UserInfo: uni.getStorageSync('user_info'),
				nameShow: false, // 实名认证
				page: 1,
				list: [],
				id: null,
				show: false,
			};
		},
		onShow() {
			this.list = []
			this.getAddressList()
		},
		methods: {
			toPage(e) {
				if (this.UserInfo.is_auth == 1) {
					uni.navigateTo({
						url: e
					})
				} else {
					this.nameShow = true
				}
			},
			scrollBottom() {
				// this.page++
				// this.getAddressList()
			},
			getAddressList() {
				userAddressListApi({
					page: this.page
				}).then(res => {
					let data = res.data.data.data
					if (data.length > 0) {
						this.list = [...this.list, ...data]
					} else {
						uni.$u.toast('数据加载完毕')
						this.page--
					}
					this.isPageShow = true;
				})
			},
			// 提示确定删除弹窗
			showClick(id) {
				this.id = id
				this.show = true
			},
			// 删除
			addressDel() {
				this.show = false
				userAddressDeleteApi({
					id: this.id
				}).then(res => {
					uni.$u.toast(res.data.msg);
					setTimeout(() => {
						this.page = 1
						this.list = []
						this.getAddressList()
					}, 1000)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		.main {
			display: flex;
			flex-direction: column;
			flex: 1;
			margin: 0 30rpx 30rpx;
		}

		.content {
			margin-bottom: 30rpx;

			.list {
				.item {
					background-color: rgba(255, 255, 255, 1);
					border-radius: 20rpx;
					margin-bottom: 30rpx;
					padding: 30rpx;
					border-radius: 20rpx;
					background: rgba(255, 255, 255, 1);
					border: 1rpx solid rgba(206, 213, 218, .5);
					font-family: Roboto;
					font-size: var(--font-14);
					font-weight: 400;
					line-height: 48rpx;
					color: rgba(34, 34, 34, 1);

					.userInfo {
						margin-top: 20rpx;
						font-weight: 700;
					}

					.address {
						margin-bottom: 40rpx;
						line-height: 32rpx;
					}

					.icon {
						image {
							height: 30rpx;
							display: block;
						}
					}

					.choose {
						color: rgba(178, 180, 181, 1);

						.box {
							width: 36rpx;
							height: 36rpx;
							border-radius: 36rpx;
							flex-shrink: 0;
							margin-right: 20rpx;
							border: 1px solid rgba(206, 213, 218, 1);
						}

						.active {
							border: 1px solid #F33E31;
							background: #F33E31;
						}
					}
				}
			}

			.noData {
				background: #fff;
				border-radius: 20rpx;
				padding: 10vh 0;
				flex: 1;
				height: 100%;
				font-weight: 400;
				line-height: 40rpx;
				text-align: center;
				color: rgba(111, 115, 116, 1);

				image {
					width: 200rpx;
					margin-bottom: 40rpx;
				}
			}
		}

		.footer {
			.button {}
		}
	}
</style>