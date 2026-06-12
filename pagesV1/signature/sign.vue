<template>
	<view class="container">
		<headerView>合同详情</headerView>
		<view class="content">
			<view class="title">请签字</view>
			<ttSignBoard :show="true" ref="signBoard" @save="handleGetImg" />
		</view>
		<view class="footer">
			<view class="rule" v-if="!!rule">
				<view class="rule-title">温馨提示</view>
				<view v-html="rule"></view>
			</view>
			<view class="btns flex_between">
				<view class="btn flex_center" @click="reDraw">取消</view>
				<view class="btn active flex_center" @click="save">保存</view>
			</view>
		</view>
		<!-- 温馨提示 -->
		<u-popup :show="qianmingInfo.show" mode="center" round="32">
			<view class="van-dialog">
				<view class="van-dialog__header">温馨提示</view>
				<view class="van-dialog__content" v-html="qianmingInfo.tips"></view>
				<template v-if="qianmingInfo.status == 1">
					<view class="van-dialog__footer flex_center" @click="jiaona">缴纳</view>
				</template>
				<template v-else-if="qianmingInfo.status == -9">
					<view class="van-dialog__footer flex_center" @click="$utils.toPage('/pages/mine/recharge/recharge')">充值</view>
				</template>
				<template v-else>
					<view class="van-dialog__footer flex_center" @click="backClick">确定</view>
				</template>
			</view>
		</u-popup>
		<!-- 款项保证金 -->
		<u-popup :show="bxInfo.show" zIndex="10" mode="center">
			<view class="van-dialog">
				<view class="van-dialog__header">款项保证金</view>
				<view class="list">
					<view class="list-title">
						<view>款项保证金</view>
						<view>项目资产/元</view>
						<view>缴纳保费/元</view>
					</view>
					<view class="list-item" :class="item.id == bxInfo.check_id?'active':''" v-for="item in bxInfo.bx_list" :key="item.id">
						<view>{{item.title}}</view>
						<view>{{item.content}}</view>
						<view>{{item.rate}}</view>
					</view>
				</view>
				<view class="van-dialog__footer flex_center" @click="withfourJiaona">缴纳</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import { houseWithfourAddApi, houseWithfourJiaonaApi } from '@/api/api.js'
	import ttSignBoard from "@/components/tt-sign-board/ttSignBoard.vue";
	export default {
		components: {
			ttSignBoard
		},
		data() {
			return {
				qianmingInfo: {
					show: false,
					tips: '',
					status: 0
				},
				bxInfo: {
					show: false,
					check_id: null,
					bx_list: []
				},
				rule: '',
			};
		},
		onLoad() {
			if(!!uni.getStorageSync('signatureInfo')){
				this.rule = uni.getStorageSync('signatureInfo').ht_wxts
			}else{
				uni.navigateBack()
			}
		},
		methods: {
			reDraw(){
				this.$refs.signBoard.reDraw()
			},
			save(){
				this.$refs.signBoard.save()
			},
			handleGetImg(img) {
				uni.showLoading({mask: true})
				uni.uploadFile({
					url: uni.getStorageSync("baseUrl") + '/api/common/upload',
					filePath: img,
					name: 'file',
					formData: {
						site: uni.getStorageSync("baseUrl"),
						app_ver: '101'
					},
					success: (res) => {
						uni.hideLoading();
						this.setCardAdd(JSON.parse(res.data).data.url)
					},
					fail: (err) => {
						uni.hideLoading();
						uni.$u.toast('请求超时，请重新再试')
					},
				})
			},
			setCardAdd(image){
				houseWithfourAddApi({
					qm_image: image
				}).then(res=> {
					uni.removeStorageSync('signatureInfo')
					this.qianmingInfo = {
						show: true,
						tips: res.data.msg,
						status: 1
					}
					this.bxInfo = {
						show: false,
						check_id: res.data.data.check_id,
						bx_list: res.data.data.bx_list
					}
				})
			},
			jiaona(){
				this.qianmingInfo.show = false
				this.bxInfo.show = true
				// uni.redirectTo({
				// 	url: '/pages/mine/withdraw/withdraw'
				// })
			},
			// 保险缴纳
			withfourJiaona(){
				this.bxInfo.show = false
				
				houseWithfourJiaonaApi().then(res=> {
					this.qianmingInfo = {
						show: true,
						tips: res.data.data.tips,
						status: res.data.data.status==-9?res.data.data.status:2
					}
				})
			},
			backClick(){
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss">
	.container {
		background: url("/static/mine/recharge_bg.svg") no-repeat center top / 100%;
		background-color: rgba(255, 255, 255, 1);
	}
	
	.content{
		padding: 32rpx;
		background-color: rgba(255, 255, 255, 1);
		
		.title {
			font-family: Roboto;
			font-weight: 500;
			font-size: 28rpx;
			line-height: 44rpx;
			color: #858597;
		}
	}
	
	.footer {
		padding: 20rpx 32rpx 80rpx;
		
		.rule {
			font-family: Roboto;
			font-weight: 500;
			font-size: 28rpx;
			line-height: 44rpx;
			letter-spacing: 0px;
			color: #858597;
			
			.rule-title {
				line-height: 32rpx;
				color: #D33C30;
				margin-bottom: 16rpx;
			}
		}
		
		.btns {
			margin: 68rpx auto 0;
			
			.btn {
				width: 339rpx;
				height: 100rpx;
				border-radius: 120rpx;
				background: #ACACAC;
				font-family: Mulish;
				font-weight: 600;
				font-size: 32rpx;
				color: #F7F7FC;
			}
			
			.active {
				background: #D33C30;
			}
		}
	}
	
	.van-dialog {
		width: 560rpx;
		padding: 48rpx 32rpx;
		border-radius: 16rpx;
		background: rgba(255, 255, 255, 1);
	
		.van-dialog__header {
			font-family: Roboto;
			font-weight: 700;
			font-size: 30rpx;
			line-height: 42rpx;
			text-align: center;
			color: #D33C30;
		}
		
		.list {
			margin-bottom: 20rpx;
			
			.list-title, .list-item {
				display: grid;
				grid-template-columns: 1fr 1fr 1fr;
				font-family: Roboto;
				font-weight: 400;
				font-size: 24rpx;
				line-height: 42rpx;
				margin-top: 20rpx;
				text-align: center;
				padding: 0 16rpx;
				
				&>view {
					display: flex;
					align-items: center;
					justify-content: center;
				}
				
				&>view:first-child {
					justify-content: flex-start;
				}
			}
			
			.list-item {
				width: 496rpx;
				height: 96rpx;
				border-radius: 20rpx;
				border: 1px solid #FFFFFF;
			}
			
			.active {
				border: 1px solid #D33C30;
			}
		}
	
		.van-dialog__content {
			margin: 32rpx auto;
			font-family: Roboto;
			font-weight: 400;
			font-size: 28rpx;
			line-height: 42rpx;
			text-align: center;
			color: #111826;
		}
	
		.van-dialog__footer {
			width: 496rpx;
			height: 80rpx;
			border-radius: 104rpx;
			background: #D33C30;
			font-family: Roboto;
			font-weight: 400;
			font-size: 28rpx;
			color: #F7F7FC;
		}
	}
</style>
