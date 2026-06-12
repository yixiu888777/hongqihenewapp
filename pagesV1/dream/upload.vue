<template>
	<view class="container">
		<headerView>宣传活动上传</headerView>
		<view class="content">
			<view class="card">
				<!-- #ifdef H5 -->
				<view class="title">上传视频/图片</view>
				<view class="col_center">
					<u-upload :fileList="fileList1" @afterRead="afterRead" @delete="deletePic" name="1" multiple accept="file" :maxCount="1" width="311" height="129">
						<image src="@/static/image/dream/upload.svg" mode="widthFix" style="width: 311px;height: 129px;"></image>
					</u-upload>
				</view>
				<!-- #endif -->
				<!-- #ifdef APP-PLUS -->
				<view class="title flex">
					<view class="title-box" :class="isVideo?'active':''" @click="isVideo=true">上传视频</view>
					<view class="title-box" :class="isVideo?'':'active'" @click="isVideo=false">上传图片</view>
				</view>
				<view class="col_center" v-if="isVideo">
					<u-upload :fileList="fileList1" @afterRead="afterRead" @delete="deletePic" name="1" multiple accept="video" :maxCount="1" width="311" height="129">
						<view class="upload-box col_center">
							<image src="@/static/image/dream/export.svg" mode="widthFix"></image>
							<view>上传视频</view>
						</view>
					</u-upload>
				</view>
				<view class="col_center" v-else>
					<u-upload :fileList="fileList1" @afterRead="afterRead" @delete="deletePic" name="1" multiple accept="image" :maxCount="1" width="311" height="129">
						<view class="upload-box col_center">
							<image src="@/static/image/dream/export.svg" mode="widthFix"></image>
							<view>上传图片</view>
						</view>
					</u-upload>
				</view>
				<!-- #endif -->
				
				<view class="rule">
					<view class="rule_title">温馨提示</view>
					<view class="rule_content" v-html="settingInfo.order_video_rule"></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { uploadVideoAPI } from '@/api/api.js'
	export default {
		data() {
			return {
				settingInfo: uni.getStorageSync('settingInfo'),
				isVideo: true,
				id: null,
				fileList1: [],
			};
		},
		onLoad(opt) {
			this.id = opt.id
		},
		methods: {
			// 返回上一页
			returnClick() {
				uni.navigateBack()
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
					if(!!result){
						let item = this[`fileList${event.name}`][fileListLen]
						this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
							status: 'success',
							message: '',
							url: result.fullurl,
							upload: result.url
						}))
						fileListLen++
					}else{
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
							
							uploadVideoAPI({
								id: this.id,
								video: JSON.parse(res.data).data.url
							}).then(res=>{
								uni.$u.toast(res.data.msg)
							})
						},
						fail: (err) => {
							uni.$u.toast('请求超时，请重新再试')
							setTimeout(()=>{
								resolve('')
							}, 1000)
						}
					});
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	::v-deep.u-upload__wrap__preview__other{
		width: 311px !important;
		height: 129px !important;
	}
	
	.container {
		background: #F33E31;

		.content {
			background: #fff;

			.card {
				margin: 28rpx 32rpx;
				background: #fff;
				padding: 32rpx;
				box-shadow: 0px 0px 32px 0px #8898AA26;
				border-radius: 8rpx;

				.title {
					font-family: Roboto;
					font-size: var(--font-14);
					font-weight: 400;
					line-height: 48rpx;
					letter-spacing: 0.20000000298023224px;
					text-align: left;
					color: #222222;
					margin-bottom: 12rpx;
					
					.title-box{
						padding: 0 15rpx;
						border-radius: 16rpx;
						margin-right: 20rpx;
						font-size: 26rpx;
						border: 1rpx solid #F33E31;
						color: #F33E31;
					}
					
					.active{
						background-color: #F33E31;
						color: #fff;
					}
				}
				
				.upload-box{
					width: 311px;
					height: 129px;
					padding: 26rpx 32rpx;
					border-radius: 16rpx;
					background: rgba(255, 255, 255, 1);
					border: 1px solid rgba(206, 213, 218, 1);
					
					image{
						width: 48rpx;
						height: 48rpx;
					}
					
					view{
						font-family: Roboto;
						font-size: 24rpx;
						font-weight: 500;
						line-height: 48rpx;
						text-align: center;
						color: rgba(111, 115, 116, 1);
						margin-top: 20rpx;
					}
				}
				
				.rule {
					margin-top: 28rpx;

					.rule_title {
						font-family: Roboto;
						font-size: var(--font-12);
						font-weight: 500;
						line-height: 32rpx;
						text-align: left;
						color: #F33E31;
					}

					.rule_content {
						margin-top: 16rpx;
						font-family: Roboto;
						font-size: var(--font-13);
						font-weight: 500;
						line-height: 52rpx;
						text-align: left;
						color: #6F7374;
					}
				}
			}
		}
	}
</style>