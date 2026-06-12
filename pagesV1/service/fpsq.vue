<template>

	<view class="container"
		style="background: url('/static/new1/bg.jpg') no-repeat center top / cover;background-attachment: fixed;">
		<view class="statusbar"></view>
		<view class="header_k">
			<view style="position: absolute;left: 20rpx;" @click="jumpk">
				<uni-icons type="left" color="#fff"></uni-icons>
			</view>
			红旗河纪元·扶持申请
		</view>
		<view class="tip">共建伟业·同心同行·关注基层生活</view>
		<view class="reward" style="margin-top: 20rpx;">
			<view style="display: flex;align-items: center;font-weight: 800;font-size: 26rpx;margin-bottom: 30rpx;">
				<image src="/static/fpqs/1.png" style="width:100rpx;height: 100rpx;" mode=""></image>
				<text>扶持计划时间:长期开放(按季度审核)</text>
			</view>
			<view style="display: flex;align-items: center;font-weight: 800;font-size: 26rpx;margin-bottom: 30rpx;">
				<image src="/static/fpqs/2.png" style="width:100rpx;height: 100rpx;" mode=""></image>
				<text>扶持方向:线下宣讲、团队建设、地区活动、公益行动</text>
			</view>
			<view style="display: flex;align-items: center;font-weight: 800;font-size: 26rpx;margin-bottom: 30rpx;">
				<image src="/static/fpqs/3.png" style="width:100rpx;height: 100rpx;" mode=""></image>
				<text>扶持方向:线下宣讲、团队建设、地区活动、公益行动</text>
			</view>
			<view>
				<view style="font-size: 30rpx;color: #333;
				font-weight: 800;margin-right: 20rpx;">团队名称</view>
				<view class="input-code" style="margin: 20rpx 0;">

					<input type="text" v-model='form.team_name' placeholder="" />

				</view>
			</view>
			<view>
				<view style="font-size: 30rpx;color: #333;
				font-weight: 800;margin-right: 20rpx;">所在地区</view>
				<view class="input-code" style="margin:20rpx 0">

					<input type="text" v-model='form.area' placeholder="" />

				</view>
			</view>
			<view>
				<view style="font-size: 30rpx;color: #333;
				font-weight: 800;margin-right: 20rpx;">联系方式(手机号/新纪元账户)</view>
				<view class="input-code" style="margin: 20rpx 0;padding-right: 0;position: relative;">

					<input type="text" v-model="form.phone" placeholder="" />
				</view>
			</view>
			<view>
				<view style="font-size: 30rpx;color: #333;
				font-weight: 800;margin-right: 20rpx;">团队负责人</view>
				<view class="input-code" style="margin: 20rpx 0;padding-right: 0;position: relative;">

					<input type="text" v-model="form.team_superintendent" placeholder="" />
				</view>
			</view>
			<view>
				<view style="font-size: 30rpx;color: #333;
				font-weight: 800;margin-right: 20rpx;">申请金额(元)</view>
				<view class="input-code" style="margin: 20rpx 0;padding-right: 0;position: relative;">

					<input type="text" v-model="form.amount" placeholder="" />
				</view>
			</view>
			<view>
				<view style="font-size: 30rpx;color: #333;
				font-weight: 800;margin-right: 20rpx;">活动类型(请勾选)</view>
				<view class="input-code" style="background: #fff;margin: 20rpx 0;padding-right: 0;position: relative;">
					<uni-data-checkbox v-model="form.activity_type" :localdata="sex"></uni-data-checkbox>
				</view>
			</view>
			<view>
				<view style="font-size: 30rpx;color: #333;
				font-weight: 800;margin-right: 20rpx;">活动计划与经费用途说明(300字内)</view>
				<view class="input-code" style="margin: 20rpx 0;
				">

					<textarea v-model="form.usage_instructions" id="" cols="30" rows="10"></textarea>

				</view>
			</view>
			<view>
				<view style="font-size: 30rpx;color: #333;
				font-weight: 800;margin-right: 20rpx;">上传相关资料(选填)</view>
				<view class="input-code" style="background: #fff;margin: 20rpx 0;padding-right: 0;position: relative;">
					<uni-data-checkbox v-model="updatetype" :localdata="sex1" ></uni-data-checkbox>
				</view>
			</view>
			<view style="color: red;text-align: center;font-size: 20rpx;margin-top: 80rpx;">
				提交后请联系新纪元官方接待专员查询审核进度!
			</view>
			<view style="margin-top: 20rpx;
				
				background-color: red;text-align: center;color: #fff;
				padding: 30rpx 0;border-radius: 20rpx;" @click="add">
				提交申请
			</view>

		</view>

	</view>



</template>

<script>
	import {
		userSupportRecord,
		userSupportAddApi,
		userSupportTypeApi
	} from '@/api/api.js'
	export default {
		data() {
			return {
				settingInfo: uni.getStorageSync('settingInfo'),
				form:{
					team_name:'',
					area:'',
					phone:'',
					team_superintendent:'',
					amount:'',
					activity_type:'',
					usage_instructions:'',
					image:'',
					activity_image:'',
					budget_image:''
				},
				updatetype:-1,
				sex: [],
				sex1: [{
					text: '团队照片',
					value: 0
				}, {
					text: '以往活动记录',
					value: 1
				}, {
					text: '预算明细表',
					value: 2
				}],

			};
		},
		onLoad() {
			
		userSupportTypeApi().then(res=>{
			res.data.data.forEach(i=>{
				this.sex.push({
					text:i.name,
					value:i.id
				})
			})
		})
			
		},
		methods: {
			add(){
				userSupportAddApi(this.form).then(res=>{
					uni.$u.toast(res.data.msg)
				})
			},
			jumpk() {
				uni.navigateBack()
			},
		}
	}
</script>

<style lang="scss">
	.count-box {
		padding: 30rpx;
		margin: 0 30rpx 30rpx;
		border-radius: 20rpx;
		background: #fff;
	}

	.container {
		min-height: 100vh;
		height: auto;
		padding-bottom: 120rpx;
	}

	.header_k {
		position: relative;
		text-align: center;
		color: #fff;
		margin-top: 40rpx;
		font-weight: 700;
	}



	.tip {
		text-align: center;
		color: #fff;
		font-size: 28rpx;
		line-height: 1;
		margin: 20rpx 0 40rpx;
	}

	.input-code {
		display: flex;
		align-items: center;
		background: rgba(246, 247, 249, 1);
		padding: 20rpx;
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

		.level {
			font-size: 0.8em;
			margin-bottom: 30rpx;

			.lv1 {
				background: linear-gradient(270deg, #7B90AD 0%, #B2C1D7 100%);
			}

			.lv2 {
				background: linear-gradient(270deg, #DDB999 0%, #F1D8BA 100%);
			}

			.lv3 {
				background: linear-gradient(90deg, #ADCAE8 0%, #CCE0F8 100%);
			}

			.lv4 {
				background: linear-gradient(90deg, #E8BE76 0%, #F4D59E 100%);
			}

			.lv5 {
				background: linear-gradient(90deg, #918EE5 0%, #A5A0F0 100%);
			}

			.lv6 {
				background: linear-gradient(90deg, #131313 0%, #48484A 100%);
			}

			.item {
				border-radius: 20rpx;
				padding: 30rpx;
				display: flex;
				align-items: center;
				margin-bottom: 30rpx;

				.icon {
					image {
						width: 90rpx;
					}
				}

				.desc {
					color: #fff;
					font-size: 1.2em;
					padding: 0 20rpx;
					flex: 1;
				}

				.btn {
					color: #FF374F;
					font-size: 1.2em;
					font-weight: bold;
				}
			}
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