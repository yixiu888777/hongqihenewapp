<template>
	<view class="container" style="background:#c8131e url(/static/new/bg.jpg) no-repeat center top / 100%;">
		<headerView>
			<template #leftIcon><u-icon name="arrow-left" color="#fff" size="24"></u-icon></template>
			<view>审核记录</view>
		</headerView>
		<view class="main">
			<view class="lists">
				<view class="itme">
					<view class="dl">
						<view class="dt">状态</view>
						<view class="dd fail">审核失败</view>
					</view>
					<view class="dl">
						<view class="dt">缘由</view>
						<view class="dd">请拍摄清晰身份证信息再此提交!</view>
					</view>
				</view>
				<view class="itme">
					<view class="dl">
						<view class="dt">状态</view>
						<view class="dd success">审核成功</view>
					</view>
					<view class="dl">
						<view class="dt">缘由</view>
						<view class="dd">请拍摄清晰身份证信息再此提交!</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getUserInfoAPI,
	} from '@/api/api.js';
	export default {
		data() {
			return {
				settingInfo: uni.getStorageSync('settingInfo'),
				UserInfo: [],
			};
		},
		onLoad(opt) {
			this.loadData();
		},
		methods: {
			loadData(){
				getUserInfoAPI().then(res => {
					this.UserInfo = res.data.data
					uni.setStorageSync('UserInfo', res.data.data)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.main{padding:0 30rpx 30rpx;}
	.lists{
		.itme{padding: 30rpx; margin-bottom: 30rpx; border-radius: 20rpx; background: #fff; line-height: 1;
			.dl{ display: flex; justify-content: space-between; padding: 5rpx 0;}
			.dd{ color: #999; padding-left: 30rpx; padding: 5rpx 0; }
			.dd.success{ color: rgba(7, 193, 96, 1);}
			.dd.fail{ color: rgba(246, 42, 45, 1);}
		}
	}
</style>