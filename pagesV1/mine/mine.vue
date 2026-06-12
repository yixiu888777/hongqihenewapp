<!-- 有用 -->
<template>
	<view class="container">
		<view class="bg"></view>
		<view class="main">
			<headerView>
				<template #leftIcon><u-icon name="arrow-left" color="#fff" size="24"></u-icon></template>
				<view>个人养老金账户</view>
			</headerView>
			<view class="content">
				<view class="box">
					<view class="mine">
						<view class="desc b">持有人:张伟</view>
						<view class="desc">养老账户卡号：6222 0012 3456 7890</view>
					</view>
					<view class="card">
						<view class="item">
							<view class="desc">年度预存上限金额</view>
							<view class="num b">50000</view>
						</view>
						<view class="item">
							<view class="desc">年化利率</view>
							<view class="num b">50000</view>
						</view>
						<view class="item">
							<view class="desc">国家代缴金额</view>
							<view class="num">50000</view>
						</view>
						<view class="item">
							<view class="desc">个人缴费金额</view>
							<view class="num">50000</view>
						</view>
						<view class="item">
							<view class="desc">可用余额</view>
							<view class="num">50000</view>
						</view>
						<view class="item">
							<view class="desc">国补利息</view>
							<view class="num">50000</view>
						</view>
					</view>
					<view class="btn">
						<view class="sbtn"><svg t="1760362213172" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2634" width="128" height="128"><path d="M866.56 447.296L544 770.48V96h-80v672.16L142.448 447.296 85.248 503.84 503.84 922.448 922.496 503.84z" fill="#ffffff" p-id="2635"></path></svg>转入</view>
						<view class="sbtn"><svg t="1760362015579" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4540" width="128" height="128"><path d="M503.92 99.456L85.296 518.048l57.184 56.56L464 253.76V928h80V251.424l322.592 323.2 55.952-56.576z" fill="#ffffff" p-id="4541" data-spm-anchor-id="a313x.search_index.0.i0.468c3a811ZPwch" class="selected"></path></svg>提现</view>
					</view>
				</view>
				<view class="box">
					<view class="btn2">
						<view class="sbtn">账户说明</view>
						<view class="sbtn">转入记录</view>
						<view class="sbtn">提现记录</view>
					</view>
					<view class="list">
						<view class="tit">
							<view class="name">账户</view>
							<view class="status">状态</view>
						</view>
						<view class="item">
							<view class="name">账户</view>
							<view class="status">状态</view>
						</view>
					</view>
					<view class="m-noData">
						<view class="item">
							<view class="icon"><image src="@/static/new/nodata.png" mode="widthFix"></image></view>
							<view class="text">您还没有添加地址哦</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	
</script>

<style lang="scss" scoped>
	.container { min-height: 100vh; height: auto; padding: 0; background: rgba(250, 250, 250, 1); }
	.bg{ padding: 30rpx; background: linear-gradient(to bottom, #FF3150 0%, #FF644B 70%, rgba(250, 250, 250, 1) 100%); height: 800rpx; }
	.main{ padding: 30rpx; color: #040A13; margin-top: -800rpx; margin-bottom: calc(60px + env(safe-area-inset-bottom));
		.title{ color: #fff; font-size: 1.4em; font-weight: bold; text-align: center; margin-bottom: 30rpx;}
		::v-deep .header{ padding: 0; height: 60rpx; margin:0 -30rpx 30rpx; }
	}
	.content{  
		.box{ background: #fff; padding: 30rpx; border-radius: 20rpx; margin-bottom: 30rpx; }
		.mine{ margin-bottom: 30rpx;
			.b{ font-weight: bold; }
		}
		.card{ display: flex; flex-wrap: wrap; margin-bottom: 30rpx;
			.item{ width: 50%; margin-bottom: 30rpx;
				.desc{}
				.num{ color: rgba(255, 55, 79, 1); font-size: 1.2em;}
				.b{font-weight: bold;font-size: 1.4em;}
			}
		}
		.btn{  display: flex; gap: 30rpx; 
			.sbtn{ flex: 1; background: #FF3650; background: linear-gradient(to left, #FF624B, #FF3650); color: #fff; text-align: center; padding: 20rpx; border-radius: 20rpx; box-shadow: 0 2rpx 5rpx rgba(255, 77, 77, 0.30); 
				svg{display: inline-block; width: 40rpx; height: 40rpx; margin-right: 10rpx; vertical-align: middle; }
			}
		}
		.btn2{ display: flex; gap: 30rpx; margin-bottom: 30rpx;
			.sbtn{ flex: 1; background: rgba(240, 241, 243, 1); background: linear-gradient(to left, rgba(240, 241, 243, 1), rgba(240, 241, 243, 1)); text-align: center; padding: 20rpx; border-radius: 20rpx;  }
		}
		.list{ text-align: center;
			.tit{ display: flex; margin-bottom: 30rpx;
				.name{ width: 40%; }
				.status{ width: 60%; }
			}
			.item{ display: flex;
				.name{ width: 40%; }
				.status{ width: 60%; }
			}
		}
	}
	// 暂无数据
	.m-noData{ padding:60rpx 30rpx; height: auto; text-align: center; background: #fff; display: flex; align-items: center;
		.item{flex: 1;
			.icon{ margin-bottom: 30rpx;
				image{ width: 200rpx; }
			}
			.text{ opacity: .5; }
		}
	}
	
	

</style>