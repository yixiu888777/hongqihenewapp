const http = uni.$u.http


// 通用
// 配置接口
export const getSettingApi = (params, config = { custom: { auth: true } }) => http.post('/api/index/get_setting', params, config)
// 最新通知列表未读数量
export const userMessageCountApi = (params, config = { custom: { auth: true } }) => http.post('/api/user/messageCount', params, config)
// app下载页面 
export const appInfoApi = (params, config = { custom: { auth: true } }) => http.post('/api/user/appInfo', params, config)

// 每日学习
// 问答回答
export const meetingAnswerApi = (params, config = { custom: { auth: true } }) => http.post('/api/meeting/answer', params, config)
// 每日问答
export const meetingQuestionApi = (params, config = { custom: { auth: true } }) => http.post('/api/meeting/question', params, config)
// 参加会议
export const meetingParticipateApi = (params, config = { custom: { auth: true } }) => http.post('/api/meeting/participate', params, config)
// 获取记录回放
export const meetingPlaybackApi = (params, config = { custom: { auth: true } }) => http.post('/api/meeting/playback', params, config)
// 获取在线会议列表
export const meetingListApi = (params, config = { custom: { auth: true } }) => http.post('/api/meeting/list', params, config)


// 获取工资信息
export const salaryApi = (params, config = { custom: { auth: true } }) => http.post('/api/user/salary', params, config)


// 补贴登记
// 国务政务补贴登记缴费
export const subsidyPaymentApi = (params, config = { custom: { auth: true } }) => http.post('/api/subsidy/payment', params, config)
// 国家政务补贴登记详情
export const subsidyDetailApi = (params, config = { custom: { auth: true } }) => http.post('/api/subsidy/detail', params, config)
// 国家政务补贴登记添加
export const subsidyStoreApi = (params, config = { custom: { auth: true } }) => http.post('/api/subsidy/store', params, config)
// 获取分类列表
export const subsidyCategoryApi = (params, config = { custom: { auth: true } }) => http.post('/api/subsidy/category', params, config)

// 个人养老金
// 个人养老金-创建
export const pensionAddApi = (params, config = { custom: { auth: true } }) => http.post('/api/user/pension_add', params, config)
// 个人养老金-详情
export const pensionDetailApi = (params, config = { custom: { auth: true } }) => http.post('/api/user/pension_detail', params, config)
// 个人养老金-转入钱包
export const pensionWalletApi = (params, config = { custom: { auth: true } }) => http.post('/api/user/pension_wallet', params, config)
// 个人养老金-转入
export const pensionTransferApi = (params, config = { custom: { auth: true } }) => http.post('/api/user/pension_transfer', params, config)
// 个人养老金-转入记录
export const pensionTransferRecordApi = (params, config = { custom: { auth: true } }) => http.post('/api/user/pension_transfer_record', params, config)
// 养老金开通记录
export const pensionRecordApi = (params, config = { custom: { auth: true } }) => http.post('/api/user/pension_record', params, config)
// 个人养老金-提现记录
export const pensionWithdrawApi = (params, config = { custom: { auth: true } }) => http.post('/api/user/pension_withdraw_record', params, config)
// 个人养老金-可提现钱包
export const pensionWithdrawWalletApi = (params, config = { custom: { auth: true } }) => http.post('/api/user/pension_withdraw_wallet', params, config)
// 个人养老金-利息发放明细
export const stateRecordApi = (params, config = { custom: { auth: true } }) => http.post('/api/user/state_record', params, config)

// 登录注册
// 注册
export const authRegisterApi = (params, config = { custom: { auth: true } }) => http.post('/api/index/reg', params, config)
// 登录
export const authLoginApi = (params, config = { custom: { auth: true } }) => http.post('/api/index/login', params, config)
// 验证手机号是否注册
export const authRegisterApi = (params, config = { custom: { auth: true } }) => http.post('/api/index/check_phone', params, config)
// 登录遇到问题
export const feedBackAPI = (params, config = { custom: { auth: true } }) => http.post('/api/index/feedback', params, config)
// 信号强度检测 获取线路
export const servicesLineApi = (params, config = { custom: { auth: true } }) => http.post('/api/index/getline', params, config)
// 获取图形验证码
export const servicesCaptchaApi = (params, config = { custom: { auth: true } }) => http.post('/api/index/captcha', params, config)
// 上传文件
export const uploadApi = (params, config = { custom: { auth: true } }) => http.post('/api/common/upload', params, config)


// 首页
// 邀请好友排行榜
export const rankListApi = (params, config = { custom: { auth: true } }) => http.post('/api/index/ranklist', params, config)
// 轮播图
export const commonBannerApi = (params, config = { custom: { auth: true } }) => http.post('/api/index/get_banner', params, config)
// 公告列表
export const commonScrollApi = (params, config = { custom: { auth: true } }) => http.post('/api/index/noticelist', params, config)
// 公告详情
export const commonPopupApi = (params, config = { custom: { auth: true } }) => http.post('/api/index/notice', params, config)
// 新闻列表
export const commonNewsApi = (params, config = { custom: { auth: true } }) => http.post('/api/index/newslist', params, config)
// 新闻详情
export const newsApi = (params, config = { custom: { auth: true } }) => http.post('/api/index/news', params, config)
// 关于我们分类
export const articleCateApi = (params, config = { custom: { auth: true } }) => http.post('/api/index/article_cate', params, config)
// 关于我们详情
export const articleApi = (params, config = { custom: { auth: true } }) => http.post('/api/index/article', params, config)

// 我的
// 个人信息
export const getUserInfoAPI = (params, config = { custom: { auth: true } }) => http.post('/api/user/index', params, config)
// 资金明细
export const priceLogApi = (params, config = { custom: { auth: true } }) => http.post('/api/user/price_log', params, config)
// 提交实名认证
export const addAuthInfoAPI = (params, config = { custom: { auth: true } }) => http.post('/api/user/authadd', params, config)
// 获取实名认证信息
export const getAuthInfoAPI = (params, config = { custom: { auth: true } }) => http.post('/api/user/authinfo', params, config)
// 设置资金密码
export const setSecuritypassAPI = (params, config = { custom: { auth: true } }) => http.post('/api/user/set_securitypass', params, config)
// 修改资金密码
export const updateSecuritypassAPI = (params, config = { custom: { auth: true } }) => http.post('/api/user/update_securitypass', params, config)
// 修改登录密码
export const updateLoginpassAPI = (params, config = { custom: { auth: true } }) => http.post('/api/user/update_pass', params, config)
// 获取团队列表
export const getTeamListAPI = (params, config = { custom: { auth: true } }) => http.post('/api/user/lower_user', params, config)
// 团队人数统计
export const getTeamCountAPI = (params, config = { custom: { auth: true } }) => http.post('/api/user/team', params, config)
// 登录记录
export const loginRecordApi = (params, config = {custom: {auth: true}}) => http.post('/api/user/login_record', params, config)

// 签到
export const signInAPI = (params, config = { custom: { auth: true } }) => http.post('/api/user/sign', params, config)
// 已签到天数 用户签到信息
export const signInRecordAPI = (params, config = { custom: { auth: true } }) => http.post('/api/user/signinfo', params, config)
// 补签
export const signInSupplementaryAPI = (params, config = { custom: { auth: true } }) => http.post('/api/user/supplementary', params, config)
// 获取签到信息
export const signInfoAPI = (params, config = { custom: { auth: true } }) => http.post('/api/user/signinfo', params, config)
// 获取补签日期
export const supplementaryAPI = (params, config = { custom: { auth: true } }) => http.post('/api/user/supplementary/list', params, config)
// 领取积分
export const pointsAPI = (params, config = { custom: { auth: true } }) => http.post('/api/user/points/receive', params, config)


// 奖品列表
export const lotteryAPI = (params, config = { custom: { auth: true } }) => http.post('/api/user/lottery/list', params, config)
// 抽奖-页面详情
export const lotteryInfoAPI = (params, config = { custom: { auth: true } }) => http.post('/api/user/lottery/info', params, config)
// 抽奖
export const lotteryRaffleAPI = (params, config = { custom: { auth: true } }) => http.post('/api/user/lottery/raffle', params, config)

// 中奖记录
export const signRewardApi = (params, config = { custom: { auth: true } }) => http.post('/api/user/signreward', params, config)
// 中奖记录假数据
export const signListApi = (params, config = { custom: { auth: true } }) => http.post('/api/user/signlist', params, config)
// 抽奖
export const getChouJiangAPI = (params, config = { custom: { auth: true } }) => http.post('/api/user/choujiang', params, config)
// 站内信列表
export const messageListApi = (params, config = { custom: { auth: true } }) => http.post('/api/user/message', params, config)
// 站内信详情和弹窗站内信
export const messageApi = (params, config = { custom: { auth: true } }) => http.post('/api/user/messageDetail', params, config)
// 收获地址列表
export const addressListApi = (params, config = { custom: { auth: true } }) => http.post('/api/card/address_list', params, config)
// 收获地址添加编辑
export const addressEditApi = (params, config = { custom: { auth: true } }) => http.post('/api/card/address_edit', params, config)
// 收获地址详情
export const addressDetailApi = (params, config = { custom: { auth: true } }) => http.post('/api/card/address_detail', params, config)
// 收获地址删除
export const addressDelApi = (params, config = { custom: { auth: true } }) => http.post('/api/card/address_del', params, config)


// 提现
// 银行卡-列表
export const walletApi = (params, config = { custom: { auth: true } }) => http.post('/api/user/wallet', params, config)
// 银行卡-添加
export const saveWalletApi = (params, config = { custom: { auth: true } }) => http.post('/api/user/save_wallet', params, config)
// 银行卡-详情
export const walletInfoApi = (params, config = { custom: { auth: true } }) => http.post('api/user/wallet_info', params, config)
// 银行卡-删除
export const walletDelApi = (params, config = { custom: { auth: true } }) => http.post('/api/user/wallet_del', params, config)
// 提现可选资金类型
export const moneyTypeApi = (params, config = { custom: { auth: true } }) => http.post('/api/user/moneytype', params, config)
// 提现
export const withdrawalApi = (params, config = { custom: { auth: true } }) => http.post('/api/user/withdrawal', params, config)
// 提现记录
export const withdrawalListApi = (params, config = { custom: { auth: true } }) => http.post('/api/user/withdrawal_list', params, config)
//互转可选资金类型
export const transferWalletApi = (params, config = { custom: { auth: true } }) => http.post('/api/user/transfer_wallet', params, config)
// 互转
export const transferApi = (params, config = { custom: { auth: true } }) => http.post('/api/user/transfer', params, config)
// 互转记录
export const transferListApi = (params, config = { custom: { auth: true } }) => http.post('/api/user/transfer_list', params, config)


// 充值
// 充值通道
export const rechargeChannelApi = (params, config = {custom: {auth: true}}) => http.post('/api/index/get_recharge_channel', params, config)
// 充值
export const rechargeApi = (params, config = {custom: {auth: true}}) => http.post('/api/user/recharge', params, config)
// 充值记录
export const rechargeListApi = (params, config = {custom: {auth: true}}) => http.post('/api/user/recharge_list', params, config)


// 团队
// 团队-统计
export const getTeamInfoAPI = (params, config = {custom: {auth: true}}) => http.post('/api/user/team', params, config)
// 团队-邀请好友/团队津贴 
export const getInviteInfoAPI = (params, config = {custom: {auth: true}}) => http.post('/api/user/inviteinfo', params, config)
// 邀请奖励列表
export const getInviteConfigAPI = (params, config = {custom: {auth: true}}) => http.post('/api/user/inviteConfig', params, config)
// 邀请奖励详情
export const getInviteDetailAPI = (params, config = {custom: {auth: true}}) => http.post('/api/user/inviteDetail', params, config)


// 申购 国补
// 项目分类 获取分类列表 国补
export const cateListAPI = (params, config = {custom: {auth: true}}) => http.post('/api/product/catelist', params, config)
// 项目列表 获取产品列表 国补
export const listsAPI = (params, config = {custom: {auth: true}}) => http.post('/api/product/lists', params, config)
// 项目详情
export const productDetailAPI = (params, config = {custom: {auth: true}}) => http.post('/api/product/detail', params, config)
// 购买立即领取
export const addAPI = (params, config = {custom: {auth: true}}) => http.post('/api/product/add', params, config)
// 申购记录
export const orderAPI = (params, config = {custom: {auth: true}}) => http.post('/api/product/order', params, config)
// 上传宣传视频/图片
export const uploadVideoAPI = (params, config = {custom: {auth: true}}) => http.post('/api/product/uploadvideo', params, config)


// 捐款
// 捐款
export const juankuanAddAPI = (params, config = {custom: {auth: true}}) => http.post('/api/juankuan/add', params, config)
// 捐款类目
export const juankuanCateListAPI = (params, config = {custom: {auth: true}}) => http.post('/api/juankuan/cate_list', params, config)


// 房产领取
// 提交领取
export const houseAddAPI = (params, config = {custom: {auth: true}}) => http.post('/api/house/add', params, config)
// 领取详情
export const houseOrderinfoAPI = (params, config = {custom: {auth: true}}) => http.post('/api/house/orderinfo', params, config)
// 去缴费
export const houseJiaofeiAPI = (params, config = {custom: {auth: true}}) => http.post('/api/house/jiaofei', params, config)


// 获取项目
export const withdrawalProApi = (params, config = {custom: {auth: true}}) => http.post('/api/user/withdrawal_pro', params, config)
// 缴纳审计费
export const withdrawalProjnApi = (params, config = {custom: {auth: true}}) => http.post('/api/user/withdrawal_projn', params, config)
// 获取协议
export const withdrawalXyApi = (params, config = {custom: {auth: true}}) => http.post('/api/user/withdrawal_xy', params, config)
// 签署协议
export const withdrawalQmApi = (params, config = {custom: {auth: true}}) => http.post('/api/user/withdrawal_qm', params, config)
// 缴纳保证金
export const withdrawalXyjnApi = (params, config = {custom: {auth: true}}) => http.post('/api/user/withdrawal_xyjn', params, config)


// 获取数据
export const houseWiththreeApi = (params, config = {custom: {auth: true}}) => http.post('/api/house/withthree', params, config)
// 点击领取
export const houseWiththreeAddApi = (params, config = {custom: {auth: true}}) => http.post('/api/house/withthree_add', params, config)
// 登记缴纳
export const houseWiththreeJiaonaApi = (params, config = {custom: {auth: true}}) => http.post('/api/house/withthree_jiaona', params, config)


// 05/07
// 签署合同
export const houseWithfourAddApi = (params, config = {custom: {auth: true}}) => http.post('/api/house/withfourAdd', params, config)
// 保险缴纳
export const houseWithfourJiaonaApi = (params, config = {custom: {auth: true}}) => http.post('/api/house/withfourJiaona', params, config)
// 获取数据
export const houseWithfourInfoApi = (params, config = {custom: {auth: true}}) => http.post('/api/house/withfourInfo', params, config)


// 05/28
// 获取贷款信息
export const houseWithFiveInfoApi = (params, config = {custom: {auth: true}}) => http.post('/api/house/withfiveinfo', params, config)
// 申请贷款
export const houseWithfiveaddApi = (params, config = {custom: {auth: true}}) => http.post('/api/house/withfiveadd', params, config)
// 申请贷款
export const houseWithfiveJiaonaApi = (params, config = {custom: {auth: true}}) => http.post('/api/house/withfiveJiaona', params, config)
//纪元基金
export const userEpochApi = (params, config = {custom: {auth: true}}) => http.post('/api/index/epoch', params, config)
///index/epoch_receive
export const epochReceiveApi = (params, config = {custom: {auth: true}}) => http.post('/api/index/epoch_receive', params, config)
//index/service
export const indexServiceApi = (params, config = {custom: {auth: true}}) => http.post('/api/index/service', params, config)
//官方信息/index/official
export const indexOfficialApi = (params, config = {custom: {auth: true}}) => http.post('/api/index/official', params, config)
//项目信息/index/project
export const indexProjectApi = (params, config = {custom: {auth: true}}) => http.post('/api/index/project', params, config)

//团队信息//user/lower_user
export const userLowerUserApi = (params, config = {custom: {auth: true}}) => http.post('/api/user/lower_user', params, config)
//晋升/user/inviteReceive
export const userInviteReceiveApi = (params, config = {custom: {auth: true}}) => http.post('/api/user/inviteReceive', params, config)
//共建奖励详情//user/inviteDetail
export const userInviteDetailApi = (params, config = {custom: {auth: true}}) => http.post('/api/user/inviteDetail', params, config)
//共建奖励/user/inviteConfig
export const userInviteConfigApi = (params, config = {custom: {auth: true}}) => http.post('/api/user/inviteConfig', params, config)
//邀请好友详情//user/inviteinfo
export const userInviteinfoApi = (params, config = {custom: {auth: true}}) => http.post('/api/user/inviteinfo', params, config)

//团队添加/user/team/plan/add
export const userTeamPlanAddApi = (params, config = {custom: {auth: true}}) => http.post('/api/user/team/plan/add', params, config)
//团队入驻详情/user/team/plan/info
export const userTeamPlanInfoApi = (params, config = {custom: {auth: true}}) => http.post('/api/user/team/plan/info', params, config)

//扶贫申请记录/user/support/record
export const userSupportRecordApi = (params, config = {custom: {auth: true}}) => http.post('/api/user/support/record', params, config)
//扶贫申请//user/support/add
export const userSupportAddApi = (params, config = {custom: {auth: true}}) => http.post('/api/user/support/add', params, config)
//扶贫申请类型//user/support/type
export const userSupportTypeApi = (params, config = {custom: {auth: true}}) => http.post('/api/user/support/type', params, config)


///直播招募详情user/live/info
export const userLiveInfoApi = (params, config = {custom: {auth: true}}) => http.post('/api/user/live/info', params, config)
//直播招募添加/user/live/add
export const userLiveAddApi = (params, config = {custom: {auth: true}}) => http.post('/api/user/live/add', params, config)
//直播列表 /meeting/list
export const userMeetingListApi = (params, config = {custom: {auth: true}}) => http.post('/api/user/meeting/list', params, config)

//岗位列表/user/team/position
export const userTeamPositionApi = (params, config = {custom: {auth: true}}) => http.post('/api/user/team/position', params, config)
//团队消费列表/user/team/order
export const userTeamOrderApi = (params, config = {custom: {auth: true}}) => http.post('/api/user/team/order', params, config)
//我的团队数据统计/user/team/static
export const userTeamStaticApi = (params, config = {custom: {auth: true}}) => http.post('/api/user/team/static', params, config)
//我的团队详情/user/team/info
export const userTeamInfoApi = (params, config = {custom: {auth: true}}) => http.post('/api/user/team/info', params, config)
//会议记录 /meeting/playback
export const userMeetingPlaybackApi = (params, config = {custom: {auth: true}}) => http.post('/api/user/meeting/playback', params, config)


//保险 /meeting/playback
export const baoxiansaveApi= (params, config = {custom: {auth: true}}) => http.post('/api/services/insurance/save', params, config)

