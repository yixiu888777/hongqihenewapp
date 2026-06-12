<template>
	<view class="container" style="background: red;height:100vh">
		<view class="m-header">
			<view style="position: absolute;left: 20rpx;">
				<uni-icons type="left" size="20" color="#fff"></uni-icons>
			</view>
			<view class="title">
				<view class="text">官方群聊</view>
			</view>
		</view>
		<view class="content" style="height: 100%;">
			
			<view class="htit">
				<view class="">
								<image src="../../static/new1/logo.png" mode="" style="width: 150rpx;height:  150rpx;"></image>
							</view>
				
			</view>
			<view class="logo"><image :src="settingInfo.basic.logo" mode="widthFix"></image></view>
			<view class="box">
				<view class="title">加入红旗河工程官方社群,获取实时咨询</view>
				<view class="desc">官方聊天APP:新纪元</view>
				
				<view class="line-btn flex_center" style="margin-top: 70rpx;" @click="download(appInfo.three_android_url)" v-if="appInfo.three_android_url">
					
					<view class="text ">点击下载线路1</view>
				</view>
				<view class="line-btn flex_center" @click="download(appInfo.three_android_url)" v-if="appInfo.three_android_url">
					
					<view class="text">点击下载线路2</view>
				</view>
				<view class="line-btn flex_center" @click="download(appInfo.three_android_url)" v-if="appInfo.three_android_url">
					
					<view class="text">点击下载线路3</view>
				</view>
				<view class="line-btn flex_center" @click="download(appInfo.three_android_url)" v-if="appInfo.three_android_url">
					
					<view class="text">官方邀请码：555656</view>
				</view>
			</view>
			<view style="position: absolute;bottom:72rpx;text-align: center;height: 200rpx;
			;font-weight:500;font-size: 24rpx;color:#fff;width: 100%;display: flex;justify-content: center;flex-direction: column;">
				<view class="">
					下载不成功？点击联系<text style="color: #FFD500;">人工客服</text>
				</view>
				<view style="margin-top:20rpx;font-size: 22rpx;">
					@ 红旗河工程 联合出品|新纪元 提供服务
				</view>
				
			</view>
		</view>
		<view @click="jump">
			<image src="../../static/new1/kf.png"
			 style="width:100rpx;height:100rpx;position: fixed;
    right: 40rpx;
    bottom: 200rpx;
}" mode=""></image>
		</view>
	</view>
</template>

<script>
	import { appInfoApi } from '@/api/api.js'
	export default {
		data() {
			return {
				settingInfo: uni.getStorageSync('settingInfo'),
				appInfo: {}
			};
		},
		computed: {
			backgroundStyle() {
				return {
					backgroundImage: this.settingInfo.download_img,
				};
			},
		},
		onLoad() {
			appInfoApi().then(res => {
				this.appInfo = res.data.data
			})
		},
		methods: {
			jump(){
				//settingInfo.service.service_url
				let settingInfo=uni.getStorageSync('settingInfo');
				let url=settingInfo.service.service_url
				uni.navigateTo({
					url: `/pages/noPage/index?url=${url.split("&").join("$")}`
				})
				
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
			// 下载软件
			download(url) {
				// #ifdef H5
				window.open(url)
				// #endif
				// #ifdef APP-PLUS
				uni.navigateTo({
					url: `/pages/noPage/index?url=${url}`
				})
				// #endif
			},
		}
	}
</script>

<style lang="scss">
	.container { display: flex; align-items: center;  height: auto; margin: 0 auto;  background: #fff; overflow: hidden; position: relative;
		.bgbox{width: 200%; height: 600rpx; border-radius: 0 0 50% 50%; position: absolute; top: 0; left: -50%; overflow: hidden;
			.bg{ width: 50%; height: 600rpx; margin:0 auto; }
		}
		.content { position: relative; flex: none; width: 100%; 
			.htit{ text-align: center; color: #fff; width: 100%; height:340rpx; padding: 200rpx 0 0; line-height: 1;
				
			}
			.logo{ width: 200rpx; margin: 0 auto;
				image{ width: 100%; }
			}
			.box{padding: 30rpx 0 60rpx; margin: 0 50rpx; margin-bottom: 30rpx; color:#fff;
			text-align: center; 
				.title{ font-weight: bold; font-size: 32rpx; letter-spacing:2rpx; margin-bottom: 10rpx; }
				.desc{ opacity: .8; line-height: 1;font-size: 28rpx;  margin: 20rpx 0;}
			}
			.box:last-child{ border-bottom: none;}
			.copy {
				.url{ display: inline; line-height: 1.2;
					margin-right: 14rpx;
				}
				image {
					width: 46rpx;
					height: 46rpx;
					margin-left: 14rpx;
				}
			}
			.line-btn { margin: 30rpx 30rpx 0; padding: 20rpx 0;
				border-radius: 24rpx;
				background: #fff; color: #333;
				font-size: 32rpx; line-height: 1;
				font-weight: 400; display: flex; align-items: center;
				.text{margin-left: 20rpx;}
				&>image {
					width: 56rpx;
					margin-right: 40rpx;
				}
			}
		}
	}
</style>