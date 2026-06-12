<!-- 有用 -->
<template>
	<view class="container" v-if="isPageShow">
		<view class="main">
			<view class="news">
				<view class="list">
					<view class="item" v-for="item in newsList" :key="item.id">
						<view class="h2">{{item.title}}</view>
						<view class="text">
							<view class="icon"><image src="/static/new/mt11.png" mode="widthFix"></image></view>
							<view class="desc" @tap="copyText(item.url)">{{item.url}}</view>
							<view class="icon copy"><image src="/static/new/copy.png" mode="widthFix"></image></view>
						</view>
						<view class="text">
							<view class="icon"><image src="/static/new/mt22.png" mode="widthFix"></image></view>
							<view class="desc">{{item.speaker}}</view>
						</view>
						<view class="text">
							<view class="icon"><image src="/static/new/mt33.png" mode="widthFix"></image></view>
							<view class="desc">{{item.time}}</view>
						</view>
						<view class="btn">
							<view class="sbtn" @click="$utils.toWeb(`${item.playback_url}`)">回放</view>
						</view>
					</view>
				</view>
				<uni-load-more iconType="snow" :status="load.status" color="rgba(255,255,255,.5)" />
			</view>
		</view>
	</view>
</template>

<script>
	import {
		meetingPlaybackApi, // 获取记录回放
	} from '@/api/api.js'
	export default {
		data() {
			return {
				isPageShow: false,
				// 新闻列表
				newsList: [],
				page: 1,
				load:{
					status: 'loading', //more/loading/noMore
				},
			}
		},
		onLoad() {
			this.loadData();
		},
		onShow() {
			
		},
		onHide() {
			
		},
		onUnload() {
			// 页面卸载时
		},
		onReachBottom() {
			// 上拉触底时
			this.page++
			this.loadData()
		},
		methods: {
			async loadData() {
				meetingPlaybackApi({
					page: this.page
				}).then(res => {
					let data = res.data.data.data
					if (data.length > 0) {
						this.newsList = [...this.newsList, ...data]
						this.load.status = 'more';
					} else {
						this.load.status = 'noMore';
						uni.$u.toast('数据加载完毕!')
						this.page--
					}
				})
				this.isPageShow = true;
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
		}
	}
</script>

<style lang="scss" scoped>
	.container { min-height: 100vh; background:#FF363E url(/static/new/bg.png) no-repeat top center; background-size: cover;  height: auto; }
	.main{ color: #040A13; margin-bottom: calc(60px + env(safe-area-inset-bottom));}
	.news{ padding: 30rpx; 
		.list{ 
			.item{ padding: 30rpx;  background: #fff; border-radius: 20rpx; margin-bottom: 30rpx;
				.h2{ font-weight: bold; margin-bottom: 30rpx; }
				.text{ line-height: 1; display: flex; align-items: center; margin-bottom: 20rpx;
					.icon{ border-radius: 20rpx;
						image,img{ width: 50rpx; display: block;}
					}
					.desc{  padding-left:20rpx; color: rgba(4, 10, 19, .7); white-space: nowrap; overflow: hidden; }
					.copy{  padding-left:20rpx;
						image,img{ width: 30rpx; display: block;}
					}
				}
				.btn{ background: #FF3650; background: linear-gradient(to left, #FF624B, #FF3650); color: #fff; text-align: center; padding: 20rpx; border-radius: 20rpx; box-shadow: 0 2rpx 5rpx rgba(255, 77, 77, 0.30);  margin-top: 60rpx;}
			}
			.item:last-child{ border-bottom:none;}
		}
	}
	.m-noData{ background: #f5f5f5; height: 100vh; }
</style>