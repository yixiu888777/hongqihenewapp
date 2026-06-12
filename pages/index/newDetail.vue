<template>
	<view class="container" style="background:#c8131e url(/static/new/bg.jpg) no-repeat center top / 100%;">
		<headerView>
			<template #leftIcon><u-icon name="arrow-left" color="#fff" size="24"></u-icon></template>
			<view>资讯详情</view>
		</headerView>
		<view class="content">
			<view class="h1">{{info.title}}</view>
			<view class="info" v-if="info.title"><u-parse :content="info.content"></u-parse></view>
			<u-skeleton :loading="true" :animate="true" :rows="10" v-else></u-skeleton>
		</view>
	</view>
</template>

<script>
	import {
		commonNewsDetailApi
	} from '@/api/api.js'
	export default {
		data() {
			return {
				info: {}
			};
		},
		onLoad(opt) {
			commonNewsDetailApi({
				id: opt.id
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
			margin: 0 30rpx 30rpx;
			border-radius: 20rpx;
			background-color: rgba(255, 255, 255, 1);
			text-align: justify;
			color: rgba(34, 34, 34, 1);

			.h1 {
				text-align: center;
				margin-bottom: 30rpx;
				font-size: 1.2em;
				font-weight: bold;
			}

			.info {

				img,
				image {
					max-width: 100%;
					height: auto;
				}

				::v-deep video {
					width: 100% !important;
					max-width: 100% !important;
				}

				::v-deep p {
					margin-bottom: 1em;
					line-height: 1.4;
					font-weight: 300;
				}

				::v-deep img {
					border-radius: 20rpx;
				}
			}
		}
	}

	// ::v-deep video {
	//   width: 100% !important; /* 强制占满容器宽度 */
	//   height: auto !important; /* 高度自适应 */
	//   max-width: 100% !important; /* 限制最大宽度 */
	// }
</style>