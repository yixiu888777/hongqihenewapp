<template>
	<view class="container">
		<headerView>购买记录</headerView>
		<scroll-view scroll-y="true" @scrolltolower="scrollBottom" class="content">
			<view class="list flex" v-if="1==1">
				<view class="item" v-for="i in 10">
					<image class="item-image" src="@/static/public/img.png" mode="none"></image>
					<view class="item-info">
						<view class="flex_between">
							<span class="el1">AR眼镜 BtailAR</span>
							已支付
						</view>
						<view class="flex_between">
							<text>¥3399</text>
							共1件
						</view>
					</view>
					<view class="item-address">
						<view class="flex_between">
							<span>姓名</span>
							<text class="el1">刘</text>
						</view>
						<view class="flex_between">
							<span>电话</span>
							<text class="el1">18956243256</text>
						</view>
						<view class="flex_between">
							<span>地址</span>
							<text class="el1">云南省曲靖市罗平云南省曲靖市罗平...</text>
						</view>
					</view>
				</view>
			</view>
			<view class="noData col_center" v-else>
				<image src="@/static/public/noData.svg" mode="widthFix"></image>
				<view>暂无记录</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		methods: {
			scrollBottom() {
				console.log('触底！');
			},
		}
	}
</script>

<style lang="scss">
	.container{
		background: linear-gradient(198.19deg, #F23D30 7.15%, #FF5D29 35.57%, #FFFFFF 60%);
		
		.content{
			width: 750rpx;
			padding: 0 32rpx;
			border-radius: 30rpx 30rpx 0rpx 0rpx;
			background-color: rgba(255, 255, 255, 1);
			
			.list{
				flex-wrap: wrap;
				
				.item{
					width: 334rpx;
					margin: 28rpx 18rpx 0 0;
					padding: 0px 0px 12rpx 0px;
					border-radius: 8px 0px 0px 0px;
					opacity: 0px;
					
					.item-image{
						height: 342rpx;
						border-radius: 16rpx 16rpx 0 0;
					}
					
					.item-info{
						font-family: Roboto;
						font-size: var(--font-10);
						font-weight: 400;
						line-height: 40rpx;
						color: rgba(111, 115, 116, 1);
						border-bottom: 1px solid rgba(0, 0, 0, 0.1);
						
						&>view{
							margin-top: 10rpx;
						}
						
						span{
							flex: 1;
							margin-right: 20rpx;
							font-size: var(--font-14);
							color: rgba(34, 34, 34, 1);
						}
						
						text{
							font-size: var(--font-14);
							font-weight: 500;
							line-height: 48rpx;
							color: rgba(243, 62, 49, 1);
						}
					}
					
					.item-address{
						padding: 10rpx 0;
						font-family: Roboto;
						font-size: var(--font-11);
						font-weight: 400;
						line-height: 40rpx;
						color: rgba(34, 34, 34, 1);
						
						span{
							flex-shrink: 0;
						}
						
						text{
							margin-left: 20rpx;
							flex: 1;
							text-align: right;
						}
					}
				}
				
				.item:nth-child(2n){
					margin-right: 0;
				}
			}
			
			.noData{
				margin: 30% auto 0;
				font-family: Roboto;
				font-size: var(--font-16);
				font-weight: 500;
				line-height: 41rpx;
				color: rgba(111, 115, 116, 1);
				
				image{
					width: 312rpx;
					height: 312rpx;
					margin-bottom: 56rpx;
				}
			}
		}
	}

</style>
