<!-- 有用 -->
<template>
	<view class="container" v-if="isPageShow" style="background:url(/static/new/bg.png) no-repeat center top / 100%;">
		<view class="statusbar"></view>
		<view class="m-header">
			<view class="logo">
				<view class="icon"><image src="/static/new/155.png" mode="aspectFit"></image></view>
				<view class="text">十五五战略</view>
			</view>
			<view class="more">
				<view class="icon"><image src="/static/new/log.png" mode="aspectFit"></image></view>
				<view class="text">申购记录</view>				
			</view>
		</view>
		<view class="main">
			<view class="tab">
				<view class="item" :class="current==index?'on':''" v-for="(item,index) in navList" @tap="current=index" v-html="item.name"></view>			
			</view>
			<view class="list">
				<view class="item" v-for="item in list" :key="item.id">
					<view class="img">
						<image :src="item.image" mode="widthFix"></image>
						<view class="alt">周期:20天，到期即可提现</view>
					</view>
					<view class="text">
						<view class="title">
							{{item.name}} <view class="sub">限购{{item.nums_total}}份</view>
						</view>
						<view class="desc">{{item.detail}}</view>
						<view class="price">{{ item.price }}</view>
						<view class="btn">查看详情</view>
						<view class="static">
							<view class="day">日限额</view>
							<view class="progress">
								<view class="bar" :style="'width:'+item.process+'%;'"></view>
							</view>
							<view class="percent">{{item.process}}%</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { 
		getSettingApi, 
		cateListAPI, // 项目分类 获取分类列表 国补
		listsAPI , // 项目列表 获取产品列表 国补
	} from '@/api/api.js'
	export default {
		data() {
			return {
				isPageShow: false,
				auditShow: false,
				navList: [],
				current: -1,
				list: []
			}
		},
		onLoad(opt) {
			cateListAPI().then(res=>{
				this.navList = res.data.data.data
				if(!!opt.cate_id){
					this.navList.forEach((item, index) => {
						if (opt.cate_id == item.id){
							this.current = index
						}
					})
				} else {
					this.current = 0
				}
			})
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
		},
		watch: {
			current(){
				this.getList()
			}
		},
		methods: {
			getList(){
				if(this.navList.length > 0){
					listsAPI({
						cate_id: this.navList[this.current].id
					}).then(res=>{
						this.list = res.data.data.data
						this.isPageShow = true;
					})
				}
			},
			// 实名页面跳转
			toPage(url) {
				if( this.UserInfo.is_auth == 1 ){
					this.$utils.toPage(url)
				} else{
					this.rnShow = true;
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container { min-height: 100vh; height: auto; }
	.main{ padding: 30rpx; color: #040A13; margin-bottom: calc(60px + env(safe-area-inset-bottom));}
	.tab{ display: flex; margin-bottom: 30rpx; padding-top: 20rpx;
		.item{ background: #fff; padding: 20rpx 30rpx; }
		.on{ background: #FF3650; background: linear-gradient(to left, #FF624B, #FF3650); color: #fff; }
		.item:nth-child(1){ border-radius: 20rpx 0 0 20rpx;}
		.item:nth-child(2){ border-radius: 0 20rpx 20rpx 0;}
	}
	.list{
		.item{ background: #fff; border-radius: 20rpx; margin-bottom: 30rpx;
			.img{ overflow: hidden; border-radius: 20rpx 20rpx 0 0; position: relative;
				image,img{width: 100%; display: block;}
				.alt{ position: absolute; top: 0;right: 0; background: linear-gradient(to left, #FF624B, #FF3650); color: #fff; padding: 10rpx 20rpx; font-size: 0.8em; border-radius: 0 0 0 20rpx; }
			}
			.text{ padding: 20rpx; 
				.title{ font-size: 1.1em; font-weight: bold;
					.sub{ display: inline-block; background: rgba(255, 98, 75, .1); color: #FF4D4D; font-size: 0.6em; font-weight: 300; padding: 5rpx 10rpx; border-radius: 10rpx; white-space: nowrap; margin-left: 10rpx;}
				}
				.desc{ color:rgba(4, 10, 19, 0.4); margin-bottom: 30rpx; }
				.price{ color:#FF4D4D; font-size: 2em; font-weight: bold; margin-bottom: 30rpx;}
				.btn{ background: #FF3650; background: linear-gradient(to left, #FF624B, #FF3650); color: #fff; text-align: center; padding: 20rpx; border-radius: 20rpx; box-shadow: 0 2rpx 5rpx rgba(255, 77, 77, 0.30);  margin-bottom: 20rpx;}
				.static{ display: flex; align-items: center; font-size: 0.6em;
					.day{ padding-right: 10rpx; }
					.progress{ flex: 1; height: 10rpx; border-radius: 20rpx; background: linear-gradient(to left, rgba(255, 98, 75, .1), rgba(255, 54, 80, .1));
						.bar{ background: #FF3650; background: linear-gradient(to left, #FF624B, #FF3650); height: 10rpx; border-radius: 20rpx; }
					}
					.percent{ padding-left: 10rpx; }
				}
			}
		}
	}
</style>