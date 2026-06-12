<template>
	<view class="container">
		<headerView>
			<view>信号强度检测</view>
			<template #rightIcon>
				<image src="@/static/login/flushed.svg" mode="widthFix" @click="getLine"></image>
			</template>
		</headerView>
		<view class="content">
			<view class="content_header flex">
				<view class="_title">{{settingInfo.login_title}}</view>
				<view class="_tip">{{settingInfo.login_content}}</view>
			</view>
			<view class="list">
				<view class="title">数值越小，速度越快，请选择</view>
				<view class="item flex_between" v-for="(item,index) in lineList" :key="item.id"
					@click="select(item,index)">
					<view class="item-name">{{item.name}}</view>
					<view class="flex_center">
						<view>{{item.ms}}ms</view>
						<image class="item-image" src="@/static/login/strong.svg" mode="widthFix"></image>
						<view class="item-checkbox flex_center" :class="activeValue==index?'active':''">
							<u-icon name="checkbox-mark" color="#FFFFFF" v-if="activeValue==index"></u-icon>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		servicesLineApi
	} from '@/api/api.js'
	export default {
		data() {
			return {
				settingInfo: uni.getStorageSync('settingInfo'),
				activeValue: !!uni.getStorageSync('currentline') ? uni.getStorageSync('currentline') : '',
				lineList: []
			};
		},
		onLoad() {
			this.getLine()
		},
		methods: {
			select(item, index) {
				if (this.activeValue == index) return
				this.activeValue = index
				uni.setStorageSync('currentline', index)
			},
			getLine() {
				servicesLineApi().then(res => {
					this.lineList = res.data.data
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		display: block;
		background: linear-gradient(180deg, #D42410 25.86%, #F2E7DF 100%);
		position: relative;

		&::after {
			content: "";
			background: url("/static/login/login-header.svg") no-repeat center / 100%;
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 374rpx;
			z-index: 1;
		}

		.header {
			position: absolute;
			left: 0;
			top: var(--status-bar-height);
			z-index: 3;
		}

		.content {
			// width: 750rpx;
			// padding: 32rpx;
			// background: url('@/static/image/bg.png') no-repeat bottom / cover;
			// background-color: rgba(255, 198, 171, 1);

			.content_header {
				height: calc(374rpx - var(--status-bar-height));
				position: relative;
				z-index: 2;
				justify-content: center;
				align-items: flex-end;
				padding-right: 60rpx;
				flex-direction: column;
				line-height: 40rpx;
				font-family: Roboto;
				color: rgba(177, 35, 39, 1);

				._title {
					font-size: var(--font-20);
					font-weight: 700;
					margin-bottom: 12rpx;
				}

				._tip {
					font-size: var(--font-14);
					font-weight: 400;
				}
			}



			.list {
				margin-top: 66rpx;
				color: #fff;
				padding: 32rpx;

				.title {
					font-family: Roboto;
					font-size: var(--font-14);
					font-weight: 500;
					line-height: 64rpx;
					letter-spacing: 0.20000000298023224px;
				}

				.item {
					margin-top: 20rpx;
					font-family: Roboto;
					font-size: var(--font-14);
					font-weight: 500;
					line-height: 64rpx;
					letter-spacing: 0.20000000298023224px;

					.item-name {
						flex: 1;
					}

					.item-image {
						width: 46rpx;
						height: 38rpx;
						flex-shrink: 0;
						margin: 0 12rpx;
					}

					.item-checkbox {
						width: 36rpx;
						height: 36rpx;
						border-radius: 8rpx;
						border: 1px solid #fff;
					}

					.active {
						background: rgba(25, 203, 55, 1);
						border: 1px solid rgba(25, 203, 55, 1);
					}
				}
			}
		}
	}
</style>