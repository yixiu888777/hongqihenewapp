<template>
	<view class="container" :style="'background: #df2516 url(/static/new/bg.png) no-repeat center top / 100%;background-attachment: fixed;'">
		<scroll-view scroll-y @scrolltolower="scrollBottom" class="content">
			<view class="list" v-if="list.length > 0">
				<view class="item flex" v-for="item in list" :key="item.id" @click="$utils.toPage(`/pages/mine/messages/detail?id=${item.id}`)">
					<image src="@/static/new/t2.png" mode="widthFix"></image>
					<view class="item-info">
						<view class="title flex_between">{{item.title}}
							<!-- <view class="time">{{item.createtime}}</view> -->
						</view>
						<view class="text el2" v-html="item.content"></view>
					</view>
					<view class="op">
						<view class="status error" v-if="item.status == 0"><u-badge :isDot="true" type="error" class="u-badge"></u-badge> 未读</view>
						<view class="status success" v-if="item.status == 1"><u-badge :isDot="true" type="success" class="u-badge"></u-badge> 已读</view>
					</view>
				</view>
			</view>
			<view class="m-noData" v-else>
				<view class="item">
					<view class="icon"><image src="@/static/new/nodata.png" mode="widthFix"></image></view>				
					<view class="text">暂无数据</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import {
		userMessageApi
	} from '@/api/api.js'
	export default {
		data() {
			return {
				settingInfo: uni.getStorageSync('settingInfo'),
				page: 1,
				list: []
			};
		},
		onLoad() {
		},
		onShow() {
			this.list = []
			this.getMessageList()			
		},
		methods: {
			scrollBottom() {
				this.page++
				this.getMessageList()
			},
			getMessageList() {
				userMessageApi({
					page: this.page
				}).then(res => {
					let data = res.data.data.data
					if (data.length > 0) {
						this.list = [...this.list, ...data]
					} else {
						uni.$u.toast('数据加载完毕!')
						this.page--
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.container { min-height: 100vh; height: auto;}
	.container {
		.content { display: flex; 
			.list {
				padding: 30rpx;
				.item { background: #fff; padding: 30rpx; border-radius: 20rpx;
					margin-bottom: 30rpx;
					image {
						width: 80rpx;
						height: 80rpx;
						flex-shrink: 0;
						border-radius: 50%;
						overflow: hidden;
					}

					.item-info {
						margin-left: 20rpx;
						font-family: Roboto;
						font-weight: 400;
						flex: 1;

						.title {
							font-weight: 700;
							color: rgba(0, 0, 0, 1);
							line-height: 1; margin-bottom: 10rpx;
						}

						.text {
							font-size: .8em;
							line-height: 28rpx;
							color: rgba(90, 98, 116, 1);
						}

						.time {
							font-size: var(--font-12);
							color: rgba(158, 163, 174, 1);
						}
					}
					.op{ padding-left: 60rpx; font-size: .8em; 
						.status{ color: #999;
							.u-badge{ display: inline-block; margin-right: 10rpx; }
						}
						.error{ color: #f56c6c; }
						.success{ color: #5ac725; }
						
						image{ height: 20rpx; margin-right: 10rpx; }
					}
				}
			}
		}
	}
	.m-noData{ background: #f5f5f5; height: 100vh; }
</style>