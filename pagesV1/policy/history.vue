<template>
	<view class="container" style="background:#df2516 url(/static/new/bg.png) no-repeat center top / 100%;background-attachment: fixed;">
		<view class="content">
			<view class="list">
				<view class="item" v-for="(item,index) in list" :key="index">
					<view class="title">{{item.pro_name}}</view>
					<view class="dl" v-for="(item2,index2) in item.infolist" :key="index2">
						<view class="dt">{{item2.name}}</view>
						<view class="dd" :class="item2.name == '申购金额'? 'num':''">{{item2.value}}</view>
					</view>
				</view>
				<uni-load-more iconType="snow" :status="load.status" color="rgba(255,255,255,.5)" />
			</view>
		</view>
		<!-- 是否实名认证 -->
		<Real-Name></Real-Name>
	</view>
</template>

<script>
	import {
		orderAPI //申购记录
	} from '@/api/api.js'
	export default {
		data() {
			return {
				page: 1,
				list: [],
				load:{
					status: 'loading', //more/loading/noMore
				},
				total: 0
			};
		},
		onLoad() {
			this.getOrderList()
		},
		onReachBottom() {
			// 上拉触底时
			// console.log("sss")
			this.scrollBottom()
		},
		methods: {
			scrollBottom() {
				this.page++
				this.load.status = 'loading';
				this.getOrderList()
			},
			getOrderList() {
				orderAPI({ page: this.page }).then(res => {
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
			}
		}
	}
</script>

<style lang="scss">
	.container { height: auto; min-height: 100vh;
		.content { padding:30rpx; display: flex;
			.list{ flex: 1; 
				.item { background: #fff; padding: 30rpx; border-radius: 20rpx; margin-bottom: 30rpx;
					.title{ font-weight: bold; font-size: 1.2em; border-bottom: 2rpx dashed #e5e5e5; padding: 0 0 20rpx; margin-bottom: 20rpx;}
					.dl{ display: flex; justify-content: space-between; align-items: center; padding: 20rpx; border-radius: 10rpx; line-height: 1;
						.dt{ font-size: .8em; opacity: .8;}
						.dd{}
						.num{color: #ff3650;}
					}
					.dl:nth-child(odd){ background: linear-gradient(to left, rgba(247, 247, 247, .7), rgba(216, 216, 216, .3)); }
				}
			}
		}
	}
</style>