<template>
	<view class="comNineGrid">
		<view v-for="(item, index) in gridList" :key="`lotterItem${index}`" class="luckyItem" @click="currentClick(index)">
			<!-- <template v-if="index !== 4"> -->
			<view :class="currentIndex == index ? 'itemImg':''"></view>
			<image src="@/static/image/mine/egg.png" mode="widthFix" class="liwuImg"></image>
			<!-- </template> -->
			<!-- <template v-else>
				<view class="itemBtn">
					<view>正在</view>
					<view>抽奖</view>
				</view>
			</template> -->
		</view>
	</view>
</template>
<script>
	export default {
		props: ['prizeList'],
		name: 'nineChild',
		data() {
			return {
				gridList: [],
				currentIndex: undefined,
				startTimer: undefined
			}
		},
		mounted() {
			this.prizeListInitFunc()
		},
		emits: ['onStop'],
		methods: {
			prizeListInitFunc() {
				// this.prizeList.splice(4, 0, {})
				this.gridList = this.prizeList
			},
			startBtnFunc() {
				this.$emit('onStartBtn')
				this.onStartBtn && this.onStartBtn()
				let index = 0
				this.startTimer = setInterval(() => {
					this.currentIndex = index
					if (index < 8) {
						// if (index == 3) {
						// 	index = 5
						// } else {
						// 	index += 1
						// }
						index += 1
					} else {
						index = 0
					}
				}, 100)
			},
			recursion(index, speed, stopIndex) {
				this.currentIndex = index
				if (index == stopIndex && speed > 200) {
					this.$emit('onEndFunc')
					return
				} else {
					setTimeout(() => {
						if (index < 8) {
							// if (index == 3) {
							// 	index = 5
							// } else {
							// 	index += 1
							// }
							index += 1
						} else {
							index = 0
						}
						speed += 20
						this.recursion(index, speed, stopIndex)
					}, speed)
				}
			},
			stop(id) {
				const _findIndex = this.gridList.findIndex(item => item.id == id)
				clearInterval(this.startTimer)
				let speed = 0
				let index = this.currentIndex
				this.recursion(index, speed, _findIndex)
			},
			currentClick(index){
				this.currentIndex = index
				this.$emit('onEndFunc')
			}
		}
	}
</script>
<style scoped lang="scss">
	.comNineGrid {
		position: relative;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		width: 610rpx;
		height: 610rpx;
		padding: 14rpx;
		border-radius: 40rpx;
		background: rgba(245, 59, 0, 1);

		.luckyItem {
			position: relative;
			width: 180rpx;
			height: 180rpx;
			border-radius: 10rpx;
			background: rgba(255, 253, 219, 1);
			display: flex;
			align-items: center;
			justify-content: center;

			.itemImg {
				width: 100%;
				height: 100%;
				background-color: rgba(245, 59, 0, 0.4);
			}

			.liwuImg {
				width: 90rpx;
				height: 104rpx;
				position: absolute;
				left: 50%;
				transform: translateX(-50%);
				top: 35rpx;
			}

			.itemBtn {
				width: 166rpx;
				height: 166rpx;
				background-color: rgba(245, 59, 0, 1);
				font-family: Roboto;
				font-size: 64rpx;
				font-weight: 900;
				line-height: 80rpx;
				letter-spacing: 15rpx;
				text-align: center;
				color: rgba(255, 253, 219, 1);
			}
		}
	}
</style>