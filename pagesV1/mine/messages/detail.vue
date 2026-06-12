<template>
	<view class="container">
		<view class="content">
			<view class="title">{{info.title}}</view>
			<view class="time">{{info.createtime}}</view>
			<view class="text" v-html="info.content"></view>
		</view>
	</view>
</template>

<script>
	import {
		messageApi
	} from '@/api/api.js'
	export default {
		data() {
			return {
				info: {}
			};
		},
		onLoad(option) {
			messageApi({
				id: option.id
			}).then(res => {
				this.info = res.data.data
			})
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		.content {
			padding: 30rpx;
			background-color: rgba(255, 255, 255, 1);

			/* #ifdef APP */
				margin-top: 30rpx;
			/* #endif */
			.title {
				font-weight: 700; font-size: 1.4em;
				margin-bottom: 10rpx;
				text-align: center;
				color: rgba(34, 34, 34, 1);
			}

			.time {
				text-align: right; margin-bottom: 30rpx;
				color: rgba(111, 115, 116, 1);
			}

			.text {
				font-family: Roboto;
				font-weight: 400;
				line-height: 56rpx;
				text-align: justified;
				color: rgba(34, 34, 34, 1);
				margin-top: 18rpx;
			}
		}
	}
</style>