<template>
	<view class="container">		
		<view class="content">
			<!-- 等级占比统计 -->
			<view class="nav-list flex_between">
				<view class="nav-item flex_between" @click="$utils.toPage('/pages/team/myTeam?type=1')">
					<image src="/" mode=""></image>
					<view>
						<view>一级</view>
						<view>{{info.one}}</view>
					</view>
					<image src="@/static/img/right.svg" mode="widthFix"></image>
				</view>
				<view class="nav-item flex_between" @click="$utils.toPage('/pages/team/myTeam?type=2')">
					<image src="/" mode=""></image>
					<view>
						<view>二级</view>
						<view>{{info.two}}</view>
					</view>
					<image src="@/static/img/right.svg" mode="widthFix"></image>
				</view>
				<view class="nav-item flex_between" @click="$utils.toPage('/pages/team/myTeam?type=3')">
					<image src="/" mode=""></image>
					<view>
						<view>三级</view>
						<view>{{info.three}}</view>
					</view>
					<image src="@/static/img/right.svg" mode="widthFix"></image>
				</view>
			</view>
			<!-- 等级数据统计 -->
			<view class="count-box">
				<image class="vector3" src="@/static/img/Vector 3.svg" mode="widthFix"></image>
				<image class="vector2" src="@/static/img/Vector 2.svg" mode="widthFix"></image>
				<view class="name">我邀请人数</view>
				
				<view class="count">
					<view class="title">
						<view></view>
						<view>一级</view>
						<view>二级</view>
						<view>三级</view>
					</view>
					<view class="item" v-for="(item, index) in countList" :key="index">
						<view class="item-name">{{item.title}}</view>
						<view>{{item.one}}</view>
						<view>{{item.two}}</view>
						<view>{{item.three}}</view>
					</view>
				</view>
			</view>
			
			<!-- 轮播图 -->
			<view class="count-box">
				<image class="vector3" src="@/static/img/Vector 3.svg" mode="widthFix"></image>
				<image class="vector2" src="@/static/img/Vector 2.svg" mode="widthFix"></image>
				<view class="name">团队活动宣传</view>
				<u-swiper :list="swiperList" keyName="image" @change="e => swiperCurrent = e.current" autoplay circular
					height="190" radius="10">
					<view slot="indicator" class="indicator">
						<view class="indicator__dot" v-for="(item, index) in swiperList" :key="index"
							:class="[index === swiperCurrent && 'indicator__dot--active']"></view>
					</view>
				</u-swiper>
			</view>
			<!-- 邀请奖励 -->
			<view class="count-box" style="margin-bottom: 180rpx;">
				<image class="vector3" src="@/static/img/Vector 3.svg" mode="widthFix"></image>
				<image class="vector2" src="@/static/img/Vector 2.svg" mode="widthFix"></image>
				<view class="name">邀请好友</view>
				<view class="invite">
					<view class="text col_center" v-if="false">
						<view class="inner">
							<view class="item" v-for="(item,index) in infoList" :key="index">{{item}}</view>
						</view>
					</view>
					<view class="button" @click="$utils.toPage('/pages/team/invite')">去邀请</view>
				</view>
			</view>
		</view>
		<tabBarView current="4"></tabBarView>
	</view>
</template>

<script>
	import { getSettingApi, commonBannerApi, getTeamInfoAPI, getInviteInfoAPI } from '@/api/api.js'
	export default {
		data() {
			return {
				settingInfo: uni.getStorageSync('settingInfo'),
				// 轮播图
				swiperCurrent: 0,
				swiperList: [],
				info: {},
				countList: [],
				infoList: []
			};
		},
		onLoad() {
			// 轮播图
			commonBannerApi({
				cate: 2
			}).then(res => {
				this.swiperList = res.data.data
			})
			
			getTeamInfoAPI().then(res => {
				this.info = res.data.data.count
				this.countList = res.data.data.list
			})
			
			getInviteInfoAPI().then(res => {
				this.infoList = res.data.data.list
			})
			
			getSettingApi().then(res => {
				this.settingInfo = res.data.data
				uni.setStorageSync('settingInfo', res.data.data)
			})
		},
	}
</script>

<style lang="scss">
	.container {
		display: block;
		

		.content {
			padding: 32rpx;

			.nav-list {
				margin: 0 auto;
				display: grid; gap:30rpx;
				grid-template-columns: 1fr 1fr 1fr;

				.nav-item {
					padding: 20rpx;
					border-radius: 16rpx;
					background: linear-gradient(to left, #FF624B, #FF3650); color: #fff;
					font-weight: 400;
					text-align: center;
					image {
						width: 28rpx;
						height: 28rpx;
					}
				}
			}
			
			.count-box {
				width: 686rpx;
				margin-top: 28rpx;
				border-radius: 20rpx;
				background: linear-gradient(180deg, #DD2A00 0%, #FFFFFF 76.5%);
				overflow: hidden;
				position: relative;
				
				.vector3, .vector2 {
					width: 302rpx;
					height: 175rpx;
					position: absolute;
					top: 0;
					right: 104rpx;
				}
				
				.vector2 {
					right: 0;
				}
				
				.name {
					padding: 24rpx;
					font-family: Roboto;
					font-size: 32rpx;
					font-weight: 400;
					line-height: 37rpx;
					color: rgba(255, 255, 255, 1);
				}
				
				.count {
					width: 690rpx;
					padding: 20rpx;
					border-radius: 20rpx;
					background: linear-gradient(180deg, #F6CBCA 0%, #F6CBCA 3.78%, #FFFFFF 26.05%);
					border-top: 1px solid rgba(255, 255, 255, 1);
					box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.05);
					font-family: Roboto;
				
					.title {
						display: grid;
						grid-template-columns: 1fr 1fr 1fr 1fr;
						font-size: var(--font-14);
						font-weight: 700;
						line-height: 33rpx;
						color: rgba(51, 51, 51, 1);
				
						&>view {
							text-align: center;
						}
					}
				
					.item {
						height: 96rpx;
						border-bottom: 1px solid rgba(241, 241, 241, 1);
						display: grid;
						grid-template-columns: 1fr 1fr 1fr 1fr;
						font-size: var(--font-14);
						font-weight: 700;
						line-height: 96rpx;
						color: rgba(51, 51, 51, 1);
				
						&>view {
							text-align: center;
						}
				
						.item-name {
							font-weight: 400;
						}
					}
				}
			
				.indicator {
					@include flex(row);
					justify-content: center;
				
					&__dot {
						width: 16rpx;
						height: 16rpx;
						border-radius: 80rpx;
						background: rgba(5, 5, 5, 0.5);
						margin: 0 8rpx 0 0;
				
				
						&--active {
							width: 32rpx;
							height: 16rpx;
							border-radius: 80rpx;
							background: rgba(5, 5, 5, 0.5);
						}
					}
				}
				
				.invite {
					width: 690rpx;
					padding: 48rpx;
					border-radius: 20rpx;
					background: linear-gradient(180deg, #F6CBCA 0%, #F6CBCA 3.78%, #FFFFFF 26.05%);
					border-top: 1px solid rgba(255, 255, 255, 1);
					box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.05);
				
					.text {
						font-family: Roboto;
						font-size: 32rpx;
						font-weight: 400;
						line-height: 37rpx;
						text-align: center;
						color: rgba(0, 0, 0, 1);
						
						.item {
							margin-bottom: 20rpx;
						}
					}
				
					.button {
						height: 90rpx;
						border-radius: 146rpx;
						background: linear-gradient(180deg, #EE7531 0%, #FF2C0F 100%);
						border-top: 1px solid rgba(255, 255, 255, 1);
						box-shadow: 0px 4px 4px 0px rgba(186, 69, 47, 0.5);
					}
				}
			}
		}

		.fixedList {
			position: fixed;
			right: 0;
			top: 206rpx;

			.item {
				margin-bottom: 10rpx;
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
		}
	}
</style>