<template>
	<view class="container" 	style="background: url('/static/new1/bg.jpg') no-repeat center top / cover;background-attachment: fixed;">
		<headerView>
			<template #leftIcon><u-icon name="arrow-left" color="#fff" size="24"></u-icon></template>
			<view>岗位介绍</view>
		</headerView>
		<view class="main">
			<view class="content">
				<view class="title">{{list[0].name}}</view>
				<view class="body" v-html="list[0].detail"></view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		addressDelApi,
		userTeamPositionApi
	} from '@/api/api.js'
	export default {
		data() {
			return {
				settingInfo: uni.getStorageSync('settingInfo'),
				list:[]
			};
		},
		onLoad() {
			this.getDate()
		},
		methods: {
			getDate(){
				userTeamPositionApi().then(res=>{
					console.log(res.data.data);
					this.list=res.data.data
				})
			}
		}
	}
</script>

<style lang="scss">
	.container {
		.main{ display: flex; flex-direction: column; flex: 1;margin:0 30rpx 30rpx; }
		.content { background: #fff; border-radius: 20rpx; display: flex; flex-direction: column; flex: 1;
			.title{ padding: 30rpx; border-bottom: 2rpx solid #e5e5e5; font-weight: bold; }
			.body{ margin: 30rpx; overflow: auto; flex: 1; max-height: calc(100vh - 300rpx);
				/* #ifdef APP */
				max-height: calc(100vh - 400rpx);
				/* #endif */
			}
		}
	}
</style>