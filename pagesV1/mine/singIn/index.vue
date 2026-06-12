<template>
	<view class="container" style="background:#c8131e url(/static/new/bg.jpg) no-repeat center top / 100%;">
		<headerView>
			<template #leftIcon><u-icon name="arrow-left" color="#fff" size="24"></u-icon></template>
			<view>红旗河打卡中心</view>
		</headerView>
		<view class="content">
			<view class="main">
				<view class="tips">
					<view class="item">剩余补签卡 {{signInfo.supplementary_card}} 张</view>
					<view class="item">我的积分:{{signInfo.points}}分</view>
				</view>
				<view class="title">每日签到可获得现金、积分、抽奖机会</view>
				<view class="calendar">
					<zeng-calen :actDay="actDay" :chooseDay="chooseDay" @changeMonth="changeMonth" @custom-event="getSignInRecord" ref="childComponent"></zeng-calen>
					<!-- <view :class="isBtn?'button':'button no'" @click="isBtn?onDayClick():''"><image src="/static/new/cc1.png" mode="heightFix"></image> {{isBtn?'签到':'今日已签到'}}</view> -->
				</view>
				<view class="title">成长进度/升级档位</view>
				<view class="progress">
					<view class="text">直推 {{signInfo.sign_people}}/{{signInfo.sign_upgrade_people}}人</view>
					<view class="line"><u-line-progress :percentage="signInfo.sign_people/signInfo.sign_upgrade_people*100" activeColor="#F62A2D" inactiveColor="rgba(246, 42, 45, .2)" :showText="false"></u-line-progress></view>
					<view class="num">{{Math.floor(signInfo.sign_people/signInfo.sign_upgrade_people*100)}}%</view>
				</view>
				<view class="title">
					下档奖励升级: <text class="red">{{signInfo.min_price}}~{{signInfo.max_price}}</text> 元 <br>
					今日收入: <text class="red">{{signInfo.sign_price}}</text> 元</view>
				<view class="btn_1">
					<view class="item text">连续签到:{{signInfo.sign_num || 0}}天</view>
					<view class="item btn" @click="onPoints">领取积分</view>
				</view>
				<view class="jf">
					<view class="item" :class="signInfo.sign_num >= item.day?'on':''" v-for="(item,index) in signInfo.sign_points"><u-icon name="checkmark-circle-fill"></u-icon> <text>{{item.day}}天→ {{item.points}}积分</text></view>
				</view>
			</view>
			<view class="rule">
				<view class="rule_title">签到规则</view>
				<view class="rule_content" v-html="settingInfo.text.sign_rule"></view>
			</view>
			<view class="btn_2">
				<view class="item" @click="onSup()"><image src="/static/new/ca1.png" mode="heightFix"></image> <text>补签</text></view>
				<view class="item" @click="isBtn?onDayClick():''"><image src="/static/new/ca2.png" mode="heightFix"></image> <text>{{isBtn?'签到':'今日已签到'}}</text></view>				
			</view>
			<!-- <view class="card">
				<view class="title">
					<view class="tit">
						<view class="h2">补签卡</view>
						<view class="desc">完成任务获得补签卡</view>
					</view>
					<view class="more"><image src="/static/new/cc2.png" mode="heightFix"></image> {{signInfo.supplementary_card}} 张</view>
				</view>
				<view class="list">
					<view class="item" v-for="(item,index) in signInfo.sign_task" :key="index">
						<view class="icon"><image :src="item.icon" mode="widthFix"></image></view>
						<view class="text">
							<view class="h3">{{item.title}}</view>
							<view class="desc">+{{item.count}} 补签卡</view>
						</view>
						<view class="btn" @tap="$utils.toPage(item.url)">去完成</view>
					</view>
				</view>
			</view> -->
		</view>
		
		
		<u-popup :show="supShow" mode="center" round="32" :closeable="true" @close="supShow = false" style="z-index: 1000;">
			<view class="supBox">
				<view class="data">
					<view class="mouth" @click="pickerRef = true">
						<text>选择月份：{{this.supMonth}}</text>
						<u-icon name="arrow-down"></u-icon>
					</view>
					<radio-group @change="dayChange" class="day" v-if="supList.length > 0">
						<label class="item" :class="dayIndex==index?'on':''" v-for="(item,index) in supList" :key="index">
							<text>{{item}}</text>
							<radio :value="String(index)" :checked="dayIndex == index" activeBackgroundColor="rgba(0, 0, 0, 1)" style="transform:scale(0.7)" />
						</label>
					</radio-group>
					<u-empty mode="data" v-else></u-empty>
					<view class="btn" @click="onSupDay" v-if="supList.length > 0"><u-icon name="calendar-fill" size="30" color="#fff"></u-icon>补签</view>
				</view>
			</view>
		</u-popup>
		
		<u-popup :show="pickerRef" type="bottom" @close="pickerRef = false" style="z-index: 1100;">
			<view class="picker-area">
				<view class="picker-area-hd">
					<view class="picker-area-btn">
						<view class="sbtn" @click="Cancel">取消</view>
						<view class="text">请选择日期</view>
						<view class="sbtn confirm" @click="Confirm">确定</view>
					</view>
				</view>
				<view class="picker-area-bd">
					<picker-view class="picker-view" indicator-class="picker-view-selected" :value="dateList.selectIndex" @change="bindChange">
						<picker-view-column>
							<view class="picker-item" v-for="(item,index) in dateList.calendar" :key="index">{{item.year}}年</view>
						</picker-view-column>
						<picker-view-column v-if="dateList.calendar.length > 0">
							<view class="picker-item" v-for="(item,index) in dateList.calendar[dateList.selectIndex[0]].list" :key="index">{{item.month}}月</view>
						</picker-view-column>
					</picker-view>
				</view>
			</view>
		</u-popup>
		
		<!-- 提示 -->
		<u-popup :show="nameShow" mode="center" round="32" @close="nameShow = false">
			<view class="van-dialog">
				<view class="van-dialog__header">提示</view>
				<view class="van-dialog__content">请先完成实名认证！</view>
				<view class="van-dialog__footer">
					<view class="button" @click="toPage('1')">去认证</view>
				</view>
			</view>
		</u-popup>

		<!-- 签到成功获得抽奖提示 -->
		<u-popup :show="lotteryShow" mode="center" round="32" @close="lotteryShow = false">
			<view class="van-dialog">
				<view class="van-dialog__header">签到成功</view>
				<view class="van-dialog__content" v-html="rewardInfo.tips"></view>
				<view class="van-dialog__footer flex_between" v-if="rewardInfo.tips_type==2">
					<view class="btn" @click="lotteryShow = false">取消</view>
					<view class="button" style="width: 207rpx;" @click="toPage('2')">立即使用</view>
				</view>
				<view class="van-dialog__footer flex_between" v-else>
					<view class="button" @click="lotteryShow = false">确定</view>
				</view>
			</view>
		</u-popup>
		
		<!-- 获得礼盒 -->
		<u-popup :show="boxShow" mode="center" round="32" @close="boxShow = false">
			<view class="boxMask">
				<view class="close">
					<image class="img" src="@/static/image/mine/close.png"></image>
				</view>
				<view class="mask_content">
					<view class="title">
						<view>恭喜您</view>
						<view>获得一份礼盒</view>
					</view>
					<view class="btn flex_center" @click="boxClick">打开</view>
				</view>
			</view>
		</u-popup>
		<!-- 现金奖励 -->
		<u-popup :show="priceShow" mode="center" @close="priceShow = false">
			<view class="priceMask">
				<view class="mask_content">
					<view class="hbBox">
						<view class="detail"><text>￥</text>{{rewardInfo.tips_money}}</view>
						<view class="title">现金一份</view>
					</view>
					<view class="btn flex_between">
						<view class="btn_1 btn_item" @click="priceShow = false">关闭</view>
						<view class="btn_2 btn_item" @click="toPage('2')">继续抽奖</view>
					</view>
				</view>
				<view class="close" @click="priceShow = false">
					<image class="img" src="@/static/img/close.svg"></image>
				</view>
			</view>
		</u-popup>
		<!-- 签到 -->
		<u-popup :show="qdShow" mode="center" round="32" :closeable="true" @close="qdShow=false">
			<view class="van-dialog van-dialog2">
				<view class="van-dialog__header">提示</view>
				<view class="van-dialog__content">
					<view>{{rewardInfo.prize_tips}}</view>
					<view>{{rewardInfo.lx_tips}}</view>
				</view>
				
				<!-- <view class="van-dialog__footer">
					<view class="button" @click="$utils.toPage(`/pages/mine/singIn/history`)" v-if="rewardInfo.sign_reward_type == 1">查看奖励</view>
					<view class="button" @click="toLoads(settingInfo.service.service_url)" v-if="rewardInfo.sign_reward_type == 2">领取奖励</view>
				</view> -->
				<!-- 连续签到 -->
			</view>
		</u-popup>
		<!-- 是否实名认证 -->
		<Real-Name></Real-Name>
	</view>
</template>

<script>
	import { getUserInfoAPI, signInAPI, signInRecordAPI, supplementaryAPI, pointsAPI, signInSupplementaryAPI } from '@/api/api.js';
	import zengCalen from '@/components/calen/zeng-calen.vue';
	export default {
		components: {
			zengCalen
		},
		data() {
			return {
				isPageShow: false,
				settingInfo: uni.getStorageSync('settingInfo'),
				ruleShow: false, // 规则弹窗
				day: '', //当前日
				supList: [], // 获取补签日期
				dayIndex: 0,
				supMonthList: [], // 获取补签月
				supMonth: '', // 选择补签月
				supDay: '', // 选择补签日期
				signInfo: { }, // 签到信息
				chooseDay: [], // 签到日期
				isBtn: true, // 今日是否签到

				nameShow: false, // 实名认证
				supShow: false, // 补签
				rewardInfo: {}, // 签到成功数据
				qdShow: false, // 签到成功奖励
				
				actDay: [], //用户选择的日期
				lotteryShow: false, // 签到成功获得抽奖提示弹窗
				boxShow: false, // 获得礼盒弹窗
				priceShow: false, // 现金奖励弹窗
				
				
				dateList:{
					calendar:[],
					selectIndex: [0,0],
					oldYear: 0,
					oldMonth: 0,
					newYear: 0,
					newMonth: 0					
				},
				pickerRef: false
			};
		},
		onLoad() {
			this.getCurrentYearMonth();
			this.getSignInRecord();
			this.getSup();
		},
		methods: {
			getCurrentYearMonth() {
			  const now = new Date();
			  const year = now.getFullYear();
			  const month = (now.getMonth() + 1).toString().padStart(2, '0');
			  const day = now.getDate(); // 日（1-31）
			  this.supMonth = `${year}-${month}`
			  this.day = `${year}-${month}-${day}`
			  // console.log("supMonth",this.supMonth)
			  // return `${year}-${month}`;
			},
			toPage(type) {
				if (type == 1) {
					this.nameShow = false
					this.$utils.toPage('/pages/mine/realName')
				} else {
					this.lotteryShow = false
					this.priceShow = false
					this.$utils.toPage('/pages/mine/singIn/lottery')
				}
			},
			boxClick(){
				this.boxShow = false
				this.priceShow = true
			},
			// 格式化日期
			formatNum(num) {
				let res = Number(num);
				return res < 10 ? '0' + res : res;
			},
			// 已签到天数
			getSignInRecord() {
				// console.log("getSignInRecord")
				signInRecordAPI({
					month: `${new Date().getFullYear()}-${this.formatNum(new Date().getMonth() + 1)}`
				}).then(res => {
					this.signInfo = res.data.data
					this.chooseDay = res.data.data.date
					this.chooseDay.forEach(item => {
						if (item == `${new Date().getFullYear()}-${this.formatNum(new Date().getMonth() + 1)}-${this.formatNum(new Date().getDate())}`) {
							this.isBtn = false
						}
					})
					this.getDate()
				})
			},
			getSup() {
				supplementaryAPI({month:this.supMonth}).then(res => {
					this.supList =  res.data.data.list;
					this.dayIndex = 0;
					this.supDay = res.data.data.list[0]
				})
			},
			changeMonth(y, m) {
				signInRecordAPI({
					month: `${y}-${this.formatNum(m)}`
				}).then(res => {
					this.chooseDay = res.data.data.date
				})
			},
			onPoints() {
				// 领取积分
				pointsAPI().then(res => {
					uni.$u.toast(res.data.data)
				})
			},
			// 立即签到
			onDayClick() {
				this.$utils.throttle(() => {
					// 判断实名认证
					getUserInfoAPI().then(res => {
						if (res.data.data.is_auth == 1) {
							// 签到
							signInAPI().then(res => {
								this.rewardInfo = res.data.data
								if(res.data.data.is_prize){
									this.qdShow = true;
								}
								setTimeout(()=> {
									this.$refs.childComponent.getSignInfo();
									this.getSignInRecord()
								}, 1000)
							})
						} else {
							this.nameShow = true
						}
					})
				}, 1000)()
			},
			onSup(){
				this.supShow = true;
				
			},
			onSupDay(){
				// 补签
				// console.log("ssss",this.supDay)
				signInSupplementaryAPI({date:this.supDay}).then(res => {
					uni.$u.toast(res.data.msg);
					this.dateList.calendar = []
					setTimeout(()=> {
						this.$refs.childComponent.getSignInfo();
						this.getSignInRecord()
						this.getSup();
					}, 1000)
				})
			},
			// 跳转在线客服
			toLoads(url) {
				uni.navigateTo({
					url: `/pages/noPage/index?url=${url.split("&").join("$")}`
				})
			},
			getDate(type) {
				// var personal = uni.getStorageSync('personal')
				const oldDate = this.signInfo.create_date; //'2015-10-16 19:32:01' //this.userInfo.create_time;
				
				this.dateList.oldYear = Number(oldDate.slice(0,4));
				this.dateList.oldMonth = Number(oldDate.slice(5,7));
				// console.log("oldYear",dateList.oldYear,dateList.oldMonth)
				const newDate = new Date();
				this.dateList.newYear = newDate.getFullYear();
				// console.log("year",year)
				this.dateList.newMonth = newDate.getMonth() + 1;
				var i = 0
				for (let y = this.dateList.oldYear; y <= this.dateList.newYear; y++) {
					this.dateList.calendar.push({'year': y,'list':[]})
					var ii = i++
					if( y == this.dateList.oldYear && y == this.dateList.newYear){
						for (let m = this.dateList.oldMonth; m <= this.dateList.newMonth ; m++) {
						// console.log("yearyear",i++)
							this.dateList.calendar[ii].list.push({'month': m})
						}					
					} else if ( y == this.dateList.oldYear){
						for (let m = this.dateList.oldMonth; m <= 12 ; m++) {
							this.dateList.calendar[ii].list.push({'month': m})
						}					
					} else if( y == this.dateList.newYear ){
						for (let m = 1; m <= this.dateList.newMonth ; m++) {
							this.dateList.calendar[ii].list.push({'month': m})
						}
					} else {
						for (let m = 1; m <= 12 ; m++) {
							this.dateList.calendar[ii].list.push({'month': m})
						}
					}
				}
			},
			bindChange(e){
				// console.log("bindChange",e)
				this.dateList.selectIndex = e.detail.value
			},
			Cancel(e){
				this.pickerRef = false;
			},
			Confirm(e){
				let year = this.dateList.calendar[this.dateList.selectIndex[0]].year;
				let month = this.dateList.calendar[this.dateList.selectIndex[0]].list[this.dateList.selectIndex[1]].month;
				this.supMonth = year + '-' + month;
				this.pickerRef = false;
				this.getSup();
			},
			dayChange(e) {
				// console.log("dayChange", this.supList[e.detail.value] )
				this.dayIndx = e.detail.value; 
				this.supDay = this.supList[this.dayIndx]
			},
		}
	}
</script>

<style lang="scss">	
	.content { padding:0 30rpx 30rpx;
		.main{ background: #fff; border-radius: 20rpx; padding:30rpx; margin-bottom: 30rpx;
			.title{text-align: center; font-weight: bold; margin-bottom: 30rpx;
				.red{ color: rgba(246, 42, 45, 1);}
			}
			.progress{ display: flex; align-items: center; margin-bottom: 30rpx;
				.text{}
				.line{ flex: 1; padding: 0 10rpx;}
				.num{}
			}
			.btn_1{display: flex; gap: 30rpx; margin-bottom: 30rpx;  justify-content: center; align-items: center;
				.item{ flex: 1;}
				.text{ color: rgba(246, 42, 45, 1); font-weight: bold;}
				.btn{background: rgba(246, 42, 45, 1); color: #fff;padding:30rpx 20rpx; border-radius: 20rpx;text-align: center;}
			}
			.jf{ display: flex;  justify-content: center; align-items: center; flex-wrap: wrap;
				.item{ min-width: 300rpx; flex: 1; color: rgba(4, 10, 19, .4);display: flex; align-items: center;
					::v-deep .u-icon__icon{ color: rgba(4, 10, 19, .4) !important;}
					text{padding-left: 10rpx;}
				}
				.on{color: rgba(246, 42, 45, 1);
					::v-deep .u-icon__icon{ color: rgba(246, 42, 45, 1) !important;}
				}
			}
		}
		.btn_2{display: flex; gap: 30rpx; margin-bottom: 30rpx; justify-content: center; align-items: center; text-align: center;
			.item{ display: flex; justify-content: center; align-items: center; flex: 1; background: #fff; padding:30rpx 20rpx; border-radius: 20rpx;color: rgba(246, 42, 45, 1); font-weight: bold;
				image{ height: 30rpx; display: block; margin-right: 10rpx;}
				text{}
			}
		}
		.tips { display: flex; gap: 30rpx; margin-bottom: 30rpx; 
			.item{ background: rgba(246, 42, 45, .2); padding:30rpx 20rpx; border-radius: 20rpx; width: 345rpx; text-align: center; flex: 1; color: rgba(246, 42, 45, 1); font-weight: 500;
				.desc{ font-size: .8em; margin-bottom: 10rpx;}
				.num{ color: #FF374F; font-size: 1.6em; font-weight: bold;}
			}
		}

		.calendar { margin-bottom: 30rpx;
			border-radius: 20rpx;
			background: #fff; 
			.button { margin-bottom: 30rpx;
				height: 90rpx;
				border-radius: 20rpx;
				background: linear-gradient(to left, #FF624B, #FF3650);
				image{ height: 40rpx; margin-right: 10rpx;}
			}

			.no {
				opacity: 0.5;
			}
		}

		.rule { background: #F9FAFB; padding: 30rpx; border-radius: 20rpx; margin-bottom: 90rpx;
			.rule_title { font-weight: bold; font-size: .8em; }

			.rule_content { opacity: 0.8; font-size: .8em; }
		}
	}

	.van-cha {
		width: 48rpx;
		height: 48rpx;
		position: absolute;
		right: -34rpx;
		top: -50rpx;
	}

	
	.priceMask {
		.mask_content {
			width: 540rpx;
			height: 546rpx;
			background: url("@/static/img/gift_mask.png") no-repeat center / cover;
			text-align: center;
			position: relative;
			padding: 1rpx;
			
			.hbBox {
				width: 172rpx;
				height: 198rpx;
				background: url("@/static/img/hb.png") no-repeat center / cover;
				margin: 86rpx auto 0;
				padding-top: 84rpx;
				
				.detail {
					font-family: Roboto;
					font-weight: 400;
					font-size: 48rpx;
					line-height: 56rpx;
					color: rgba(255, 255, 255, 1);
					
					text {
						font-size: 24rpx;
						line-height: 28rpx;
					}
				}
				
				.title {
					font-family: Roboto;
					font-weight: 400;
					font-size: 28rpx;
					line-height: 38rpx;
					color: rgba(255, 223, 78, 1);
				}
			}
			
			.btn {
				position: absolute;
				left: 50%;
				bottom: 56rpx;
				transform: translateX(-50%);
	
				.btn_item {
					width: 210rpx;
					height: 72rpx;
					border: 1px solid #FCE1BA;
					font-family: Roboto;
					font-size: 14px;
					font-weight: 400;
					border-radius: 40rpx;
					color: #F2370D;
					display: flex;
					justify-content: center;
					align-items: center;
					background: linear-gradient(270deg, #FAC78E 0%, #FCE1BA 100%);
	
				}
	
				.btn_1 {
					margin-right: 40rpx;
					color: #FCE1BA;
					background: transparent;
				}
			}
		}
	
		.close {
			width: 100%;
			height: 48rpx;
			display: flex;
			justify-content: center;
			margin-top: 62rpx;
	
			.img {
				width: 48rpx;
				height: 48rpx;
			}
		}
	}
	
	.boxMask{
		.close {
			margin-bottom: 34rpx;
			width: 100%;
			height: 48rpx;
			display: flex;
			justify-content: flex-end;
			
			.img {
				width: 48rpx;
				height: 48rpx;
			}
		}
		
		.mask_content {
			width: 273px;
			height: 325.76px;
			background: url("@/static/image/mine/box.png") no-repeat center / cover;
			padding: 326rpx 0 0;
			
			.title{
				font-family: PingFang SC;
				font-size: 40rpx;
				font-weight: 400;
				line-height: 56rpx;
				text-align: center;
				color: rgba(255, 255, 255, 1);
			}
			
			.btn{
				width: 226.1px;
				height: 52.76px;
				border-radius: 20rpx;
				margin: 60rpx auto 0;
				background: rgba(254, 219, 55, 1);
				font-family: PingFang SC;
				font-size: 40rpx;
				font-weight: 400;
				color: rgba(251, 44, 2, 1);
			}
		}
	}
	.card{ background: #fff; padding: 30rpx; border-radius: 20rpx;
		.title{display: flex; align-items: center; margin-bottom: 30rpx;
			.tit{ flex: 1;
				.h2{font-weight: bold; }
				.desc{ opacity: .8; font-size: .8em;}
			}
			.more{padding: 10rpx 20rpx;background: linear-gradient(to left, rgba(255, 98, 75, .1), rgba(255, 54, 80, .1));border-radius: 10rpx; color: #FF374F; font-size: .8em;
				image{ height: 24rpx; display: inline-block; margin-right: 10rpx; vertical-align: middle;}
			}
		}
		.list{
			.item{ padding: 30rpx; margin-bottom: 30rpx; border-radius: 20rpx; display: flex; align-items: center; background: #F9FAFB; font-size: .8em;
				.icon{
					image{ width: 100rpx;}
				}
				.text{ flex: 1; padding: 0 30rpx;  
					.h3{font-weight: bold; margin-bottom: 10rpx;}
				}
				.btn{background: linear-gradient(to left, #FF624B, #FF3650);color: #fff; border-radius: 10rpx; padding: 10rpx 20rpx;}
			}
		}
	}
	.supBox{ background: #fff; border-radius: 20rpx; width: 690rpx;
		.data{ padding: 30rpx;
			.mouth{ display: flex; align-items: center; border-bottom: 2rpx solid #e5e5e5; padding-bottom: 30rpx; margin-bottom: 20rpx;
				text{ margin-right: 20rpx;}
			}
			.day{ display: flex; flex-wrap: wrap; margin-bottom: 30rpx;
				.item{ width: 50%; display: flex; padding: 10rpx 0; align-items: center;
					text{ margin-right: 10rpx;}
				}
			}
			.btn{ color: #fff; background: rgba(246, 42, 45, 1); text-align: center; padding: 20rpx; border-radius: 20rpx; display: flex; justify-content: center; align-items: center; font-weight: bold; }
		}
	}
	
	// 地区选择
	.picker-area {
		background-color: #fff;
		border-radius: 24rpx 24rpx 0 0;
	}
	.picker-area-btn { border-bottom: 1rpx solid var(--border-color);
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 24rpx; line-height: 60rpx;
		.sbtn { padding: 12rpx 24rpx; font-size: 28rpx; color:var(--text-color-desc); }
		.text{ font-weight: 800;}
		.confirm{ color: var(--primary-color);}
	}
	.picker-view {
		width: 100%;
		height: 500rpx;
		.picker-item{ padding:10rpx 20rpx; height: 60rpx;}
		.picker-view-selected{ height: 60rpx; }
	}
</style>