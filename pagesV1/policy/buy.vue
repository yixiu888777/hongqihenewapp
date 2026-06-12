<template>
	<view class="container" style="background:#c8131e url(/static/new/bg.jpg) no-repeat center top / 100%;">
		<headerView>
			<template #leftIcon><u-icon name="arrow-left" color="#fff" size="24"></u-icon></template>
			<view>{{productDetail.name}}</view>
		</headerView>
		<view class="content">
			<!-- <view class="h1">{{settingInfo.text.buy_hearder_title}}</view> -->
			<image :src="productDetail.c_image" mode="widthFix" class="img"></image>
			<!-- <view class="img"><image :src="productDetail.c_image" mode="widthFix"></image>
				<view class="h2">{{productDetail.name}}</view>
				<view class="dl" v-if="productDetail.name">
					<view class="dt">{{productDetail.name}}</view>
					<view class="dd">{{productDetail.cate_name}}</view>
					<view class="desc" v-html="productDetail.title"></view>
				</view>
			</view> -->
			<view class="m-tips">
				<view class="text">
					<view class="h2">温馨提示:</view>
					<view class="desc">这里是温馨提示这里是温馨提示这里是温馨提示
这里是温馨提示这里是温馨提示</view>
				</view>
			</view>
			<view class="m-info">
				<view class="text">
					<view class="h2">产品介绍:</view>
					<view class="desc">这里是温馨提示这里是温馨提示这里是温馨提示
这里是温馨提示这里是温馨提示</view>
				</view>
			</view>
			<view class="main">
				<view class="h2">官方信息一览</view>
				<view class="imglink">
					<view class="item"><image src="/static/new/z.png" mode="widthFix"></image></view>
					<view class="item"><image src="/static/new/z.png" mode="widthFix"></image></view>
					<view class="item"><image src="/static/new/z.png" mode="widthFix"></image></view>
					<view class="item"><image src="/static/new/z.png" mode="widthFix"></image></view>
					<view class="item"><image src="/static/new/z.png" mode="widthFix"></image></view>
				</view>
				<!-- <view class="income">
					<view class="ul">
						<view class="li" v-for="(item,index) in productDetail.infolist" :key="index">
							<view class="name"><u-icon name="rmb-circle-fill" color="#FBB11B" size="20"></u-icon> {{item.name}}</view>
							<view class="num">{{item.value}}</view>
						</view>
					</view>
				</view> -->
				<view class="psw">
					<view class="dt">请输入支付密码</view>
					<view class="dd">
						<input type="password" v-if="pwdShow" v-model="form.password" class="input" placeholder="请输入密码" placeholder-class="placeholder" />
						<input type="text" v-else v-model="form.password" class="input" placeholder="请输入密码" placeholder-class="placeholder" />
						<view @click="pwdShow=!pwdShow">
							<image src="/static/public/eye-off.svg" mode="heightFix" v-if="pwdShow"></image>
							<image src="/static/public/eye.svg" mode="heightFix" v-else></image>
						</view>
					</view>
				</view>
		<view class="footer">
			<view class="button" @click="saveClick" v-if="form.password">立即参加 (¥{{productDetail.price}})</view>
			<view class="button no" v-else>立即参加 (¥{{productDetail.price}})</view>
			<view class="footer-tips">无法提交请联系 <span @click="toLoads(settingInfo.service.service_url)">在线客服</span></view>
		</view>
			</view>
		</view>
		<!-- 申购成功提示 -->
		<u-popup :show="addShow" mode="center" round="32" :closeable="true" @close="addShow = false">
			<view class="van-dialog van-dialog2">
				<view class="van-dialog__header">提示</view>
				<view class="van-dialog__content">您已申购成功</view>
			</view>
		</u-popup>
		<!-- 是否实名认证 -->
		<Real-Name></Real-Name>
	</view>
</template>

<script>
	import {
		productDetailAPI, // 项目详情
		addAPI //购买立即领取
	} from '@/api/api.js'
	export default {
		data() {
			return {
				isPageShow: false,
				settingInfo: uni.getStorageSync('settingInfo'),
				pwdShow: true,
				addShow: false,
				form: {
					password: '',
				},
				id: '',
				productDetail: {}
			};
		},
		onLoad(opt) {
			this.id = opt.id
			this.loadData()
		},
		methods: {			
			loadData(){
				productDetailAPI({id:this.id}).then(res => {
					this.productDetail = res.data.data
				})
			},
			saveClick(){
				addAPI({id:this.id,security_password:this.form.password}).then(res => {
					if( this.productDetail.is_pension_product == 1){
						uni.redirectTo({
							url: '/pages/mine/pension/index'
						})
					} else {
						uni.redirectTo({
							url: '/pages/policy/history'
						})						
					}
				}).catch(err =>{
					uni.$u.toast(err.data.msg);
				})
			},
			// 去在线客服页
			toLoads(url) {
				uni.navigateTo({
					url: `/pages/noPage/index?url=${url.split("&").join("$")}`
				})
			},
		}
	}
</script>

<style lang="scss">
	.container {
		.content {  padding:0 30rpx 30rpx;
			.h1{ color: #fff; font-weight: bold; margin-bottom: 20rpx; font-size: 1.2em; }
			.main { padding: 30rpx; background: #fff; border-radius: 20rpx; 
				.h2{ font-weight: bold; margin-bottom: 20rpx;}
			}
			.img{ margin-bottom: 30rpx; background: #fff; min-height: 200rpx; border-radius: 20rpx; position: relative; 
				image{ width: 100%; display: block; border-radius: 20rpx 20rpx 0 0; display: block;}
				.h2{ position: absolute; top: 30rpx; left: 30rpx; color: #fff; font-size: 1.4em; font-weight: 300; text-shadow: 0 0 10rpx rgba(0, 0, 0, .5); }
				.dl{ background: linear-gradient(to left, rgba(208, 5, 8, 1), rgba(254, 91, 74, 1)); color: #fff; padding: 30rpx; border-radius: 20rpx; margin: -60rpx 30rpx 0; position: relative; display: flex; gap: 30rpx; line-height: 1;
					.dt{ overflow: hidden; width: 2em; height: 2em; }
					.dd{ overflow: hidden; width: 4em; height: 2em; }
					.desc{ flex: 1; text-align: center; padding: 20rpx; border-radius: 200rpx; background: rgba(255, 255, 255, .2); overflow: hidden; white-space: nowrap; }
				}
			}
			.info{ margin-bottom: 30rpx;
				.num{ font-size: 1.4em; font-weight: bolder; color: rgba(243, 62, 49, 1);}
				.desc{ opacity: .8; }
			}
			.recharge{ display: flex; justify-content: space-between; margin-bottom: 30rpx;
				.dt{}
				.dd{ color: rgba(243, 62, 49, 1); }
			}
			.psw{ margin-bottom: 30rpx; 
				.dt{ margin-bottom: 20rpx; }
				.dd{ border: 2rpx solid #e5e5e5; padding: 20rpx 30rpx; border-radius: 20rpx; display: flex; align-items: center;
					.input{ flex: 1; height: 50rpx; line-height: 50rpx; border: none;}
					image{ height: 50rpx; margin-left: 20rpx; display: block;}
				}
			}
			.income{
				.title{ font-weight: bold; margin-bottom: 20rpx;}
				.ul {  margin-bottom: 60rpx;  display: flex; justify-content: space-between; gap: 30rpx; flex-wrap: wrap;
					.li { min-width: 300rpx; flex: 1;  padding: 50rpx 30rpx; border-radius: 20rpx;  background: linear-gradient(to right, rgba(208, 5, 8, 1), rgba(254, 91, 74, 1)); color: #fff; font-weight: 500; position: relative; overflow: hidden;
						.name{ font-weight: 500; line-height: 1; margin-bottom: 10rpx; display: flex;  
							.u-icon{ margin-right: 10rpx; }
						}
						.num{ font-size: 1.4em; line-height: 1; font-weight: bold; }
						.icon { position: absolute; bottom: -50rpx; right: -50rpx; opacity: .2; }
					}
					// .li:nth-child(odd){ background: linear-gradient(to left, rgba(255, 212, 27, 1), rgba(255, 146, 80, 1)); }
				}
			}
		}
		.footer { 
			.button{ font-weight: bold; font-size: 1em;}
			.footer-tips { text-align: center; font-size: .8em;
				font-weight: 400;
				line-height: 40rpx;
				color: rgba(133, 133, 151, 1);
				margin-top: 20rpx;
				span {
					margin-left: 10rpx;
					color: rgba(243, 62, 49, 1);
				}
			}
		}
	}	
	.m-tips{ background: #fff; margin-bottom: 30rpx;}
	.m-info{ border-radius: 20rpx;  padding: 30rpx; display: flex;  background: #fff; margin-bottom: 30rpx;
		
		.text{ line-height: 1; text-align: left;
			.h2{ font-weight: bold; margin-bottom: 20rpx;}
			.desc{  }
		}
	}
	.imglink{ display: flex; flex-wrap: wrap; gap: 30rpx; margin-bottom: 30rpx;
			.item{ min-width: 300rpx;
				image{ width: 100%; display: block;}
			}
	}
</style>