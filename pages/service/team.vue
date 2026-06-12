<template>
	<view class="container" style="background:#c8131e url(/static/new/bg.jpg) no-repeat center top / 100%;">
		<headerView>
			<template #leftIcon><u-icon name="arrow-left" color="#fff" size="24"></u-icon></template>
			<view>{{settingInfo.name}}纪元·团队入驻计划</view>
			<template #rightIcon>
				<view class="icon" @click="$utils.toPage('/pages/service/team-list')">
					<image src="/static/new/history.png" mode="heightFix"
						style="height: 36rpx; display: block; margin: 0 auto 5rpx;"></image>
					<view class="text" style="font-size: .6em;line-height: 1;">申请记录</view>
				</view>
			</template>
		</headerView>
		<view class="tip">让团队的力量，汇入时代的洪流</view>
		<view class="count-box">
			<image :src="settingInfo.team_ad_image" mode="widthFix"></image>
		</view>
		<view class="reward">
			<view style="background-color: #FEE9EA;padding: 30rpx 120rpx;margin-bottom: 50rpx;border-radius: 20rpx;
			color: rgba(246, 42, 45, 1);font-weight: 700;text-align: center;">欢迎您的团队加入纪元计划，共享资源，共创收益。</view>
			<view>
				<view class="name">团队名称</view>
				<view class="input-code" style="margin: 20rpx 0;">
					<input type="text" v-model="form.team_name" placeholder="" />
				</view>
			</view>
			<view>
				<view class="name">负责人姓名</view>
				<view class="input-code" style="margin:20rpx 0">
					<input type="text" v-model="form.person" placeholder="" />

				</view>
			</view>
			<view>
				<view class="name">新纪元账户</view>
				<view class="input-code" style="margin: 20rpx 0;padding-right: 0;position: relative;">
					<input type="text" v-model="form.account" placeholder="" />
				</view>
			</view>
			<view>
				<view class="name">团队规模</view>
				<view class="input-code" style="margin: 20rpx 0;padding-right: 0;position: relative;">
					<input type="text" v-model="form.scale" placeholder="" />
				</view>
			</view>
			<view>
				<view class="name">主要推广渠道</view>
				<view class="input-code" style="margin: 20rpx 0;padding-right: 0;position: relative;">
					<input type="text" v-model="form.channel" placeholder="" />
				</view>
			</view>
			<view>
				<view class="name">预期月推广人数</view>
				<view class="input-code" style="margin: 20rpx 0;padding-right: 0;position: relative;">
					<input type="text" v-model="form.people_num" placeholder="" />
				</view>
			</view>
			<view>
				<view class="name">所在城市/身份</view>
				<view class="input-code" style="margin: 20rpx 0;padding-right: 0;position: relative;">
					<input type="text" v-model="form.city" placeholder="" />
				</view>
			</view>
			<view>
				<view class="name">备注说明</view>
				<view class="input-code" style="margin: 20rpx 0;">
					<textarea v-model="form.remark" maxlength="300" cols="30" rows="10"></textarea>
				</view>
			</view>
			<view class="desc-tip">
				提示:申请入驻会在1-3个工作日内完成审核，进度请点击右上角查看申请记录！
			</view>
			<!-- -1 未提交，0 待审核，1审核通过   2 审核失败 -->
			<view class="btn" @click="save" v-if="form.status == -1">申请入驻</view>
			<view class="btn no" v-if="form.status == 0">待审核</view>
			<view class="btn no" v-if="form.status == 1">已申请</view>
			<view class="btn" @click="save" v-if="form.status == 2">修改</view>
		</view>
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
		userTeamUpdateAddApi,
		userTeamPlanAddApi,
		userTeamPlanInfoApi
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
					person: '',
					account: '',
					scale: '',
					channel: '',
					people_num: '',
					city: '',
					remark: ''
				},
				code: 0
			};
		},
		onLoad() {
			this.loadData();
		},
		methods: {
			loadData() {
				userTeamPlanInfoApi().then(res => {
					this.code = res.data.code;
					this.form = res.data.data;
				})
			},
			save() {
				if (this.UserInfo.is_auth == 1) {
					userTeamPlanAddApi(this.form).then(res => {
						uni.$u.toast(res.data.msg);
						// uni.navigateBack()
						this.show = true
					})
				} else {
					this.nameShow = true
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.count-box {
		padding: 30rpx;
		margin: 0 30rpx 30rpx;
		border-radius: 20rpx;
		background: #fff;

		image {
			width: 100%;
			border-radius: 20rpx;
		}
	}

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
		margin: 0 0 30rpx;
	}

	.input-code {
		display: flex;
		align-items: center;
		background: rgba(243, 240, 241, 1);
		padding: 30rpx;
		border-radius: 10rpx 20rpx;

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

		.name {
			font-size: 30rpx;
			color: #333;
			font-weight: 800;
		}

		.list {
			.item {
				padding: 30rpx;
				margin-bottom: 30rpx;
				border-radius: 20rpx;
				display: flex;
				align-items: center;
				background: rgba(249, 250, 251, 1);

				.icon {
					image {
						width: 100rpx;
					}
				}

				.text {
					flex: 1;
					padding: 0 30rpx;

					.h3 {
						font-weight: bold;
					}

					.desc {
						font-size: .8em;
					}
				}

				.btn {
					font-size: .8em;
					background: linear-gradient(to left, #FF624B, #FF3650);
					color: #fff;
					border-radius: 10rpx;
					padding: 10rpx 20rpx;
				}
			}

			.success {
				filter: grayscale(100%);
				-webkit-filter: grayscale(100%);
				opacity: .7;

				.btn {}
			}

			.ing {
				.btn {}
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

		.btn.no {
			opacity: .7;
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
</style>