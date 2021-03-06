//index.js
const util = require('../../utils/util.js');
const config = require('../../utils/config.js');
const paixuTemp = require('../../utils/paixuTemp.js');
const bannerTemp = require('../../utils/bannerTemp.js');
const navTemp = require('../../utils/navTemp.js'); 
const superNavTemp = require('../../utils/superNavTemp.js'); 
const dataItemTemp = require('../../utils/dataItemTemp.js');
const loadListData = require('../../utils/loadListData.js'); 
const basic = require('../../utils/basic.js'); 
const app = getApp()
Page({
  data: {
    imgHttp: app.globalImageUrl,
    scrollHeight: app.globalData.scrollHeight,
    search_key: '',
    positionValue: '',
    slider1: [],
    slider2: [],
    saomiao:'../../img/saomiao.png',
    positionImg:'../../img/position.png',
    search_icon: '../../img/search.png',
    nav_3List: [
      {
        id: 0,
        img: '../../img/zhongchou/shenqingruzhu.png',
        text: '申请入驻',
        page: 'shenqingruzhu'
      },
      {
        id: 1,
        img: '../../img/zhongchou/youhuiquan.png',
        text: '优惠券',
        page:'youhuiquan'
      },
      {
        id: 2,
        img: '../../img/zhongchou/yaoqing.png',
        text: '邀请好友',
        page: 'yaoqinghaoyou'
      },
      {
        id: 3,
        img: '../../img/zhongchou/huodong.png',
        text: '活动',
        page: 'huodong'
      },
      // {
      //   id: 4,
      //   img: '../../img/zhongchou/shenqingruzhu.png',
      //   text: '行业1',
      //   page: ''
      // },
      // {
      //   id: 5,
      //   img: '../../img/zhongchou/youhuiquan.png',
      //   text: '行业1',
      //   page: ''
      // },
      // {
      //   id: 6,
      //   img: '../../img/zhongchou/yaoqing.png',
      //   text: '行业1',
      //   page: ''
      // },
      // {
      //   id: 7,
      //   img: '../../img/zhongchou/huodong.png',
      //   text: '行业1',
      //   page: ''
      // },
    ],
    nav_4List: [
      {
        navName: '酒店',
        navImg: '../../img/zhongchou/jiudian.png',
        navColor:'#00bcd5',
        innerNavColor:'#5cdff2',
        hasRadius:true,
        navInnerList: [
          {
            name: '酒店-名宿客栈',
            trade_id: 2,
            page: 'jiudianList'
          },
          {
            name: '酒店-排屋别墅',
            trade_id: 3,
            hasRadius: true,
            page: 'jiudianList'
          },
          {
            name: '酒店-度假公寓',
            trade_id: 4,
            page: 'jiudianList'
          },
          {
            name: '酒店-星级酒店',
            trade_id: 5,
            page: 'jiudianList'
          },
        ]
      },
      {
        navName: '旅游',
        navImg: '../../img/zhongchou/lvyou.png',
        navColor: '#7ce261',
        innerNavColor: '#a2ea8e',
        navInnerList: [
          {
            name: '旅游-国内游',
            trade_id: 7,
            page: 'jiudianList'
          },
          {
            name: '旅游-景点门票',
            trade_id: 8,
            page: 'jiudianList'
          },
          {
            name: '旅游-境外游',
            trade_id: 9,
            page: 'jiudianList'
          },
          {
            name: '旅游-跟团游',
            trade_id: 10,
            page: 'jiudianList'
          },
        ]
      },
      {
        navName: '餐饮',
        navImg: '../../img/zhongchou/canyin.png',
        navColor: '#f8c751',
        innerNavColor: '#fdda7b',
        navInnerList: [
          {
            name: '餐饮-农家味道',
            trade_id:12,
            page: 'jiudianList'
          },
          {
            name: '餐饮-西式餐厅',
            trade_id: 13,
            page: 'jiudianList'
          },
          {
            name: '餐饮-地方早点',
            trade_id: 14,
            page: 'jiudianList'
          },
          {
            name: '餐饮-咖啡茶座',
            trade_id: 15,
            page: 'jiudianList'
          },
        ]
      },
      {
        navName: '服饰',
        navImg: '../../img/zhongchou/fushi.png',
        navColor:'#fc928c',
        innerNavColor:'#fdb2af',
        navInnerList: [
          {
            name: '服饰-珠宝首饰',
            trade_id: 17,
            page: 'jiudianList'
          },
          {
            name: '服饰-潮流饰品',
            trade_id: 18,
            page: 'jiudianList'
          },
          {
            name: '服饰-品质手表',
            trade_id: 19,
            page: 'jiudianList'
          },
          {
            name: '服饰-绅士配件',
            trade_id: 20,
            page: 'jiudianList'
          },
        ]
      },
    ],
    // 排序组件所需data
    allData: app.globalData.allPaiXuData,
    // 底部数据列表
    dataList: [],
    page_no: 1,
    total_page: 1,
    showNomore: false
  },
  onLoad(options){
    var salesman_id = options.salesman_id || ''
    console.log('salesman_id', salesman_id)
    if (salesman_id && app.globalData.member_id != salesman_id){
      var params = {
        salesman_id: salesman_id,
        member_id: app.globalData.member_id
      }
      util.httpPost2(app.globalUrl + app.SendSalesman, params).then(res => {console.log('被邀请用户点击进来了',res)})
    }
  },
  onShow() {
    // 数据初始化
    this.inteData()
    // 请求商铺数据
    if (app.globalData.firstLongitude){
      this.loadStorData()
    }else{
      app.getFirstLocation().then(this.loadStorDataAndCityName)
    }
    //请求banner数据
    this.loadBannerData();
  },
  inteData(){
    this.setData({
      bindDownLoad: true,
      page_no: 1,
      dataList: [],
      total_page: 1,
      showNomore: false
    })
  },
  loadStorDataAndCityName(res){
    this.getCityName(res)
    this.loadStorData()
  },
  getCityName(res){
    var params = {
      location: res.latitude + ',' + res.longitude,
      key: config.key
    }
    util.httpPost2(app.MAP, params).then(this.processLocation)
  },
  processLocation(res){
    console.log('请求当前位置返回数据', res)
    app.globalData.firstAddress = res.result.address
    this.setData({
      //此时应该显示的城市名称
      positionValue: res.result.ad_info.district
    })
  },
  loadStorData() {
    var params = {
      order_by: this.data.allData.nowPaiXu,
      page_no: 1,
      page_size: 15,
      is_top: 2,
      cur_fixed: app.globalData.firstLongitude + ',' + app.globalData.firstLatitude
    }
    this.loadListData(params);
  },
  loadBannerData(){
    var params1 = {
      region_id: 3144,  //地区ID搜索
      loca_id: 1
    }
    var params2 = {
      region_id: 3144,  //地区ID搜索
      loca_id: 2
    }
    util.httpPost2(app.globalUrl + app.BANNER, params1).then(this.processBannerData)
    util.httpPost2(app.globalUrl + app.BANNER, params2).then(this.processBannerCenterData)
  },
  // 顶部banner
  processBannerData: function (res) {
    if (res.suc == 'y') {
      console.log('顶部banner数据', res.data);
      for(var i in res.data){
        res.data[i].img_src = app.globalImageUrl + res.data[i].img_src
      }
      this.setData({
        slider1: res.data
      })
    }
  },
  // 中间banner
  processBannerCenterData: function (res) {
    if (res.suc == 'y') {
      console.log('中间banner数据', res.data); 
      for (var i in res.data) {
        res.data[i].img_src = app.globalImageUrl + res.data[i].img_src
      }
      this.setData({
        slider2: res.data
      })
    }
  },
  saoyisao:function(){
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log(res)
      }
    })
  }, 
  // switchCity(e){
  //   var that = this
  //   basic.goPage('switchcity', that, e,)
  // },
  //页面跳转
  goPage: function (e) {
    var that = this
    var page = e.target.dataset.page
    basic.goPage(page, that, e,)
  },
  // 输入搜索文字
  input: function (e) {
    var search_key = e.detail.value
    this.setData({
      search_key: search_key
    })
  },
  // 确认搜索
  search: function (e) {
    var that = this
    var search_key = this.data.search_key
    if (search_key.replace(/(^\s*)|(\s*$)/g, "").length == 0) {
      wx.showToast({
        title: '请输入您要搜索的商品',
        duration: 1000
      })
    } else {
      var go = function (e) {
        that.setData({
          search_key: ''
        })
        search_key = JSON.stringify(search_key)
        wx.navigateTo({
          url: '../search/search?search_key=' + search_key
        })
      }
      var data = { go, e }
      that.clickTooFast(data)
    }
  },
  // 下拉加载更多购物车数据
  bindDownLoad: function (e) {
    var params = {
      order_by: this.data.allData.nowPaiXu,
      page_no: this.data.page_no,
      page_size: 15,
      is_top: 2,
      cur_fixed: app.globalData.firstLongitude + ',' + app.globalData.firstLatitude
    }
    this.loadListData(params)
  },
  // 加载数据
  loadListData: function (params) {
    var that = this
    var allParams = {
      that: that,
      params: params,
      app: app,
      processData: that.processStoreData,
      API: app.STORELIST
    }
    loadListData.loadListData(allParams)
  },
  processStoreData(res){
    if (res.suc == 'y') {
      var dataList = this.data.dataList
      console.log('获取商铺list成功', res.data);
      if ((res.data.list instanceof Array && res.data.list.length < 15) || (res.data.list == '')) {
        this.setData({
          showNomore: true
        })
      }
      // if (app.globalData.hasLogin){
        wx.hideLoading()
      // }
      for (var i in res.data.list){
        res.data.list[i].store_img_src = app.globalImageUrl + res.data.list[i].store_img_src
        res.data.list[i].special = res.data.list[i].special.split(",");
      }
      //获取数据之后需要改变page和totalPage数值，保障上拉加载下一页数据的page值，其余没有需要修改的数据
      dataList = dataList.concat(res.data.list)
      this.setData({
        page_no: this.data.page_no + 1,
        total_page: res.data.total_page,
        dataList: dataList,
      })
    } else {
      console.log('获取商铺list错误', res);
    }
  },
  kefu(){
    wx.makePhoneCall({
      phoneNumber: '13067998666',
    })
  },
  /*==========
  防止快速点击
  ===========*/
  clickTooFast: function (data) {
    var lastTime = this.data.lastTime
    var curTime = data.e.timeStamp
    if (lastTime > 0) {
      if (curTime - lastTime < 1000) {
        console.log('点击太快了')
        return
      } else {
        data.go(data.e)
      }
    } else {
      data.go(data.e)
    }
    this.setData({
      lastTime: curTime
    })
  },
  //以下全是组件事件
  //点击广告
  clickBanner: function (e) {
    var that = this
    bannerTemp.clickBanner(e, that)
  },
  // 点击顶部大分类菜单
  clickSuperNav(e){
    var that = this
    var item = e.currentTarget.dataset.item
    superNavTemp.clickSuperNav(e, that, item)
  },
  // 点击子菜单
  clickNav: function (e) {
    var that = this
    var item = e.currentTarget.dataset.item
    navTemp.clickNav(e, that, item)
  },
  // 点击子数据
  clickItem: function (e) {
    var that = this
    var item = e.currentTarget.dataset.item
    dataItemTemp.clickItem(e, that, item)
  },
  hangyepaixu: function (e) {
    // 数据初始化,但暂时不清空dataList
    this.setData({
      bindDownLoad: true,
      page_no: 1,
      total_page: 1
    })
    var that = this 
    var nowPaiXu = paixuTemp.hangyepaixu(e, that)
    this.loadStorDataByOrder(e)
  },
  xiaoliangpaixu: function (e) {
    // 数据初始化,但暂时不清空dataList
    this.setData({
      bindDownLoad: true,
      page_no: 1,
      total_page: 1
    })
    var that = this
    var nowPaiXu = paixuTemp.xiaoliangpaixu(e, that)
    this.loadStorDataByOrder(e)
  },
  julipaixu: function (e) {
    // 数据初始化,但暂时不清空dataList
    this.setData({
      bindDownLoad: true,
      page_no: 1,
      total_page: 1
    })
    var that = this
    var nowPaiXu = paixuTemp.julipaixu(e, that)
    this.loadStorDataByOrder(e)
  },
  // 点击排序重新请求数据，不能先清空dataList，会出现闪动；
  // 目前先单独处理，之后需要对请求data函数做处理，根据标志位判断当前的请求是加载下一页，还是完全更新数据
  loadStorDataByOrder(e){
    var params = {
      order_by: this.data.allData.nowPaiXu,
      page_no: 1,
      page_size: 15,
      is_top: 2,
      cur_fixed: app.globalData.firstLongitude + ',' + app.globalData.firstLatitude
    }
    this.loadListDataByOrder(params);
  },
  loadListDataByOrder(params){
    var that = this
    var allParams = {
      that: that,
      params: params,
      app: app,
      processData: that.processStoreByOrderData,
      API: app.STORELIST
    }
    loadListData.loadListData(allParams)
  },
  processStoreByOrderData(res){
    if (res.suc == 'y') {
      var dataList = []
      console.log('获取商铺list成功', res.data);
      if (app.globalData.hasLogin) {
        wx.hideLoading()
      }
      for (var i in res.data.list) {
        res.data.list[i].store_img_src = app.globalImageUrl + res.data.list[i].store_img_src
        res.data.list[i].special = res.data.list[i].special.split(",");
      }
      //获取数据之后需要改变page和totalPage数值，保障上拉加载下一页数据的page值，其余没有需要修改的数据
      dataList = dataList.concat(res.data.list)
      this.setData({
        page_no: this.data.page_no + 1,
        total_page: res.data.total_page,
        dataList: dataList,
      })
    } else {
      console.log('获取商铺list错误', res);
    }
  }
})