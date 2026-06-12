<template>
	<view class="container" style="background:#c8131e url(/static/new/bg.jpg) no-repeat center top / 100%;">
		<headerView>
			<template #leftIcon><u-icon name="arrow-left" color="#fff" size="24"></u-icon></template>
			<view>实名认证</view>
			<template #rightIcon>
				<view class="icon" @click="$utils.toPage('/pages/mine/realList')">
					<image src="/static/new/history.png" mode="heightFix" style="height: 36rpx; display: block; margin: 0 auto 5rpx;"></image>
					<view class="text" style="font-size: .6em;line-height: 1;">记录</view>
				</view>
			</template>
		</headerView>
		<view class="main">
			<view class="form">
				<view class="item">
					<view class="item-name">身份证正反面</view>
					<view class="upload">
						<view class="col_center">
							<u-upload :fileList="fileListZ" @afterRead="afterRead" @delete="deletePic" name="Z" multiple :maxCount="1" width="300rpx"  height="200rpx">
								<view class="img"><image src="@/static/new/sfz1.png" mode="widthFix" style="width: 100%;"></image></view>
							</u-upload>	
						</view>
						<view class="col_center">
							<u-upload :fileList="fileListF" @afterRead="afterRead" @delete="deletePic" name="F" multiple :maxCount="1" width="300rpx"  height="200rpx">
								<view class="img"><image src="@/static/new/sfz2.png" mode="widthFix" style="width: 100%;"></image></view>
							</u-upload>
						</view>
					</view>
				</view>
				<!-- <view class="item">
					<view class="item-name">证件类型</view>
					<view class="item-input flex_between">
						<input type="text" value="居民身份证" class="input" placeholder="居民身份证"
							placeholder-class="placeholder" disabled />
					</view>
				</view> -->
				<view class="item">
					<view class="item-name">姓名</view>
					<view class="item-input flex_between">
						<input type="text" v-model="form.realname" class="input" placeholder="请输入姓名"
							placeholder-class="placeholder" @blur="containsChinese" :disabled="info.status == 1" />
					</view>
				</view>
				<view class="item">
					<view class="item-name">身份证号</view>
					<view class="item-input flex_between">
						<input type="text" v-model="form.cardno" class="input" placeholder="请输入身份证号"
							placeholder-class="placeholder" maxlength="18" @blur="isValidID" :disabled="info.status == 1" />
					</view>
				</view>
				<view class="item">
					<view class="item-name">手机号</view>
					<view class="item-input flex_between">
						<input type="text" v-model="form.phone" class="input" placeholder="请输入手机号"
							placeholder-class="placeholder" maxlength="11" @blur="isPhone" :disabled="info.status == 1" />
					</view>
				</view>
				<!-- <view class="item">
					<view class="item-name">国籍(地区)</view>
					<view class="item-input flex_between">
						<input type="text" v-model="form.country" class="input" placeholder="中华人民共和国"
							placeholder-class="placeholder" disabled />
					</view>
				</view> -->
			</view>
			<view class="footer">
				<view class="button" @click="addAuthInfo" v-if="info.status < 1">{{!!info.id?"重新认证":"认证"}}</view>
				<view class="footer-tips">无法认证请联系？<text @click="toLoads(settingInfo.service.service_url)">在线客服</text></view>
			</view>
		</view>
		<view class="m-tips">
			<view class="text" v-html="settingInfo.text.realauth_rule"></view>
		</view>
	</view>
</template>

<script>
	import {
		addAuthInfoAPI,
		getUserInfoAPI,
		getAuthInfoAPI
	} from '@/api/api.js';
	export default {
		data() {
			return {
				type: 0,
				settingInfo: uni.getStorageSync('settingInfo'),
				UserInfo: [],
				info: {
					status: 0
				},
				form: {
					realname: "",
					cardno: "",
					phone: "",
					country: "中华人民共和国"
				},
				fileListZ: [],
				fileListF: []
			};
		},
		onLoad(opt) {
			this.type = !!opt.type ? 1 : 0

			this.loadData();
		},
		methods: {
			loadData(){
				getAuthInfoAPI().then(res => {
					this.info = res.data.data
					if (this.info.status != -1) {
						this.fileListZ = [{
							upload: this.info.sfzz_image,
							url: this.info.sfzz_image_url
						}]
						this.fileListF = [{
							upload: this.info.sfzf_image,
							url: this.info.sfzf_image_url
						}]
						this.form.realname = this.info.realname
						this.form.cardno = this.info.cardno
						this.form.phone = this.info.phone
						this.form.country = this.info.country
					}
					// if( this.info.status == 1){
					// 	uni.navigateBack()
					// }
				})
				getUserInfoAPI().then(res => {
					this.UserInfo = res.data.data
					uni.setStorageSync('UserInfo', res.data.data)
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
				// console.log("afterRead",lists)
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
					// console.log("result",result)
					if (!!result) {
						let item = this[`fileList${event.name}`][fileListLen]
						this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
							status: 'success',
							message: '',
							url: result.url,
							upload: result.path
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
			addAuthInfo() {
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
					addAuthInfoAPI({
						sfzz_image: this.fileListZ[0].upload,
						sfzf_image: this.fileListF[0].upload,
						realname: this.form.realname,
						cardno: this.form.cardno,
						phone: this.form.phone,
						country: this.form.country
					}).then(res => {
						uni.$u.toast(res.data.msg)
						setTimeout(() => {
							uni.reLaunch({
								url: '/pages/index/index'
							})
						}, 1000)
					})
				}, 2000)()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container { min-height: 100vh; height: auto; background:#FF363E url(/static/new/bg.png) no-repeat top center; background-size: cover; }
	.main{  background: #fff; border-radius: 20rpx; padding: 30rpx; margin: 0 30rpx 30rpx; color: #040A13;}
	.form { margin: 0 auto;	
		.item { font-weight: 400; margin-bottom: 30rpx;
			.item-name {
				font-family: Roboto;
				font-size: var(--font-14);
				line-height: 48rpx;
				color: rgba(17, 24, 38, 1);
				margin-bottom: 16rpx;
				font-weight: 500;
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

			.upload { display: flex; gap: 30rpx;
				.col_center{ width: 300rpx; flex: 1;
					.img{ width: 300rpx;}
				}
			}
		}
	}
	.button{ margin-bottom: 30rpx;}
	.footer-tips{ text-align: center; margin: 30rpx 0 20rpx; font-size: .8em; color: #999;
		text{margin-left: 10rpx; color: rgba(243, 62, 49, 1);}
	 }
	.m-tips{ background: #fff; margin: 0 30rpx 30rpx;}
</style>