<!-- 有用 -->
<template>
	<view class="container" style="background:#c8131e url(/static/new/bg.jpg) no-repeat center top / 100%;"
		v-if="isPageShow">
		<headerView>
			<view>商品</view>
			<template #rightIcon>
				<view class="icon" @click="$utils.toPage('/pages/policy/history')">
					<image src="/static/new/history.png" mode="heightFix"
						style="height: 36rpx; display: block; margin: 0 auto 5rpx;"></image>
					<view class="text" style="font-size: .6em;line-height: 1;">记录</view>
				</view>
			</template>
		</headerView>
		<!-- <scroll-view scroll-x class="nav-box flex_center">
			<view class="nav flex">
				<view :class="item.id==typeValue?'active item':'item'" v-for="(item,index) in cateList" :key="index" @click="typeClick(item.id)">{{item.name}}</view>
			</view>
		</scroll-view> -->
		<view class="nav-box">
			<u-tabs :list="cateList" :current="typeIndex" lineColor="#fff"
				activeStyle="background:#fff; color: #f62a2d; padding:20rpx 30rpx; border-radius:20rpx; font-weight: bold;"
				inactiveStyle="background: rgba(0, 0, 0, 0.3);color: #fff;padding:20rpx 30rpx; border-radius:20rpx;"
				lineWidth="10" lineHeight="0" lineBgSize="cover" @click="click"></u-tabs>
		</view>
		<view class="list">
			<view class="item" v-for="(item,index) in lists" :key="index">
				<view class="title">{{item.name}}</view>
				<view class="price">
					<view class="li" v-for="(item2,index2) in item.front_display" :key="index2">
						<view class="desc">{{item2.key}}</view>
						<view class="num">{{item2.value}}</view>
					</view>
				</view>
				<view class="btn" @click="$utils.toPage(`/pages/policy/buy?id=${item.id}`)">查看详情</view>
				<view class="limit" v-if="item.repeat_buy ==1">
					<image src="/static/new/limit1.png" mode="widthFix"></image>
				</view>
				<view class="limit" v-if="item.repeat_buy ==2">
					<image src="/static/new/limit2.png" mode="widthFix"></image>
				</view>
				<view class="limit" v-if="item.repeat_buy ==3">
					<image src="/static/new/limit3.png" mode="widthFix"></image>
				</view>
				<view class="limit" v-if="item.repeat_buy ==4">
					<image src="/static/new/limit4.png" mode="widthFix"></image>
				</view>
				<view class="limit" v-if="item.repeat_buy ==5">
					<image src="/static/new/limit5.png" mode="widthFix"></image>
				</view>
				<!-- 1 热门 2预售 3售罄-->
				<view class="sold" v-if="item.attribute == 1">
					<image src="/static/new/hot.png" mode="widthFix"></image>
				</view>
				<view class="sold" v-if="item.attribute == 2">
					<image src="/static/new/presale.png" mode="widthFix"></image>
				</view>
				<view class="sold" v-if="item.attribute == 3">
					<image src="/static/new/soldout.png" mode="widthFix"></image>
				</view>
			</view>
			<uni-load-more iconType="snow" :status="load.status" color="rgba(255,255,255,.5)" />
		</view>
		<!-- <tabBarView current="3"></tabBarView> -->
	</view>
</template>

<script>
	import {
		productCateApi, // 获取分类列表
		productListApi //获取产品列表
	} from '@/api/api.js'
	export default {
		data() {
			return {
				isPageShow: true,
				settingInfo: uni.getStorageSync('settingInfo'),
				cateList: [],
				typeValue: '',
				typeIndex: 0,
				lists: [],
				page: 1,
				load: {
					status: 'loading', //more/loading/noMore
				},
			}
		},
		onLoad() {
			this.loadData();
		},
		onShow() {
			this.loadData();
		},
		onHide() {

		},
		onUnload() {
			// 页面卸载时
		},
		// onReachBottom() {
		// 	this.getLists()
		// },
		methods: {
			loadData() {
				productCateApi().then(res => {
					this.cateList = res.data.data
					//console.log(res)
					this.typeValue = res.data.data[0].id
					this.getLists()
				})
			},
			getLists() {
				productListApi({
					cate_id: this.typeValue
				}).then(res => {
					this.lists = res.data.data
					this.load.status = 'noMore';
					this.isPageShow = true;
				})
			},
			typeClick(value) {
				this.load.status = 'loading';
				this.lists = {}
				this.typeValue = value;
				this.getLists()
			},
			click(item) {
				// console.log('item', item);
				this.load.status = 'loading';
				this.lists = []
				this.typeValue = item.id;
				this.getLists()
			},
			// 实名页面跳转
			toPage(url) {
				if (this.UserInfo.is_auth == 1) {
					this.$utils.toPage(url)
				} else {
					this.rnShow = true;
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		padding: 0 0 0rpx;
	}

	::v-deep .header {
		// .title{ text-align: left; padding-left: 0; }
	}

	.nav-box {
		padding: 0 20rpx 30rpx;
		box-sizing: border-box;
		position: sticky;
		top: 0;

		.nav {
			display: flex;
			align-items: center;
			gap: 30rpx;

			.item {
				font-weight: 400;
				flex-shrink: 0;
				box-sizing: border-box;
				padding: 20rpx;
				border-radius: 20rpx;
				position: relative;
				flex: 1;
				background: rgba(0, 0, 0, 0.30);
				min-width: 300rpx;
				color: rgba(255, 255, 255, 1);
				text-align: center;
			}

			.active {
				background: #fff;
				color: rgba(246, 42, 45, 1);
				font-weight: bold;
			}

			// .active::after { content: ''; height: 8rpx; border-radius: 20rpx; background: #fff; width: 60%; left: 20%; bottom: 0; position: absolute;}
		}
	}

	.list {
		padding: 0 30rpx 30rpx;
		overflow: auto;
		border-radius: 20rpx;

		.item {
			background: linear-gradient(to bottom, rgba(255, 230, 224, 1), rgba(255, 255, 255, 1));
			padding: 30rpx;
			border-radius: 20rpx;
			margin-bottom: 30rpx;
			position: relative;

			.title {
				text-align: center;
				font-size: 1.2em;
				font-weight: bold;
				margin-bottom: 20rpx;
			}

			.img {
				margin-bottom: 30rpx;
				background: linear-gradient(to left, rgba(255, 59, 80, .51), rgba(255, 94, 76, .51));
				color: #fff;
				min-height: 200rpx;
				border-radius: 20rpx;
				position: relative;
				overflow: hidden;

				image {
					width: 100%;
					border-radius: 20rpx;
					display: block;
				}

				.text {
					position: absolute;
					bottom: 0;
					left: 0;
					background: rgba(0, 0, 0, 0.40);
					display: flex;
					justify-content: space-between;
					padding: 10rpx 20rpx;
					width: 100%;
				}

				.name {}

				.num {
					font-weight: bold;
				}

				// .desc{ position: absolute; top: 0; right: 0; border-radius: 0 20rpx 0 20rpx; background: linear-gradient(to left, rgba(255, 59, 80, 1), rgba(255, 94, 76, 1)); color: #fff; text-align: center; padding: 10rpx 20rpx; max-width: 60%; }
				.desc {
					position: absolute;
					top: 0;
					left: 0;
					background: linear-gradient(to left, rgba(208, 5, 8, 1), rgba(254, 91, 74, 1));
					border-radius: 0 20rpx 0 20rpx;
				}
			}

			.price {
				margin-bottom: 30rpx;
				display: flex;
				gap: 30rpx;
				flex-wrap: wrap;

				.li {
					padding: 20rpx;
					border-radius: 20rpx;
					width: 300rpx;
					position: relative;
					text-align: center;

					.icon {
						position: absolute;
						top: 50rpx;
						left: 30rpx;

						.u-icon {
							justify-content: center;
						}
					}

					.num {
						font-size: 1.2em;
						font-weight: bold;
						line-height: 1;
						color: #ff3650;
					}

					.desc {
						opacity: .7;
						line-height: 1;
						margin-bottom: 20rpx;
					}
				}
			}

			.limit {
				position: absolute;
				top: 0;
				right: 20rpx;
				width: 150rpx;

				image {
					width: 100%;
				}
			}

			.sold {
				position: absolute;
				bottom: 60rpx;
				right: 10rpx;
				width: 150rpx;

				image {
					width: 100%;
				}
			}

			.progress {
				margin-bottom: 30rpx;
			}

			.btn {
				background: rgba(246, 42, 45, 1);
				color: #fff;
				border-radius: 20rpx;
				text-align: center;
				padding: 20rpx;
				margin: 0 100rpx 10rpx;
				font-weight: bold;
			}
		}
	}

	.onType {
		.u-tabs__wrapper__nav__item__text {
			color: #fff;
			font-weight: bold;
		}
	}

	::v-deep {
		.u-tabs__wrapper__nav {

			// gap: 30rpx;
			.u-tabs__wrapper__nav__item {
				// padding: 0;
			}
		}
	}
</style>