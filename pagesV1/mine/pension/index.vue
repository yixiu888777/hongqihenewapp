<!-- 有用 -->
<template>
	<view class="container">	
		<view class="typeShow" v-if="typeShow">
			<view class="van-dialog van-dialog2">
				<view class="van-close" @click="closeType()"><u-icon name="close-circle-fill"></u-icon></view>
				<view class="van-dialog__header">创建养老金账户</view>
				<view class="van-dialog__content">
						<view class="form">
							<view class="item">
								<view class="flex_between">
									<view class="item-name">姓名</view>
								</view>
								<view class="item-input flex_between">
									<input type="text" class="input" v-model="form.name" placeholder="请输入真实姓名" placeholder-class="placeholder" @blur="containsChinese"/>
								</view>
							</view>
							<view class="item">
								<view class="flex_between">
									<view class="item-name">身份证号</view>
								</view>
								<view class="item-input flex_between">
									<input type="text" v-model="form.card_number" class="input" placeholder="请输入身份证号"
										placeholder-class="placeholder" maxlength="18" @blur="isValidID" />
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
									<view class="item-name">城市</view>
								</view>
								<view class="item-input flex_between">
									<input type="text" class="input" v-model="form.city" placeholder="请输入城市" placeholder-class="placeholder"/>
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
				</view>
				<view class="van-dialog__footer flex_center">
					<view class="van-success" @click="addSave()">创建</view>
				</view>
			</view>
		</view>
		<view class="detail" v-if="dtShow">
			<view class="bg"></view>
			<view class="main">
				<headerView>
					<template #leftIcon><u-icon name="arrow-left" color="#fff" size="24"></u-icon></template>
					<view>个人养老金账户</view>
				</headerView>
				<view class="content">
					<view class="box">
						<view class="more" @click="$utils.toPage(`/pages/mine/pension/interest`)">利息明细</view>
						<view class="mine">
							<view class="name">持有人：{{detail.name}}</view>
							<view class="desc">养老账户卡号：{{detail.card_no}}</view>
						</view>
						<view class="card">
							<view class="item">
								<view class="desc">年度预存上限金额</view>
								<view class="num b">{{detail.prepaid_amount}}</view>
							</view>
							<view class="item">
								<view class="desc">年化利率</view>
								<view class="num b">{{detail.interest_rate}}</view>
							</view>
							<view class="item">
								<view class="desc">{{detail.name_polit_price}}</view>
								<view class="num">{{detail.polit_price}}</view>
							</view>
							<view class="item">
								<view class="desc">{{detail.name_pension_price}}</view>
								<view class="num">{{detail.pension_price}}</view>
							</view>
							<view class="item">
								<view class="desc">可用余额</view>
								<view class="num">{{detail.balance}}</view>
							</view>
							<view class="item">
								<view class="desc">{{detail.name_state_price}}</view>
								<view class="num">{{detail.state_price}}</view>
							</view>
						</view>
						<view class="btn">
							<view class="sbtn" @click="transferShow = true"><u-icon name="arrow-downward" color="#fff" size="20"></u-icon> 转入</view>
							<view class="sbtn" @click="$utils.toPage(`/pages/mine/withdraw/withdraw?type=state`)"><u-icon name="arrow-upward" color="#fff" size="20"></u-icon> 提现</view>
						</view>
					</view>
					<view class="box">
						<view class="btn2">
							<view class="sbtn" :class="tabIndex ==0?'on':''" @click="tabIndex =0">账户说明</view>
							<view class="sbtn" :class="tabIndex ==1?'on':''" @click="tabIndex =1">转入记录</view>
							<view class="sbtn" :class="tabIndex ==2?'on':''" @click="tabIndex =2">提现记录</view>
						</view>
						<view v-if="tabIndex == -1">
						<view class="list" v-if="pensionRecord.length > 0">
							<view class="tit">
								<view class="name">账户</view>
								<view class="status">状态</view>
							</view>
							<view class="scroll" :style="{ height: `${(pensionRecord.length+1) * 80}rpx` }">
							<view class="scroll-content" :style="{ animationDuration: `${pensionRecord.length * 2}s` }">
								<view class="item" v-for="(item,index) in pensionRecord" :key="`original-${index}`">
									<view class="name">{{item.phone}}</view>
									<view class="status">成功开通养老金</view>
								</view>
								<view class="item" v-for="(item,index) in pensionRecord" :key="`copy-${index}`">
									<view class="name">{{item.phone}}</view>
									<view class="status">成功开通养老金</view>
								</view>
							</view>
							</view>
						</view>
						<view class="m-noData" v-else>
							<view class="item">
								<view class="icon"><image src="@/static/new/nodata.png" mode="widthFix"></image></view>
							</view>
						</view>
						</view>
						<view class="description" v-html="detail.pension_description" v-if="tabIndex ==0"></view>
						<view v-if="tabIndex == 1">
							<view class="list" v-if="pensionTransfer.length >0">
								<view class="tit">
									<view class="text">类型</view>
									<view class="num">金额</view>
								</view>
								<view class="item" v-for="(item,index) in pensionTransfer" :key="index">
									<view class="text">									
										<text class="memo">{{item.memo}}</text>
										<text class="createtime">{{item.createtime}}</text>
									</view>
									<view class="num">{{item.money}}</view>
								</view>
							</view>
							<view class="m-noData" v-else>
								<view class="item">
									<view class="icon"><image src="@/static/new/nodata.png" mode="widthFix"></image></view>
								</view>
							</view>
						</view>
						<view v-if="tabIndex == 2">
							<view class="list" v-if="WithdrawPage.length >0">
								<view class="tit">
									<view class="text">类型</view>
									<view class="num">金额</view>
								</view>
								<view class="item" v-for="(item,index) in WithdrawPage" :key="index">
									<view class="text">
										<view class="title">{{item.money_type_str}}</view>
										<view class="time">{{item.time_str}}</view>
										<view class="succeed" v-if="item.status==4 || item.status==9">{{item.status_str}}</view>
										<view class="fail" v-else-if="item.status==2 || item.status==3 || item.status==10">
											{{item.status_str}}
										</view>
										<view class="audit" v-else>{{item.status_str}}</view>
									</view>
									<view class="num">{{item.price}}</view>
								</view>
							</view>
							<view class="m-noData" v-else>
								<view class="item">
									<view class="icon"><image src="@/static/new/nodata.png" mode="widthFix"></image></view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 立即转入提示 -->
		<u-popup :show="transferShow" mode="center" round="32" @close="transferShow = false">
			<view class="van-dialog van-dialog2">
				<view class="van-dialog__header">转入</view>
				<view class="van-dialog__content">
					<view class="form">
						<view class="type">
							<view class="li" :class="typeIndex==index?'on':''" v-for="(item,index) in typeList" :key="index" @click="typeClick(item, index)">
								<view class="name">{{item.name}}</view>
								<view class="num">{{item.price}}</view>
							</view>
						</view>
						<view class="item">
							<view class="flex_between">
								<view class="item-name">金额</view>
							</view>
							<view class="item-input flex_between">
								<input type="number" class="input" v-model="transfer.amount" placeholder="请输入金额" placeholder-class="placeholder"/>
							</view>
						</view>
						<view class="item">
							<view class="flex_between">
								<view class="item-name">支付密码</view>
							</view>
							<view class="item-input flex_between">
								<input type="password" class="input" v-model="transfer.security_password" placeholder="请输入支付密码" placeholder-class="placeholder" />
							</view>
						</view>
					</view>				
				</view>
				<view class="van-dialog__footer">
					<view class="button" @click="onTransfer">立即转入</view>
				</view>
			</view>
		</u-popup>
		<!-- 是否实名认证 -->
		<Real-Name></Real-Name>
	</view>
</template>

<script>
	import { 
		pensionAddApi, //个人养老金-创建 
		pensionDetailApi, //个人养老金-详情
		pensionWalletApi, //个人养老金-转入钱包
		pensionTransferApi, //个人养老金-转入
		pensionTransferRecordApi, //个人养老金-转入记录
		pensionRecordApi, // 养老金开通记录
		pensionWithdrawApi, // 个人养老金-提现记录
		getUserInfoAPI
	} from '@/api/api.js'
	export default {
		data() {
			return {
				settingInfo: uni.getStorageSync('settingInfo'),
				isPageShow: false,
				typeShow: false,
				dtShow: false,
				transferShow: false,
				withdrawShow: false,
				tabIndex: -1,
				detail: [],
				form: {
					name: '',
					age: '',
					phone: '',
					card_number: '',
					city: '',
				},
				transfer: {
					money_type: '',
					amount: '',
					security_password: '',
				},
				pensionRecord: [],
				typeList: [], // 钱包
				typeIndex: 0,
				pensionTransfer: [],
				page: 1,
				pensionWithdraw: [],
				WithdrawPage: 1,
				userInfo: {}
			}
		},
		onLoad(opt) {
			this.getPensionTransfer();
			this.getPensionWithdraw();
		},
		onShow() {
			getUserInfoAPI().then(res => {
				this.userInfo = res.data.data;
				if( res.data.data.is_auth == 1 ){
					this.getDT();
				}
				
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
		onReachBottom() {
			// 上拉触底时
			if( this.tabIndex == 1){
				this.page++
				this.getPensionTransfer()				
			}
			if( this.tabIndex == 2){
				this.WithdrawPage++
				this.getPensionWithdraw()				
			}
		},
		methods: {
			getDT(){
				pensionDetailApi().then(res=>{
					if(res.data.data.order_id == 0){
						setTimeout(() => {
							uni.redirectTo({
								url: '/pages/policy/buy?id=' + this.settingInfo.pension.pension_product_id
							})
						}, 100)
					} else {
						this.detail = res.data.data;
						this.typeShow = false;
						this.dtShow  = true;						
					}
				}).catch (err=> {
					// console.log("err.data.code",err.data.code)
					if( err.data.code == -76){
						this.typeShow = true;
						this.dtShow = false;
					} 				})
				pensionWalletApi().then(res => {
					this.typeList = res.data.data;
					this.transfer.money_type = this.typeList[0].id
				})
				pensionRecordApi().then(res => {
					this.pensionRecord = res.data.data;
				})
			},
			getPensionTransfer(){
				pensionTransferRecordApi({page:this.page}).then(res=>{
					let data = res.data.data.data
					if ( data.length > 0 ) {
						this.pensionTransfer = [...this.pensionTransfer, ...data]
					} else {
						uni.$u.toast('数据加载完毕!')
						this.page--
					}
				})
			},
			getPensionWithdraw(){
				pensionWithdrawApi({page:this.WithdrawPage}).then(res=>{
					let data = res.data.data.data
					if ( data.length > 0 ) {
						this.pensionWithdraw = [...this.pensionWithdraw, ...data]
					} else {
						uni.$u.toast('数据加载完毕!')
						this.WithdrawPage--
					}
				})
			},			
			// 验证中文
			containsChinese(str) {
				if (!this.$utils.containsChinese(str)) {
					this.form.name = ''
					uni.$u.toast('请输入正确姓名');
				}
			},
			addSave(){
				if (!this.form.name) {
					return uni.$u.toast('请输入真实姓名');
				}
				if (!this.form.age) {
					return uni.$u.toast('请输入年龄');
				}
				if (!this.form.phone) {
					return uni.$u.toast('请输入联系电话');
				}
				if (!this.form.card_number) {
					return uni.$u.toast('请输入证件号码');
				}
				if (!this.form.city) {
					return uni.$u.toast('请输入城市');
				}
				this.$utils.throttle(() => {
					pensionAddApi({
						...this.form
					}).then(res => {
						uni.$u.toast(res.data.msg);
						// this.getDT();
						setTimeout(() => {
							uni.redirectTo({
								url: '/pages/policy/buy?id=' + this.settingInfo.pension.pension_product_id
							})
						}, 1000)
					})
				}, 2000)()				
			},
			onTransfer(){
				pensionTransferApi({ ...this.transfer }).then(res => {
					this.transferShow = false;
					this.transfer.amount = '';
					this.transfer.security_password = '';
					this.getPensionTransfer();
				})
			},
			typeClick(item, index) {
				this.typeIndex = index
				this.transfer.money_type = item.id
			},
			closeType(){
				uni.navigateBack();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container{ }
	.typeShow{ display: flex; align-items: center; align-content: center; width: 100%; height: 100vh; background: rgba(0, 0, 0, .4);
		.van-dialog{ flex: none; margin: 0 auto;}
	}
	
	.type { display: flex; justify-content: space-between; gap: 30rpx; flex-wrap: wrap;
		.li { flex: 1; min-width: 300rpx; text-align: center; padding: 30rpx 20rpx; border-radius: 20rpx;  background: linear-gradient(to left, rgba(247, 247, 247, 1), rgba(216, 216, 216, .5)); font-weight: 500; color: rgba(17, 24, 38, 1);
			.name{ font-weight: 300; font-size: .8em; line-height: 1; margin-bottom: 10rpx; }
			.num{ line-height: 1; font-weight: bold; }
			.li-box { width: 36rpx; height: 36rpx; border-radius: 36rpx; border: 2rpx solid rgba(177, 177, 177, 1); background: #fff;
			}
		}
		.li.on{ background: linear-gradient(to left, rgba(255, 98, 75, 1), rgba(255, 54, 80, 1)); color: #fff; }
	}
	
	.form { margin-top: -30rpx;
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
					border: 1px solid rgba(206, 213, 218, 1); text-align: left;
	
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
	
	.detail { padding: 0; min-height: 100vh; height: auto;
		.bg{ padding: 30rpx; background: linear-gradient(to bottom, #FF3150 0%, #FF644B 70%, #F0F1F3 100%); height: 800rpx; }
		.main{ padding: 30rpx; color: #040A13; margin-top: -800rpx;  
			.title{ color: #fff; font-size: 1.4em; font-weight: bold; text-align: center; margin-bottom: 30rpx;}
			::v-deep .header{ padding: 0; height: 60rpx; margin:0 -30rpx 30rpx; }
		}
		.content{  
			.box{ background: #fff; padding: 30rpx; border-radius: 20rpx; margin-bottom: 30rpx; position: relative;
				.more{ position: absolute; right: 20rpx; border: 2rpx solid rgba(255, 55, 79, .2); padding: 5rpx 10rpx; font-size: .8em; border-radius: 10rpx; color: rgba(255, 55, 79, 1); background: rgba(255, 55, 79, .1); }
			}
			.mine{ margin-bottom: 30rpx;
				.name{ font-weight: bold; font-size: 1.2em; }
			}
			.card{ display: flex; flex-wrap: wrap; margin-bottom: 30rpx;
				.item{ width: 50%; margin-bottom: 30rpx;
					.desc{}
					.num{ color: rgba(255, 55, 79, 1); font-size: 1.2em;}
					.b{font-weight: bold;font-size: 1.4em;}
				}
			}
			.btn{  display: flex; gap: 30rpx; 
				.sbtn{ flex: 1; background: #FF3650; background: linear-gradient(to left, #FF624B, #FF3650); color: #fff; text-align: center; padding: 20rpx; border-radius: 20rpx; box-shadow: 0 2rpx 5rpx rgba(255, 77, 77, 0.30);  
					.u-icon{display: inline-block; width: 40rpx; height: 40rpx; margin-right: 20rpx; vertical-align: middle; }
				}
			}
			.btn2{ display: flex; gap: 30rpx; margin-bottom: 30rpx;
				.sbtn{ flex: 1; background: rgba(240, 241, 243, 1); background: linear-gradient(to left, rgba(240, 241, 243, 1), rgba(240, 241, 243, 1)); text-align: center; padding: 20rpx; border-radius: 20rpx;  }
				.on{ background: linear-gradient(to left, #FF624B, #FF3650); color: #fff; }
			}
			.list{ text-align: center;
				.tit{ display: flex; margin-bottom: 30rpx; padding-bottom: 30rpx; border-bottom: 2rpx solid #e5e5e5;
					.name{ width: 40%; }
					.status{ width: 60%; }
					.text{ width: 70%; }
					.num{ width: 30%; }
				}
				.item{ display: flex; align-items: center; padding: 20rpx 0; 
					.name{ width: 40%; }
					.status{ width: 60%; }
					.text{ width: 70%; font-size: .8em;
						.createtime{ opacity: .7; margin-left: 10rpx;  }
					}
					.num{ width: 30%; color: rgba(255, 55, 79, 1); font-weight: bold; }
					
					.succeed {
						color: rgba(47, 146, 0, 1);
					}
					
					.fail {
						color: rgba(250, 60, 49, 1);
					}
					
					.audit {
						color: rgba(255, 92, 0, 1);
					}
				}
			}
		}
	}
	
	.scroll { line-height: 80rpx; overflow: hidden;	}
	.scroll-content { display: flex; flex-direction: column; animation: verticalScroll linear infinite;
		.item {
		  height: 80rpx;
		}
	}
	@keyframes verticalScroll {
	  0% {
	    transform: translateY(0); 
	  }
	  100% {
	    transform: translateY(-50%);
	  }
	}
	.scroll:hover .scroll-content { animation-play-state: paused;	}
</style>