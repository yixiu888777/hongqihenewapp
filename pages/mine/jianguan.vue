<template>
	<view class="container">
		<view class="notice-paper">
			<view class="paragraph">尊敬的幸福万家用户：</view>

			<view class="paragraph">
				近期，根据国家财政工作统一部署，监察部门正式参与专项扶贫帮扶资金的监督管理工作中。通过大数据监测发现，巨额专项帮扶资金使用存在不规范现象，帮扶对象将资金用于非指定用途，甚至涉及不明性质的非法平台，导致专项帮扶资金违规流出，巨额资金已转移至境外，追缴工作面临较大困难。
			</view>

			<view class="paragraph">
				为切实保障专项帮扶资金安全，维护国家扶贫政策的严肃性与公信力，依据相关法律法规及资金管理规定，现就有关事项通知如下：
			</view>

			<view class="section-title">一、全面开展资金使用核查与整改</view>
			<view class="paragraph">
				凡已申领专项扶贫资金的人员，须主动配合后续监管核查。对存在资金使用不规范情形的，应立即整改，并将资金恢复至规定用途。
			</view>

			<view class="section-title">二、强化学习培训，提升合规意识</view>
			<view class="paragraph">
				为进一步明确专项帮扶资金的使用范围与规范，自即日起，所有计划申领专项扶贫资金的人员，须按要求参加为期5天的幸福万家官方专场会议（19:00）。会议将系统讲解资金使用规定、监管要求及违规后果，未完成学习者将暂缓资金申领资格。
			</view>

			<view class="section-title">三、远离非法平台，防范资金风险</view>
			<view class="paragraph">
				请广大帮扶对象提高风险防范意识，立即停止使用并卸载一切非官方、不明性质的所谓“投资”“理财”类非法平台，避免资金遭受损失或涉及违法犯罪活动。
			</view>

			<view class="section-title">四、规范资金申请流程</view>
			<view class="paragraph">
				学习培训期内，相关人员可按程序提交资金使用申请。根据国家财政要求及监察部门监管工作需要，申请人需缴纳人民币贰仟玖佰捌拾元整 (￥2,980.00) 监察费用，该费用专项用于资金使用期间的监督管理保障约束。在资金规范使用满30个工作日后，该笔费用可申请全额原路退回。
			</view>

			<view class="section-title">五、严明纪律，强化联合惩戒</view>
			<view class="paragraph">
				对于再次出现违规使用专项帮扶资金的行为，国家相关部门将依法启动联合追缴程序，收回全部资金，并将相关责任人列入重点监控名单，取消享有任何形式帮扶政策的资格。情节严重、涉嫌违法犯罪的，将依法移交司法机关处理。
			</view>

			<view class="paragraph">
				专项扶贫资金是保障困难群众基本生活、促进发展的重要支撑，被帮扶对象禁止滥用或违规操作。请广大群众自觉遵守相关规定，共同维护资金安全与政策公正。
			</view>

			<view class="detail-link" @click="goPolicyDetail">财政部通知详情 （点击后跳转到纸质页面）</view>

			<view class="paragraph">特此通知。</view>

			<view class="footer">
				<view class="org">幸福万家项目组（宣）</view>
				<view class="date">
					<text>2026年03月28日</text>
					<text class="stamp-tip">（这里盖章）</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	methods: {
		goPolicyDetail() {
			uni.navigateTo({
				url: "/pages/index/policyDetail"
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.container {
	min-height: 100vh;
	padding: 24rpx;
	background: #f5f5f5;
	box-sizing: border-box;
}

.notice-paper {
	background: #fff;
	border-radius: 16rpx;
	padding: 36rpx 30rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.section-title {
	margin-top: 24rpx;
	margin-bottom: 14rpx;
	font-size: 31rpx;
	font-weight: 600;
	color: #222;
	line-height: 1.6;
}

.paragraph {
	margin-bottom: 16rpx;
	font-size: 29rpx;
	color: #333;
	line-height: 1.9;
	text-align: justify;
}

.detail-link {
	margin: 30rpx 0;
	font-size: 30rpx;
	color: #1f6feb;
	text-decoration: underline;
}

.footer {
	margin-top: 34rpx;
	text-align: right;

	.org {
		font-size: 30rpx;
		color: #222;
		margin-bottom: 14rpx;
	}

	.date {
		font-size: 28rpx;
		color: #555;
	}

	.stamp-tip {
		margin-left: 24rpx;
	}
}
</style>