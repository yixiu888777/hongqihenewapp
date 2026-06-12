c<template>
	<view class="container">
		<view class="content" :style="{background: `url(${settingInfo.background.invite_bg_image}) no-repeat center top / 100%`, 'background-color': '#fdd491'}">
		<view class="statusbar"></view>
			<view class="titleTip">
				<view class="inner">{{info.invite_title}}</view>
				<view class="tip">{{info.invite_title2}}</view>
			</view>
			<!-- 专属码 -->
			<view class="count-box">
				<view class="qrcode">
					<image :src="info.code_ewm" mode="widthFix"></image>
				</view>
				<view class="btn" @tap="copyText(info.code)">
					{{info.code}}
					<image src="/static/new/copy2.png" mode="heightFix"></image>
				</view>
				<view class="h2">我的邀请码</view>
				<view class="h3">专属邀请链接</view>
				<view class="input-code">
					<view class="input">{{info.invite_url}}</view>
					<view class="icon"><image src="/static/new/copy.png" mode="height" @tap="copyText(info.invite_url)"></image></view>
				</view>
			</view>
			<view class="reward">
				<view class="tit">邀约奖励</view>
				<!-- <view class="list">
					<view class="item" :class="item.is_complete == 1?'success':'ing'" v-for="(item,index) in info.invite_config" :key="index">
						<view class="icon"><image :src="item.icon" mode="widthFix"></image></view>
						<view class="text">
							<view class="h3">{{item.title}}</view>
							<view class="desc">{{item.description}}</view>
						</view>
						<view class="btn" @tap="copyText(info.invite_url)">{{ item.is_complete == 1 ? '已完成' : '去完成' }}</view>
					</view>
				</view> -->
				<view class="level">
					<view :class="'item lv'+(index+1)" v-for="(item,index) in InviteConfig">
						<view class="icon"><image :src="item.icon" mode="widthFix"></image></view>
						<view class="desc">{{item.title}}</view>
						<view class="btn" @click="$utils.toPage(`/pages/team/myTeam?id=${item.id}&index=${index}`)">详情</view>
					</view>
				</view>
				
				<!-- 等级占比统计 -->
				<view class="nav-list flex_between" v-if="settingInfo.invite.invite_rate_state ==1">
					<view class="nav-item flex_between" @click="$utils.toPage('/pages/salary/detail?level=1')">
						<image src="/" mode=""></image>
						<view>
							<view>一级</view>
							<view>{{info.yongjin_rate_1}}</view>
						</view>
						<image src="@/static/img/right.svg" mode="widthFix"></image>
					</view>
					<view class="nav-item flex_between" @click="$utils.toPage('/pages/salary/detail?level=2')">
						<image src="/" mode=""></image>
						<view>
							<view>二级</view>
							<view>{{info.yongjin_rate_2}}</view>
						</view>
						<image src="@/static/img/right.svg" mode="widthFix"></image>
					</view>
					<view class="nav-item flex_between" @click="$utils.toPage('/pages/salary/detail?level=3')">
						<image src="/" mode=""></image>
						<view>
							<view>三级</view>
							<view>{{info.yongjin_rate_3}}</view>
						</view>
						<image src="@/static/img/right.svg" mode="widthFix"></image>
					</view>
				</view>
				
				<view class="m-tips primary">
					<view class="text">
						<view class="h2">奖励说明</view>
						<view class="desc" v-html="settingInfo.text.invite_reward_rule"></view>
					</view>
				</view>
			</view>			
		</view>
		<tabBarView current="3"></tabBarView>
		<!-- 是否实名认证 -->
		<Real-Name></Real-Name>
	</view>
</template>

<script>
	import { commonScrollApi, getInviteInfoAPI, getInviteConfigAPI } from '@/api/api.js'
	export default {
		data() {
			return {
				settingInfo: uni.getStorageSync('settingInfo'),
				// 滚动公告
				noticeText: '',
				info: {
					rate: {}
				},
				InviteConfig:[]
			};
		},
		onLoad() {
			// commonScrollApi({
			// 	is_popup: 2
			// }).then(res => {
			// 	this.noticeText = res.data.data.data[0].content
			// })
			
			getInviteInfoAPI().then(res => {
				// console.log("getInviteInfoAPI",res.data)
				this.info = res.data.data
			})
			getInviteConfigAPI().then(res => {
				this.InviteConfig = res.data.data
			})
		},
		methods: {
			pageBack() {
				if (!!this.back) {
					uni.reLaunch({
						url: '/pages/index/index'
					})
				} else {
					// #ifndef APP-PLUS
					let backPage = getCurrentPages()
					if (backPage.length == 1) {
						uni.reLaunch({
							url: "/pages/index/index"
						})
					} else {
						uni.navigateBack()
					}
					// #endif
			
					// #ifdef APP-PLUS
					uni.navigateBack()
					// #endif
				}
			},
			// 跳转在线客服
			toLoads(url) {
				// #ifndef APP-PLUS
				window.open(url)
				// #endif
				// #ifdef APP-PLUS
				uni.navigateTo({
					url: `/pages/noPage/index?url=${url.split("&").join("$")}`
				})
				// #endif
			},
			// 复制
			copyText(text) {
				uni.setClipboardData({
					data: text,
					success: () => {
						uni.$u.toast('复制成功')
					},
					fail: () => {
						uni.$u.toast('复制失败')
					}
				});
			},
		}
	}
</script>

<style lang="scss">
	.container{ padding-bottom: 120rpx; }
	.titleTip{ text-align: center; padding: 90rpx 0 420rpx; color: #fff;
		.inner{ font-size: 46rpx; line-height: 1; margin-bottom: 30rpx; font-weight: bold; }
		.tip{ font-size: 28rpx; line-height: 1; }
	}
	.count-box{ padding: 30rpx; margin: 0 30rpx 30rpx; border-radius: 20rpx; background: #fff;
		.qrcode{ width: 220rpx; margin: 0 auto 20rpx; }
		.btn{ display: flex; align-items: center; border-radius: 50rpx; background: linear-gradient(to left, #FF624B, #FF3650); color: #fff; width: 220rpx; margin: 0 auto 30rpx; text-align: center; padding:10rpx 30rpx;
			image{ height: 30rpx; margin-left: 10rpx; display: inline-block;}
		}
		.h2{ font-size: 32rpx; font-weight: bold; text-align: center; margin-bottom: 30rpx; }
		.h3{ font-size: 32rpx; font-weight: bold; margin-bottom: 10rpx;}
		.input-code{ display: flex; align-items: center; background: rgba(246, 247, 249, 1); padding: 30rpx; border-radius:10rpx 20rpx;
			.input{ flex: 1; overflow: hidden; white-space: nowrap; overflow: hidden; }
			.icon{ width: 60rpx; padding-left: 20rpx;
				image{ height: 40rpx; }
			}
		}
	}
	
	.reward{ padding: 30rpx; margin: 0 30rpx 30rpx; border-radius: 20rpx; background: #fff;
		.tit { font-size: 32rpx; font-weight: bold; margin-bottom: 30rpx; }
		.list{
			.item{ padding: 30rpx; margin-bottom: 30rpx; border-radius: 20rpx; display: flex; align-items: center; background: rgba(249, 250, 251, 1); 
				.icon{
					image{ width: 100rpx;}
				}
				.text{ flex: 1; padding: 0 30rpx;
					.h3{font-weight: bold;}
					.desc{ font-size: .8em; }
				}
				.btn{font-size: .8em;  background: linear-gradient(to left, #FF624B, #FF3650);color: #fff; border-radius: 10rpx; padding: 10rpx 20rpx;}
			}
			.success{ filter: grayscale(100%); -webkit-filter: grayscale(100%); opacity: .7;
				.btn{}
			}
			.ing{ 
				.btn{}
			}
		}
		.level{ font-size: 0.8em; margin-bottom: 30rpx;
			.item{ background: #FF3650; background: linear-gradient(to left, rgba(255, 49, 80, 0.10), rgba(255, 100, 75, 0.10));  border-radius: 20rpx; padding: 30rpx; display: flex; align-items: center; margin-bottom: 30rpx;
				.icon{
					image{ width: 90rpx; }
				}
				.desc{ color: #040A13; font-size: 1.2em; padding: 0 20rpx; flex: 1;}
				.btn{ color: #FF374F; font-size: 1.2em; font-weight: bold;}
			}
		}
		
	}
	.nav-list {
		grid-template-columns: 1fr 1fr 1fr;
		margin-bottom: 30rpx;
		display: flex;
		justify-content: space-between;
		.nav-item {
			width: 31%;
			height: 104rpx;
			padding: 12rpx 20rpx;;
			border-radius: 20rpx;
			background: linear-gradient(to left, rgba(255, 49, 80, 0.1), rgba(255, 100, 75, 0.1));
			border-top: 1px solid rgba(255, 255, 255, 1);
			font-family: Roboto;
			font-size: 28rpx;
			font-weight: 400;
			line-height: 40rpx;
			color: rgba(175, 21, 0, 1);
			image {
				width: 28rpx;
				height: 28rpx;
			}
		}
	}
</style>