<template>
	<!-- 实名认证提示 -->
	<u-popup :show="RealNameShow" mode="center" round="32">
		<view class="van-dialog van-dialog2">
			<view class="van-dialog__header">提示</view>
			<view class="van-dialog__content">您还未实名认证，请先实名认证</view>
			<view class="van-dialog__footer">
				<view class="van-success" @tap="$utils.toPage('/pages/mine/realName')">认证</view>
			</view>
		</view>
	</u-popup>
</template>

<script>
	import {
		getUserInfoAPI
	} from '@/api/api.js' 
	export default {
		data() {
			return {
				RealNameShow: false,
				UserInfo: {}
			}
		},
		mounted(){
			this.getAuth()
		},
		activated() {
		    this.getAuth()
	    },
		methods: {
			getAuth(){
				getUserInfoAPI().then(res => {
					this.UserInfo = res.data.data
					uni.setStorageSync('UserInfo', res.data.data)
					if( this.UserInfo.is_auth == 0 ){
						this.RealNameShow = true;
					} else {
						this.RealNameShow = false;
					}
				})				
			}
		}
	}
</script>

<style>
</style>