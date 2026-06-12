<template>
	<view class="container">
		<headerView>
			<template #leftIcon><u-icon name="arrow-left" color="#fff" size="24"></u-icon></template>
			<view>纪元基金</view>
		</headerView>
		<scroll-view scroll-y class="main" @scrolltolower="scrollBottom">
			<view class="titlex">
				<text>百年复兴</text>
				<text>纪元基金</text>
			</view>
			<view class="tab1">
				<view class="item" v-for="item in epochList" :key="item.id" @click="submits(item.id)">
					<image :src="item.image" mode="widthFix"></image>
					<view class="kl">
						<view class="name">{{ item.name }}</view>
						<view class="kl_t">{{ item.price }}</view>
					</view>
					<view class="kl_b">共襄伟业</view>
				</view>
			</view>
			<uni-load-more iconType="snow" :status="loadStatus" color="rgba(255,255,255,.5)"></uni-load-more>
		</scroll-view>

		<u-popup :show="rnShow" mode="center" round="32" @close="rnShow = false">
			<view class="van-dialog van-dialog2">
				<view class="van-dialog__header">温馨提示</view>
				<view class="van-dialog__content">
					<view class="icon">
						<image src="/static/new/safe.png" mode="heightFix" style="height: 160rpx;"></image>
					</view>
					<view class="desc">领取前请先完成实名认证审核</view>
				</view>
				<view class="van-dialog__footer">
					<view class="van-success" @tap="$utils.toPage('/pages/mine/realName')">去认证</view>
				</view>
			</view>
		</u-popup>

		<u-popup :show="jyShow" mode="center" round="32" @close="onjyShow">
			<view class="van-dialog van-dialog2">
				<view class="van-dialog__header">
					<image src="/static/new/gift2.png" mode="heightFix" style="height: 50rpx; vertical-align: middle;"></image>
					恭喜您!
				</view>
				<view class="van-dialog__content">
					<view class="desc">您将获得纪元基金</view>
					<view class="num">￥ {{ jyEpoch.price }}</view>
					<view class="desc">请保持签到，共襄伟业！</view>
				</view>
				<view class="van-dialog__footer">
					<view class="van-success" @tap="onjyShow">关闭</view>
					<view class="van-success" @tap="onEpoch">确认领取</view>
				</view>
			</view>
		</u-popup>

		<u-popup :show="imgShow" mode="center" round="32" :closeable="true" @close="onimgShow">
			<view class="van-img">
				<image src="/static/new/IMG_4904.jpg" mode="aspectFill"></image>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		userEpochApi,
		epochReceiveApi,
		userInfoApi
	} from '@/api/api.js'

	export default {
		data() {
			return {
				settingInfo: uni.getStorageSync('settingInfo'),
				UserInfo: uni.getStorageSync('user_info'),
				epochList: [],
				page: 1,
				loadStatus: 'loading',
				jyShow: false,
				jyEpoch: {},
				rnShow: false,
				imgShow: false
			}
		},
		onLoad() {
			this.epoch()
		},
		onShow() {
			this.getUserInfo()
		},
		onReachBottom() {
			this.scrollBottom()
		},
		methods: {
			getUserInfo() {
				userInfoApi().then(res => {
					this.UserInfo = res.data.data
					uni.setStorageSync('user_info', res.data.data)
				})
			},
			submits(id) {
				if (this.UserInfo.is_auth == 1) {
					const targetEpoch = this.epochList.filter(item => item.id === id)
					this.jyEpoch = targetEpoch[0]
					this.jyShow = true
				} else {
					this.rnShow = true
				}
			},
			onEpoch() {
				this.jyShow = false
				this.imgShow = true
				epochReceiveApi({
					id: this.jyEpoch.id
				}).then(res => {
					uni.$u.toast(res.data.msg)
				})
			},
			onjyShow() {
				this.jyShow = false
			},
			onimgShow() {
				this.imgShow = false
			},
			epoch() {
				userEpochApi({
					page: this.page
				}).then(res => {
					const data = res.data.data.data
					if (data.length > 0) {
						this.epochList = [...this.epochList, ...data]
						this.loadStatus = 'more'
					} else {
						this.loadStatus = 'noMore'
						if (this.page > 1) {
							uni.$u.toast('数据加载完毕!')
							this.page--
						}
					}
				})
			},
			scrollBottom() {
				if (this.loadStatus === 'noMore') return
				this.loadStatus = 'loading'
				this.page++
				this.epoch()
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #c8131e;
		background-image: url(/static/new/bg.jpg);
		background-repeat: no-repeat;
		background-position: center top;
		background-size: 100% 100%;
		min-height: 100%;
	}
</style>

<style lang="scss" scoped>
	.container {
		min-height: 100vh;
	}

	.main {
		height: calc(100vh - 88rpx - env(safe-area-inset-top));
		box-sizing: border-box;
	}

	.titlex {
		text-align: center;
		color: #fff;
		font-size: 46rpx;
		font-weight: 500;
		padding: 0 30rpx;
		margin-bottom: 20rpx;
		display: flex;
		justify-content: center;

		text {
			flex: 1;
			display: block;
		}
	}

	.tab1 {
		display: flex;
		flex-wrap: wrap;
		gap: 30rpx;
		margin: 0 30rpx 30rpx;

		.item {
			background: #fff;
			border-radius: 20rpx;
			width: 330rpx;
			position: relative;

			image {
				display: block;
				border-radius: 20rpx 20rpx 0 0;
				background: #eee;
				width: 100%;
				height: 220rpx;
			}

			.kl {
				color: #93969a;
				font-weight: 500;
				font-size: 24rpx;
				padding: 30rpx;

				.kl_t {
					margin-top: 5rpx;
					color: rgba(246, 42, 45, 1);
					font-size: 36rpx;
					font-weight: 800;
				}
			}

			.kl_b {
				background-color: rgba(246, 42, 45, 1);
				color: #fff;
				text-align: center;
				margin: 0 30rpx 30rpx;
				border-radius: 10rpx;
				padding: 20rpx 0;
				font-size: 24rpx;
			}
		}
	}
</style>
