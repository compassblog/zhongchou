// pages/zhongchoudetail/zhongchoudetail.js
const util = require('../../utils/util.js');
const bannerTemp = require('../../utils/bannerTemp.js');
const zhongchouItem = require('../../utils/zhongchouItem.js');
const loadListData = require('../../utils/loadListData.js');
const basic = require('../../utils/basic.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jinzhanList:[],
    pingjiaList: [],
    kefuIcon: '../../img/kefu.png',
    zhongchouInfo:{},
    navItems: [
      {
        name: '详情',
        id: 0,
        checked: true,
      },
      {
        name: '进展',
        id: 1,
        checked: false,
      },
      {
        name: '留言',
        id: 2,
        checked: false,
      }],
      
  },
  onLoad(options){
    var that = this
    var fund_id = options.id
    console.log(fund_id)
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight - 100 * res.screenWidth / 750
        })
      }
    });
    // 众筹详情
    util.httpPost(app.globalUrl + app.FundDetail, { member_id: app.globalData.member_id, fund_id: fund_id }, this.processDetailData);
    // 参与列表
    util.httpPost(app.globalUrl + app.FundAttendList, { fund_id: fund_id }, this.processAttendListData);
    // 留言列表
    util.httpPost(app.globalUrl + app.FundMessageList, { member_id: app.globalData.member_id, fund_id: fund_id }, this.processMessageListData);
  },
  processDetailData: function (res) {
    if (res.suc == 'y') {
      console.log('获取众筹详情成功', res.data);
      res.data.logo_url = app.globalImageUrl + res.data.logo_url;
      res.data.value = (parseInt(res.data.actual_amount || 0) / parseInt(res.data.amount) * 100).toFixed(2);
      res.data.paddingLeft = (res.data.value * 0.8 - 2) + '%';
      res.data.btn = res.data.flag == 1 ? '我要众筹' : (res.data.flag == 2 ? '我要留言' : '已完成')
      this.setData({
        zhongchouInfo: res.data,
      })
    } else {
      console.log('获取众筹详情错误', res);
    }
  },
  processAttendListData: function (res) {
    if (res.suc == 'y') {
      console.log('获取参与列表成功', res.data);
      this.setData({
        jinzhanList: res.data,
      })
    } else {
      console.log('获取参与列表错误', res);
    }
  },
  processMessageListData: function (res) {
    if (res.suc == 'y') {
      console.log('获取留言列表成功', res.data);
      this.setData({
        pingjiaList: res.data,
      })
    } else {
      console.log('获取留言列表错误', res);
    }
  },
  clickBtn(e){
    var that = this;
    var params = {
      zhongchouInfo: this.data.zhongchouInfo
    }
    var btn = this.data.zhongchouInfo.btn
    if(btn == '已完成'){
      return
    }else if(btn == '我要留言'){
      basic.goPage('zhongchoupinglun', that, e, params)
    }else{
      basic.goPage('canyuzhongchou', that, e, params)
    }
  },
  kefu() {
    wx.makePhoneCall({
      phoneNumber: '13067998666',
    })
  },
  /* ===选择顶部菜单 */
  checked: function (e) {
    var that = this
    var article_type = e.target.dataset.id;
    //点击已选中的菜单时，直接返回
    if (article_type === that.data.article_type) {
      return
    } else {
      var index = e.target.dataset.index;
      console.log(index)
      var name = e.target.dataset.name;
      that.setData({
        // article_type: article_type,
        // page: 0,
        // youhuiquan_list: [],
        // bindDownLoad: true,
        // total_page: 1,
        index: index,
        // name: name
      })
      // that.loadData(index)
      that.changeStyle(index)
    }
  },
  //修改顶部菜单样式
  changeStyle: function (index) {
    var navItems = this.data.navItems
    for (var i = 0; i < navItems.length; i++) {
      navItems[i]['checked'] = false
    };
    navItems[index]['checked'] = true
    this.setData({
      navItems: navItems
    })
  },
})