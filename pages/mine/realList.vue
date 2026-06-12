<!-- 有用 -->
<template>
	<view class="container" style="background:#c8131e url(/static/new/bg.jpg) no-repeat center top / 100%;">
		<headerView>
			<template #leftIcon><u-icon name="arrow-left" color="#fff" size="24"></u-icon></template>
			<view>审核记录</view>
		</headerView>
		<view class="main">
			<scroll-view scroll-y @scrolltolower="scrollBottom" class="news">
				<view class="list">
					<view class="item" v-for="item in lists" :key="item.id">
						<view class="dl">
							<view class="dt">状态</view>
							<view class="dd">
								<view class="status" :class="'status'+item.status">{{item.status_name}}</view>
							</view>
						</view>
						<view class="dl">
							<view class="dt">缘由</view>
							<view class="dd">{{item.remark}}</view>
						</view>
					</view>
				</view>
				<uni-load-more iconType="snow" :status="loadStatus" color="rgba(255,255,255,.5)"></uni-load-more>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import {
		userRealRecordApi,
	} from '@/api/api.js'
	export default {
		data() {
			return {
				lists: [],
				page: 1,
				loadStatus: 'loading' //more/loading/noMore
			}
		},
		onLoad() {
			// 新闻
			this.getNewsList()
		},
		onShow() {

		},
		onHide() {

		},
		onUnload() {

		},
		onReachBottom() {
			// 上拉触底时
			this.scrollBottom()
		},
		methods: {
			// 加载更多
			scrollBottom() {
				this.loadStatus = 'loading';
				this.page++
				this.getNewsList()
			},
			// 获取新闻列表
			getNewsList() {
				userRealRecordApi({
					page: this.page
				}).then(res => {
					let data = res.data.data
					if (data.length > 0) {
						this.lists = [...this.lists, ...data]
						this.loadStatus = 'more';
					} else {
						this.loadStatus = 'noMore';
						uni.$u.toast('数据加载完毕!')
						this.page--
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		min-height: 100vh;
		height: auto;
	}

	.main {
		color: #040A13;
		padding: 0 30rpx;
	}

	.banner {
		background: #fff;
		border-radius: 20rpx;
		height: 200rpx;
		margin-bottom: 60rpx;
	}

	.news {
		.list {
			.item {
				border-bottom: 1px solid rgba(0, 0, 0, .1);
				padding: 30rpx;
				background: #fff;
				border-radius: 10rpx;
				margin-bottom: 30rpx;

				.img {
					background: #f5f5f5;
					border-radius: 20rpx;

					image,
					img {
						width: 200rpx;
						height: 140rpx;
						display: block;
						border-radius: 20rpx;
					}
				}

				.dl {
					display: flex;
					justify-content: space-between;
					line-height: 1.2;
					padding: 10rpx 0;
					overflow: hidden;
					flex: 1;

					.dt {
						font-weight: 500;
						font-size: 1em;
						overflow: hidden;
						text-overflow: ellipsis;
						padding-right: 20rpx;
						-webkit-line-clamp: 1;
						-webkit-box-orient: vertical;
						display: -webkit-box;
					}

					.dd {
						color: rgba(4, 10, 19, .7);
						font-size: .9em;
						overflow: hidden;
						text-overflow: ellipsis;
						-webkit-line-clamp: 1;
						-webkit-box-orient: vertical;
						display: -webkit-box;

						.status1 {
							color: rgba(7, 193, 96, 1);
						}

						.status2 {
							color: rgba(246, 42, 45, 1);
						}
					}
				}

			}

			.item:last-child {
				border-bottom: none;
			}
		}
	}
</style>