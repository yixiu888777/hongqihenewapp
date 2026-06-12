<template>
	<view class="container"	style="background: url('/static/new1/bg.jpg') no-repeat center top / cover;background-attachment: fixed;">
		<headerView>
			<template #leftIcon><u-icon name="arrow-left" color="#fff" size="24"></u-icon></template>
			<view>政策文件</view>
		</headerView>
		<view class="main">
			<view class="content">
				<view class="title">这里是政策文件标题</view>
				<view class="body">今天，《党风政风热线》聚焦西安市建总工程集团有限公司承建的亮丽家园项目拖欠农民工工资问题。西安市国资委考核评价处处长张宏，西安建工集团副总经理买亚锋，西安建工集团建总工程集团有限公司总经理张春钢，曲江建设集团有限公司总经理杨雷蒙，曲江建设集团有限公司副总经理胡彦利做客直播间，接听群众热线，回应市民关切，接受社会监督。
节目邀请致公党西安高新支部代表金龙为监督嘉宾，与上线单位互动交流并提出意见和建议。
今天，《党风政风热线》聚焦西安市建总工程集团有限公司承建的亮丽家园项目拖欠农民工工资问题。西安市国资委考核评价处处长张宏，西安建工集团副总经理买亚锋，西安建工集团建总工程集团有限公司总经理张春钢，曲江建设集团有限公司总经理杨雷蒙，曲江建设集团有限公司副总经理胡彦利做客直播间，接听群众热线，回应市民关切，接受社会监督。
节目邀请致公党西安高新支部代表金龙为监督嘉宾，与上线单位互动交流并提出意见和建议。近日，有外地建筑商向我们《党风政风热线》栏目反映，他们2011年承建了，由西安建工集团下属的西安市建总工程集团有限公司中标的，曲江新区亮丽家园小区项目。
今天，《党风政风热线》聚焦西安市建总工程集团有限公司承建的亮丽家园项目拖欠农民工工资问题。西安市国资委考核评价处处长张宏，西安建工集团副总经理买亚锋，西安建工集团建总工程集团有限公司总经理张春钢，曲江建设集团有限公司总经理杨雷蒙，曲江建设集团有限公司副总经理胡彦利做客直播间，接听群众热线，回应市民关切，接受社会监督。
节目邀请致公党西安高新支部代表金龙为监督嘉宾，与上线单位互动交流并提出意见和建议。近日，有外地建筑商向我们《党风政风热线》栏目反映，他们2011年承建了，由西安建工集团下属的西安市建总工程集团有限公司中标的，曲江新区亮丽家园小区项目。

</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		addressDelApi
	} from '@/api/api.js'
	export default {
		data() {
			return {
				settingInfo: uni.getStorageSync('settingInfo'),
			};
		},
		onShow() {
		},
		methods: {
		}
	}
</script>

<style lang="scss">
	.container {
		.main{ display: flex; flex-direction: column; flex: 1;margin:0 30rpx 30rpx; }
		.content { background: #fff; border-radius: 20rpx; display: flex; flex-direction: column; flex: 1;
			.title{ padding: 30rpx; border-bottom: 2rpx solid #e5e5e5; font-weight: bold; }
			.body{ margin: 30rpx; overflow: auto; flex: 1; max-height: calc(100vh - 300rpx);
				/* #ifdef APP */
				max-height: calc(100vh - 400rpx);
				/* #endif */
			}
		}
	}
</style>