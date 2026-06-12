<!-- 有用 -->
<template>
	<view class="container" v-if="isPageShow">
		<view class="main">
			<view class="news">
				<view class="list">
					<view class="item" v-for="item in newsList" :key="item.id">
						<view class="h2">{{item.title}}</view>
						<view class="text">
							<view class="icon"><image src="/static/new/mt11.png" mode="widthFix"></image></view>
							<view class="desc" @tap="copyText(item.url)">{{item.url}}</view>
							<view class="icon copy"><image src="/static/new/copy.png" mode="widthFix"></image></view>
						</view>
						<view class="text">
							<view class="icon"><image src="/static/new/mt22.png" mode="widthFix"></image></view>
							<view class="desc">{{item.speaker}}</view>
						</view>
						<view class="text">
							<view class="icon"><image src="/static/new/mt33.png" mode="widthFix"></image></view>
							<view class="desc">{{item.time}}</view>
						</view>
						<view class="btn">
							<view class="sbtn" @click="popParticipate(item.time,item.id)">参会码</view>
							<view class="sbtn" @click="toParticipate(item.time,item.url)">加入会议</view>
						</view>
					</view>
				</view>
				<uni-load-more iconType="snow" :status="load.status" color="rgba(255,255,255,.5)" />
			</view>
		</view>
		<!-- 会议提示 -->
		<u-popup :show="hyShow" mode="center" round="32" @close="hyShow = false">
			<view class="van-dialog van-dialog2">
				<view class="van-dialog__header">会议码</view>
				<view class="van-dialog__content">
					<view class="input-text"><input type="text" v-model="code" class="input" placeholder="请输入会议码" placeholder-class="placeholder" /></view></view>					
				<view class="van-dialog__footer">
					<view class="van-success" @click="onParticipate">确认</view>
				</view>
			</view>
		</u-popup>
		<!-- 红包提示 -->
		<u-popup :show="hbShow" mode="center" round="32" @close="hbShow = false">
			<view class="van-dialog van-dialog2">
				<view class="van-dialog__header">提示</view>
				<view class="van-dialog__content">{{meetingParticipate.lx_tips}}</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		meetingListApi, // 获取在线会议列表
		meetingParticipateApi, // 参加会议
	} from '@/api/api.js'
	export default {
		data() {
			return {
				isPageShow: false,
				// 新闻列表
				newsList: [],
				page: 1,
				load:{
					status: 'loading', //more/loading/noMore
				},
				hyShow: false,
				hbShow: false,
				code: '',
				id: '',
				meetingParticipate: []
			}
		},
		onLoad() {
			this.loadData();
		},
		onShow() {
			
		},
		onHide() {
			
		},
		onUnload() {
			// 页面卸载时
		},
		onReachBottom() {
			// 上拉触底时
			this.page++
			this.loadData()
		},
		methods: {
			async loadData() {
				meetingListApi({
					page: this.page
				}).then(res => {
					let data = res.data.data.data
					if (data.length > 0) {
						this.newsList = [...this.newsList, ...data]
						this.load.status = 'more';
					} else {
						this.load.status = 'noMore';
						uni.$u.toast('数据加载完毕!')
						this.page--
					}
				})
				this.isPageShow = true;
			},
			// 复制
			copyText(text) {
				uni.setClipboardData({
					data: text,
					success: () => {
						uni.$u.toast('复制成功')
					},
					fail: () => {
						uni.$u.toast('复制失败')
					}
				});
			},
			popParticipate(time,id){
				// console.log("popParticipate",id)
				var newTime = new Date().getTime()
				var PartTime = new Date(time).getTime()
				if( newTime > PartTime){
					this.hyShow = true
					this.id = id
				} else {
					uni.$u.toast("会议暂未开始，请等待开播后重试")
				}
			},
			toParticipate(time,url){
				console.log("url",url)
				// console.log("time",new Date(time).getTime())
				var newTime = new Date().getTime()
				var PartTime = new Date(time).getTime()
				if( newTime > PartTime){
					this.$utils.toWeb(url)
				} else {
					uni.$u.toast("暂未到开播时间")
				}
			},
			onParticipate(){
				meetingParticipateApi({id:this.id,code:this.code}).then(res => {
					this.meetingParticipate = res.data.data;
					uni.$u.toast(res.data.msg)
					// uni.showToast({
					// 	title: res.data.msg,
					// 	duration: 2000
					// });
					if( res.data.code == 1 ){
						this.hyShow = false;
						this.code = '';
						if( res.data.data.lx_tips.length > 0 ){
							this.hbShow = true;
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container { min-height: 100vh; background:#FF363E url(/static/new/bg.png) no-repeat top center; background-size: cover;  height: auto; }
	.main{ padding: 30rpx; color: #040A13; margin-bottom: calc(60px + env(safe-area-inset-bottom));}
	.news{
		.list{ 
			.item{ padding: 30rpx;  background: #fff; border-radius: 20rpx; margin-bottom: 30rpx;
				.h2{ font-weight: bold; margin-bottom: 30rpx; }
				.text{ line-height: 1; display: flex; align-items: center; margin-bottom: 20rpx; font-size: .8em;
					.icon{ border-radius: 20rpx;
						image,img{ width: 40rpx; display: block;}
					}
					.desc{  padding-left:20rpx; color: rgba(4, 10, 19, .7); white-space: nowrap; overflow: hidden; }
					.copy{  padding-left:20rpx;
						image,img{ width: 30rpx; display: block;}
					}
				}
				.btn{  margin-top: 60rpx; display: flex; gap: 30rpx;
					.sbtn{ flex: 1; background: #FF3650; background: linear-gradient(to left, #FF624B, #FF3650); color: #fff; text-align: center; padding: 20rpx; border-radius: 20rpx; box-shadow: 0 2rpx 5rpx rgba(255, 77, 77, 0.30); font-size: .9em;}
				}
			}
			.item:last-child{ border-bottom:none;}
		}
	}
</style>