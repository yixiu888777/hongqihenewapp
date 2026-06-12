<!-- 有用 -->
<template>
	<view class="container">
		<view class="main">
			<view class="news" v-if="lists.length > 0">
				<view class="list">
					<view class="item" v-for="item in lists" :key="item.id">
						<view class="text">
							<view class="h2">{{item.memo}} - {{item.money_type_str}}</view>
							<view class="desc">{{item.createtime}}</view>
						</view>
						<view class="num">{{item.money}}</view>
					</view>
				</view>
			</view>
			<view class="m-noData" v-else>
				<view class="item">
					<view class="icon"><image src="@/static/new/nodata.png" mode="widthFix"></image></view>
				</view>
			</view>
			<!-- <uni-load-more iconType="snow" :status="loadStatus"></uni-load-more> -->
		</view>
	</view>
</template>

<script>
	import {
		stateRecordApi, 
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
			this.getList()
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
				this.getList()
			},
			// 获取新闻列表
			getList() {
				stateRecordApi({
					page: this.page
				}).then(res => {
					let data = res.data.data.data
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
	.container { height: auto;  }
	.main{ margin-top: 30rpx; color: #040A13; }
	.news{ background: #fff; border-radius: 10rpx; padding:0 30rpx;
		.list{
			.item{ display: flex; align-items: center; border-bottom: 1px solid rgba(0, 0, 0, .1); padding: 30rpx 0;
				.text{line-height: 1;  padding-left: 20rpx; overflow: hidden; flex: 1;
					.h2{font-weight: 500; margin-bottom: 20rpx; font-size: 1em; height: 40rpx; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;}
					.desc{ color: rgba(4, 10, 19, .7); font-size: .9em; line-height: 1.2; overflow: hidden; text-overflow: ellipsis; -webkit-line-clamp: 2; -webkit-box-orient: vertical; display: -webkit-box; }
				}
				.num{ font-size: 1.4em; font-weight: bold; color: rgba(255, 55, 79, 1); }
			}
			.item:last-child{ border-bottom:none;}
		}
	}
</style>