<template>
	<view class="container" style="background:#c8131e url(/static/new/bg.jpg) no-repeat center top / 100%;" v-if="isPageShow">
		<headerView>
			<template #leftIcon><u-icon name="arrow-left" color="#fff" size="24"></u-icon></template>
			<view>收货地址</view>
		</headerView>
		<view class="main">
			<view class="content">
				<view class="form">
					<view class="item">
						<view class="flex_between">
							<view class="item-name">
								<span>*</span>收件人
							</view>
							<view class="choose flex" @click="!disabled?isDefault = !isDefault:''">
								<view class="box flex_center" :class="isDefault?'active':''">
									<u-icon name="checkbox-mark" color="#ffffff" size="12"></u-icon>
								</view>
								<view>常用地址</view>
							</view>
						</view>
						<view class="item-input flex_between">
							<input type="text" class="input" v-model="form.name" placeholder="请输入收件人" :disabled="disabled"
								placeholder-class="placeholder" @blur="containsChinese" />
						</view>
					</view>
					<view class="item">
						<view class="item-name">
							<span>*</span>手机号
						</view>
						<view class="item-input flex_between">
							<input type="number" v-model="form.phone" class="input" placeholder="请输入手机号" :disabled="disabled"
								placeholder-class="placeholder" maxlength="11" />
						</view>
					</view>
					<view class="item" @click="!disabled?ehShowClike():''">
						<view class="item-name">
							<span>*</span>所在地区
						</view>
						<view class="item-input flex_between">
							<view class="arrow-area">{{ form.area }}</view>
							<!-- <input type="text" v-model="form.area" class="input" placeholder="请填写所在地区" disabled
								placeholder-class="placeholder" /> -->
						</view>
					</view>
					<view class="item">
						<view class="item-name">
							<span>*</span>详细地址
						</view>
						<view class="item-input flex_between">
							<input type="text" v-model="form.address" class="input" placeholder="小区、写字楼、门牌号等" :disabled="disabled" placeholder-class="placeholder" />
						</view>
					</view>
				</view>
				<view class="m-tips warning">
					<view class="icon"><image src="/static/new/tips.png" mode="aspectFit"></image></view>
					<view class="text" v-html="settingInfo.text.address_notice"></view>
				</view>
				<view class="fixedBtn" v-if="total > 0">
					<view class="btn" @click="toLoads(settingInfo.service.service_url)">
						<view class="icon"><image class="img" src="@/static/image/login/tab1.svg"></image></view>
						<view class="text">
							<view class="dt">客服管家</view>
							<view class="dd">7*12H在线</view>
						</view>
					</view>
				</view>
			</view>
			<view class="footer flex_center">
				<view class="button" @click="saveClick">保存</view>
			</view>
		</view>
		<ehPicker v-if="ehShow" @conceal="conceal" @showClike="ehShowClike" />
		<!-- 是否实名认证 -->
		<Real-Name></Real-Name>
	</view>
</template>

<script>
	import ehPicker from '@/components/erha-picker/erha-picker.vue';
	import {
		addressListApi,
		addressEditApi,
		addressDetailApi
	} from '@/api/api.js'
	export default {
		components: {
			ehPicker
		},
		data() {
			return {
				isPageShow: false,
				settingInfo: uni.getStorageSync('settingInfo'),
				isDefault: true,
				list: [],
				form: {
					name: '',
					phone: '',
					area: '请选择省 / 市 / 区',
					address: ''
				},
				ehShow: false,
				disabled: false,
				total: 0
			};
		},
		onLoad(opt) {
			// if (!!opt.id) {
			// 	addressDetailApi({
			// 		id: opt.id
			// 	}).then(res => {
			// 		this.form = res.data.data
			// 		this.isDefault = !!this.form.is_default
			// 	})
			// }
			addressListApi({ page: 1 }).then(res => {
				this.list = res.data.data.data
				this.total = res.data.data.total
				if( this.total == 0){
					this.isPageShow = true;
				} else{
					// this.disabled = true;
					this.getaddressDetail();
				}
			})
		},
		methods: {
			// 地址详情
			getaddressDetail() {
				addressDetailApi({
					id: this.list[0].id
				}).then(res => {
					this.form = res.data.data
					this.isDefault = !!this.form.is_default
					this.isPageShow = true;
				})
			},
			// 验证中文
			containsChinese(str) {
				if (!this.$utils.containsChinese(str)) {
					this.form.name = ''
					uni.$u.toast('请输入正确姓名');
				}
			},
			// 获取所在地区
			conceal(param) {
				this.form.area = param.province + ' ' + param.city + ' ' + param.area + ' ' + param.street
				this.ehShowClike()
			},
			// 省市区街道四级联动的显示隐藏
			ehShowClike() {
				this.ehShow = !this.ehShow;
			},
			// 保存
			saveClick() {
				if (!this.form.name) {
					return uni.$u.toast('请输入收件人');
				}
				if (!this.form.phone) {
					return uni.$u.toast('请输入手机号');
				}
				if (!this.form.area) {
					return uni.$u.toast('选择所在地区');
				}
				if (!this.form.address) {
					return uni.$u.toast('请输入详细地址');
				}
				this.$utils.throttle(() => {
					addressEditApi({
						...this.form,
						is_default: this.isDefault
					}).then(res => {
						uni.$u.toast(res.data.msg);
						setTimeout(() => {
							uni.navigateBack()
						}, 1000)
					})
				}, 2000)()
			},
			// 去在线客服页
			toLoads(url) {
				uni.navigateTo({
					url: `/pages/noPage/index?url=${url.split("&").join("$")}`
				})
			}
		}
	}
</script>

<style lang="scss">
	.container {
		.main{ display: flex; flex-direction: column; flex: 1;margin:0 30rpx 30rpx; background-color: rgba(255, 255, 255, 1); border-radius: 20rpx;}
		.content {
			.title{ font-weight: bold; border-bottom: 2rpx solid #e5e5e5; padding: 30rpx; font-size: 1.2em;}
			.form { padding: 30rpx; 
				.item {
					font-weight: 400;
					margin-top: 30rpx;
					.item-name {
						font-family: Roboto;
						font-size: var(--font-14);
						line-height: 40rpx;
						color: rgba(34, 34, 34, 1);
						margin-bottom: 20rpx;
						span {
							color: rgba(243, 62, 49, 1);
						}
					}
					.choose {
						font-family: Roboto;
						font-size: var(--font-14);
						font-weight: 400;
						color: rgba(34, 34, 34, 1);
						margin-bottom: 20rpx;
						line-height: 48rpx;

						.box {
							width: 36rpx;
							height: 36rpx;
							border-radius: 36rpx;
							flex-shrink: 0;
							margin-right: 20rpx; background: linear-gradient(to left, #ddd, #aaa);
						}

						.active {
							background: linear-gradient(to left, #FF624B, #FF3650);
						}
					}

					.item-input {
						width: 100%;
						height: 100rpx;
						padding: 26rpx 32rpx;
						border-radius: 16rpx;
						border: 1px solid rgba(206, 213, 218, 1);

						.input {
							color: rgba(111, 115, 116, 1);
							flex: 1;
						}

						.placeholder {
							color: rgba(187, 189, 193, 1);
						}

						image {
							width: 40rpx;
							height: 40rpx;
							margin-left: 20rpx;
						}
					}
				}
			}
		}
		.m-tips{ margin: 0 30rpx 30rpx;}
		.footer {  margin: 0 30rpx 30rpx;}
	}
	
	.arrow-area{ position: relative; width: 100%;
		
	}
	.arrow-area:before {
	  content: '';
	  position: absolute;
	  top: 50%;
	  right: 0;
	  transform: translateY(-50%);
	  
	  /* 箭头尺寸和颜色 */
	  width: 0;
	  height: 0;
	  border-top: 5px solid transparent;
	  border-bottom: 5px solid transparent;
	  border-left: 8px solid #333; /* 箭头颜色 */
	}
	.arrow-area:after {
	  content: '';
	  position: absolute;
	  top: 50%;
	  right: 2rpx;
	  transform: translateY(-50%);
	  
	  /* 箭头尺寸和颜色 */
	  width: 0;
	  height: 0;
	  border-top: 5px solid transparent;
	  border-bottom: 5px solid transparent;
	  border-left: 8px solid #fff; /* 箭头颜色 */
	}
	.fixedBtn {	display: flex; justify-content: flex-end; padding-top: 60rpx; display: none;
		.btn { background: #f5f5f5; border-radius: 100rpx; padding: 30rpx;  display: flex; align-items: center; flex: none;
			.icon{ 
				image,img{ width: 90rpx; height: 90rpx; display: block; }
			}
			.text{ line-height: 1; padding:0 20rpx; 
				.dt{ font-weight: bold; margin-bottom: 10rpx; }
				.dd{ font-size: .8em;}
			}
		}	
	}
	
</style>