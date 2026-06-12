<template>
	<view class="container">
		<view class="history" @click="$utils.toPage('/pages/dream/list')">
			申购记录
		</view>
		<view class="header" :style="{background: `url(${settingInfo.shengou_bg_shang}) no-repeat center top / 100%`}">
			<view class="title">
				<view class="inner">{{settingInfo.shengou_title2}}</view>
				<view class="tip">{{settingInfo.shengou_title}}</view>
			</view>
		</view>
		<view class="content">
			<scroll-view scroll-x="true" class="nav_box">
				<view class="nav flex">
					<view class="nav_item flex_center" :class="current==index?'active_item':''" v-for="(item,index) in navList" @tap="current=index" v-html="item.name"></view>
				</view>
			</scroll-view>
			
			<view class="list">
				<view class="item" v-for="item in list" :key="item.id">
					<!-- 样式二：办卡 -->
					<view class="item-content" v-if="item.type == 4">
						<view class="item-card-image">
							<image :src="item.image" mode="none"></image>
							<view @tap.stop="$utils.toPage(`/pages/dream/audit?id=${item.id}`)">产品介绍</view>
						</view>
						<view class="item-card-info">
							<view class="price"><text>￥</text>{{item.price}}</view>
							<view class="name flex_center">
								{{item.name}}
								<view class="day">项目周期: {{item.days}}</view>
							</view>
						</view>
						<view class="item-card-list">
							<view class="info_card">{{item.note}}</view>
							<view class="button" @tap="$utils.toPage(`/pages/dream/authentication?id=${item.id}`)">立即领取</view>
						</view>
					</view>
					<!-- 样式一：办卡以外 -->
					<view class="item-card" @tap="$utils.toPage(`/pages/dream/authentication?id=${item.id}`)" v-else>
						<view class="item-card-image">
							<image :src="item.image" mode="none"></image>
							<view @tap.stop="$utils.toPage(`/pages/dream/audit?id=${item.id}`)">产品介绍</view>
						</view>
						<view class="item-card-info">
							<view class="name flex_between">
								<view>{{item.name}}</view>
								<view class="price"><text>￥</text>{{item.price}}</view>
							</view>
							<view class="progress flex_between">
								<view class="progress-box">
									<view :style="{width: `${item.process*1}%`}"></view>
								</view>
								<view class="tip">配额进度：<text>{{item.process*1}}%</text></view>
							</view>
						</view>
						<view class="item-card-list flex">
							<view class="item-card-list-item col_center" v-for="(i, index) in item.infolist" :key="index">
								<view class="num">{{i.value}}</view>
								<view>{{i.name}}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<tabBarView current="3"></tabBarView>


		<!-- 提示 -->
		<u-popup :show="auditShow" mode="center" round="32" @close="auditShow = false">
			<view class="van-dialog">
				<view class="van-dialog__header">提示</view>
				<view class="van-dialog__content">审核中</view>
				<view class="van-dialog__footer">
					<view class="button" @click="auditShow = false">查看</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import { getSettingApi, cateListAPI, listsAPI } from '@/api/api.js'
	export default {
		data() {
			return {
				settingInfo: uni.getStorageSync('settingInfo'),
				auditShow: false,
				navList: [],
				current: -1,
				list: []
			};
		},
		onLoad(opt) {
			cateListAPI().then(res=>{
				this.navList = res.data.data.data
				if(!!opt.cate_id){
					this.navList.forEach((item, index) => {
						if (opt.cate_id == item.id){
							this.current = index
						}
					})
				} else {
					this.current = 0
				}
			})
			
			getSettingApi().then(res => {
				this.settingInfo = res.data.data
				uni.setStorageSync('settingInfo', res.data.data)
			})
		},
		watch: {
			current(){
				this.getList()
			}
		},
		methods: {
			getList(){
				if(this.navList.length > 0){
					listsAPI({
						cate_id: this.navList[this.current].id
					}).then(res=>{
						this.list = res.data.data.data
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		display: block;
		
		.history {
			width: 60rpx;
			padding: 20rpx 16rpx;
			border-radius: 32rpx 0px 0px 32rpx;;
			background: linear-gradient(180deg, #FDFBEE 0%, #F7CDCD 100%);
			box-shadow: 0px 4px 7.3px 0px rgba(204, 64, 0, 0.5);
			font-family: Roboto;
			font-size: 28rpx;
			font-weight: 500;
			line-height: 32.82rpx;
			color: rgba(238, 72, 49, 1);
			writing-mode: vertical-rl;
			text-orientation: upright;
			position: fixed;
			top: 224rpx;
			right: 0;
			z-index: 99;
		}
		
		.header {
			width: 750rpx;
			height: 360rpx;
			padding-top: 1rpx;
			
			.title {
				margin: 156rpx auto 0;
				font-family: Roboto;
				color: rgba(255, 255, 255, 1);
				font-weight: 700;
				line-height: 40rpx;
				text-align: center;
				
				.inner {
					font-size: 48rpx;
				}
			
				.tip {
					font-size: 32rpx;
					margin-top: 20rpx;
				}
			}
		}
		.content {
			width: 750rpx;
			margin-top: -2rpx;
			padding: 40rpx 32rpx;
			background: linear-gradient(180deg, #D52800 0%, #FFFFFF 100%);
			
			.nav_box {
				width: 686rpx;
				margin: 0 auto;
				
				.nav {
					.nav_item {
						min-width: 233rpx;
						padding: 0 20rpx;
						height: 100rpx;
						margin-right: 20rpx;
						border-radius: 20rpx;
						background: linear-gradient(180deg, #F5C6C5 0%, #FFFFFF 68%);
						border-top: 1px solid rgba(255, 255, 255, 1);
						font-family: Roboto;
						font-size: 28rpx;
						font-weight: 400;
						line-height: 40rpx;
						color: rgba(175, 21, 0, 1);
						flex-shrink: 0;
						white-space: nowrap;
						
						&:last-child {
							margin-right: 0;
						}
					}
								
					.active_item {
						background: linear-gradient(180deg, #CA2500 0%, #FF6B67 100%);
						border-top: 1px solid rgba(228, 150, 150, 1);
						color: rgba(255, 255, 255, 1);
					}
				}
			}

			.list {
				margin: 28rpx auto 150rpx;

				.item {
					width: 686rpx;
					overflow: hidden;
					padding-bottom: 40rpx;
					margin-bottom: 28rpx;
					border-radius: 20rpx;
					background: linear-gradient(180deg, #F5C3C2 0%, #F7D1D0 9.16%, #FFFFFF 40.71%);
					border-top: 2.8rpx solid rgba(255, 255, 255, 1);

					.item-content {
						.item-card-image{
							width: 686rpx;
							height: 300rpx;
							position: relative;
							
							&>image{
								width: 100%;
								height: 100%;
							}
							
							&>view{
								width: 136rpx;
								height: 48rpx;
								padding: 12rpx 28rpx;
								border-radius: 114rpx;
								background: rgba(0, 0, 0, 0.5);
								font-family: Roboto;
								font-size: 20rpx;
								font-weight: 400;
								line-height: 23rpx;
								text-align: center;
								color: rgba(255, 255, 255, 1);
								position: absolute;
								top: 24rpx;
								right: 24rpx;
							}
						}
						
						.item-card-info {
							margin: 0 20rpx;
							padding: 20rpx 0;
							border-bottom: 1px dashed rgba(202, 202, 202, 1);
							
							.price{
								font-family: Roboto;
								font-size: 48rpx;
								font-weight: 700;
								line-height: 56rpx;
								color: rgba(220, 79, 63, 1);
								text-align: center;
								
								&>text{
									line-height: 28rpx;
									font-size: 24rpx;
								}
							}
							
							.name {
								margin: 16rpx 0 0 148rpx;
								font-family: Roboto;
								font-size: 32rpx;
								font-weight: 400;
								line-height: 37rpx;
								color: rgba(0, 0, 0, 1);
								
								.day {
									padding: 8rpx 12rpx;
									border-radius: 12rpx 12rpx 12rpx 0px;;
									background: linear-gradient(180deg, #FFB800 0%, #FF4D00 100%);
									font-family: Open Sans;
									font-size: 20rpx;
									font-weight: 400;
									line-height: 27rpx;
									color: rgba(255, 255, 255, 1);
									position: relative;
									top: -16rpx;
								}
							}
						}
						
						.item-card-list {
							.info_card {
								margin: 20rpx auto 40rpx;
								font-family: Roboto;
								font-size: 32rpx;
								font-weight: 700;
								line-height: 37rpx;
								text-align: center;
								color: rgba(220, 79, 63, 1);
							}
							
							.button {
								width: 646rpx;
								height: 100rpx;
								margin: 0 auto;
								border-radius: 24rpx;
								font-size: 32rpx;
							}
						}
					}
					
					.item-card{
						.item-card-image{
							width: 686rpx;
							height: 300rpx;
							position: relative;
							
							&>image{
								width: 100%;
								height: 100%;
							}
							
							&>view{
								width: 136rpx;
								height: 48rpx;
								padding: 12rpx 28rpx;
								border-radius: 114rpx;
								background: rgba(0, 0, 0, 0.5);
								font-family: Roboto;
								font-size: 20rpx;
								font-weight: 400;
								line-height: 23rpx;
								text-align: center;
								color: rgba(255, 255, 255, 1);
								position: absolute;
								top: 24rpx;
								right: 24rpx;
							}
						}
						
						.item-card-info {
							margin: 0 20rpx;
							padding: 20rpx 0;
							border-bottom: 1px dashed rgba(202, 202, 202, 1);
							
							.name{
								font-family: Roboto;
								font-size: 32rpx;
								font-weight: 400;
								line-height: 37rpx;
								color: rgba(0, 0, 0, 1);
								
								.price{
									font-family: Roboto;
									font-size: 48rpx;
									font-weight: 700;
									line-height: 56rpx;
									color: rgba(220, 79, 63, 1);
									
									&>text{
										line-height: 28rpx;
										font-size: 24rpx;
									}
								}
							}
							
							.progress {
								margin-top: 20rpx;
								
								.progress-box {
									width: 470rpx;
									height: 20rpx;
									border-radius: 68rpx;
									background: rgba(244, 244, 244, 1);
									
									&>view {
										height: 20rpx;
										border-radius: 84rpx;
										background: linear-gradient(0deg, #EE4831, #EE4831), linear-gradient(0deg, #EE4831, #EE4831),linear-gradient(0deg, #EE4831, #EE4831);
									}
								}
								
								.tip {
									margin-left: 32rpx;
									flex-shrink: 0;
									font-family: Roboto;
									font-size: 20rpx;
									font-weight: 400;
									line-height: 23rpx;
									color: rgba(0, 0, 0, 0.5);
									
									text {
										font-family: Roboto;
										font-size: 32rpx;
										font-weight: 700;
										line-height: 37rpx;
										color: rgba(238, 72, 49, 1);
									}
								}
							}
						}
						
						.item-card-list{
							padding: 20rpx 96rpx 0 96rpx;
							flex-wrap: wrap;
							
							.item-card-list-item{
								width: 50%;
								font-family: Roboto;
								font-size: 20rpx;
								font-weight: 400;
								line-height: 23rpx;
								color: rgba(0, 0, 0, 0.5);
								margin-bottom: 20rpx;
						
								.num{
									font-size: 48rpx;
									font-weight: 700;
									line-height: 56rpx;
									color: rgba(51, 51, 51, 1);
									margin-bottom: 16rpx;
								}
							}
							
							.item-card-list-item:first-child{
								.num {
									color: rgba(220, 79, 63, 1);
								}
							}
						}
						
						
						
						.circularProgress{
							position: relative;
							
							.text{
								width: 170rpx;
								height: 80rpx;
								position: absolute;
								top: 50%;
								bottom: 50%;
								left: 50%;
								right: 50%;
								transform: translate(-50%, -50%);
								font-family: Roboto;
								font-size: 30rpx;
								font-weight: 400;
								line-height: 40rpx;
								text-align: center;
								color: rgba(34, 34, 34, 1);
							}
						}
						
						
					}
				}
			}
		}
		
		
		.fixedList {
			position: fixed;
			right: 0;
			top: 206rpx;
			padding: 16rpx 12rpx;
			border-radius: 120rpx 0px 0px 120rpx;
			background: rgba(255, 255, 255, 1);
			backdrop-filter: blur(8rpx);
			box-shadow: 0px 8rpx 8rpx 0px rgba(0, 0, 0, 0.05);
			font-family: Roboto;
			font-size: var(--font-12);
			font-weight: 400;
			line-height: 36rpx;
			color: rgba(192, 27, 23, 1);

			image {
				width: 36rpx;
				height: 36rpx;
				margin-right: 12rpx;
				flex-shrink: 0;
			}
		}

		.van-dialog {
			width: 540rpx;
			padding: 48rpx;
			border-radius: 16rpx;
			background: rgba(255, 255, 255, 1);
			font-family: Roboto;
			font-weight: 400;
			line-height: 40rpx;
			text-align: center;
			color: rgba(27, 28, 30, 1);

			.van-dialog__header {
				font-size: var(--font-18);
			}

			.van-dialog__content {
				margin: 34rpx auto;
				font-size: var(--font-16);
			}

			.van-dialog__footer {
				display: flex;

				.button {
					height: 72rpx;
					font-size: var(--font-14);
				}
			}
		}
	}
</style>