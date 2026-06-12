<template>
	<view class="tab_bar">
		<view class="tab_item col_center" v-for="(item,index) in list" @tap="toPage(item.pagePath)" v-if="item.status == 1">
			<view class="icon">
				<image :src='current==item.id?item.activeImg:item.img'></image>
			</view>
			<view class="text" :class="current==item.id?'active_text':''">
				{{item.title}}
			</view>
		</view>
	</view>
</template>

<script>
	import { getSettingApi } from '@/api/api.js'
	export default {
		name: "tabBarView",
		props: ["current"],
		data() {
			return {
				settingInfo: uni.getStorageSync('settingInfo'),
				list: [{
						id: 1,
						img: require('@/static/tabbar/home.png'),
						activeImg: require('@/static/tabbar/home-on.png'),
						pagePath: "/pages/index/index",
						title: '首页',
						status: 1
					},
					{
						id: 2,
						img: require('@/static/tabbar/service.png'),
						activeImg: require('@/static/tabbar/service-on.png'),
						pagePath: "/pages/service/service",
						title: '服务',
						status: 1
					}, 
					{
						id: 3,
						img: require('@/static/tabbar/shop.png'),
						activeImg: require('@/static/tabbar/shop-on.png'),
						pagePath: "/pages/policy/index",
						title: '商城',
						status: 1
					},
					{
						id: 4,
						img: require('@/static/tabbar/team.png'),
						activeImg: require('@/static/tabbar/team-on.png'),
						pagePath: "/pages/salary/index",
						title: '团队',
						status: 1
					}, {
						id: 5,
						img: require('@/static/tabbar/me.png'),
						activeImg: require('@/static/tabbar/me-on.png'),
						pagePath: "/pages/mine/index",
						title: '我的',
						status: 1
					}
				]
			};
		},
		mounted() {
			this.settingInfo = uni.getStorageSync('settingInfo')
			// this.list[1].status = this.settingInfo.program.subsidy_tab_status; //国补页面是否开启
			// this.list[3].status = this.settingInfo.program.salary_tab_status; //工资页面是否开启
			this.getSetting()
		},
		methods: {
			toPage(url) {
				if (!!url) {
					uni.redirectTo({
						url
					})
				} else {
					uni.$u.toast('敬请期待');
				}
			},
			getSetting(){
				getSettingApi().then(res => {
					this.settingInfo = res.data.data
					uni.setStorageSync('settingInfo', res.data.data)
					// this.list[1].status = this.settingInfo.program.subsidy_tab_status; //国补页面是否开启
					// this.list[3].status = this.settingInfo.program.salary_tab_status; //工资页面是否开启
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tab_bar {
		width: 100%;
		padding: 30rpx 0;
		background: #FFFFFF;
		box-shadow: 0px 0px 68rpx 0px #00000014;
		display: flex;
		grid-template-columns: 1fr 1fr 1fr 1fr;
		margin: 0 auto;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 999;
		.tab_item { flex: 1;
			height: 100%;
			text-align: center;
			.icon {
				width: 48rpx;
				height: 48rpx;
				image{display: block;}
			}
			.text {
				font-size: 30rpx;
				font-weight: 400;
				line-height: 30rpx;
				color: rgba(178, 180, 181, 1);
				margin-top: 20rpx;
				&.active_text {
					font-weight: 700;
					color: #f33e31;
				}
			}
		}


	}

	.img {
		width: 100%;
		height: 100%;
	}
</style>