<template>
	<view class="container">
		<!-- <headerView>十五五战略</headerView> -->
		<scroll-view scroll-y @scrolltolower="scrollBottom" class="content">
			<view class="banner">
				<image :src="settingInfo.bg_about" mode="none"></image>
			</view>
			<view class="nav">
				<u-tabs :list="list" @click="tabClick" :activeStyle="{color: 'rgba(243, 62, 49, 1)'}" lineWidth="43"
					lineColor="rgba(243, 62, 49, 1)"></u-tabs>
			</view>
			<view class="middle">
				<view class="content-item" v-show="articleListShow" v-for="item in articleList" :key="item.id"
					@click="toPage(`/pages/index/about/aboutDetail?id=${item.id}`)">
					<view>{{item.name}}</view>
					<view class="time">{{item.createtime}}</view>
				</view>
				<u-parse v-show="!articleListShow" :content="articleInfo.content" lazyLoad :lazyLoad="true"
					:previewImg="false" @imgTap="imgTap"></u-parse>
			</view>
		</scroll-view>
		<!-- 预览图片 -->
		<u-popup :show="previewImg!=''" mode="center">
			<view class="img_mask col_center">
				<view class="close" @tap="previewImg=''">
					<image src="@/static/public/close.svg" mode="widthFix"></image>
				</view>
				<view class="img_show">
					<image :src="previewImg" mode="widthFix"></image>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		articleCateApi,
		articleApi
	} from '@/api/api.js'
	export default {
		data() {
			return {
				settingInfo: uni.getStorageSync('settingInfo'),
				id: null,

				page: 1,
				list: [],

				articleInfo: {},

				articleList: [],
				articleListShow: false,

				previewImg: ""
			};
		},
		onLoad() {
			articleCateApi().then(res => {
				this.list = res.data.data
				this.id = this.list[0].id
				this.getArticle()
			})
		},
		methods: {
			// 切换分类
			tabClick(e) {
				this.id = e.id
				this.page = 1
				this.articleList = []
				this.articleInfo = {}
				this.getArticle()
			},
			// 详情
			getArticle() {
				articleApi({
					cate_id: this.id,
					page: this.page
				}).then(res => {
					let data = res.data.data.data
					this.articleListShow = res.data.data.total * 1 > 1 ? true : false
					if (this.articleListShow) {
						if (data.length > 0) {
							this.articleList = [...this.articleList, ...data]
						} else {
							uni.$u.toast('数据加载完毕!')
							this.page--
						}
					} else {
						if (data.length > 0) {
							this.articleInfo = data[0]
						} else {
							uni.$u.toast('数据加载完毕!')
						}
					}
				})
			},
			scrollBottom() {
				if (this.articleListShow) {
					this.page++
					this.getArticle()
				}
			},
			imgTap(img) {
				this.previewImg = img.src
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		.content {
			background-color: rgba(255, 255, 255, 1);

			.banner {
				width: 100%;
				height: 360rpx;
				margin: 0 auto;
			}

			.nav {
				width: 100%;
				font-size: var(--font-13);
			}

			.middle {
				padding: 20rpx 32rpx;
				font-family: Roboto;
				font-size: var(--font-14);
				font-weight: 400;
				line-height: 56rpx;
				text-align: justified;
				color: rgba(34, 34, 34, 1);
			}
		}

		.img_mask {
			width: 100vw;
			height: 100vh;
			background: rgba(0, 0, 0, 0.35);
			padding: 20rpx;

			.close {
				width: 38rpx;
				height: 38rpx;
				margin-bottom: 18rpx;
				align-self: flex-end;
			}

			.img_show {
				width: 100%;
			}
		}
	}
</style>