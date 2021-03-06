//app.js
App({
  // 地图接口，根据经纬度获取用户地址信息
  MAP:'https://apis.map.qq.com/ws/geocoder/v1',
  globalUrl: 'https://zc.youmi158.com/index.php/City/',
  globalImageUrl:'https://zc.youmi158.com',
  BANNER: 'Index/banner_list',
  // 店铺列表
  STORELIST: 'Index/home_store',
  // 商家详情
  STOREINFO: 'Store/info',
  // 酒店详情
  HOTELINFO: 'Store/hotel_index',
  // 预定酒店
  HOTELORDER: 'Hotel/hotel_detail',
  // 商家商品
  GOODSTAB: 'Goods/get_tab',
  // 商品规格
  RODUCTLIST: 'Goods/product_list',
  // 同城商品详情
  GOODSINFO: 'Goods/get_info',
  // 购物车
  CARTINFO: 'Shopping/cart_info',
  // 购物车编辑
  CARTEDIT: 'Shopping/cart_edit',
  // 购物车删除
  CARTDEL: 'Shopping/cart_del',
  // 购物车结算
  CARTSUBMIT: 'Shopping/cart_submit',
  // 确认订单页面修改地址或优惠劵
  CONFIRMINFO: 'Shopping/confirm_info',
  // 提交订单
  ORDERSUBMIT: 'Shopping/order_submit',
  // 订单支付申请
  ORDERPAY: 'Shopping/order_pay',
  // 订单列表
  getOrderListByMemberId: 'OrderManage/getOrderListByMemberId',
  // 确认收货
  confirmReceipt: 'OrderManage/confirmReceipt',
  // 取消订单
  cancelOrderById: 'OrderManage/cancelOrderById',
  // 删除订单
  deleteOrderById: 'OrderManage/deleteOrderById',
  // 添加评论
  addEvaluate: 'OrderManage/addEvaluate',
  // 申请退款
  applyRefund: 'OrderManage/applyRefund',
  // 订单详情
  getCityOrderInfoById: 'Order/getOrderDetail',
  //获取收货地址
  GETADDRESS: 'Address/index',
  //添加地址
  ADD_ADDRESS: 'Address/addAddress',
  //修改收货地址
  EDITADDRESS: 'Address/editAddress',
  //删除收货地址
  DELADDRESS: 'Address/deleteAddress',
  //修改默认地址
  EXAMINEADDRESS: 'Address/examine',
  //支付
  Payment: 'Payment/OrderCharge',
  //评价列表
  REMARK: 'Store/remark',
  // 会员接口
  Openid: 'Member/getOpenid',
  // 个人中心接口
  Memberid: 'Member/index',
  // 充值
  Charge:'Payment/applyCharge',
  // 单独获取用户信息
  GetUserInfoByMemberId: 'Member/get_list',
  // 众筹列表
  FundList: 'Fund/index',
  // 众筹详情
  FundDetail: 'Fund/detail',
  // 我要众筹
  FundAttend: 'Fund/get_attend',
  // 众筹支付
  FundCharge: 'Payment/FundCharge',
  // 参与列表、我的众筹
  FundAttendList: 'Fund/attend_list',
  // 我要留言
  FundMessage: 'Fund/message',
  // 留言列表
  FundMessageList: 'Fund/message_list',
  // 商家顶部分类菜单
  TopNav: 'Base/get_list',
  // 申请入驻
  Apply: 'Apply/apply',
  // 图片上传地址
  UploadImg: 'Base/upload_img',
  // 优惠券
  CouponList: 'Coupon/index', 
  // 领取优惠券
  GetCoupon: 'Coupon/draw',
  // 获取浏览记录
  GlanceList: 'Other/glance',
  // 删除浏览记录
  DelGlance: 'Other/delete',
  // 账单明细
  MoneyDetail: 'Money/money_detail',
  // 红包获取记录
  MoneyGetPack: 'Money/getPack',
  // 消息列表
  NewsList: 'other/news_list',
  // 邀请会员界面数据接口
  Invite: 'Invite/index',
  // 邀请会员或者店铺的列表
  InviteList: 'Invite/get_list',
  // 活动列表
  ActiveList: 'Coupon/active',
  // 被邀请用户传递上级用户id接口
  SendSalesman: 'Invite/salesman',

  onLaunch: function () {
    //获取屏幕高度
    this.getSystemInfo();
    //获取用户当前所在位置
    // this.getFirstLocation();
    // 用户登录系统
    if (!this.globalData.hasLogin){
      this.getUserInfo();
    }
  },
  getSystemInfo(){
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        console.info(res.windowHeight);
        that.globalData.scrollHeight =  res.windowHeight
        // mult，乘法系数，用于设置scroll-view的px高度时，裁剪对应的rpx高度的其余标签；
        // 如在可视高度范围内，有一个底部或者顶部固定高度为100rpx的fixed定位标签；
        // 则scroll高度为scrollHeight - 100 * mult；
        that.globalData.mult =  res.screenWidth / 750
      }
    });
  },
  //获取用户登录信息
  getUserInfo: function () {
    var that = this;
    wx.login({
      success: function (res) {
        wx.getUserInfo({
          success: function (msg) {
            that.globalData.hasLogin = true;
            if (res.code) {
              console.log('userInfo', msg.userInfo)
              that.globalData.userInfo = msg.userInfo
              that.getOpenid(res.code);
            } else {
              console.log('获取用户登录态失败！' + res.errMsg);
            }
          }
        });
      },
      fail(res){
        console.log('用户点击了拒绝登录')
      }
    })
  },
  //获取Openid
  getOpenid: function (code) {
    var that = this;
    // wx.showLoading({
    //   mask: true
    // })
    wx.request({
      url: that.globalUrl + that.Openid,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        code: code,
      },
      method: 'POST',
      success: function (res) {
        if (res.data.suc == 'y') {
          console.log('openid', res.data.data.openid)
          var userInfo = that.globalData.userInfo;
          userInfo.openid = res.data.data.openid;
          that.globalData.openid = res.data.data.openid;
          that.userLogin(userInfo);
        }else{
          console.log('openid失败', res.data)
        }
      },
      fail: function (err) {
        console.log(err);
      }
    });
  },
  //将用户登录信息同步到后台
  userLogin: function (userInfo) {
    var that = this;
    var data = {
      nickname: userInfo.nickName,
      img_url: userInfo.avatarUrl,
      gender: JSON.stringify(userInfo.gender),
      openid: userInfo.openid
    };
    wx.request({
      url: that.globalUrl + that.Memberid,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      data: data,
      success: function (res) {
        if (res.data.suc == 'y') {
          console.log('userInfo',res.data)
          that.globalData.member_id = res.data.data.id;
          that.globalData.userInfo = res.data.data;
          that.globalData.userInfo.token = res.data.data.id;
          wx.hideLoading()
        }
      },
      fail: function (error) {
        console.log(error);
      }
    });
  },
  checkSession: function () {
    wx.checkSession({
      success: function () {
        //session 未过期，并且在本生命周期一直有效
      },
      fail: function () {
        //登录态过期
        wx.login() //重新登录
      }
    });
  },
  globalData: {
    hasLogin: false,
    userInfo: {},
    openid: null,
    member_id: null,
    //排序组件
    allPaiXuData: {
      hangyepaixu: '../../img/paixu2.png',
      xiaoliangpaixu: '../../img/paixu0.png',
      julipaixu: '../../img/paixu0.png',
      paixuList: ['../../img/paixu0.png', '../../img/paixu1.png', '../../img/paixu2.png'],
      // 排序规则：1、3、5降序，2、4、6升序，0不排序。
      nowPaiXu: 1,
    },
    scrollHeight:0,
    firstLongitude:0,
    firstLatitude:0
  },
  showSearchToast: function (e) {
    wx.showLoading({
      title: '搜索中',
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 600)
  },
  // 获取当前日期和第二天日期用于默认进店离店时间
  getEnterAndLeaveDate(AddDayCount) {
    var dd = new Date();
    dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;//获取当前月份的日期
    var d = dd.getDate();
    return y + "-" + m + "-" + d;
  },
  //获取用户当前所在位置
  getFirstLocation() {
    var that = this
    return new Promise(function (resolve, reject) {
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          that.globalData.firstLongitude = res.longitude
          that.globalData.firstLatitude = res.latitude
          resolve(res);
        },
        fail(res) {
          console.log('fail')
          reject(res);
        }
      })
    });
  },
})