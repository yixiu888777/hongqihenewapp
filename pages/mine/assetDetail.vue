<template>
	<view class="container" style="background:#c8131e url(/static/new/bg.jpg) no-repeat center top / 100%;">
		<headerView>
			<template #leftIcon><u-icon name="arrow-left" color="#fff" size="24"></u-icon></template>
			<view>资金明细</view>
		</headerView>
		<!-- <scroll-view scroll-x class="nav-box flex_center">
				<view class="nav flex">
					<view :class="item.moneytype==typeValue?'active item':'item'" v-for="(item,index) in typeList"
						:key="index" @click="typeClick(item.moneytype)">{{item.name}}</view>
				</view>
			</scroll-view> -->
		<view class="nav">
			<view class="item" :class="typeValue==item.id?'active':''" v-for="item in typeList"
				@click="typeClick(item.id)">{{item.name}}</view>
			<!-- <u-tabs :list="typeList" :current="typeIndex" lineColor="#fff" activeStyle="color: #fff; font-weight: bold;" inactiveStyle="color: #fff;" lineWidth="40" lineHeight="5" @click="click"></u-tabs> -->
		</view>
		<scroll-view scroll-y @scrolltolower="scrollBottom" class="listData">
			<view class="list" v-if="list.length > 0">
				<!-- <view class="title">
					<view class="info">
						<view class="month" @click="onMonth(item.month)">{{ item.month }}
							<view class="iconfont"><u-icon name="arrow-down-fill" color="#fff" size="16"></u-icon></view>
						</view>
					</view>
				</view> -->
				<view class="item" v-for="(item, index) in list" :key="item.index">
					<view class="dl">
						<view class="dt" v-if="item.type_name=='购买股权'">股权变化</view>
						<view class="dt" v-else>余额变化</view>
						<view class="dd price" v-if="item.type_name=='购买股权'">{{ item.money }}股</view>
						<view class="dd price" v-else>￥{{ item.money }}</view>
					</view>
					<view class="dl">
						<view class="dt">类型</view>
						<view class="dd">{{ item.type_name }}</view>
					</view>
					<view class="dl">
						<view class="dt">时间</view>
						<view class="dd">{{ item.createtime }}</view>
					</view>
					<view class="dl">
						<view class="dt">备注</view>
						<view class="dd">{{ item.memo }}</view>
					</view>
				</view>
			</view>
			<view class="m-noData" v-else>
				<u-empty mode="data"></u-empty>
			</view>
			<!-- <uni-load-more iconType="snow" :status="load.status" color="rgba(255,255,255,.5)" /> -->
			<view class="footer">
				<view class="desc" @click="servicesUnit.organizer_url && $utils.toWeb(servicesUnit.organizer_url)">
					主办单位：{{servicesUnit.organizer}}
				</view>
				<view class="desc" @click="servicesUnit.icp_beian_url && $utils.toWeb(servicesUnit.icp_beian_url)">
					ICP备案号：{{servicesUnit.icp_beian}}
				</view>
				<view class="desc"
					@click="servicesUnit.beijin_beian_url && $utils.toWeb(servicesUnit.beijin_beian_url)">
					<image :src="servicesUnit.beijin_beian_img" mode="heightFix" style="height: 50rpx;"></image>
					{{servicesUnit.beijin_beian}}
				</view>
				<view class="desc"
					@click="servicesUnit.technical_support_url && $utils.toWeb(servicesUnit.technical_support_url)">
					技术支持：{{servicesUnit.technical_support}}</view>
			</view>
		</scroll-view>
		<!-- <view class="list2"> 
				<view class="item" v-for="item in list" :key="item.id">
					<view class="flex_between">
						<view>余额变化</view>
						<view :style="{color:item.money>0?'rgba(47, 146, 0, 1)':'rgba(250, 60, 49, 1)'}">{{item.money}}
						</view>
					</view>
					<view class="flex_between">
						<view>类型</view>
						<view>{{item.memo}}</view>
					</view>
					<view class="flex_between">
						<view>时间</view>
						<view>{{item.time_str}}</view>
					</view>
				</view>
			</view> -->
		<!-- <view class="m-noData" v-else>
				<view class="item"> v-if="list.length > 0"
					<view class="icon"><u-icon name="error-circle" color="#fff" size="60"></u-icon></view>				
					<view class="text">暂无数据</view>
				</view>
			</view> -->
		<u-popup :show="pickerRef" type="bottom" @close="pickerRef = false">
			<view class="picker-area">
				<view class="picker-area-hd">
					<view class="picker-area-btn">
						<view class="sbtn" @click="Cancel">取消</view>
						<view class="text">请选择日期</view>
						<view class="sbtn confirm" @click="Confirm">确定</view>
					</view>
				</view>
				<view class="picker-area-bd">
					<picker-view class="picker-view" indicator-class="picker-view-selected"
						:value="dateList.selectIndex" @change="bindChange">
						<picker-view-column>
							<view class="picker-item" v-for="(item,index) in dateList.calendar" :key="index">
								{{item.year}}年
							</view>
						</picker-view-column>
						<picker-view-column v-if="dateList.calendar.length > 0">
							<view class="picker-item"
								v-for="(item,index) in dateList.calendar[dateList.selectIndex[0]].list" :key="index">
								{{item.month}}月
							</view>
						</picker-view-column>
					</picker-view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		userPriceTypeApi,
		userPriceRecordApi,
		servicesUnitApi
	} from '@/api/api.js'
	export default {
		data() {
			return {
				UserInfo: uni.getStorageSync('user_info'),
				servicesUnit: {},
				typeList: [],
				typeValue: '',
				typeIndex: 0,
				data: '',
				page: 1,
				page_size: 10,
				list: [],
				lists: {},
				pagination: {},
				pages: {
					page: 1,
					page_size: 10,
					date: '',
					order: '' // 降序desc 升序asc 
				},
				load: {
					status: 'loading', //more/loading/noMore
				},
				dateList: {
					calendar: [],
					selectIndex: [0, 0],
					oldYear: 0,
					oldMonth: 0,
					newYear: 0,
					newMonth: 0
				},
				pickerRef: false
			};
		},
		onLoad(opt) {
			userPriceTypeApi().then(res => {
				this.typeList = res.data.data
				if (opt.type) {
					if (opt.type == 'total') {
						this.typeValue = this.typeList[0].id
					} else {
						this.typeValue = opt.type;
						this.typeIndex = opt.index;
					}
				} else {
					this.typeValue = this.typeList[0].id
				}
				this.getPriceLog()
				this.getDate()
			})
			const unitconfig = this.getCache('unitconfig');
			if (!unitconfig) {
			   servicesUnitApi().then(res => {
			   	this.servicesUnit = res.data.data
				this.setCache('unitconfig',this.servicesUnit,6000)
			   	//this.isPageShow = true;
			   })
			}else{
				this.servicesUnit = this.getCache('unitconfig');
			}
			/* servicesUnitApi().then(res => {
				this.servicesUnit = res.data.data
				this.isPageShow = true;
			}) */
		},
		onReachBottom() {
			// 上拉触底时
			// console.log("sss")
			this.scrollBottom()
		},
		methods: {
			setCache(key, value, expire = 0) {
			    const data = {
			        value: value,
			        expire: expire ? Date.now() + expire * 1000 : 0 // 秒 → 毫秒
			    };
			    uni.setStorageSync(key, data);
			},
			getCache(key) {
			    const data = uni.getStorageSync(key);
			
			    if (!data) return null;
			
			    // 判断是否有过期时间
			    if (data.expire && data.expire < Date.now()) {
			        uni.removeStorageSync(key); // 删除过期缓存
			        return null;
			    }
			
			    return data.value;
			},
			scrollBottom() {
				this.load.status = 'loading';
				this.page++
				this.getPriceLog()
			},
			getPriceLog() {
				userPriceRecordApi({
					page: this.page,
					page_size: this.page_size,
					money_type: this.typeValue,
				}).then(res => {
					let data = res.data.data.data
					// console.log("priceLogApi",res.data.data.data)
					if (data.length > 0) {
						this.list = [...this.list, ...data]
						this.load.status = 'more';
					} else {
						this.load.status = 'noMore';
						uni.$u.toast('数据加载完毕!')
						this.page--
					}
				})
			},
			typeClick(value) {
				this.typeValue = value
				this.load.status = 'loading';
				this.list = []
				this.page = 1
				this.data = ''
				this.getPriceLog()
			},
			click(item) {
				// console.log('item', item);
				this.typeValue = item.moneytype
				this.typeIndex = item.index
				this.load.status = 'loading';
				this.list = []
				this.page = 1
				this.data = ''
				this.getPriceLog()
			},
			getDate(type) {
				// var personal = uni.getStorageSync('personal')
				const oldDate = this.UserInfo.create_time; //'2015-10-16 19:32:01' //this.userInfo.create_time;

				this.dateList.oldYear = Number(oldDate.slice(0, 4));
				this.dateList.oldMonth = Number(oldDate.slice(5, 7));
				// console.log("oldYear",dateList.oldYear,dateList.oldMonth)
				const newDate = new Date();
				this.dateList.newYear = newDate.getFullYear();
				// console.log("year",year)
				this.dateList.newMonth = newDate.getMonth() + 1;
				var i = 0
				for (let y = this.dateList.oldYear; y <= this.dateList.newYear; y++) {
					this.dateList.calendar.push({
						'year': y,
						'list': []
					})
					var ii = i++
					if (y == this.dateList.oldYear && y == this.dateList.newYear) {
						for (let m = this.dateList.oldMonth; m <= this.dateList.newMonth; m++) {
							// console.log("yearyear",i++)
							this.dateList.calendar[ii].list.push({
								'month': m
							})
						}
					} else if (y == this.dateList.oldYear) {
						for (let m = this.dateList.oldMonth; m <= 12; m++) {
							this.dateList.calendar[ii].list.push({
								'month': m
							})
						}
					} else if (y == this.dateList.newYear) {
						for (let m = 1; m <= this.dateList.newMonth; m++) {
							this.dateList.calendar[ii].list.push({
								'month': m
							})
						}
					} else {
						for (let m = 1; m <= 12; m++) {
							this.dateList.calendar[ii].list.push({
								'month': m
							})
						}
					}
				}
			},
			bindChange(e) {
				// console.log("bindChange",e)
				this.dateList.selectIndex = e.detail.value
			},
			onMonth(e) {
				// console.log("onMonth",e)
				var year = this.dateList.calendar.findIndex(item => item.year === Number(e.slice(0, 4)))
				var month = this.dateList.calendar[year].list.findIndex(item => item.month === Number(e.slice(5, 7)))
				this.dateList.selectIndex = [year, month]
				this.pickerRef = true;
			},
			Cancel(e) {
				this.pickerRef = false;
			},
			Confirm(e) {
				this.load.status = 'loading';
				let year = this.dateList.calendar[this.dateList.selectIndex[0]].year;
				let month = this.dateList.calendar[this.dateList.selectIndex[0]].list[this.dateList.selectIndex[1]].month;
				this.list = [];
				this.page = 1;
				this.data = year + '-' + month;
				this.pickerRef = false;
				this.getPriceLog()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		.nav {
			padding: 0 30rpx 30rpx;
			display: flex;
			flex-wrap: wrap;
			gap: 30rpx;
			justify-content: center;

			.item {
				flex: 1;
				text-align: center;
				white-space: nowrap;
				padding: 20rpx;
				border-radius: 20rpx;
				background: rgba(0, 0, 0, .4);
				font-weight: 400;
				align-items: center;
				color: #fff;
				flex-shrink: 0;
			}

			.active {
				background: rgba(255, 255, 255, 1);
				color: rgba(246, 42, 45, 1);
			}
		}

		.listData {
			overflow: auto;
		}
	}

	.list {
		min-height: 50vh;
		padding: 0 30rpx;
		font-size: .8em;
		overflow: auto;

		.title {
			fposition: sticky;
			top: 0;
			display: flex;
			margin-bottom: 20rpx;
			color: #fff;

			.info {
				flex: 1;

				.month {
					font-weight: bold;

					.iconfont {
						display: inline-block;
						margin-left: 10rpx;
					}
				}

				.num {
					text-align: left;
					color: #999;

					text {
						margin-right: 20rpx;
					}
				}
			}

			.total {
				font-size: 30rpx;
			}
		}

		.item {
			padding: 30rpx;
			margin-bottom: 30rpx;
			border-radius: 20rpx;
			background: #fff;

			.dl {
				display: flex;
				justify-content: space-between;
				padding: 10rpx 0;

				.dt {}

				.dd {
					font-weight: 700;
				}

				.price {
					color: rgba(255, 55, 79, 1);
					font-size: 1em;
				}
			}
		}

		.text {
			flex: 1;
			font-size: 24rpx;
			display: flex;

			.img {
				width: 90rpx;
				height: 90rpx;

				image,
				img {
					width: 90rpx;
					height: 90rpx;
					border-radius: 90rpx;
				}
			}

			.info {
				font-size: 30rpx;
				padding-left: 20rpx;

				.time {
					color: var(--text-color-desc);
				}

				.role {
					font-size: 24rpx;
					background: #090;
					background: var(--linear-color);
					color: #fff;
					padding: 5rpx 10rpx;
					border-radius: 10rpx;
				}
			}
		}

		// 1提现申请2提现成功3提现拒绝4提现撤销、
		.num {
			font-size: 40rpx;
			text-align: center;
		}

		.num1 {
			color: #f00;
		}

		.num2 {
			color: var(--text-color-desc);
		}

		.amount {
			font-weight: bold;
			font-size: 40rpx;
			text-align: right;
		}

		.desc {
			font-size: 24rpx;
			text-align: right;
			color: var(--text-color-desc);
		}

		.status {
			font-size: 24rpx;
			text-align: right;
		}

		.status0 {
			color: var(--text-color-desc);
		}

		.status1 {
			color: var(--primary-color);
		}

		.status2 {
			color: #090;
		}

		.status3 {
			color: #09f;
		}

		.status4 {
			color: var(--text-color-desc);
		}
	}

	// .m-noData{ background: #fff; padding: 30rpx; border-radius: 20rpx;}
	.m-noData {
		color: #fff;
		min-height: 50vh;
	}

	// 地区选择
	.picker-area {
		background-color: #fff;
		border-radius: 24rpx 24rpx 0 0;
	}

	.picker-area-btn {
		border-bottom: 1rpx solid var(--border-color);
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 24rpx;
		line-height: 60rpx;

		.sbtn {
			padding: 12rpx 24rpx;
			font-size: 28rpx;
			color: var(--text-color-desc);
		}

		.text {
			font-weight: 800;
		}

		.confirm {
			color: var(--primary-color);
		}
	}

	.picker-view {
		width: 100%;
		height: 500rpx;

		.picker-item {
			padding: 10rpx 20rpx;
			height: 60rpx;
		}

		.picker-view-selected {
			height: 60rpx;
		}
	}

	.footer {
		padding: 90rpx 0;
		color: #fff;
		border-radius: 20rpx;
		text-align: center;

		.beian {
			width: 100%;
			display: block;
			border-radius: 20rpx;
		}

		.desc {
			padding: 10rpx;
		}

		image {
			align-items: center;
			vertical-align: middle;
			margin: 0 10rpx;
		}
	}
</style>