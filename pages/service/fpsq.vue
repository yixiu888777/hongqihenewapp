<template>
	<view class="container" style="background:#c8131e url(/static/new/bg.jpg) no-repeat center top / 100%;">
		<headerView>
			<template #leftIcon><u-icon name="arrow-left" color="#fff" size="24"></u-icon></template>
			<view>{{settingInfo.name}}纪元·扶持申请</view>
			<template #rightIcon>
				<view class="icon" @click="$utils.toPage('/pages/service/fpsq-list')">
					<image src="/static/new/history.png" mode="heightFix"
						style="height: 36rpx; display: block; margin: 0 auto 5rpx;"></image>
					<view class="text" style="font-size: .6em;line-height: 1;">申请记录</view>
				</view>
			</template>
		</headerView>
		<view class="tip">共建伟业·同心同行·关注基层生活</view>
		<view class="reward">
			<view class="item">
				<view class="img">
					<image src="/static/fpqs/1.png" style="width:100rpx;height: 100rpx;" mode="aspectFill"></image>
				</view>
				<view class="text">扶持计划时间:长期开放(按季度审核)</view>
			</view>
			<view class="item">
				<view class="img">
					<image src="/static/fpqs/2.png" style="width:100rpx;height: 100rpx;" mode="aspectFill"></image>
				</view>
				<view class="text">扶持方向:线下宣讲、团队建设、地区活动、公益行动</view>
			</view>
			<view class="item">
				<view class="img">
					<image src="/static/fpqs/3.png" style="width:100rpx;height: 100rpx;" mode="aspectFill"></image>
				</view>
				<view class="text">审核通过团队将获得：经费支持➕物资补助➕宣传推广资源</view>
			</view>
			<view class="li">
				<view class="name">团队名称</view>
				<view class="input-code">
					<input class="input-text" type="text" v-model='form.team_name' placeholder="" />
				</view>
			</view>
			<view class="li">
				<view class="name">所在地区</view>
				<view class="input-code">
					<input class="input-text" type="text" v-model='form.area' placeholder="" />
				</view>
			</view>
			<view class="li">
				<view class="name">联系方式(手机号/新纪元账户)</view>
				<view class="input-code">
					<input class="input-text" type="text" v-model="form.phone" placeholder="" />
				</view>
			</view>
			<view class="li">
				<view class="name">团队负责人</view>
				<view class="input-code">
					<input type="text" class="input-text" v-model="form.person" placeholder="" />
				</view>
			</view>
			<view class="li">
				<view class="name">申请金额(元)</view>
				<view class="input-code">
					<input class="input-text" type="text" v-model="form.amount" placeholder="" />
				</view>
			</view>
			<view class="li">
				<view class="name">活动类型(请勾选)</view>
				<view class="input-code">
					<uni-data-checkbox selectedColor="#F62A2D" v-model="form.activity_type"
						:localdata="activity_type"></uni-data-checkbox>
				</view>
			</view>
			<view class="li">
				<view class="name">活动计划与经费用途说明(300字内)</view>
				<view class="input-code">
					<textarea class="input-text" v-model="form.usage_instructions" id="" maxlength="300" cols="30"
						rows="10"></textarea>
				</view>
			</view>
			<view class="li">
				<view class="name">上传相关资料</view>
				<view class="input-code">
					<uni-data-checkbox selectedColor="#F62A2D" v-model="updatetype" :localdata="up_type"
						@change="changeType"></uni-data-checkbox>
				</view>
			</view>
			<view class="desc-tip">提交后请联系新纪元官方接待专员查询审核进度!</view>
			<view class="btn" @click="add">提交申请</view>
		</view>

		<u-popup :show="imgShow" mode="center" round="32" :closeable="true" @close="imgShow=false">
			<view class="upload" v-if="updatetype == 0">
				<view class="t">上传相关资料</view>
				<u-upload :fileList="fileListA" @afterRead="afterRead" @delete="deletePic" name="A" multiple
					:maxCount="1" width="570rpx" height="400rpx">
					<view class="upimg">
						<image src="@/static/new/upload.png" mode="widthFix" style="width: 100rpx;"></image>
					</view>
				</u-upload>
			</view>
			<view class="upload" v-if="updatetype == 1">
				<view class="t">上传相关资料</view>
				<u-upload :fileList="fileListB" @afterRead="afterRead" @delete="deletePic" name="B" multiple
					:maxCount="1" width="570rpx" height="400rpx">
					<view class="upimg">
						<image src="@/static/new/upload.png" mode="widthFix" style="width: 100rpx;"></image>
					</view>
				</u-upload>
			</view>
			<view class="upload" v-if="updatetype == 2">
				<view class="t">上传相关资料</view>
				<u-upload :fileList="fileListC" @afterRead="afterRead" @delete="deletePic" name="C" multiple
					:maxCount="1" width="570rpx" height="400rpx">
					<view class="upimg">
						<image src="@/static/new/upload.png" mode="widthFix" style="width: 100rpx;"></image>
					</view>
				</u-upload>
			</view>
		</u-popup>
		<!-- 提示 -->
		<u-popup :show="show" mode="center" round="32" :closeable="true" @close="show = false">
			<view class="van-dialog van-dialog2">
				<view class="img" style="margin: 20rpx 0 30rpx;">
					<image src="/static/new/yes.png" mode="aspectFill" style="width: 90rpx; height: 90rpx;"></image>
				</view>
				<view class="van-dialog__header">
					<view class="h2">报名成功！</view>
					<view class="desc">请等待工作人员联系您！</view>
				</view>
			</view>
		</u-popup>
		<!-- 实名提示 -->
		<u-popup :show="nameShow" mode="center" round="32" @close="nameShow = false">
			<view class="van-dialog van-dialog2">
				<view class="van-dialog__header">提示</view>
				<view class="van-dialog__content">请先完成实名认证！</view>
				<view class="van-dialog__footer">
					<view class="button" @click="$utils.toPage(`/pages/mine/realName`)">去认证</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		userSupportRecordApi,
		userSupportAddApi,
		userSupportTypeApi
	} from '@/api/api.js'
	export default {
		data() {
			return {
				settingInfo: uni.getStorageSync('settingInfo'),
				UserInfo: uni.getStorageSync('user_info'),
				nameShow: false, // 实名认证
				show: false, // 弹窗
				form: {
					team_name: '',
					area: '',
					phone: '',
					team_superintendent: '',
					amount: '',
					activity_type: '',
					usage_instructions: '',
					team_image: '',
					activity_image: '',
					budget_image: ''
				},
				fileListA: [],
				fileListB: [],
				fileListC: [],
				updatetype: -1,
				activity_type: [],
				up_type: [{
					text: '团队照片',
					value: 0
				}, {
					text: '以往活动记录',
					value: 1
				}, {
					text: '预算明细表',
					value: 2
				}],
				imgShow: false,

			};
		},
		onLoad() {
			userSupportTypeApi().then(res => {
				res.data.data.forEach(i => {
					this.activity_type.push({
						text: i.name,
						value: i.id
					})
				})
			})
		},
		methods: {
			add() {
				if (this.UserInfo.is_auth == 1) {
					if (this.updatetype == 0) {
						this.form.activity_image = this.fileListA[0].upload
					}
					if (this.updatetype == 1) {
						this.form.activity_image = this.fileListB[0].upload
					}
					if (this.updatetype == 2) {
						this.form.budget_image = this.fileListC[0].upload
					}
					userSupportAddApi(this.form).then(res => {
						uni.$u.toast(res.data.msg)
						this.show = true
					})
				} else {
					this.nameShow = true
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
						url: uni.getStorageSync("baseUrl") + '/api/services/upload/file',
						filePath: url,
						name: 'file',
						formData: {
							site: uni.getStorageSync("baseUrl")
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
			changeType(e) {
				console.log('e:', e);
				this.imgShow = true;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		min-height: 100vh;
		height: auto;
		padding-bottom: 120rpx;
	}

	.tip {
		text-align: center;
		color: #fff;
		font-size: 28rpx;
		line-height: 1;
		margin: 0 0 40rpx;
	}

	.input-code {
		display: flex;
		align-items: center;

		.input {
			flex: 1;
			overflow: hidden;
			white-space: nowrap;
			overflow: hidden;
		}
	}

	.reward {
		padding: 30rpx;
		margin: 0 30rpx 30rpx;
		border-radius: 20rpx;
		background: #fff;

		.tit {
			font-size: 32rpx;
			font-weight: bold;
			margin-bottom: 30rpx;
		}

		.item {
			display: flex;
			align-items: center;
			font-weight: 800;
			font-size: 26rpx;
			line-height: 1;
			margin-bottom: 10rpx;
		}

		.li {
			margin-bottom: 30rpx;

			.name {
				font-weight: bold;
				margin-bottom: 10rpx;
			}

			.input-text {
				background: rgba(243, 240, 241, 1);
				padding: 20rpx;
				border-radius: 20rpx;
				width: 100%;
			}
		}

		.desc-tip {
			text-align: center;
			color: rgba(246, 42, 45, 1);
			line-height: 1;
			margin: 60rpx 0 30rpx;
			font-size: .9em;
		}

		.btn {
			background: rgba(246, 42, 45, 1);
			color: #fff;
			text-align: center;
			padding: 30rpx;
			border-radius: 20rpx;
		}
	}

	.nav-list {
		grid-template-columns: 1fr 1fr 1fr;
		margin-bottom: 30rpx;
		display: flex;
		justify-content: space-between;

		.nav-item {
			width: 31%;
			height: 104rpx;
			padding: 12rpx 20rpx;
			;
			border-radius: 20rpx;
			background: linear-gradient(to left, rgba(255, 49, 80, 0.1), rgba(255, 100, 75, 0.1));
			border-top: 1px solid rgba(255, 255, 255, 1);
			font-family: Roboto;
			font-size: 28rpx;
			font-weight: 400;
			line-height: 40rpx;
			color: rgba(175, 21, 0, 1);

			image {
				width: 28rpx;
				height: 28rpx;
			}
		}
	}

	.upload {
		padding: 30rpx;
		background: #fff;
		border: 1rpx solid #eee;
		border-radius: 20rpx;

		.t {
			font-weight: bold;
			margin-bottom: 30rpx;
		}

		.upimg {
			width: 570rpx;
			background: #fff;
			border: 2rpx dashed #eee;
			border-radius: 20rpx;
			padding: 90rpx 0;
			text-align: center;
			flex: 1;

			image {
				width: 100%;
			}
		}

		.u-upload {
			width: 570rpx;

			::v-deep .u-upload__deletable {
				background: rgba(0, 0, 0, .5);
				width: 60rpx;
				height: 60rpx;

				.u-upload__deletable__icon {
					top: 15rpx;
					right: 5rpx;
				}

				.uicon-close {
					font-size: 40rpx !important;
				}
			}
		}
	}
</style>