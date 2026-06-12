<template>
	<view class="container" style="background:#c8131e url(/static/new/bg.jpg) no-repeat center top / 100%;">
		<headerView>
			<template #leftIcon>
				<image src="@/static/mine/back.svg" mode="widthFix"></image>
			</template>
			<view>人工客服</view>
		</headerView>
		<view class="content">
			<view class="service">
				<view class="img"><image src="" mode="heightFix"></image></view>
				<view class="text"> 
					<view class="name">365在线</view>
					<view class="desc">每天12小时专属客服服务</view>
				</view>
				<view class="btn" @click="toLoads(settingInfo.service.service_url)">人工客服</view>
			</view>
			<view class="list">
				<view class="item">
					<view class="icon"><image src="/static/new/qa.png" mode="widthFix"></image></view>
					<view class="text">
						<view class="q">
							<text>1、如何注册</text>
							<u-icon name="arrow-right"></u-icon>
						</view>
						<view class="a">点击网站首页“登录”，在登录弹窗上点击“立即注册”，即可进入注
册页面，本期仅支持手机号注册哦~</view>
					</view>
				</view>
				<view class="item">
					<view class="icon"><image src="/static/new/qa.png" mode="widthFix"></image></view>
					<view class="text">
						<view class="q">
							<text>1、如何注册</text>
							<u-icon name="arrow-right"></u-icon>
						</view>
						<view class="a">点击网站首页“登录”，在登录弹窗上点击“立即注册”，即可进入注
册页面，本期仅支持手机号注册哦~</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				settingInfo: uni.getStorageSync('settingInfo'),
			};
		},
		onLoad() {
			
		},
		methods: {
			// 跳转在线客服
			toLoads(url) {
				uni.navigateTo({
					url: `/pages/noPage/index?url=${url.split("&").join("$")}`
				})
			},
		}
	}
</script>

<style lang="scss">
	.container {}
	.content{padding: 30rpx;}
	.service{ display: flex; align-items: center; margin-bottom: 30rpx;
		.img{ width: 100rpx;
			image{ height: 100rpx; display: block;}
		}
		.text{ color: #fff; flex: 1; padding: 0 30rpx;}
		.btn{ background: #fff;padding:20rpx 30rpx; border-radius: 90rpx;}
	}
	.list{ 
		.item{ background: #fff; padding: 30rpx; border-radius: 20rpx; margin-bottom: 30rpx; display: flex;
			.icon{ width: 50rpx; flex: none;
				image{ width: 50rpx; display: block; }
			}
			.text{ padding: 0 0 0 30rpx; flex: 1;
				.q{ display: flex; justify-content: space-between; align-items: center;}
				.a{ font-size: .8em; opacity: .5; display: none;  margin-top: 20rpx;}
			}
		}
		.item.on{
			.text{ padding: 0 0 0 30rpx;
				.a{ display: block; }
			}
		}
	}
</style>