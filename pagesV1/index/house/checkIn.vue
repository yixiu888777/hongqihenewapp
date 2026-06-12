<template>
	<view class="container">
		<headerView>资料等级</headerView>
		<view class="content">
			<view class="ul">
				<view class="title">选择房产信息</view>
				<view class="li flex_between" v-for="(item,index) in houseList" :key="index" @click="houseIndex=index">
					<view>{{ item.title }}</view>
					<view class="flex_center">
						<view class="li-box flex_center" :class="houseIndex==index?'active':''">
							<view></view>
						</view>
					</view>
				</view>
			</view>
			<view class="form">
				<view class="title">个人信息登记</view>
				<view class="item">
					<view class="item-name">姓名</view>
					<view class="item-input flex_between">
						<input v-model="form.realname" type="text" class="input" placeholder="请输入姓名" 
							placeholder-class="placeholder" @blur="containsChinese" />
					</view>
				</view>
				<view class="item">
					<view class="item-name">手机号</view>
					<view class="item-input flex_between">
						<input v-model="form.phone" type="number" class="input" placeholder="请输入手机号" 
							placeholder-class="placeholder" maxlength="11" />
					</view>
				</view>
				<view class="item">
					<view class="item-name">身份证号</view>
					<view class="item-input flex_between">
						<input v-model="form.cardno" type="text" class="input" placeholder="请输入身份证号"
							placeholder-class="placeholder" maxlength="18" @blur="isValidID" />
					</view>
				</view>
				<view class="item">
					<view class="item-name">地址</view>
					<view class="item-input flex_between">
						<input v-model="form.address" type="text" class="input" placeholder="请输入地址"
							placeholder-class="placeholder" />
					</view>
				</view>
			</view>
			<view class="ul">
				<view class="title">资产选择</view>
				<view class="li flex_between" v-for="(item,index) in priceList" :key="index" @click="priceIndex=index">
					<view>{{ item }}</view>
					<view class="flex_center">
						<view class="li-box flex_center" :class="priceIndex==index?'active':''">
							<view></view>
						</view>
					</view>
				</view>
			</view>
			<view class="rule" v-if="!!settingInfo.withnew3_dj_rule">
				<view class="rule_title">温馨提示</view>
				<view v-html="settingInfo.withnew3_dj_rule"></view>
			</view>
		</view>
		<view class="footer col_center">
			<view class="button" @click="houseWiththreeAdd">点击领取</view>
			<view class="footer-tips">无法认证请联系<span @click="toLoads(settingInfo.service.service_url)">在线客服</span></view>
		</view>
		
		<!-- 提示 -->
		<u-popup :show="show" mode="center" round="32" @close="show = false">
			<view class="van-dialog">
				<view class="van-dialog__header">提示</view>
				<view class="van-dialog__content" v-html="houseInfo.tips"></view>
				<view class="van-dialog__footer">
					<view class="button" v-if="houseInfo.status == 0" @click="$utils.toPage('/pages/index/house/pay')">下一步</view>
					<view class="button" v-else-if="houseInfo.status == 3" @click="$utils.toPage('/pages/mine/withdraw/withdraw')">去提现</view>
					<view class="button" v-else @click="yesClick">确定</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import { houseWiththreeApi, houseWiththreeAddApi } from '@/api/api.js'
	export default {
		data() {
			return {
				settingInfo: uni.getStorageSync('settingInfo'),
				houseInfo: {},
				houseList: [],
				houseIndex: 0,
				priceList: ['1-10万', '10-50万', '50万以上'],
				priceIndex: 0,
				form: {
					realname: null,
					phone: null,
					cardno: null,
					address: null
				},
				
				show: false
			};
		},
		onLoad() {
			this.getHouseInfo()
		},
		methods: {
			// 去在线客服页
			toLoads(url) {
				uni.navigateTo({
					url: `/pages/noPage/index?url=${url.split("&").join("$")}`
				})
			},
			// 验证中文
			containsChinese(str) {
				if (!this.$utils.containsChinese(str)) {
					this.form.realname = ''
					uni.$u.toast('请输入正确姓名');
				}
			},
			// 验证身份证号
			isValidID(str) {
				if (!this.$utils.isValidID(str)) {
					this.form.cardno = ''
					uni.$u.toast('请输入正确身份证号码');
				} 
			},
			getHouseInfo(){
				houseWiththreeApi().then(res=> {
					this.houseInfo = res.data.data
					this.houseList = res.data.data.house
					
					if(this.houseInfo.status != -1){
						this.show = true
					}
				})
			},
			houseWiththreeAdd(){
				if(!this.form.realname){
					return uni.$u.toast("请输入姓名")
				}
				if(!this.form.phone){
					return uni.$u.toast("请输入手机号")
				}
				if(!this.form.cardno){
					return uni.$u.toast("请输入身份证号")
				}
				if(!this.form.address){
					return uni.$u.toast("请输入地址")
				}
				
				this.$utils.throttle(() => {
					houseWiththreeAddApi({
						house_id: this.houseList[this.houseIndex].id,
						...this.form,
						zichan: this.priceList[this.priceIndex]
					}).then(res => {
						this.form = {
							realname: null,
							phone: null,
							cardno: null,
							address: null
						}
						this.getHouseInfo()
					})
				}, 2000)()
			},
			yesClick(){
				// #ifndef APP-PLUS
				let backPage = getCurrentPages()
				if (backPage.length == 1) {
					uni.reLaunch({
						url: "/pages/index/index"
					})
				} else {
					uni.navigateBack()
				}
				// #endif
				
				// #ifdef APP-PLUS
				uni.navigateBack()
				// #endif
			}
		}
	}
</script>

<style lang="scss">
	.container {
		background: url("/static/mine/recharge_bg.svg") no-repeat center top / 100%;
		background-color: rgba(255, 255, 255, 1);
		
		.content {
			padding: 28rpx 32rpx;
			background-color: rgba(255, 255, 255, 1);
			
			.ul {
				.title {
					font-family: Roboto;
					font-size: var(--font-14);
					font-weight: 400;
					line-height: 48rpx;
					color: rgba(34, 34, 34, 1);
				}
			
				.li {
					height: 96rpx;
					margin: 16rpx 0 0;
					padding: 24rpx 32rpx;
					border-radius: 20rpx;
					background: rgba(255, 255, 255, 1);
					box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.05);
					font-size: var(--font-14);
					font-weight: 500;
					color: rgba(17, 24, 38, 1);
			
					.li-box {
						width: 36rpx;
						height: 36rpx;
						border-radius: 36rpx;
						border: 2rpx solid rgba(177, 177, 177, 1);
					}
			
					.active {
						border: 2rpx solid rgba(250, 60, 49, 1);
			
						&>view {
							width: 24rpx;
							height: 24rpx;
							border-radius: 24rpx;
							background: rgba(250, 60, 49, 1);
						}
					}
				}
			}
			
			.form {
				margin: 20rpx auto;
				
				.title {
					font-family: Roboto;
					font-size: var(--font-14);
					font-weight: 700;
					line-height: 48rpx;
					color: rgba(34, 34, 34, 1);
				}
				
				.item {
					margin: 20rpx auto;
					
					.item-name {
						margin-bottom: 16rpx;
						font-family: Roboto;
						font-size: var(--font-14);
						font-weight: 400;
						line-height: 48rpx;
						color: rgba(34, 34, 34, 1);
					}
			
					.item-input {
						width: 100%;
						height: 100rpx;
						padding: 26rpx 32rpx;
						border-radius: 16rpx;
						border: 2rpx solid rgba(232, 235, 238, 1);
			
						.input {
							color: rgba(111, 115, 116, 1);
							flex: 1;
							font-size: var(--font-14);
							font-weight: 500;
							line-height: 48rpx;
						}
			
						.placeholder {
							color: rgba(187, 189, 193, 1);
						}
					}
			
					.item-list {
			
						&>view {
							flex: 1;
							height: 60rpx;
							margin: 20rpx 20rpx 20rpx 0;
							border-radius: 8rpx;
							background: rgba(250, 60, 49, 0.1);
							font-family: Roboto;
							font-size: var(--font-11);
							font-weight: 400;
							line-height: 60rpx;
							text-align: center;
							color: rgba(250, 60, 49, 1);
						}
			
						&>view:nth-child(6n) {
							margin-right: 0;
						}
			
						.active {
							background: rgba(250, 60, 49, 1);
							color: rgba(255, 255, 255, 1);
						}
					}
				}
			}
			
			.rule {
				margin: 20rpx auto;
				font-family: Roboto;
				font-weight: 500;
				font-size: 28rpx;
				line-height: 44rpx;
				color: #858597;
				
				.rule_title {
					line-height: 32rpx;
					color: #FA3C31;
					margin-bottom: 16rpx;
				}
			}
		}
		
		.footer {
			padding: 20rpx 0;
			background-color: rgba(255, 255, 255, 1);
			
			.button {
				width: 686rpx;
				height: 100rpx;
				border-radius: 120rpx;
				font-weight: 600;
				font-size: 32rpx;
			}
			
			.footer-tips {
				font-family: Roboto;
				font-size: var(--font-12);
				font-weight: 400;
				line-height: 40rpx;
				color: rgba(133, 133, 151, 1);
				margin-top: 8rpx;
		
				span {
					margin-left: 10rpx;
					color: rgba(243, 62, 49, 1);
				}
			}
		}
		
		.van-dialog {
			width: 560rpx;
			padding: 48rpx 32rpx;
			border-radius: 32rpx;
			background: url("/static/mine/popup_bg.svg") no-repeat left top / 100%;
			background-color: rgba(255, 255, 255, 1);
			font-family: Roboto;
			font-weight: 400;
			line-height: 40rpx;
			text-align: center;
			color: rgba(27, 28, 30, 1);
		
			.van-dialog__header {
				font-size: var(--font-15);
				color: rgba(210, 17, 15, 1);
				font-weight: 700;
			}
		
			.van-dialog__content {
				margin: 32rpx auto;
				font-size: var(--font-14);
				line-height: 42rpx;
			}
		
			.van-dialog__footer {
				display: flex;
				align-items: center;
				justify-content: space-between;
		
				.button {
					flex: 1;
					height: 80rpx;
					font-size: var(--font-14);
				}
			}
		}
	}
</style>
