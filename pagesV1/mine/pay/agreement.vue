<template>
	<view class="container">
		<!-- <headerView>签署大额提现协议</headerView> -->
		<view class="content">
			<view class="image">
				<image :src="info.xy_content" mode="widthFix"></image>
			</view>
			<view class="signBoard">
				<view>签字</view>
				<ttSignBoard :show="true" @save="handleGetImg" />
			</view>
		</view>
		
		<!-- 提示 -->
		<u-popup :show="info.is_tan == 1" mode="center" round="32">
			<view class="van-dialog">
				<view class="van-dialog__header">温馨提示</view>
				<view class="van-dialog__content">{{info.tips}}</view>
				<view class="van-dialog__footer">
					<view class="button" @click="confirmSub">{{info.btn==0?'确定':'缴纳'}}</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import ttSignBoard from "@/components/tt-sign-board/tt-sign-board.vue";
	import { withdrawalXyApi, withdrawalQmApi, withdrawalXyjnApi } from '@/api/api.js'
	export default {
		components: {
			ttSignBoard
		},
		data() {
			return {
				info: {}
			}
		},
		onLoad() {
			// 获取配置
			withdrawalXyApi().then(res => {
				this.info = res.data.data
			})
		},
		methods: {
			handleGetImg(img) {
				this.$utils.throttle(() => {
					withdrawalQmApi({
						img_str: img
					}).then(res => {
						this.info.is_tan = 1
						this.info.tips = res.data.msg
						this.info.btn = 1
					})
				}, 2000)()
			},
			confirmSub(){
				if(this.info.btn == 1){
					this.$utils.throttle(() => {
						withdrawalXyjnApi().then(res => {
							console.log(res.data);
							this.info.is_tan = 1
							this.info.tips = res.data.msg
							this.info.btn = 0
						})
					}, 2000)()
				}else {
					uni.reLaunch({
						url: '/pages/mine/mine'
					})
				}
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		background: #F33E31;

		.content {
			width: 750rpx;
			padding: 28rpx 32rpx;
			background-color: rgba(255, 255, 255, 1);
			
			.image {
				width: 590rpx;
				margin: 20rpx auto;
				
				image {
					width: 100%;
					height: 100%;
				}
			}
			
			.signBoard {
				font-family: PingFang SC;
				font-size: 28rpx;
				font-weight: 400;
				line-height: 40rpx;
				color: rgba(0, 0, 0, 1);
				
				&>view {
					margin: 20rpx 0;
				}
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
				color: rgba(241, 55, 36, 1);
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