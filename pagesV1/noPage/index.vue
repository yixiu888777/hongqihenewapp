<template>
	<view style="background-color: #F1F1F1;">
		<!-- <headerView></headerView> -->
		<iframe frameborder="no" :src="urls" class="web"></iframe>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				urls: ''
			};
		},
		onLoad(options) {
			this.urls = options.url.split("$").join("&")
		}
	}
</script>

<style lang="scss">
	.web{
		width: 750rpx;
		margin: 0 auto;
		height: calc(100vh - 96rpx);
	}
</style>
