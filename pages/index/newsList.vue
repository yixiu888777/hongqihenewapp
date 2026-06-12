<!-- 有用 -->
<template>
	<view class="container" style="background:#c8131e url(/static/new/bg.jpg) no-repeat center top / 100%;">
		<headerView>
			<template #leftIcon><u-icon name="arrow-left" color="#fff" size="24"></u-icon></template>
			<view>

			</view>
		</headerView>
		<view class="main">
			<view class="banner">
				<image :src="settingInfo.news_top_image" mode="widthFix"></image>
			</view>
			<scroll-view scroll-y @scrolltolower="scrollBottom" class="news">
				<view class="list">
					<view class="item" v-for="item in newsList" :key="item.id" @click="$utils.toPage(`/pages/index/newDetail?id=${item.id}`)">
						<view class="text">
							<view class="h2">{{item.title}}</view>
							<!-- <view class="desc">{{item.createtime}}</view> -->
						</view>
						<view class="img" v-if="item.is_content==1">
							<image class="item-image" :src="'https://images.weserv.nl/?url=' + item.image" mode="none">
							</image>
						</view>
						<view class="img" v-else>
							<image class="item-image" :src="item.image" mode="none"></image>
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
		commonNewsApi, // 新闻列表
	} from '@/api/api.js'
	export default {
		data() {
			return {
				// 新闻列表
				settingInfo: uni.getStorageSync('settingInfo'),
				newsList: [],
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
				commonNewsApi({
					page: this.page
				}).then(res => {
					let data = res.data.data.data
					if (data.length > 0) {
						this.newsList = [...this.newsList, ...data]
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
		height: auto;
	}
	.main {
		color: #040A13;
		padding: 0 30rpx;
	}
	.banner {
		background: #fff;
		border-radius: 20rpx;
		margin-bottom: 30rpx;
		image {
			display: block;
			width: 100%;
			border-radius: 20rpx;
		}
	}
	.news {
		.list {
			.item {
				display: flex;
				align-items: center;
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
				.text {
					line-height: 1;
					padding-right: 20rpx;
					overflow: hidden;
					flex: 1;
					.h2 {
						font-weight: 500;
						margin-bottom: 20rpx;
						font-size: 1em;
						line-height: 1.2;
						max-height: 2.4em;
						overflow: hidden;
						text-overflow: ellipsis;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
						display: -webkit-box;
					}
					.desc {
						color: rgba(4, 10, 19, .7);
						font-size: .9em;
						line-height: 1.2;
						overflow: hidden;
						text-overflow: ellipsis;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
						display: -webkit-box;
					}
				}
			}
			.item:last-child {
				border-bottom: none;
			}
		}
	}
</style>