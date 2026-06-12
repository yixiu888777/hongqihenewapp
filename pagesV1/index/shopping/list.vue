<template>
	<view class="container">
		<headerView>
			<view>商城中心</view>
			<template #rightIcon>
			    <image src="@/static/public/history.svg" mode="widthFix" @click="$utils.toPage('/pages/index/shopping/history')"></image>
			</template>
		</headerView>
		
		<view class="content">
			<!-- 轮播图 -->
			<view class="swiper">
				<u-swiper :list="swiperList" keyName="url" @change="e => swiperCurrent = e.current" @click="toWeb" autoplay circular height="184" radius="10">
					<view slot="indicator" class="indicator">
						<view class="indicator__dot" v-for="(item, index) in swiperList" :key="index" :class="[index === swiperCurrent && 'indicator__dot--active']"></view>
					</view>
				</u-swiper>
			</view>
			
			<!-- 导航栏 -->
			<view :style="stickyStyle">
				<u-tabs :list="navList" @click="tabClick" :activeStyle="{color: 'rgba(243, 62, 49, 1)'}" lineWidth="60" lineColor="rgba(243, 62, 49, 1)"></u-tabs>
			</view>
			
			<view class="list flex">
				<view class="item" v-for="i in 10" @click="$utils.toPage('/pages/index/shopping/detail')">
					<image class="item-image" src="@/static/public/img.png" mode="none"></image>
					<view class="item-num flex_between">
						<span>免运费</span>
						<text>销量1900</text>
					</view>
					<view class="item-name el1">男士商务包我买不起系男士商务包我买不起系</view>
					<view class="item-price el1">
						<text>￥</text>3399<text>+1234124.00数字人民币</text>
					</view>
					<view class="item-btn flex_center" @click.stop="$utils.toPage('/pages/index/shopping/buy')">立即购买</view>
				</view>
			</view>
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
				    url: 'https://cdn.uviewui.com/uview/resources/video.mp4',
				    title: '昨夜星辰昨夜风，画楼西畔桂堂东',
				    poster: 'https://cdn.uviewui.com/uview/swiper/swiper1.png'
				},{
				    url: 'https://cdn.uviewui.com/uview/swiper/swiper2.png',
				    title: '身无彩凤双飞翼，心有灵犀一点通'
				},{
				    url: 'https://cdn.uviewui.com/uview/swiper/swiper3.png',
				    title: '谁念西风独自凉，萧萧黄叶闭疏窗，沉思往事立残阳'
				}],
				// 导航栏
				navList: [{
					name: '珠宝首饰'
				},{
					name: '电子产品'
				},{
					name: '家用电器'
				},{
					name: '新能源汽车'
				},{
					name: '珠宝首饰'
				},{
					name: '电子产品'
				},{
					name: '家用电器'
				},{
					name: '新能源汽车'
				}],
				stickyStyle: ''
			};
		},
		onUnload() {
			this.stickyStyle = ''
		},
		onPageScroll(e) {
			if(e.scrollTop > 200){
				this.stickyStyle = 'position: fixed;top: 0;left: 0;background: #fff;width: 100%;z-index: 999;'
			}else{
				this.stickyStyle = ''
			}
		},
		onReachBottom() {
			console.log('触底！');
		},
		methods: {
			// 跳转外链
			toWeb(e){
				if(!!this.swiperList[e].url){
					this.$utils.toWeb(this.swiperList[e].url)
				}
			},
		}
	}
</script>

<style lang="scss">
	.container {
		background: url('@/static/public/page-background.png') no-repeat center top / 100%;
		display: block;
		
		.content{
			padding: 28rpx 32rpx;
			
			.swiper{
				margin-bottom: 26rpx;
				
				.indicator{
					@include flex(row);
					justify-content: center;
					
					&__dot{
						width: 12rpx;
						height: 12rpx;
						border-radius: 80rpx;
						background: rgba(229, 231, 235, 1);
						margin: 0 8rpx 0 0;
			
						
						&--active {
							width: 60rpx;
							height: 12rpx;
							border-radius: 80rpx;
							background: rgba(255, 255, 255, 1);
						}
					}
				}
			}
			
			.list{
				margin: 20rpx auto;
				flex-wrap: wrap;
				
				.item{
					width: 334rpx;
					margin: 20rpx 18rpx 0 0;
					font-family: Roboto;
					font-weight: 400;
					
					.item-image{
						height: 342rpx;
						border-radius: 20rpx 20rpx 0 0;
					}
					
					.item-num{
						margin-top: 10rpx;
						font-size: var(--font-11);
						line-height: 36rpx;
						color: rgba(111, 115, 116, 1);
						
						span{
							font-weight: 500;
							color: rgba(243, 62, 49, 1);
						}
					}
					
					.item-name{
						margin-top: 10rpx;
						font-size: var(--font-14);
						line-height: 40rpx;
						color: rgba(34, 34, 34, 1);
					}
					
					.item-price{
						margin-top: 10rpx;
						font-size: var(--font-14);
						font-weight: 500;
						line-height: 48rpx;
						color: rgba(243, 62, 49, 1);
						
						text{
							font-size: var(--font-12);
							font-weight: 400;
							line-height: 40rpx;
						}
					}
					
					.item-btn{
						margin-top: 10rpx;
						height: 64rpx;
						border-radius: 96rpx;
						border: 1px solid rgba(243, 62, 49, 1);
						font-size: var(--font-14);
						font-weight: 500;
						color: rgba(243, 62, 49, 1);
					}
				}
				
				.item:nth-child(2n){
					margin-right: 0;
				}
			}
		}
	}
</style>
