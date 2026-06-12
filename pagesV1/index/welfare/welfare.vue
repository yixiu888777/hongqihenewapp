<template>
	<view class="container">
		<headerView>
			<view>换新福利</view>
			<template #rightIcon>
			    <image src="@/static/public/history.svg" mode="widthFix" @click="$utils.toPage('/pages/index/welfare/history')"></image>
			</template>
		</headerView>
		<view class="content">
			<view class="noData col_center">
				<image src="@/static/public/noData.svg" mode="widthFix"></image>
				<view>暂无记录</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
	.container{
		background: linear-gradient(198.19deg, #F23D30 7.15%, #FF5D29 35.57%, #FFFFFF 60%);
		
		.content{
			width: 750rpx;
			padding: 52rpx 32rpx 0;
			border-radius: 30rpx 30rpx 0rpx 0rpx;
			background-color: rgba(255, 255, 255, 1);
			
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
