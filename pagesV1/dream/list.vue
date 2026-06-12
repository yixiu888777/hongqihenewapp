<template>
	<view class="container">
		<headerView>申购记录</headerView>
		<scroll-view scroll-y="true" @scrolltolower="scrollBottom" class="content">
			<view class="list">
				<view class="item " v-for="item in list" :key="item.id">
					<view class="title flex_between">{{item.pro_name}}
						<view class="to_detail" @click="previewImg=item.c_image" v-if="item.pro_cate_id == 2">查看详情</view>
					</view>
					<view class="detail">
						<view class="detail_item" v-for="(i, index) in item.infolist" :key="index">
							<view class="value">{{i.value}}</view>
							<view class="name">{{i.name}}</view>
						</view>
					</view>
					<view class="status flex" v-if="item.type != 4">
						<image class="img" src="../../static/image/dream/income.svg"></image>
						<text>收益类型：{{item.type_str}}</text>
					</view>
					
					<view class="button" v-if="item.pro_cate_id != 2" @click="previewImg=item.c_image">查看详情</view>
					<view class="button" v-else @tap="!!item.video?'':$utils.toPage(`/pages/dream/upload?id=${item.id}`)">{{!!item.video?'已上传宣传视频/图片':'上传宣传视频/图片'}}</view>
				</view>
			</view>
		</scroll-view>
		<u-popup :show="previewImg!=''" mode="center">
			<view class="img_mask col_center">
				<view class="img_show">
					<image :src="previewImg" mode="widthFix"></image>
				</view>
				<view class="close" @click="previewImg=''">
					<image src="@/static/public/close.svg" mode="widthFix"></image>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import { orderAPI } from '@/api/api.js'
	export default {
		data() {
			return {
				previewImg: '',
				list: [],
				page: 1
			};
		},
		onShow() {
			this.page = 1
			this.list = []
			this.getOrder()
		},
		methods: {
			scrollBottom() {
				this.page++
				this.getOrder()
			},
			getOrder() {
				orderAPI({
					cate_id: '',
					page: this.page
				}).then(res => {
					let data = res.data.data.data
					if (data.length > 0) {
						this.list = [...this.list, ...data]
					} else {
						uni.$u.toast('数据加载完毕！')
						this.page--
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		background: url("/static/mine/recharge_bg.svg") no-repeat center top / 100%;
		background-color: rgba(255, 255, 255, 1);

		.content {
			width: 750rpx;
			background-color: rgba(255, 255, 255, 1);


			.list {
				padding: 32rpx;

				.item {
					margin-bottom: 32rpx;
					padding: 32rpx 24rpx;
					border-radius: 20rpx;
					box-shadow: 0px 0px 32px 0px #8898AA26;

					&:last-child {
						margin-bottom: 0;
					}

					.title {
						font-size: var(--font-14);
						font-weight: 500;
						line-height: 60rpx;
						text-align: left;
						color: #222222;
						border-bottom: 1px dashed #F2F2F3;

						.to_detail {
							font-size: var(--font-12);
							font-weight: 500;
							line-height: 40rpx;
							color: #F33E31;
						}
					}

					.detail {
						display: grid;
						grid-template-columns: 1fr 1fr;
						gap: 24rpx;
						margin-top: 20rpx;
						margin-bottom: 24rpx;

						.detail_item {
							font-weight: 500;
							line-height: 40rpx;
							text-align: left;

							.value {
								font-size: var(--font-14);
								color: #F33E31;
							}

							.name {
								font-size: var(--font-12);
								color: #6F7374;
								margin-top: 20rpx;
							}
						}
					}

					.status {
						font-size: var(--font-12);
						font-weight: 400;
						line-height: 32rpx;
						text-align: left;
						color: #6F7374;

						.img {
							width: 38rpx;
							height: 38rpx;
						}
					}

					.button {
						margin-top: 20rpx;
						height: 80rpx;
						background: transparent;
						border: 2rpx solid #F33E31;
						border-radius: 120rpx;
						color: #F33E31;
						font-size: var(--font-13);
					}
				}
			}
		}
		
		.img_mask {
			width: 100vw;
			height: 100vh;
		
			.img_show {
				width: 668rpx;
			}
		
			.close {
				width: 76rpx;
				height: 76rpx;
				margin-top: 50rpx;
			}
		}
	}
</style>