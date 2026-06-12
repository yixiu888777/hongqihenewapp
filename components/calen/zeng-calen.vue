<template>
	<view>
		<!-- 日期选择器 -->
		<view class="content">
			<view class="calendar-wrapper">
				<!-- 选择月份 -->
				<!-- <view class="header" v-if="headerBar">
					<view class="iconfont iconarrow-left-bold pre" @click="changeMonth('pre')">
						<u-icon name="arrow-left" bold color="rgba(90, 98, 116, 1)"></u-icon>
					</view>
					<view class="moon">{{y+'年'+formatNum(m)+'月'}}</view>
					<view class="iconfont iconarrow-left-bold-copy next" @click="changeMonth('next')">
						<u-icon name="arrow-right" bold color="rgba(90, 98, 116, 1)"></u-icon>
					</view>
				</view> -->
				<!-- 星期栏 -->
				<!-- <view class="week">
					<view class="week-day" v-for="(item, index) in weekDay" :key="index">{{ item }}</view>
				</view> -->
				<!-- 日历数字 -->
				<view class="content" :style="{ height: height }">
					<view :style="{ top: positionTop + 'rpx' }" class="days">
						<view class="item" v-for="(item,index) in dates" :key="index" :class="{ no: !item.isCurM}">
							<!-- <view class="iconfont iconyixuanzhong"
								:class="{markDays:getChoose(`${item.year}-${item.month}-${item.date}`)}"
								v-if="getChoose(`${item.year}-${item.month}-${item.date}`) && !isMarkDay(item.year, item.month, item.date)&&item.isCurM">
								<image src="./yes.svg" mode="widthFix"></image>
							</view> -->
							<view class="iconfont iconyixuanzhong markDays" v-if="getChooseSign(`${item.year}-${item.month}-${item.date}`)">{{item.date}}
								<!-- <image src="./yes.svg" mode="widthFix"></image> -->
							</view>
							<!-- <view class="sinshow on" v-else-if="new Date(`${item.year}-${item.month}-${item.date}`).getTime() >= create_date && new Date(`${item.year}-${item.month}-${item.date}`).getTime() < new Date(`${yy}-${mm}-${dd}`).getTime() && item.month == m" @click="onSin(`${item.year}-${item.month}-${item.date}`)">
								<view class="day">{{item.date}}</view>
								<view class="sin">补签</view>
							</view> -->
							<view class="day" @click="selectOne(item, $event)" v-else :class="{
								nolm: !item.isCurM,//不在本月的日
					            today: isToday(item.year, item.month, item.date),//当日日期
					          }">
								{{item.date}}
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 补签 -->
		<u-popup :show="bqShow" mode="center" round="32" @close="bqShow=false">
			<view class="van-dialog van-dialog2">
				<view class="van-dialog__header">提示</view>
				<view class="van-dialog__content">
					<view>{{rewardInfo.prize_tips}}</view>
					<view>{{rewardInfo.lx_tips}}</view>
				</view>
				<view class="van-dialog__footer">
					<view class="button" @click="$utils.toPage(`/pages/mine/singIn/history`)">查看奖励</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>
<script>
	import {
		signInSupplementaryAPI,
		signInfoAPI
	} from '@/api/api.js'
	export default {
		props: {
			// 星期几为第一天(0为星期日)
			weekstart: {
				type: Number,
				default: 0
			},
			// 标记的日期
			markDays: {
				type: Array,
				default: () => {
					return [];
				}
			},
			//是否展示月份切换按钮
			headerBar: {
				type: Boolean,
				default: true
			},
			//过去日期是否不可点击
			disabledAfter: {
				type: Boolean,
				default: false
			},
			//接收用户选择的参数
			actDay: {
				type: Array,
				default: [],
			},
			//接受已经被选择的参数
			chooseDay: {
				type: Array,
				default: [],
			},
		},
		data() {
			return {
				weektext: ['日', '一', '二', '三', '四', '五', '六'],
				y: new Date().getFullYear(), // 年
				m: new Date().getMonth() + 1, // 月
				d: new Date().getDate(), //日
				dates: [], // 当前月的日期数据
				positionTop: 0,
				choose: '',
				chooseArr: [],
				settingInfo: uni.getStorageSync('settingInfo'),
				ymd: Date.now(),
				yy: new Date().getFullYear(), // 年
				mm: new Date().getMonth() + 1, // 月
				dd: new Date().getDate(), //日
				signInfo: [],
				signInfoNum: 0,
				create_date: '',
				rewardInfo: {
					lx_tips: ''
				}, // 签到成功数据
				bqShow: false,
				sinShow: false
			}
		},
		created() {
			this.dates = this.monthDay(this.y, this.m);
		},
		mounted() {
			// 获取签到信息
			// signInfoAPI({month:`${this.y}-${this.m}`}).then(res => {
			// 	// console.log("signInfoAPIsignInfoAPI",res.data.data)
			// 	this.signInfo = res.data.data;
			// 	this.signInfoNum = res.data.data.date.length
			// 	this.create_date = new Date(res.data.data.create_date).getTime()
			// })
			this.getSignInfo();
		},
		computed: {
			// 顶部星期栏
			weekDay() {
				return this.weektext.slice(this.weekstart).concat(this.weektext.slice(0, this.weekstart));
			},
			height() {
				return (this.dates.length / 7) * 100 + 'rpx';
			}
		},
		methods: {
			getSignInfo() {
				// console.log("signInfoAPIsignInfoAPI")
				// 获取签到信息
				signInfoAPI({ month: `${this.y}-${this.m}` }).then(res => {
					// console.log("signInfoAPIsignInfoAPI",res.data.data,res.data.data.date.length)
					this.signInfo = res.data.data;
					this.signInfoNum = res.data.data.date.length
					this.create_date = new Date(res.data.data.create_date).getTime()
				})
			},
			// 补签
			onSin(e) {
				// console.log("getSignInRecord",e)
				if (this.signInfo.supplementary_card > 0) {
					signInSupplementaryAPI({ date: e }).then(res => {
						this.rewardInfo = res.data.data
						uni.showToast({
							title: res.data.data.lx_tips,
							duration: 2000
						});
						if (this.rewardInfo.is_prize) {
							this.bqShow = true;
						}
						this.getSignInfo();
						this.$emit('custom-event');
					})
				} else {
					uni.showToast({
						title: '没有可用补签卡',
						icon: 'none',
						duration: 2000
					});
				}
			},
			// 已签到信息
			getChooseSign(day) {
				// setTimeout(() => {
				for (let i = 0; i < this.signInfoNum; i++) {
					// if (i == this.signInfoNum-1) {
					// 	this.sinShow = true;
					// }
					if (day == this.signInfo.date[i]) {
						return true;
					}
				}
				// }, 1000);			
			},
			//已被投标的日期
			getChoose(day) {
				for (let i = 0; i < this.chooseDay.length; i++) {
					if (day == this.chooseDay[i]) {
						return true;
					}
				}
			},
			//用户选择的日期
			getActday(day) {
				for (let i = 0; i < this.actDay.length; i++) {
					if (day == this.actDay[i] && !this.getChoose(day)) {
						return true;
					}
				}
			},
			formatNum(num) {
				let res = Number(num);
				return res < 10 ? '0' + res : res;
			},
			getToday() {
				let date = new Date();
				let y = date.getFullYear();
				let m = date.getMonth();
				let d = date.getDate();
				let week = new Date().getDay();
				let weekText = ['日', '一', '二', '三', '四', '五', '六'];
				let formatWeek = '星期' + weekText[week];
				let today = {
					date: y + '-' + this.formatNum(m + 1) + '-' + this.formatNum(d),
					week: formatWeek
				};
				return today;
			},
			// 获取当前月份数据
			monthDay(y, month) {
				let dates = [];
				let m = Number(month);
				let firstDayOfMonth = new Date(y, m - 1, 1).getDay(); // 当月第一天星期几
				let lastDateOfMonth = new Date(y, m, 0).getDate(); // 当月最后一天
				let lastDayOfLastMonth = new Date(y, m - 2, 0).getDate(); // 上一月的最后一天
				let weekstart = this.weekstart == 7 ? 0 : this.weekstart;
				let startDay = (() => {
					// 周初有几天是上个月的
					if (firstDayOfMonth == weekstart) {
						return 0;
					} else if (firstDayOfMonth > weekstart) {
						return firstDayOfMonth - weekstart;
					} else {
						return 7 - weekstart + firstDayOfMonth;
					}
				})();
				let endDay = 7 - ((startDay + lastDateOfMonth) % 7); // 结束还有几天是下个月的
				for (let i = 1; i <= startDay; i++) {
					dates.push({
						date: this.formatNum(lastDayOfLastMonth - startDay + i),
						day: weekstart + i - 1 || 7,
						month: m - 1 >= 0 ? this.formatNum(m - 1) : 12,
						year: m - 1 >= 0 ? y : y - 1
					});
				}
				for (let j = 1; j <= lastDateOfMonth; j++) {
					dates.push({
						date: this.formatNum(j),
						day: (j % 7) + firstDayOfMonth - 1 || 7,
						month: this.formatNum(m),
						year: y,
						isCurM: true, //是否当前月份
					});
				}
				for (let k = 1; k <= endDay; k++) {
					dates.push({
						date: this.formatNum(k),
						day: (lastDateOfMonth + startDay + weekstart + k - 1) % 7 || 7,
						month: m + 1 <= 11 ? this.formatNum(m + 1) : 0,
						year: m + 1 <= 11 ? y : y + 1
					});
				}
				return dates;
			},
			isWorkDay(y, m, d) {
				//是否工作日
				let ymd = `${y}/${m}/${d}`;
				let formatDY = new Date(ymd.replace(/-/g, '/'));
				let week = formatDY.getDay();
				if (week == 0 || week == 6) {
					return true;
				} else {
					return true;
				}
			},
			isFutureDay(y, m, d) {
				//是否未来日期
				let ymd = `${y}/${m}/${d}`;
				let formatDY = new Date(ymd.replace(/-/g, '/'));
				let showTime = formatDY.getTime();
				let curTime = new Date().getTime();
				if (showTime > curTime) {
					return true;
				} else {
					return false;
				}
			},
			// 标记日期
			isMarkDay(y, m, d) {
				let flag = false;
				for (let i = 0; i < this.markDays.length; i++) {
					let dy = `${y}-${m}-${d}`;
					if (this.markDays[i] == dy) {
						flag = true;
						break;
					}
				}
				return flag;
			},
			isToday(y, m, d) {
				let checkD = y + '-' + m + '-' + d;
				let today = this.getToday().date;
				if (checkD == today) {
					return true;
				} else {
					return false;
				}
			},
			// 点击回调
			selectOne(i, event) {
				let date = `${i.year}-${i.month}-${i.date}`;
				let selectD = new Date(date).getTime();
				let curTime = new Date().getTime();
				let week = new Date(date).getDay();
				let weekText = ['日', '一', '二', '三', '四', '五', '六'];
				let formatWeek = '星期' + weekText[week];
				let response = {
					date: date,
					week: formatWeek
				};
				if (!i.isCurM) {
					return false;
				}
				if (selectD < curTime) {
					if (this.disabledAfter) {
						return false;
					} else {
						this.choose = date;
						this.$emit('onDayClick', response);
					}
				} else {
					this.choose = date;
					this.chooseArr.push(date)
					this.$emit('onDayClick', response);
				}
			},
			//改变年月
			changYearMonth(y, m) {
				this.dates = this.monthDay(y, m);
				this.y = y;
				this.m = m;
			},
			changeMonth(type) {
				if (type == 'pre') {
					if (this.m + 1 == 2) {
						this.m = 12;
						this.y = this.y - 1;
					} else {
						this.m = this.m - 1;
					}
				} else {
					if (this.m + 1 == 13) {
						this.m = 1;
						this.y = this.y + 1;
					} else {
						this.m = this.m + 1;
					}
				}
				this.getSignInfo();
				this.dates = this.monthDay(this.y, this.m);
				this.$emit("changeMonth", this.y, this.m);
			},
		}
	}
</script>
<style lang="scss" scoped>
	.content {
		padding: 0;
		.calendar-wrapper {
			color: #6f6d6d;
			font-size: 28rpx;
			text-align: center;
			// background-color: #fff;
			padding-bottom: 10rpx;
			border-radius: 20rpx;
			.header {
				position: relative;
				// display: flex; 
				// align-items: center;
				// justify-content: center;
				height: 72rpx;
				font-weight: 400;
				line-height: 40rpx;
				text-align: left;
				color: rgba(27, 28, 30, 1);
				.moon {
					font-weight: bold;
					padding-top: 10rpx;
					font-size: 36rpx;
				}
				.pre,
				.next {
					position: absolute;
					top: 0;
					width: 50rpx;
					height: 50rpx;
					padding: 10rpx;
					border-radius: 50rpx;
					background: #F3F4F6;
					text-align: center;
				}
				::v-deep .u-icon__icon {
					font-size: 24rpx !important;
					padding: 0;
					margin: 0;
					padding-left: 4rpx;
				}
				.pre {
					right: 70rpx;
				}
				.next {
					right: 0;
				}
			}
			.week {
				display: flex;
				align-items: center;
				margin-top: 20rpx;
				height: 72rpx;
				line-height: 72rpx;
				font-family: Roboto;
				font-size: 24rpx;
				font-weight: 400;
				line-height: 40rpx;
				color: rgba(27, 28, 30, 1);
				view {
					flex: 1;
				}
			}
			.content {
				position: relative;
				overflow: hidden;
				transition: height 0.4s ease;
				padding: 0;
				.days {
					transition: top 0.3s;
					display: flex;
					align-items: center;
					flex-wrap: wrap;
					position: relative;
					.item {
						position: relative;
						display: block;
						padding: 10rpx;
						width: 90rpx;
						height: 90rpx;
						line-height: 90rpx;
						display: flex;
						justify-content: center;
						align-items: stretch;
						margin-top: 10rpx;
						.day {
							flex: none;
							font-style: normal;
							vertical-align: middle;
							overflow: hidden;
							width: 70rpx;
							height: 70rpx;
							line-height: 70rpx;
							margin: 0 auto;
							text-align: center;
							font-size: 30rpx;
							font-weight: 400;
							color: rgba(27, 28, 30, 1);
							background: rgba(246, 42, 45, 0.20);
							border-radius: 50rpx;
							color: rgba(246, 42, 45, 1);
							&.nolm {
								background: rgba(0, 0, 0, 0.10);
								color: rgba(153, 153, 153, 1);
							}
							&.today {
								background: rgba(246, 42, 45, 1);
								border-radius: 50rpx;
								color: #fff;
							}
						}
						.sinshow {
							position: relative;
							width: 70rpx;
							.sin {
								background: rgba(246, 42, 45, 1);
								color: #fff;
								font-size: .6em;
								border-radius: 50rpx;
								width: 70rpx;
								height: 70rpx;
								position: absolute;
								line-height: 70rpx;
								visibility: hidden;
							}
						}
						.sinshow.on {
							.day {
								background: rgba(246, 42, 45, 1);
								color: #fff;
							}
							.sin {
								visibility: visible;
							}
						}
						.markDays {
							display: flex;
							justify-content: center;
							align-items: center;
							background: rgba(246, 42, 45, 1);
							color: #fff;
							border-radius: 50%;
							flex: 1;
							position: absolute;
							z-index: 9;
							width: 70rpx;
							height: 70rpx;
							&>image {
								width: 34rpx;
								height: 34rpx;
							}
						}
					}
					.item.no {
						display: none;
					}
				}
			}
		}
		// }
	}
</style>