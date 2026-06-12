<template>
	<view class="container">
		<headerView>
			<view>查看证书</view>
			<template #rightIcon>
			    <view @click="applicationClick">申请</view>
			</template>
		</headerView>
		<view class="content">
			<image src="@/static/public/img2.png" mode="widthFix"></image>
		</view>
		<payment-vue :show="paymentShow" @onClick="paymentClose"></payment-vue>
	</view>
</template>

<script>
	import paymentVue from '@/components/paymentVue/paymentVue.vue';
	export default {
		components: {
			paymentVue
		},
		data() {
			return {
				// 缴费弹窗
				paymentShow: false
			};
		},
		methods: {
			// 申请
			applicationClick(){
				uni.$u.toast('该筑梦通道您已申请分享好友参与申请！');
			},
			paymentClose(item){
				this.paymentShow = false
				if(!!item){
					console.log('刷新接口');
				}
			}
		}
	}
</script>

<style lang="scss">
	.container{
		background: linear-gradient(198.19deg, #F23D30 7.15%, #FF5D29 35.57%, #FFFFFF 60%);
		
		.content{
			width: 750rpx;
			padding: 48rpx 52rpx;
			border-radius: 30rpx 30rpx 0rpx 0rpx;
			background-color: rgba(255, 255, 255, 1);
		}
	}

</style>
