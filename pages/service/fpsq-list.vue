<template>
	<view class="container" style="background:#c8131e url(/static/new/bg.jpg) no-repeat center top / 100%;">
		<headerView>
			<template #leftIcon><u-icon name="arrow-left" color="#fff" size="24"></u-icon></template>
			<view>申请记录</view>
		</headerView>
		<scroll-view scroll-y="true" @scrolltolower="scrollBottom" class="content" v-if="lists.length > 0">
			<view class="list">
				<view class="item" v-for="(item,index) in lists" :key="index">
					<view class="text">
						<view class="q">
							<image src="/static/new/tls.png" mode="heightFix"></image> {{item.createtime}}
						</view>
						<view :class="'static status' + item.status">{{item.status_name}}</view>
					</view>
					<view class="a">备注：{{item.remark}}</view>
				</view>
				<uni-load-more iconType="snow" :status="loadStatus" color="rgba(255,255,255,.5)" />
			</view>
		</scroll-view>
		<view class="m-noData" v-else>
			<u-empty mode="data"></u-empty>
		</view>
	</view>
</template>

<script>
	import {
		userSupportRecordApi
	} from '@/api/api.js'
	export default {
		data() {
			return {
				pageShow: false,
				settingInfo: uni.getStorageSync('settingInfo'),
				lists: [],
				page: 1,
				loadStatus: 'loading', //more/loading/noMore
			};
		},
		onLoad() {
			this.loadData();
		},
		onReachBottom() {
			// 上拉触底时
			this.loadStatus = 'loading';
			this.page++
			this.getList();
		},
		methods: {
			loadData() {
				userSupportRecordApi().then(res => {
					let list = res.data.data.data
					this.lists = this.page === 1 ? list : [...this.lists, ...list];
					this.loadStatus = res.data.data.last_page > this.page ? 'more' : 'nomore';
					this.pageShow = true;
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.list {
		padding: 0 30rpx 30rpx;
		.item {
			background: #fff;
			border-radius: 20rpx;
			margin-bottom: 30rpx;
			.text {
				padding: 30rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.icon {
					width: 50rpx;
					flex: none;
					image {
						width: 50rpx;
						display: block;
					}
				}
				.q {
					flex: 1;
					font-weight: bold;
					image {
						height: 50rpx;
						margin-right: 20rpx;
						vertical-align: middle;
					}
				}
				.status0 {
					color: rgba(255, 85, 0, 1.0);
				}
				.status1 {
					color: rgba(7, 193, 96, 1);
				}
				.status2 {
					color: rgba(246, 42, 45, 1);
				}
			}
			.a {
				border-top: 2rpx solid #e5e5e5;
				opacity: .5;
				padding: 30rpx;
			}
		}
		.item.on {
			.text {
				padding: 0 0 0 30rpx;
				.a {
					display: block;
				}
			}
		}
	}
	.m-noData {
		background-color: #fff;
		width: 690rpx;
		border-radius: 20rpx;
		height: 100%;
		margin: 0 30rpx 30rpx;
	}
</style>