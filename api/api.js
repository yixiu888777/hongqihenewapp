const http = uni.$u.http

// 登录注册
// 注册
export const authRegisterApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/auth/register', params, config)
// 登录
export const authLoginApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/auth/login', params, config)
// 验证手机号是否注册
export const authCheckPhoneApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/auth/check/phone', params, config)
// 退出登录
export const authLogoutApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/auth/logout', params, config)

// 通用
// 图形验证码
export const servicesCaptchaApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/services/captcha', params, config)
// 上传文件
export const servicesUploadFileApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/services/upload/file', params, config)
// 配置接口
export const getSettingApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/services/config', params, config)
// 线路列表
export const servicesLineApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/services/line', params, config)
// 域名通畅测试
export const servicesCheckLevelApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/services/check/level', params, config)
// 项目介绍
export const servicesProjectApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/services/project', params, config)
// 项目介绍列表
export const servicesProjectListApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/services/project/list', params, config)
// 官方信息
export const servicesOfficialApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/services/official', params, config)
// 人工客服 文章
export const servicesManualApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/services/manual', params, config)
// 政策文件
export const servicesPolicyApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/services/policy', params, config)
// 政策文件
export const servicesPolicylistApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/services/policylist', params, config)

// app下载页面  官方群聊
export const servicesChatApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/services/chat', params, config)
// app下载
export const servicesAppInfoApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/services/app/info', params, config)
// 获取app版本号
export const servicesAppVersionApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/services/app/version', params, config)
// 排行榜
export const servicesRankApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/services/rank', params, config)


// 首页轮播图
export const commonBannerApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/common/banner', params, config)
// 首页滚动公告列表
export const commonScrollApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/common/scroll', params, config)
// 首页弹窗公告列表
export const commonPopupApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/common/popup', params, config)
// 热点资讯
export const commonNewsApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/common/news', params, config)
// 咨询详情
export const commonNewsDetailApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/common/news/detail', params, config)

// 纪元基金
export const userEpochApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/epoch', params, config)
// 最新通知列表未读数量
export const userMessageCountApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/message/count', params, config)
// 最新通知列表
export const userMessageApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/message', params, config)
// 消息详情
export const userMessageDetailApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/message/detail', params, config)
// 纪元基金领取
export const epochReceiveApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/epoch/receive', params, config)
// 获取签到信息
export const signInfoAPI = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/sign/info', params, config)
// 签到
export const signInAPI = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/sign', params, config)
// 获取补签日期
export const supplementaryAPI = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/sign/supplementary/date', params, config)
// 补签
export const signInSupplementaryAPI = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/sign/supplementary', params, config)
// 领取积分
export const pointsAPI = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/sign/points/receive', params, config)
// 奖品列表
export const lotteryAPI = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/lottery/list', params, config)
// 抽奖-页面详情
export const lotteryInfoAPI = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/lottery/info', params, config)
// 抽奖
export const lotteryRaffleAPI = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/lottery/raffle', params, config)
// 直播间领取红包
export const userMeetingReceive = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/meeting/receive', params, config)
// 获取会议直播间
export const userMeetingLive = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/meeting/live', params, config)
// 在线会议
export const userMeetingApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/meeting', params, config)
// 会议记录
export const userMeetingPlaybackApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/meeting/playback', params, config)
// 直播招募添加
export const userLiveAddApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/live/add', params, config)
// 直播招募详情
export const userLiveInfoApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/live/info', params, config)
// 直播招募修改
export const userLiveUpdateApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/live/update', params, config)
//团队入住修改
export const userTeamUpdateAddApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/team/plan/update', params, config)
//团队入住审核记录
export const userTeamRecordAddApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/team/plan/record', params, config)
//团队添加/user/team/plan/add
export const userTeamPlanAddApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/team/plan/add', params, config)
//团队入驻详情/user/team/plan/info
export const userTeamPlanInfoApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/team/plan/info', params, config)
//扶持申请记录
export const userSupportRecordApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/support/record', params, config)
//扶持申请提交
export const userSupportAddApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/support/add', params, config)
//获取扶持申请活动类型列表
export const userSupportTypeApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/support/type', params, config)
// 获取团队列表
export const getTeamListAPI = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/team/lower', params, config)
// 晋升奖励金额领取
export const getTeamCountAPI = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/invite/receive', params, config)
// 共建等级奖励
export const getInviteConfigAPI = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/invite/config', params, config)
// 邀请好友详情
export const getInviteInfoAPI = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/invite/info', params, config)
// 邀请奖励详情
export const getInviteDetailAPI = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/invite/detail', params, config)

//团队页面
//我的团队详情
export const userTeamInfoApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/team/info', params, config)
//我的团队数据统计
export const userTeamStaticApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/team/static', params, config)
//团队消费列表
export const userTeamOrderApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/team/order', params, config)
//我的团队详情
export const userTeamPositionApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/team/position', params, config)

//我的页面
//  获取单位信息
export const servicesUnitApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/services/unit', params, config)
//获取充值通道类型
export const userRechargeTypeApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/recharge/type', params, config)
//充值通道
export const userRechargeChannelApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/recharge/channel', params, config)
//充值
export const userRechargeApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/recharge', params, config)
//充值记录
export const userRechargeRecordApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/recharge/record', params, config)

//提现钱包
export const userWithdrawalWalletApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/withdrawal/wallet', params, config)
//提现
export const userWithdrawalApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/withdrawal', params, config)
//提现记录
export const userWithdrawalRecordApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/withdrawal/record', params, config)

//互转钱包列表
export const userTransferWalletApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/transfer/wallet', params, config)
//互转
export const userTransferApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/transfer', params, config)
//互转记录
export const userTransferRecordApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/transfer/record', params, config)

//提交实名认证
export const userRealApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/real', params, config)
//获取实名认证信息
export const userRealDetailApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/real/detail', params, config)
//获取实名认证信息
export const userRealRecordApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/real/record', params, config)

//账号修改
export const userBankUpdateApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/bank/update', params, config)
//账号删除
export const userBankDeleteApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/bank/delete', params, config)
//账号详情
export const userBankDetaileApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/bank/detail', params, config)
//账号添加
export const userBankApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/bank', params, config)
//账号列表
export const userBankListApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/bank/list', params, config)

//资产类型
export const userPriceTypeApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/price/type', params, config)
//资产明细
export const userPriceRecordApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/price/record', params, config)


//修改登录密码
export const userPasswordApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/password', params, config)
//修改支付密码
export const userSecurityApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/security', params, config)
//修改用户图像
export const userAvatarApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/avatar', params, config)
//用户资金钱包
export const userPriceApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/price', params, config)
//我的用户信息
export const userInfoApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/info', params, config)

//收获地址修改
export const userAddressUpdateApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/address/update', params, config)
//收获地址删除
export const userAddressDeleteApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/address/delete', params, config)
//收获地址详情
export const userAddressDetailApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/address/detail', params, config)
//收获地址添加
export const userAddressApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/address', params, config)
//收获地址列表
export const userAddressListApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/address/list', params, config)

//项目分类
export const productCateApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/product/cate', params, config)
//产品列表
export const productListApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/product/list', params, config)
//产品详情
export const productDetailApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/product/detail', params, config)
//购买立即领取
export const productBuyApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/product/buy', params, config)
//申购记录
export const productOrderApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/product/order', params, config)
//申购详情
export const productOrderDetailApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/product/order/detail', params, config)


//积分
export const exchangeWalletApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/exchange/wallet', params, config)
//积分
export const exchangeApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/exchange', params, config)

//股权
export const gqdateApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/gqdate/info', params, config)

// 个人所得税办税信息
export const userTaxInfoApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/tax/info', params, config)

// 提交个人所得税申报
export const userTaxSubmitApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/user/tax/submit', params, config)

// 保险投保 - 提交投保信息
export const baoxianOrderAddApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/services/insurance/save', params, config)

// 保单信息 - 提交投保信息
export const baoxianOrderdetailApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/services/insurance/detail', params, config)


export const baoxianOrderlistsApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/services/insurance/lists', params, config)

// 保险提交地址
export const baoxianAddressApi = (params, config = {
	custom: {
		auth: true
	}
}) => http.post('/api/services/insuranceadd/address', params, config)