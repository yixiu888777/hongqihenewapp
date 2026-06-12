<!-- 有用 -->
<template>
	<view class="container" :style="'background: #df2516 url(/static/new/bg.png) no-repeat center top / 100%;background-attachment: fixed;'">	
		<view class="add" v-if="addShow">
			<view class="form">
				<view class="tit">个人信息填写</view>
				<view class="item">
					<view class="flex_between">
						<view class="item-name">姓名</view>
					</view>
					<view class="item-input flex_between">
						<input type="text" class="input" v-model="form.real_name" placeholder="请输入真实姓名" placeholder-class="placeholder" @blur="containsChinese"/>
					</view>
				</view>
				<view class="item">
					<view class="flex_between">
						<view class="item-name">身份证件号</view>
					</view>
					<view class="item-input flex_between">
						<input type="text" class="input" v-model="form.card_number" placeholder="请输入身份证号码" placeholder-class="placeholder" maxlength="18"/>
					</view>
				</view>
				<view class="item">
					<view class="flex_between">
						<view class="item-name">居住所在地</view>
					</view>
					<view class="item-input flex_between">
						<input type="text" class="input" v-model="form.location" placeholder="请输入详细地址" placeholder-class="placeholder"/>
					</view>
				</view>
				<view class="item">
					<view class="flex_between">
						<view class="item-name">年龄</view>
					</view>
					<view class="item-input flex_between">
						<input type="number" class="input" v-model="form.age" placeholder="请输入年龄" placeholder-class="placeholder"/>
					</view>
				</view>
				<view class="item">
					<view class="flex_between">
						<view class="item-name">手机号码</view>
					</view>
					<view class="item-input flex_between">
						<input type="number" class="input" v-model="form.phone" placeholder="请输入联系电话" placeholder-class="placeholder" maxlength="11" />
					</view>
				</view>
			</view>
			<view class="box">
				<view class="tit">补贴详情</view>
				<view class="dl">
					<view class="item">
						<view class="dt">登记费用：</view>
						<view class="dd">{{form.registration_fee}} 元</view>
					</view>
					<view class="item">
						<view class="dt">补贴周期：</view>
						<view class="dd">{{form.subsidy_period}} 月</view>
					</view>
					<view class="item">
						<view class="dt">首月补贴：</view>
						<view class="dd">￥{{form.subsidy_amount}} 元</view>
					</view>
					<!-- 补贴总额： -->
					<view class="item">
						<view class="dt">补贴总额：</view>
						<view class="dd">￥{{subsidy_total_amount}} 元</view>
					</view>
					<!-- 发放金额明细 -->
					<view class="item">
						<view class="dt">发放金额明细：</view>
						<view class="dd">
							<view v-for="(item,index) in detail">
								{{item.key}}:{{item.value}}元
							</view>
						</view>
					</view>
					<view class="item">
						<view class="dt">发放时间</view>
						<view class="dd">每月 {{form.issue_time}} 号</view>
					</view>
				</view>
				<view class="desc">政策部门：{{form.policy_department}}</view>
				<view class="tit">用户确认与声明</view>
				<view class="check"><label @click="check1= !check1"><checkbox value="cb" :checked="true" activeBorderColor="rgba(1, 194, 96, 1)" color="rgba(1, 194, 96, 1)" style="transform:scale(0.6)" /> 本人郑重承诺上述信息真实有效</label></view>
				<view class="check"><label @click="check2= !check2"><checkbox value="cb" :checked="true" activeBorderColor="rgba(1, 194, 96, 1)" color="rgba(1, 194, 96, 1)" style="transform:scale(0.6)" /> 我已知晓政策详情和补贴明细</label></view>
				<view class="button" @click="addSave" v-if="check1 && check2">本人自愿参与登记</view>
				<view class="button no" v-else>请先确认与声明</view>
			</view>
		</view>
	
		<!-- 补贴类型选择 -->
		<view class="typeShow" v-if="typeShow">
			<view class="van-dialog van-dialog2">
				<view class="van-dialog__header">补贴类型选择</view>
				<view class="van-dialog__content">
					<view class="type-list" v-if="cat.length > 0">
						<view class="item" :class="item.id == CatID ? 'on':''" v-for="(item,index) in cat" :key="index" @click="OnCat(index)">
							<view class="text">{{item.name}}</view>
							<view class="icon"><u-icon name="checkbox-mark" color="#fff" size="14"></u-icon></view>
						</view>
					</view>
					<u-skeleton :loading="true" :animate="true" :rows="3" :title="false" v-else></u-skeleton>
				</view>
				<view class="van-dialog__footer flex_center">
					<view class="van-success" @click="onType()">确定</view>
				</view>
			</view>
		</view>
		
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
		<!-- 支付密码修改提示 -->
		<u-popup :show="pswShow" mode="center" round="32">
			<view class="van-dialog van-dialog2">
				<view class="van-dialog__header">提示</view>
				<view class="van-dialog__content">请先设置或修改支付密码</view>
				<view class="van-dialog__footer flex_center">
					<view class="van-success" @click="$utils.toPage('/pages/mine/account/paymentPassword')">设置密码</view>
				</view>
			</view>
		</u-popup>
		<!-- 充值付款提示 -->
		<u-popup :show="payShow" mode="center" round="32">
			<view class="van-dialog van-dialog2">
				<view class="van-dialog__header">提示</view>
				<view class="van-dialog__content">
					<view class="m-tips warning">
						<view class="icon"><image src="/static/new/tips.png" mode="aspectFit"></image></view>
						<view class="text">
							<view class="desc">您的余额不足，请先充值后支付</view>
						</view>
					</view>	
				</view>
				<view class="van-dialog__footer flex_center">
					<view class="van-success" @click="$utils.toPage('/pages/mine/recharge/recharge')">立即充值</view>
				</view>
			</view>
		</u-popup>
		<!-- 修改提示 -->
		<u-popup :show="resetShow" mode="center" round="32">
			<view class="van-dialog van-dialog2">
				<view class="van-dialog__header">提示</view>
				<view class="van-dialog__content">
					<view class="m-tips warning">
						<view class="icon"><image src="/static/new/tips.png" mode="aspectFit"></image></view>
						<view class="text">
							<view class="desc">{{settingInfo.subsidy.subsidy_refuse}} {{form.remark}}</view>
						</view>
					</view>	
				</view>
				<view class="van-dialog__footer flex_center">
					<view class="van-success" @click="onReset">重新修改</view>
				</view>
			</view>
		</u-popup>	
		<!-- 审核拒绝，拒绝原因： -->
		<u-popup :show="refuseShow" mode="center" round="32">
			<view class="van-dialog van-dialog2">
				<view class="van-dialog__header">提示</view>
				<view class="van-dialog__content">
					<view class="m-tips warning">
						<view class="icon"><image src="/static/new/tips.png" mode="aspectFit"></image></view>
						<view class="text">
							<view class="desc">{{settingInfo.subsidy.subsidy_refuse}}</view>
						</view>
					</view>	
				</view>
			</view>
		</u-popup>
		<!-- 审核中 -->
		<u-popup :show="waitShow" mode="center" round="32">
			<view class="van-dialog van-dialog2">
				<view class="van-dialog__header">提示</view>
				<view class="van-dialog__content">
					<view class="m-tips warning">
						<view class="icon"><image src="/static/new/tips.png" mode="aspectFit"></image></view>
						<view class="text">
							<view class="desc">{{settingInfo.subsidy.subsidy_wait}}</view>
						</view>
					</view>	
				</view>
			</view>
		</u-popup>
		<!-- 您已完成登记，清耐心等待相关部门审核！ -->
		<u-popup :show="completeShow" mode="center" round="32">
			<view class="van-dialog van-dialog2">
				<view class="van-dialog__header">提示</view>
				<view class="van-dialog__content">
					<view class="m-tips warning">
						<view class="icon"><image src="/static/new/tips.png" mode="aspectFit"></image></view>
						<view class="text">
							<view class="desc">{{settingInfo.subsidy.subsidy_complete}}</view>
						</view>
					</view>	
				</view>
				<view class="van-dialog__footer flex_center">
					<view class="van-success" @click="$utils.toPage(`/pages/index/index`)">返回</view>
				</view>
			</view>
		</u-popup>
		<!-- 恭喜您审核通过 -->
		<u-popup :show="passShow" mode="center" round="32">
			<view class="van-dialog van-dialog2">
				<view class="van-dialog__header">提示</view>
				<view class="van-dialog__content">
					<view class="m-tips warning">
						<view class="icon"><image src="/static/new/tips.png" mode="aspectFit"></image></view>
						<view class="text">
							<view class="desc">{{settingInfo.subsidy.subsidy_pass}}</view>
						</view>
					</view>	
				</view>
				<view class="van-dialog__footer flex_center">
					<view class="van-success" @click="$utils.toPage(`/pages/index/index`)">返回</view>
				</view>
			</view>
		</u-popup>
		<!-- 完成提示 -->
		<u-popup :show="doneShow" mode="center" round="32">
			<view class="van-dialog van-dialog2">
				<view class="van-dialog__header">提示</view>
				<view class="van-dialog__content">
					<view class="m-tips warning">
						<view class="icon"><image src="/static/new/tips.png" mode="aspectFit"></image></view>
						<view class="text">
							<view class="desc">{{settingInfo.subsidy.subsidy_pass}}</view>
						</view>
					</view>	
				</view>
				<view class="van-dialog__footer flex_center">
					<view class="van-success" @click="onDone">提现</view>
				</view>
			</view>
		</u-popup>
		<!-- 输入支付密码提示 -->
		<u-popup :show="PswPayShow" mode="center" round="32">
			<view class="van-dialog van-dialog2">
				<view class="van-dialog__header">提示</view>
				<view class="van-dialog__content">
					<view class="pswbox">
						<input type="password" v-model="security_password" class="input" placeholder="请输入支付密码" placeholder-class="placeholder" />
					</view>					
				</view>
				<view class="van-dialog__footer">
					<view class="button" @click="paySubsidy()" v-if="security_password">立即支付</view>
					<view class="button no" v-else>请输入支付密码</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import { 
		subsidyPaymentApi, //国务政务补贴登记缴费 
		subsidyDetailApi, //国家政务补贴登记详情 
		subsidyStoreApi, //国家政务补贴登记添加 
		subsidyCategoryApi, //获取分类列表 
		getUserInfoAPI
	} from '@/api/api.js'
	export default {
		data() {
			return {
				settingInfo: uni.getStorageSync('settingInfo'),
				isPageShow: false,
				typeShow: false,
				addShow: false,
				resetShow: false, 
				refuseShow: false,
				waitShow: false,
				passShow: false,
				completeShow: false,
				doneShow: false,
				RealNameShow: false,
				pswShow: false,
				payShow: false,
				PswPayShow: false,
				security_password: '',
				detail: [],
				cat: [],
				CatID: 1,
				CatIndex: 0,
				CatName: '',
				form: {
					category_id: '',
					real_name: '',
					card_number: '',
					location: '',
					age: '',
					phone: '',
					registration_fee: '',
					subsidy_amount: '',
					subsidy_period: '',
					issue_time: '',
					policy_department: '',
				},
				check1: true,
				check2: true,
				userInfo: {},
				detail:[], //发放明细
				subsidy_total_amount:0, //补贴总额
			}
		},
		onLoad(opt) {
		},
		onShow() {
			this.resetShow = false;
			this.refuseShow = false;
			this.waitShow = false;
			this.passShow = false;
			this.completeShow = false;
			this.doneShow = false;
			this.RealNameShow = false;
			this.pswShow = false;
			this.payShow = false;
			this.PswPayShow = false;
			getUserInfoAPI().then(res => {
				this.userInfo = res.data.data;
				uni.setStorageSync('UserInfo', res.data.data)
				this.getCat();
				//this.getDT();
			})
		},
		onHide() {
			
		},
		onUnload() {
			// 页面卸载时
		},
		onReachBottom() {
			// 上拉触底时
		},
		methods: {
			getDT(){
				subsidyDetailApi({category_id:this.form.category_id}).then(res=>{
					this.CatID = res.data.data.id;
					this.CatName = res.data.data.category_name;
					uni.setNavigationBarTitle({ title: res.data.data.category_name });
					// 状态 0待缴纳 1待审核 2审核通过 3审核拒绝 -1未登记
					if(res.data.data.status == -1){
						this.getCat();
					} else{
						this.form = res.data.data;
						this.addShow = true;
						this.typeShow = false;
					}
					if(res.data.data.status == 0){
						this.addShow = true;
						this.PswPayShow = true;
						this.checkUser();
					}
					if(res.data.data.status == 1){
						this.completeShow = true;
					}
					if(res.data.data.status == 2){
						this.doneShow = true;
					}
					if(res.data.data.status == 3){
						this.resetShow = true;
					}
					
				})				
			},
			getCat() {
				subsidyCategoryApi().then(res=>{
					this.cat = res.data.data;					
					if( this.addShow ){
						// this.addShow = false;
					} else{
						this.CatID = res.data.data[0].id;
						this.CatName = res.data.data[0].name;
						this.form.category_id = res.data.data[0].id;
						this.form.registration_fee = res.data.data[0].registration_fee;
						this.form.subsidy_amount = res.data.data[0].subsidy_amount;
						this.form.subsidy_period = res.data.data[0].subsidy_period;
						this.form.issue_time = res.data.data[0].issue_time;
						this.form.policy_department = res.data.data[0].policy_department;
						this.detail = res.data.data[0].detail;
						this.subsidy_total_amount = res.data.data[0].subsidy_total_amount;
						this.typeShow = true;
					}
				})
			},
			OnCat(e){
				this.CatIndex = e;
				this.CatID = this.cat[e].id;
				this.CatName = this.cat[e].name;
				this.form.category_id = this.cat[e].id;
				this.form.registration_fee = this.cat[e].registration_fee;
				this.form.subsidy_amount = this.cat[e].subsidy_amount;
				this.form.subsidy_period = this.cat[e].subsidy_period;
				this.form.issue_time = this.cat[e].issue_time;
				this.form.policy_department = this.cat[e].policy_department;
				this.detail = this.cat[e].detail;
				this.subsidy_total_amount = this.cat[e].subsidy_total_amount;
			},
			onType(){
				this.typeShow = false;
				this.addShow = true;
				uni.setNavigationBarTitle({
				  title: this.CatName,
				});
				this.getDT()
			},
			// 验证中文
			containsChinese(str) {
				if (!this.$utils.containsChinese(str)) {
					this.form.name = ''
					uni.$u.toast('请输入正确姓名');
				}
			},
			addSave(){
				if (!this.form.real_name) {
					return uni.$u.toast('请输入真实姓名');
				}
				if (!this.form.card_number) {
					return uni.$u.toast('请输入身份证号码');
				}
				if (!this.form.location) {
					return uni.$u.toast('请输入详细地址');
				}
				if (!this.form.age) {
					return uni.$u.toast('请输入年龄');
				}
				if (!this.form.phone) {
					return uni.$u.toast('请输入联系电话');
				}
				this.$utils.throttle(() => {
					subsidyStoreApi({
						...this.form
					}).then(res => {
						uni.$u.toast(res.data.msg);
						this.getDT();
						// setTimeout(() => {
						// 	uni.navigateBack()
						// }, 1000)
					})
				}, 2000)()				
			},
			checkboxChange: function (e) {
				console.log("checkboxChange",e)
			},
			onReset(){
				this.resetShow = false;
				this.addShow = false;
				this.getCat();
				// this.typeShow = true;
			},
			checkUser(){
				// UserInfo.is_auth == 0
				if(this.userInfo.is_auth == 0){
					this.RealNameShow = true;
				} else if(this.userInfo.is_pay_password == 0){
					// 支付密码 1有 0 没有 
					this.pswShow = true;
				} 
				// else if ( Number(this.userInfo.price_list.recharge_price.price)  < this.form.registration_fee ){
				// 	// 钱包
				// 	this.payShow = true;
				// } else{
				// 	this.PswPayShow = true;
				// }
			},
			paySubsidy(){
				subsidyPaymentApi({security_password:this.security_password,category_id:this.form.category_id}).then(res=>{
					uni.$u.toast(res.data.msg);
					this.PswPayShow = false;
					this.completeShow = true;
				}).catch(err => {
					uni.$u.toast(err.data.msg);
					if( err.data.msg == '钱包余额不足'){
						uni.navigateTo({
							url: '/pages/mine/recharge/recharge'
						})
					}				});
			},
			onDone(){
				uni.redirectTo({
					url: '/pages/mine/withdraw/withdraw'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.type-list{
		.item{ display: flex; padding: 30rpx; border: 2rpx solid #eee; border-radius: 20rpx; margin-bottom: 30rpx;
			.text{flex: 1; text-align: left; line-height: 40rpx; font-size: .8em;}
			.icon{ background: linear-gradient(to left, #D1D5DB, #ddd); width: 40rpx;height: 40rpx; padding:8rpx; text-align: center; border-radius: 20rpx;}
		}
		.on{ border: 2rpx solid #FF3650;
			.icon {background: linear-gradient(to left, #FF624B, #FF3650); }
		}
	}
	.typeShow{ display: flex; align-items: center; align-content: center; width: 100%; height: 100vh; background: rgba(0, 0, 0, .4);
		.van-dialog{ flex: none; margin: 0 auto;}
	}
	.add{ padding-top: 30rpx; background: rgba(240, 241, 243, 1); }
	.form { margin-bottom: 30rpx; padding: 30rpx; background: #fff;
		.tit{font-weight: bold; margin-bottom: 30rpx;}
			.item { font-weight: 400; margin-top: 30rpx;
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
						margin-right: 20rpx;
						border: 1px solid rgba(206, 213, 218, 1);
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
	
	.box{ padding: 30rpx; background: #fff;
		.tit{font-weight: bold; margin-bottom: 30rpx;}
		.dl{ background: #F9FAFB; padding: 30rpx; border-radius: 20rpx; margin-bottom: 20rpx;
			.item{ display: flex; padding: 10rpx 0;
				.dt{ font-weight: 400; flex: 1;font-size: 16px;}
				.dd{}
			}
		}
		.desc{margin-bottom: 60rpx; font-weight: 300; font-size: .8em;}
		.check{ background: rgba(1, 194, 96, 0.10); color: rgba(1, 194, 96, 1); padding: 30rpx; border-radius: 20rpx; margin-bottom: 30rpx; font-size: .8em;}
		.button{ margin-top: 90rpx; }
		.no{ opacity: 0.5; }
	}
	.pswbox{ border: 2rpx solid #e5e5e5; padding: 20rpx; border-radius: 20rpx;
		::v-deep .u-code-input{justify-content: space-evenly;}
		::v-deep .u-code-input__item{ border-radius: 5rpx; }
	}
</style>