<script>
	import crypto from '@/utils/crypto.js'
	import silenceUpdate from '@/uni_modules/rt-uni-update/js_sdk/silence-update.js' //引入静默更新
	export default {
		onLaunch: function() {
		//	uni.redirectTo({ url: '/pages/index/init' });
			/* // #ifdef H5
			let baseUrl = uni.getStorageSync('baseUrl') || 'http://43.248.117.92:11197'
			//baseUrl = 'https://api.quanminfq.cc'
			uni.setStorageSync('baseUrl', baseUrl)
			// #endif

			// #ifdef APP-PLUS
			let baseUrl = !!uni.getStorageSync('baseUrl') ? uni.getStorageSync('baseUrl') : ''
			if (!uni.getStorageSync('baseUrl')) {
				uni.setStorageSync('baseUrl', baseUrl)
			}
			// #endif */
			/* let data = crypto.encrypt({
					site: baseUrl,
					app_ver: '103'
				})
			uni.request({
				url: baseUrl + '/api/index/get_setting',
				method: 'POST',
				data: data,
				success(res) {
					// 解密文本
					if(res.data.code == undefined){
						let decrypted = crypto.decrypt(res.data.data)
						res.data = decrypted
					}
					uni.setStorageSync('settingInfo', res.data.data)
				},
				fail(err) {
					// #ifdef APP-PLUS
					let baseUrlList = uni.getStorageSync('baseUrlList')
					if (baseUrlList.length == 0 || !baseUrlList) {
						let phpList = uni.getStorageSync('phpList')
						if (!phpList) {
							phpList = []
							uni.setStorageSync('phpList', phpList)
						} else if (phpList.length == 0) {
							return uni.showModal({
								title: '提示',
								content: '需要重新下载，请联系客服',
								showCancel: false, //是否显示取消按钮，默认为 true
								editable: false, //是否显示输入框
							});
						}
						let php = phpList[0]
						uni.request({
							url: `https://${php}/abc.php`,
							method: 'POST',
							header: {
								'Content-Type': 'application/x-www-form-urlencoded'
							},
							data: {
								id: uni.getStorageSync('baseUrlId')
							},
							success(res) {
								uni.showModal({
									title: '提示',
									content: '请重启APP',
									showCancel: false, //是否显示取消按钮，默认为 true
									editable: false, //是否显示输入框
								});
								baseUrlList = res.data.data.urllist
								uni.setStorageSync('baseUrl', baseUrlList[0])
								uni.setStorageSync('baseUrlList', baseUrlList.slice(1))
								uni.setStorageSync('baseUrlId', res.data.data.id)
							},
							fail(err) {
								uni.showModal({
									title: '提示',
									content: '请重启APP',
									showCancel: false, //是否显示取消按钮，默认为 true
									editable: false, //是否显示输入框
								});
								for (var i = 0; i < phpList.length; i++) {
									if (phpList[i] == php) {
										phpList.splice(i, 1);
									}
								}
								uni.setStorageSync('phpList', phpList)
							}
						})
					} else {
						uni.showModal({
							title: '提示',
							content: '请重启APP',
							showCancel: false, //是否显示取消按钮，默认为 true
							editable: false, //是否显示输入框
						});
						uni.setStorageSync('baseUrl', baseUrlList[0])
						uni.setStorageSync('baseUrlList', baseUrlList.slice(1))
					}
					// #endif
				}
			}) */
			// console.log('App Launch')
		},
		onShow: function() {
			console.log(22222)
			//#ifdef APP-PLUS
			// 获取本地应用资源版本号
			plus.runtime.getProperty(plus.runtime.appid, (inf) => {
				let api_url = uni.getStorageSync('baseUrl') || 'http://43.248.117.58:8907'
				//	let api_url=uni.getStorageSync('api_url')
				console.log(222233222)
				console.log(api_url)
				//获取服务器的版本号
				uni.request({
					url: api_url + '/api/auth/get_version', //示例接口
					data: {
						edition_type: plus.runtime.appid,
						version_type: uni.getSystemInfoSync().platform, //android或者ios
						edition_number: inf.versionCode // 打包时manifest设置的版本号
					},
					method: 'POST',
					success: (res) => {
						 console.log(res)
						 console.log(res.data.data, "qqq")
						// console.log(res.data.data.app.selice_update, "1111")

						let jsonstr = res.data.data;
						// console.log(jsonstr)
						// console.log(inf.versionCode, "当前版本号")
						// console.log(jsonstr.app_ver, "222当前11版本号")
						//res.data.xxx根据后台返回的数据决定（ 我这里后端返回的是data），所以是res.data.data
						//判断后台返回版本号是否大于当前应 用版本号 && 是否发行 （上架应用市场时一定不能弹出更新提示）
						if (Number(jsonstr.app_ver) > Number(inf.versionCode) && jsonstr.selice_update == 1) {

							// console.log("1sdfd111111111112", jsonstr.edition_url)
							//如果是wgt升级，并且是静默更新 （注意！！！ 如果是手动检查新版本，就不用判断静默更新，请直接跳转更新页，不然点击检查新版本后会没反应）
							//if (res.data.package_type  == 1&& res.data.edition_silence == 1) {
							// console.log("11111111  11112", jsonstr.selice_update)
							if (jsonstr.selice_update == 1) {
								console.log("shiyaoy  id22ian", jsonstr.app_hot_update)
								console.log("shiyaoy  id22ian", jsonstr.new_app_wgt)
								
								//调用静默更新方法 传 入下载地址
								//silenceUpdate(jsonstr.app_hot_update)
								silenceUpdate(jsonstr.new_app_wgt)

							} else {
								console.log("shqqqwwiyaoyidian", jsonstr.android_down_url)
								//跳转更新页面 （注意！！！如果pages.json第一页的代码里有一打开就跳转其他页面的操作，下面这行代码最好写在setTimeout里面设置延时3到5秒再执行）

								jsonstr.edition_url = jsonstr.android_down_url
								uni.navigateTo({
									url: '/uni_modules/rt-uni-update/components/rt-uni-update/rt-uni-update?obj=' +
										JSON.stringify(jsonstr)
								});
							}
						} else {

							// 如果是手动检查新版本 需开启以下注释
							/* uni.showModal({
							    title: '提示',
							    content: '已是最新版本',
							    showCancel: false
							}) */
						}
					}

				})

			});

			//#endif
		},
		onHide: function() {
			// console.log('App Hide')
		}
	}
</script>
<style lang="scss">
	@import "@/uni_modules/uview-ui/index.scss";
	@import '@/uni_modules/uview-ui/theme.scss';
	@font-face {
		font-family: Roboto;
		src: url("./static/font/Roboto.otf");
	}
	uni-view,
	uni-text {
		box-sizing: border-box;
	}
	/* #ifdef H5 */
	body,
	html,
	uni-page-body {
		height: 100%;
		margin: 0;
		padding: 0;
	}
	/* #endif */
	.container {
		font-size: 16px;
		display: flex;
		/* #ifdef H5 */
		height: 100%;
		padding-top: calc(var(--status-bar-height) + env(safe-area-inset-top));
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
		/* #ifdef APP-PLUS */
		height: 100vh;
		padding-top: var(--status-bar-height);
		/* #endif */
		flex-direction: column;
		box-sizing: border-box;
		color: rgba(51, 51, 51, 1);
	}
	.content {
		overflow: auto;
		flex: 1;
		box-sizing: border-box;
	}
	img,
	image {
		width: 100%;
		height: 100%;
	}
	.u-popup {
		flex: 0 !important;
	}
	::v-deep.u-popup__content {
		background: transparent !important;
	}
</style>