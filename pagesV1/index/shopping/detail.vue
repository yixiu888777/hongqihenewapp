<template>
	<view class="container">
		<headerView>产品详情</headerView>
		<view class="content">
			<!-- 轮播图 -->
			<view class="swiper">
				<u-swiper :list="swiperList" keyName="image" @change="e => swiperCurrent = e.current" @click="toWeb" autoplay circular height="280">
					<view slot="indicator" class="indicator">
						<view class="indicator__dot" v-for="(item, index) in swiperList" :key="index" :class="[index === swiperCurrent && 'indicator__dot--active']"></view>
					</view>
				</u-swiper>
			</view>
			<view class="info">
				<view class="price flex_between">
					<view>
						￥3399<text>+1232.00数字人民币</text>
					</view>
					<span>销量：3690</span>
				</view>
				<view class="name">
					陈年贵州茅台酒（50）<span>(6瓶/箱)</span>
				</view>
			</view>
			<view class="detail">
				<view class="title">产品详情</view>
				<view class="tips">
					<view>香   型：酱香型白酒</view>
					<view>酒精含量：53%  vol</view>
					<view>规    格：500 ml/瓶</view>
					<view>彩盒尺寸：340*260*115mm</view>
					<view>配    料：高粱、小麦、水</view>
					<view>储存条件：阴凉、干燥、密封保存、开启后请尽快饮用</view>
				</view>
			</view>
		</view>
		<view class="footer flex_center">
			<view class="button" @click="$utils.toPage('/pages/index/shopping/buy')">立即购买</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 轮播图
				swiperCurrent: 0,
				swiperList: [{
				    image: require('@/static/public/img.png')
				},{
				    image: require('@/static/public/img.png')
				},{
				    image: require('@/static/public/img.png')
				}],
			};
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	.container {
		background: linear-gradient(198.19deg, #F23D30 7.15%, #FF5D29 35.57%, #FFFFFF 60%);

		.content {
			width: 750rpx;
			border-radius: 30rpx 30rpx 0rpx 0rpx;
			background-color: rgba(255, 255, 255, 1);
			
			.swiper{
				.indicator{
					@include flex(row);
					justify-content: center;
					
					&__dot{
						width: 16rpx;
						height: 16rpx;
						border-radius: 80rpx;
						background: rgba(229, 231, 235, 1);
						margin: 0 8rpx 0 0;
			
						
						&--active {
							width: 48rpx;
							height: 16rpx;
							border-radius: 80rpx;
							background: rgba(245, 71, 57, 1);
						}
					}
				}
			}
			
			.info{
				margin: 0 32rpx;
				padding: 32rpx 0 28rpx;
				border-bottom: 1px solid rgba(227, 231, 236, 1);
				
				.price{
					align-items: flex-end;
					font-family: Roboto;
					font-size: var(--font-20);
					font-weight: 500;
					line-height: 48rpx;
					color: rgba(243, 62, 49, 1);
					
					span{
						font-size: var(--font-12);
						font-weight: 400;
						line-height: 40rpx;
						color: rgba(111, 115, 116, 1);
					}
					
					text{
						font-size: var(--font-16);
					}
				}
				
				.name{
					margin-top: 20rpx;
					font-family: Roboto;
					font-size: var(--font-15);
					font-weight: 600;
					line-height: 52rpx;
					color: rgba(34, 34, 34, 1);
					
					span{
						font-size: var(--font-12);
					}
				}
			}
			
			.detail{
				margin: 0 32rpx;
				padding: 28rpx 0;
				font-family: Roboto;
				color: rgba(34, 34, 34, 1);
				
				.title{
					font-size: var(--font-16);
					font-weight: 700;
					line-height: 48rpx;
				}
				
				.tips{
					margin-top: 20rpx;
					font-size: var(--font-14);
					font-weight: 400;
					line-height: 56rpx;
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
	}
</style>