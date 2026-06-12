<!-- 有用 -->
<template>
	<view class="container">
		<view class="main">
			<view class="news">
				<view class="list">
					<view class="item" v-for="item in newsList" :key="item.id" @click="$utils.toPage(`/pages/index/newDetail?id=${item.id}`)">
						<view class="img" v-if="item.is_content==1"><image class="item-image" :src="'https://images.weserv.nl/?url=' + item.image" mode="none"></image></view>
						<view class="img" v-else><image class="item-image" :src="item.image" mode="none"></image></view>
						<view class="text">
							<view class="h2">{{item.title}}</view>
							<view class="desc">{{item.desc}}</view>
						</view>
					</view>
				</view>
			</view>
			<uni-load-more iconType="snow" :status="loadStatus"></uni-load-more>
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
			this.getRight()
		},
		methods: {
			// 加载更多
			getRight() {
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
	.container { height: auto;  }
	.main{ margin-top: 30rpx; color: #040A13; }
	.news{ background: #fff; border-radius: 10rpx; padding:0 30rpx;
		.list{
			.item{ display: flex; border-bottom: 1px solid rgba(0, 0, 0, .1); padding: 30rpx 0;
				.img{ background: #f5f5f5; border-radius: 20rpx;
					image,img{ width: 200rpx; height: 140rpx; display: block; border-radius: 20rpx;}
				}
				.text{line-height: 1;  padding-left: 20rpx; overflow: hidden;
					.h2{font-weight: 500; margin-bottom: 20rpx; font-size: 1em; height: 40rpx; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;}
					.desc{ color: rgba(4, 10, 19, .7); font-size: .9em; line-height: 1.2; height: 70rpx; overflow: hidden; text-overflow: ellipsis; -webkit-line-clamp: 2; -webkit-box-orient: vertical; display: -webkit-box; }
				}
			}
			.item:last-child{ border-bottom:none;}
		}
	}
</style>