<template>
	<view class="container">
		<headerView>{{info.name}}</headerView>
		<view class="content">
			<image :src="info.c_image"></image>
			<view v-html="info.detail"></view>
		</view>
	</view>
</template>

<script>
	import { productDetailAPI } from '@/api/api.js'
	export default {
		data() {
			return {
				info: {}
			};
		},
		onLoad(opt) {
			productDetailAPI({
				id: opt.id
			}).then(res=>{
				this.info = res.data.data
			})
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		background: url("/static/mine/recharge_bg.svg") no-repeat center top / 100%;
		background-color: rgba(255, 255, 255, 1);

		.content {
			background: #fff;

			image {
				width: 750rpx;
				height: 358rpx;
			}

			view {
				margin-top: 20rpx;
				padding: 32rpx;
				font-family: Roboto;
				font-size: var(--font-14);
				font-weight: 400;
				line-height: 42rpx;
				text-align: justified;
				color: rgba(17, 24, 38, 1);
			}
		}
	}
</style>