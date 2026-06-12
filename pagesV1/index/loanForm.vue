<template>
	<view class="container">
		<headerView>申请贷款</headerView>
		<view class="content">
			<view class="form">
				<view class="item">
					<view class="item-name">选择贷款额度</view>
					<view class="li flex_between" v-for="item in dangweiList" :key="item.id" @click="form.dwid=item.id">
						<view>{{item.title}}</view>
						<view class="flex_center">
							<view class="li-box flex_center" :class="form.dwid==item.id?'active':''">
								<view></view>
							</view>
						</view>
					</view>
				</view>
				<view class="item-tips">根据您自身的要求选择贷款额度</view>
			</view>
			<view class="form">
				<view class="item-title">个人信息登记</view>
				<view class="item">
					<view class="item-name">姓名</view>
					<view class="item-input flex_between">
						<input type="text" v-model="form.realname" class="input" placeholder="请输入姓名"
							placeholder-class="placeholder" @blur="containsChinese" />
					</view>
				</view>
				<view class="item">
					<view class="item-name">手机号</view>
					<view class="item-input flex_between">
						<input type="text" v-model="form.phone" class="input" placeholder="请输入手机号"
							placeholder-class="placeholder" maxlength="11" @blur="isPhone" />
					</view>
				</view>
				<view class="item">
					<view class="item-name">身份证号</view>
					<view class="item-input flex_between">
						<input type="text" v-model="form.cardno" class="input" placeholder="请输入身份证号"
							placeholder-class="placeholder" maxlength="18" @blur="isValidID" />
					</view>
				</view>
				<view class="item">
					<view class="item-name"><span>*</span>证件上传</view>
					
					<view class="upload-text">身份证人像面（上传身份证需与实名认证信息一致）</view>
					<view class="col_center">
						<u-upload :fileList="fileListZ" @afterRead="afterRead" @delete="deletePic" name="Z" multiple
							:maxCount="1" width="343" height="180">
							<image src="@/static/image/auth/auth_img1.svg" mode="widthFix"
								style="width: 343px;height: 180px;">
							</image>
						</u-upload>
					</view>

					<view class="upload-text">身份证国徽面（上传身份证需与实名认证信息一致）</view>
					<view class="col_center">
						<u-upload :fileList="fileListF" @afterRead="afterRead" @delete="deletePic" name="F" multiple
							:maxCount="1" width="343" height="180">
							<image src="@/static/image/auth/auth_img2.svg" mode="widthFix"
								style="width: 343px;height: 180px;">
							</image>
						</u-upload>
					</view>
				</view>
			</view>
			<view class="tips" v-if="!!settingInfo.withnew5_rule">
				<view class="tips_title">温馨提示</view>
				<view v-html="settingInfo.withnew5_rule"></view>
			</view>
		</view>
		<view class="footer col_center">
			<view class="button" @click="houseWithfiveadd">提交</view>
			<view class="footer-tips">无法登记请联系<span @click="toLoads(settingInfo.service.service_url)">在线客服</span></view>
		</view>
		
		<u-popup :show="popupInfo.show" mode="center" round="32">
			<view class="van-dialog">
				<view class="van-dialog__header">温馨提示</view>
				<view class="van-dialog__content" v-html="popupInfo.tips"></view>
				<view class="van-dialog__footer">
					<template v-if="popupInfo.status==0">
						<view class="button" @click="backClick">确定</view>
					</template>
					<template v-else-if="popupInfo.status==1 || popupInfo.status==3">
						<view class="button" @click="toPage">确定</view>
					</template>
					<template v-else>
						<view class="button" @click="popupInfo.show=false">确定</view>
					</template>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import { houseWithFiveInfoApi, houseWithfiveaddApi } from '@/api/api.js';
	export default {
		data() {
			return {
				settingInfo: uni.getStorageSync('settingInfo'),
				form: {
					dwid: null,
					realname: "",
					phone: "",
					cardno: "",
				},
				fileListZ: [],
				fileListF: [],
				
				dangweiList: [],
				
				popupInfo: {
					show: false,
					tips: '',
					status: -1
				}
			};
		},
		onLoad() {
			this.getInfo()
		},
		methods: {
			backClick(){
				uni.navigateBack()
			},
			toPage(){
				uni.redirectTo({
					url: '/pages/mine/withdraw/withdraw'
				})
			},
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
			// 验证手机号
			isPhone(str) {
				if (str == "") {
					this.form.phone = ""
					uni.$u.toast("请输入手机号")
				}
			},
			// 删除图片
			deletePic(event) {
				this[`fileList${event.name}`].splice(event.index, 1)
			},
			// 新增图片
			async afterRead(event) {
				let lists = [].concat(event.file)
				let fileListLen = this[`fileList${event.name}`].length
				lists.map((item) => {
					this[`fileList${event.name}`].push({
						...item,
						status: 'uploading',
						message: '如果上传图片过大请耐心等待'
					})
				})
				for (let i = 0; i < lists.length; i++) {
					const result = await this.uploadFilePromise(lists[i].url)
					if (!!result) {
						let item = this[`fileList${event.name}`][fileListLen]
						this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
							status: 'success',
							message: '',
							url: result.fullurl,
							upload: result.url
						}))
						fileListLen++
					} else {
						this[`fileList${event.name}`] = []
					}
				}
			},
			uploadFilePromise(url) {
				return new Promise((resolve, reject) => {
					let a = uni.uploadFile({
						url: uni.getStorageSync("baseUrl") + '/api/common/upload',
						filePath: url,
						name: 'file',
						formData: {
							site: uni.getStorageSync("baseUrl"),
							app_ver: '102'
						},
						success: (res) => {
							resolve(JSON.parse(res.data).data)
						},
						fail: (err) => {
							uni.$u.toast('请求超时，请重新再试')
							setTimeout(() => {
								resolve('')
							}, 1000)
						}
					});
				})
			},
			// 提交认证信息
			houseWithfiveadd() {
				if (!this.fileListZ[0]) {
					return uni.$u.toast('上传身份证人像面');
				}
				if (!this.fileListF[0]) {
					return uni.$u.toast('上传身份证国徽面');
				}
				if (!this.form.realname) {
					return uni.$u.toast('请输入姓名');
				}
				if (!this.form.cardno) {
					return uni.$u.toast('请输入证件号码');
				}
				this.$utils.throttle(() => {
					houseWithfiveaddApi({
						...this.form,
						z_image: this.fileListZ[0].upload,
						f_image: this.fileListF[0].upload
					}).then(res => {
						uni.$u.toast(res.data.msg)
						this.getInfo()
					})
				}, 2000)()
			},
			getInfo(){
				houseWithFiveInfoApi().then(res => {
					let date = res.data.data
					this.dangweiList = date.dangwei_list
					
					if(date.status != -1){
						this.popupInfo = {
							show: true,
							tips: date.tips,
							status: date.status
						}
						
						this.form = {
							dwid: date.withfive_info.dwid,
							realname: date.withfive_info.realname,
							phone: date.withfive_info.phone,
							cardno: date.withfive_info.cardno,
						}
						
						this.fileListZ = [{
							upload: date.withfive_info.z_image,
							url: date.withfive_info.z_image_url
						}]
						this.fileListF = [{
							upload: date.withfive_info.f_image,
							url: date.withfive_info.f_image_url
						}]
					}else{
						this.form.dwid = this.dangweiList[0].id
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		background: url("/static/mine/recharge_bg.svg") no-repeat center top / 100%;
		background-color: rgba(255, 255, 255, 1);

		.content {
			width: 750rpx;
			padding: 32rpx;
			background-color: rgba(255, 255, 255, 1);

			.form {
				margin: 0 auto;
				
				.item-tips {
					font-family: Roboto;
					font-weight: 500;
					font-size: 28rpx;
					line-height: 32rpx;
					color: #FA3C31;
					margin: 20rpx 0;
				}
				
				.item-title {
					font-family: Roboto;
					font-weight: 700;
					font-size: 28rpx;
					line-height: 48rpx;
					color: #111826;
					margin: 20rpx 0;
				}

				.item {
					font-weight: 400;
					margin-bottom: 20rpx;

					.item-name {
						font-family: Roboto;
						font-size: var(--font-14);
						line-height: 48rpx;
						color: #111826;
						margin-bottom: 16rpx;
						font-weight: 500;
						
						span {
							color: #FA3C31;
						}
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

					.item-input {
						width: 100%;
						height: 100rpx;
						padding: 26rpx 32rpx;
						border-radius: 20rpx;
						border: 2rpx solid rgba(232, 235, 238, 1);

						.input {
							color: rgba(17, 24, 38, 1);
							flex: 1;
							font-size: var(--font-14);
						}

						.placeholder {
							color: rgba(187, 189, 193, 1);
						}
					}

					.upload-text {
						padding: 20rpx 0;
						font-family: Roboto;
						font-size: var(--font-12);
						font-weight: 400;
						line-height: 32rpx;
						color: rgba(90, 98, 116, 1);
					}
				}
			}
			
			.tips {
				font-family: Roboto;
				font-weight: 500;
				font-size: 28rpx;
				line-height: 44rpx;
				color: #858597;
				margin-top: 20rpx;
				
				.tips_title {
					line-height: 32rpx;
					color: #FA3C31;
					margin-bottom: 16rpx;
				}
			}
		}
		
		.footer {
			padding: 20rpx 32rpx;
			background-color: rgba(255, 255, 255, 1);
		
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
				color: rgba(241, 55, 36, 1);
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