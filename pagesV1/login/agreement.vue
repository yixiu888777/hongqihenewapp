<!-- 有用 -->
<template>
	<view class="container">
		<view class="content">
			<view class="title">{{info.name}}</view>
			<view class="text" v-html="info.content"></view>
		</view>
	</view>
</template>

<script>
	import { articleApi } from '@/api/api.js'
	export default {
		data() {
			return {
				info: {}
			};
		},
		onLoad(opt) {
			articleApi({ id: opt.id }).then(res=>{
				this.info = res.data.data.data[0]
				uni.setNavigationBarTitle({ title: res.data.data.data[0].name });
			})
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		.content {			
			.title{
				font-weight: 700; font-weight: bold; font-size: 1.2em; line-height: 1; padding:30rpx;
				text-align: left;
				color: rgba(34, 34, 34, 1);
			}
			
			.text{ background-color: rgba(255, 255, 255, 1); padding: 30rpx; margin-bottom: 30rpx;
				font-weight: 400;
				line-height: 56rpx;
				text-align: justified;
				color: rgba(111, 115, 116, 1);
			}
		}
	}
</style>