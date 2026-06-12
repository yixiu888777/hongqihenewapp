<template>
	<view class="container">
		<scroll-view scroll-y="true" @scrolltolower="scrollBottom" class="content" v-if="list.length > 0">
			<view class="item" v-for="item in list" :key="item.id">
				<view class="flex_between">
					<view>登录时间：</view>
					<view>{{item.createtime}}</view>
				</view>
				<view class="flex_between">
					<view>登录ip地址：</view>
					<view>{{item.ip}}</view>
				</view>
			</view>
			<!-- <uni-load-more iconType="snow" :status="load.status" color="rgba(0,0,0,.3)" /> -->
		</scroll-view>
		<view class="m-noData" v-else>
			<view class="item">
				<view class="icon"><image src="@/static/new/nodata.png" mode="widthFix"></image></view>				
				<view class="text">暂无数据</view>
			</view>
		</view>
		<!-- 是否实名认证 -->
		<Real-Name></Real-Name>
	</view>
</template>

<script>
	import {
		loginRecordApi
	} from '@/api/api.js'
	export default {
		data() {
			return {
				page: 1,
				list: [],
				load:{
					status: 'loading', //more/loading/noMore
				},
			};
		},
		onLoad() {
			this.getList()
		},
		methods: {
			scrollBottom() {
				this.load.status = 'loading';
				this.page++
				this.getList()
			},
			getList() {
				loginRecordApi({
					page: this.page
				}).then(res => {
					let data = res.data.data.data
					if (data.length > 0) {
						this.list = [...this.list, ...data]
						this.load.status = 'more';
					} else {
						this.load.status = 'noMore';
						uni.$u.toast('数据加载完毕!')
						this.page--
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		.content { padding:30rpx; 
			.item { background: #fff; border-radius: 20rpx; padding: 30rpx; margin-bottom: 30rpx; font-size: .8em; flex: 1;
				font-weight: 400;
				line-height: 48rpx;
				color: rgba(17, 24, 38, 1);
				.succeed {
					color: rgba(47, 146, 0, 1);
				}

				.fail {
					color: rgba(250, 60, 49, 1);
				}

				.audit {
					color: rgba(255, 92, 0, 1);
				}

				.tips {
					color: rgba(111, 115, 116, 1);
				}
			}
		}
	}
</style>