<template>
	<view class="container">
		<headerView>立即购买</headerView>
		<view class="content">
			<view class="info flex_between">
				<image class="info-image" src="@/static/public/img.png" mode="none"></image>
				<view class="info-detail col_between">
					<view class="info-name el2">
						陈年贵州茅台酒（50）<span>(6瓶/箱)</span>
					</view>
					<view class="flex_between">
						<view class="info-price">¥194999.00</view>
						<u-number-box class="info-num" v-model="value">
							<view slot="minus" class="numberBtn">
								<u-icon name="minus" class="rgba(34, 34, 34, 1)" size="10" bold></u-icon>
							</view>
							<text slot="input" style="width: 50px;text-align: center;" class="input">{{value}}</text>
							<view slot="plus" class="numberBtn">
								<u-icon name="plus" color="rgba(34, 34, 34, 1)" size="10" bold></u-icon>
							</view>
						</u-number-box>
					</view>
				</view>
			</view>
			<view class="address">
				<view class="title flex_between">
					<view>收货地址</view>
					<u-icon name="arrow-right"></u-icon>
				</view>
				<view>地址：111111111</view>
				<view>姓名:123</view>
				<view>电话:18453352365</view>
			</view>
		</view>
		<view class="footer flex_center">
			<view class="button" @click="$utils.toPage('/pages/index/shopping/buy')">立即购买</view>
		</view>
		
		<!-- 提示 -->
		<u-popup :show="addressShow" mode="center" round="32" @close="addressShow = false">
		    <view class="van-dialog">
				<view class="van-dialog__header">提示</view>
				<view class="van-dialog__content">请填写收货地址</view>
				<view class="van-dialog__footer">
					<view class="button" @click="addressClick">确定</view>
				</view>
			</view>
		</u-popup>
		
		<succeed-vue :show="succeedShow" :info="'购买成功'" @onClick="succeedClick"></succeed-vue>
		<fail-vue :show="failShow" @onClick="failClick"></fail-vue>
	</view>
</template>

<script>
	import succeedVue from '@/components/succeedVue/succeedVue.vue';
	import failVue from '@/components/failVue/failVue.vue';
	export default {
		components: {
			succeedVue,
			failVue
		},
		data() {
			return {
				value: 1,
				addressShow: false,
				succeedShow: false,
				failShow: false
			};
		},
		methods: {
			addressClick(){
				this.addressShow = false
				this.$utils.toPage('')
			},
			succeedClick(){
				this.succeedShow = false
			},
			failClick(){
				this.failShow = false
				this.$utils.toPage('')
			}
		}
	}
</script>

<style lang="scss">
	.container {
		background: linear-gradient(198.19deg, #F23D30 7.15%, #FF5D29 35.57%, #FFFFFF 60%);

		.content {
			width: 750rpx;
			padding: 28rpx;
			border-radius: 30rpx 30rpx 0rpx 0rpx;
			background-color: rgba(255, 255, 255, 1);
			
			.info{
				margin-bottom: 40rpx;
				
				.info-image{
					width: 180rpx;
					height: 180rpx;
					border-radius: 20rpx;
					flex-shrink: 0;
					margin-right: 12rpx;
				}
				
				.info-detail{
					height: 180rpx;
					flex: 1;
					font-family: Roboto;
					
					.info-name{
						font-size: var(--font-12);
						font-weight: 600;
						line-height: 52rpx;
						color: rgba(34, 34, 34, 1);
						
						span{
							font-size: var(--font-10);
						}
					}
					
					.info-price{
						font-size: var(--font-18);
						font-weight: 500;
						line-height: 48rpx;
						color: rgba(243, 62, 49, 1);
					}
					
					.info-num{
						width: 180rpx;
						
						.numberBtn{
							width: 48rpx;
							height: 48rpx;
							border-radius: 8rpx;
							border: 1px solid rgba(0, 0, 0, 0.08);
							@include flex;
							justify-content: center;
							align-items: center;
						}
						
						.input{
							width: 50px;
							padding: 0 10px;
							font-family: Roboto;
							font-size: var(--font-14);
							font-weight: 500;
							line-height: 48rpx;
							text-align: center;
							color: rgba(34, 34, 34, 1);
						}
					}
				}
			}
		
			.address{
				padding: 28rpx 32rpx;
				font-family: Roboto;
				font-size: var(--font-14);
				font-weight: 400;
				line-height: 48rpx;
				color: rgba(34, 34, 34, 1);
				box-shadow: 0px 0px 64rpx 0px rgba(136, 152, 170, 0.15);

				.title{
					font-size: var(--font-16);
					font-weight: 700;
				}
				
				&>view{
					margin-bottom: 40rpx;
				}
				
				&>view:last-child{
					margin-bottom: 0;
				}
			}
		}
		
		.footer{
			width: 750rpx;
			height: 132rpx;
			box-shadow: 0px -8rpx 100rpx 0px rgba(100, 116, 139, 0.08);
			background-color: rgba(255, 255, 255, 1);
			
			.button{
				width: 670rpx;
			}
		}
		
		.van-dialog{
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
			
			.van-dialog__content{
				margin: 34rpx auto;
				font-size: var(--font-16);
			}
			
			.van-dialog__footer {
				display: flex;
				
				.button{
					height: 72rpx;
					font-size: var(--font-14);
				}
			}
		}
	}
</style>