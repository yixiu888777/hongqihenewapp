<template>
	<view class="container">
		<headerView>团队津贴</headerView>
		<view class="content">
			<view class="card">
				<view class="title flex_center">
					<view class="title-left"></view>
					<view>APP下载链接</view>
					<view class="title-right"></view>
				</view>
				<view>YyAoMaz1P/Untitled?node-id=19-4664&node-type=frame&t=</view>
				<view class="card-btn">复制APP下载链接</view>
			</view>
			<view class="card">
				<view class="title flex_center">
					<view class="title-left"></view>
					<view>邀请注册链接</view>
					<view class="title-right"></view>
				</view>
				<view>YyAoMaz1P/Untitled?node-id=19-4664&node-type=frame&t=</view>
				<view class="card-btn">复制邀请注册链接</view>
			</view>
			<view class="inform">
				<view class="title flex_center">
					<view class="title-left"></view>
					<view>以旧换新津贴</view>
					<view class="title-right"></view>
				</view>
				<view class="inform-item flex_between" v-for="i in 5">
					<view>一级宣传大石/30人</view>
					<span>1600/月</span>
				</view>
				<view class="inform-tips">直推团队消费人数达到要求的可联系在线客服领取团队津贴</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
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
			
			.title{
				margin-bottom: 40rpx;
				font-family: Roboto;
				font-size: var(--font-15);
				font-weight: 700;
				line-height: 40rpx;
				color: rgba(243, 62, 49, 1);
				
				.title-left{
					width: 132rpx;
					height: 2rpx;
					background: linear-gradient(270deg, #F33E31 0%, #FFFFFF 100%);
					margin-right: 32rpx;
				}
				
				.title-right{
					width: 132rpx;
					height: 2rpx;
					background: linear-gradient(270deg, #FFFFFF 0%, #F33E31 100%);
					margin-left: 32rpx;
				}
			}
			
			.card{
				margin: 28rpx auto;
				width: 686rpx;
				padding: 28rpx 32rpx;
				border-radius: 20rpx;
				background: rgba(255, 255, 255, 1);
				box-shadow: 0px 0px 64rpx 0px rgba(136, 152, 170, 0.15);
				font-family: Roboto;
				font-size: var(--font-12);
				font-weight: 500;
				line-height: 36rpx;
				text-align: center;
				color: rgba(34, 34, 34, 1);
				
				.card-btn{
					width: 382rpx;
					height: 88rpx;
					margin: 14rpx auto 0;
					border-radius: 122rpx;
					border: 1px solid rgba(243, 62, 49, 1);
					font-size: var(--font-15);
					font-weight: 700;
					line-height: 88rpx;
					text-align: center;
					color: rgba(243, 62, 49, 1);
				}
			}
			
			.inform{
				width: 686rpx;
				margin: 20rpx auto;
				padding: 32rpx;
				border-radius: 20rpx;
				background: rgba(255, 248, 240, 1);
				border: 1px solid rgba(243, 154, 88, 1);
				
				.title{
					padding: 28rpx 0;
				}
				
				.inform-item{
					margin-top: 20rpx;
					height: 96rpx;
					border-bottom: 1px solid rgba(243, 154, 88, 0.2);
					font-family: Roboto;
					font-size: var(--font-12);
					font-weight: 500;
					
					span{
						font-size: var(--font-14);
						font-weight: 700;
						color: rgba(192, 27, 23, 1);
					}
				}
				
				.inform-tips{
					margin: 20rpx auto 0;
					font-family: Roboto;
					font-size: var(--font-11);
					font-weight: 400;
					line-height: 40rpx;
					text-align: center;
					color: rgba(192, 27, 23, 1);
				}
			}
		}
	}
</style>
