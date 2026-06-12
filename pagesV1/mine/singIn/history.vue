<template>
	<view class="container">
		<scroll-view scroll-y="true" @scrolltolower="scrollBottom" class="content">
			<view class="list" v-if="total > 0">
					<view class="item" v-for="(item,index) in list" :key="index">
						<view class="title flex_between">
							<view class="text">签到时间</view>
							<view class="time">{{item.createtime}}</view>
						</view>
						<view class="box flex_between" v-if="item.sign_reward.name">
							<view class="sw" v-if="item.sign_reward.type == 1">
								<!-- 实物 -->
								<view class="text">
									<view class="h2">签到奖励</view>
									<view class="name">{{item.sign_reward.name}}</view>
									<view class="type">{{item.sign_reward.type_name}}</view>
									<view class="num">价值：{{item.sign_reward.price}}元</view>
									<view class="desc" v-if="item.is_shipment == 0" @click="toLoads(settingInfo.service.service_url)">请联系官方工作人员发货</view>
									<view class="desc" v-if="item.is_shipment == 1">已发货</view>
								</view>
								<view class="img"><image :src="item.sign_reward.image" mode="widthFix"></view>
							</view>
							<view class="xj" v-if="item.sign_reward.type == 2">
								<!-- 现金奖励 -->
								<view class="text">
									<view class="h2">签到奖励</view>
									<view class="name">{{item.sign_reward.name}}</view>
									<view class="type">{{item.sign_reward.type_name}}</view>
								</view>
								<view class="num">{{item.sign_reward.price}}</view>
							</view>
						</view>
						<view class="box flex_between" v-if="item.lx_reward.name">
							<view class="xj">
								<view class="text">
									<view class="h2">连续签到奖励</view>
									<view class="name">{{item.lx_reward.name}}</view>
									<!-- <view class="day">连续签到天数：{{item.lx_reward.day}}</view> -->
									<view class="type">{{item.lx_reward.type_name}}</view>
									<view class="desc">{{item.lx_reward.wallet_name}}</view>
								</view>
								<view class="num">{{item.lx_reward.price}} 元</view>
							</view>
						</view>
					</view>
					<uni-load-more iconType="snow" :status="load.status" color="rgba(0,0,0,.3)" />
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
		signRewardApi
	} from '@/api/api.js'
	export default {
		data() {
			return {
				settingInfo: uni.getStorageSync('settingInfo'),
				page: 1,
				list: [],
				load:{
					status: 'loading', //more/loading/noMore
				},
				total: 0
			};
		},
		onLoad() {
			this.getSignRewardList()
		},
		onReachBottom() {
			// 上拉触底时
			this.scrollBottom()
		},
		methods: {
			scrollBottom() {
				// console.log("scrollBottom")
				this.load.status = 'loading';
				this.page++
				this.getSignRewardList()
			},
			getSignRewardList() {
				signRewardApi({
					page: this.page
				}).then(res => {
					this.total = res.data.data.total
					let data = res.data.data.data
					if (data.length > 0) {
						this.list = [...this.list, ...data]
						this.load.status = 'more';
					} else {
						this.load.status = 'noMore';
						uni.$u.toast('数据加载完毕！')
						this.page--
					}
				})
			},
			// 跳转在线客服
			toLoads(url) {
				uni.navigateTo({
					url: `/pages/noPage/index?url=${url.split("&").join("$")}`
				})
			}
		}
	}
</script>

<style lang="scss">
	.container {
		.content { padding:30rpx; display: flex;
			.list{ flex: 1;
				.item { background: #fff; flex: 1;
					padding: 30rpx;
					margin: 0 auto 30rpx; border-radius: 20rpx;
					font-weight: 400; 
					line-height: 48rpx;
					color: rgba(17, 24, 38, 1);
					.title{ margin-bottom: -10rpx; 
						.time{opacity: .5;}
					}
					.box{ margin-top: 30rpx; padding:50rpx 30rpx; border-radius: 20rpx; background: linear-gradient(to left, rgba(247, 247, 247, .7), rgba(216, 216, 216, .3)); position: relative;
						.sw{ flex: 1; display: flex; justify-content: space-between; align-items: center;
							.text{ flex: 1; padding-right: 20rpx;
								.name{ font-size: 1.2em; font-weight: bold; }
								.h2{ position: absolute; top: 0; right: 0; padding: 5rpx 20rpx; border-radius: 0 20rpx 0 20rpx; background: linear-gradient(to left, rgba(255, 98, 75, 1), rgba(255, 54, 80, 1)); color: #fff; font-size: .8em;}
								.num{ color: rgba(243, 62, 49, 1);}
								.desc{ font-size: .8em; opacity: .8;}
							}
							// .h2{ opacity: .5; }
							.img{ width: 160rpx;
								image{  width: 100%; border-radius: 10rpx; }
							}							
						}
						.xj{ flex: 1; display: flex; justify-content: space-between; align-items: center;
							.text{ flex: 1; padding-right: 20rpx;
								.name{ font-size: 1.2em; font-weight: bold; }
								.h2{ position: absolute; top: 0; right: 0; padding: 5rpx 20rpx; border-radius: 0 20rpx 0 20rpx; background: linear-gradient(to left, rgba(255, 98, 75, 1), rgba(255, 54, 80, 1)); color: #fff; font-size: .8em;}
								.num{ font-size: 1em;}
								.desc{ font-size: .8em; opacity: .8;}
							}
							.num{ font-size: 1.6em; font-weight: bold; color: rgba(243, 62, 49, 1); }
						}
						
					}
				}
			}
		}
	}
</style>