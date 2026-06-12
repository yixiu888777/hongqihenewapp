<template>
	<view class="container" style="background:#c8131e url(/static/new/bg.jpg) no-repeat center top / 100%;" v-if="pageShow">
		<headerView>
			<template #leftIcon><u-icon name="arrow-left" color="#fff" size="24"></u-icon></template>
			<view>幸运抽奖中心</view>
		</headerView>
		<view class="title">抽奖次数：{{lotteryInfo.sign_cj_nums}}次 <br>
			{{lotteryInfo.desc}}
		</view>
		<view class="m-dialer">
			<l-dialer :prizeList="prizeList" @done="onDone" ref="dialer">
				<image slot="pointer" src="/static/new/dail-point.png" mode="widthFix" @click="onClick" />
				<image slot="border" src="/static/new/dail-style.png" mode="widthFix" />
			</l-dialer>
		</view>
		<view class="scroll" v-if="lotteryInfo.notices.length > 0">
			<view class="scroll-box">
				<view class="scroll-content" :style="{ animationDuration: `${lotteryInfo.notices.length * 2}s` }">
					<view class="item" v-for="(item,index) in lotteryInfo.notices" :key="`original-${index}`">
						最近中奖：{{ item.realname }} 获得 {{ item.detail }}
					</view>
					<view class="item" v-for="(item,index) in lotteryInfo.notices" :key="`copy-${index}`">
						最近中奖：{{ item.realname }} 获得 {{ item.detail }}
					</view>
				</view>
			</view>
		</view>
		<view class="redbag">
			<view class="item">
				<image src="/static/new/redbag.png" mode="widthFix"></image>
				<view class="text">今日大奖：最高 <text>{{lotteryInfo.day_max_reward}}</text> 元红包</view>
			</view>
			<view class="item">
				<image src="/static/new/gift.png" mode="widthFix"></image>
				<view class="text">昨日共计发放奖励：<text>{{lotteryInfo.yesterday_reward}}</text> 份</view>
			</view>
		</view>
		<view class="m-tips">
			<view class="text">
				<view class="h2">提升中奖概率/多获得抽奖机会</view>
				<view class="desc"><u-parse :content="lotteryInfo.lottery_rule"></u-parse></view>
			</view>
		</view>
		<view class="f-desc">温馨提示：坚持签到抽奖更幸运</view>

		<u-popup :show="dialerShow" mode="center" round="32" @close="dialerShow=false">
			<view class="van-dialog van-dialog2">
				<view class="van-dialog__header">抽奖提示</view>
				<view class="van-dialog__content">
					<view>{{lotteryRaff.tip}}</view>
				</view>
				<view class="van-dialog__footer">
					<view class="button" @click="dialerShow=false">关闭提示</view>
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
		lotteryAPI,
		lotteryInfoAPI,
		lotteryRaffleAPI
	} from '@/api/api.js'
	export default {
		data() {
			return {
				settingInfo: uni.getStorageSync('settingInfo'),
				UserInfo: uni.getStorageSync('user_info'),
				nameShow: false, // 实名认证
				// 奖品列表
				prizeList: [],
				idList: [],
				lotteryInfo: {},
				lotteryRaff: {},
				tgID: 0,
				pageShow: false,
				clickLock: false,
				dialerShow: false
			};
		},
		onLoad() {
			this.loadData()
		},
		methods: {
			loadData() {
				lotteryAPI().then(res => {
					this.prizeList = res.data.data;
					this.idList = this.prizeList.map(item => item.id);
				})
				lotteryInfoAPI().then(res => {
					this.lotteryInfo = res.data.data;
					this.pageShow = true;
				})
			},
			onDone(index) {
				this.dialerShow = true;
				// const prize = this.prizeList[index]
				// uni.showModal({
				// 	title: '恭喜您',
				// 	content: this.lotteryRaff.tip
				// })
			},
			onClick() {
				// 奖品的索引
				// var xx = Math.floor(Math.random() * 5) + 1; 
				// console.log("sss",xx)
				// uniapp
				// this.$refs.dialer.run(xx)
				if (this.lotteryInfo.sign_cj_nums == 0) {
					uni.$u.toast('抽奖次数不足');
				} else {
					this.getRaffle();
				}
			},
			getRaffle() {
				if (this.UserInfo.is_auth == 1) {
					// 防止连续点击
					if(this.clickLock){
						uni.$u.toast('操作太频繁请稍后点击');
						return
					} 
					this.clickLock = true
					lotteryRaffleAPI({
						ids: JSON.stringify(this.idList)
					}).then(res => {
						this.lotteryRaff = res.data.data;
						this.$refs.dialer.run(this.lotteryRaff.index)
						this.loadData()
						this.clickLock = false
						
					})
					setTimeout(()=>{
						this.clickLock = false
					},5000) // 500ms内不能再点
				} else {
					this.nameShow = true
				}
			},
			// 根据id查找索引
			getIndexById(targetId) {
				// 核心：findIndex 遍历数组，匹配id
				const index = this.list.findIndex(item => item.id === targetId);

				if (index === -1) {
					console.log(`未找到id=${targetId}的元素`);
					return -1;
				}

				console.log(`id=${targetId}的索引是：${index}`);
				return index;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		min-height: 100vh;
		height: auto;
	}
	.title {
		text-align: center;
		background: rgba(0, 0, 0, 0.4);
		padding: 20rpx 60rpx;
		border-radius: 90rpx;
		color: #fff;
		margin: 60rpx auto 90rpx;
	}
	.m-dialer {
		margin: 0 auto 90rpx;
	}
	::v-deep .l-dialer__inner {
		.l-dialer__inner-border {
			transform: scale(1.11);
		}
		.l-dialer__inner-name {
			width: 4em;
			line-height: 1;
			text-align: center;
		}
		// .l-dialer__inner-item{ background: none !important; }
	}
	.info {
		background: rgba(0, 0, 0, 0.4);
		color: #fff;
		padding: 20rpx 30rpx;
		border-radius: 20rpx;
		margin: 0 30rpx 30rpx;
	}
	.redbag {
		background: #fff;
		padding: 20rpx 30rpx;
		border-radius: 20rpx;
		margin: 0 30rpx 30rpx;
		.item {
			display: flex;
			align-items: center;
			padding: 20rpx 0;
			image {
				width: 60rpx;
				height: 60rpx;
				display: block;
			}
			.text {
				padding-left: 20rpx;
				text {
					color: rgba(243, 62, 49, 1);
				}
			}
		}
	}
	.m-tips {
		background: #fff;
		padding: 20rpx 30rpx;
		border-radius: 20rpx;
		margin: 0 30rpx 30rpx;
	}
	.f-desc {
		color: #fff;
		margin: 0 30rpx 90rpx;
		font-size: .9em;
	}
	.scroll {
		background: rgba(0, 0, 0, 0.4);
		color: #fff;
		padding: 30rpx;
		border-radius: 20rpx;
		margin: 0 30rpx 30rpx;
		flex: none;
		.scroll-box {
			overflow: hidden;
			height: 80rpx;
		}
		.scroll-content {
			display: flex;
			flex-direction: column;
			animation: verticalScroll linear infinite;
			.item {
				background: rgba(0, 0, 0, 0.0);
				padding: 10rpx 0;
				height: 60rpx;
				line-height: 40rpx;
				border-radius: 20rpx;
				white-space: nowrap;
				font-size: .9em;
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
	}
</style>