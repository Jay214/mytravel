//user.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')
let url = '/personPost'
let that
Page({
  data: {
    motto: '我的收藏',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    innerTexts: [
     {name: "已发表", id: 0}, { name: '游记', id: 1 }, {name: '攻略',id: 2}, { name: '问答',id: 3}
    ],
    lists: [
      {title: "很难无法完成", src: "/img/cat.jpg", pv: 999, collect: 999},
      { title: "很难无法完成很难无法完成！很难无法完成很难无法完成", src: "/img/pic.jpg", pv: 999, collect: 999 },
      { title: "很难无法完成很难无法完成！很难无法完成很难无法完成！很难无法完成很难无法完成！", src: "/img/pic.jpg", pv: 999, collect: 999 },
    ],
    type: 0
  },
  onReady: function () {
    if (app.globalData.userInfo) {  
      this.setData({
        userInfo: app.globalData.userInfo, 
        hasUserInfo: true
      })
    }else{
      this.dialog = this.selectComponent("#dialog");
      // if (!app.globalData.userInfo && this.data.canIUse){
      this.showDialog()
    }
    //获得dialog组件
  
   
  // }
  },
  onLoad: function(){
    that = this
    util.request.get(url, { uid: app.globalData.id })
      .then(res => {
        that.setData({
          lists: res.data.data
        })
      }) 
  },
  //查询收藏
  getCollectList: function(e){
    that.setData({
      type: e.detail
    })
    
    url = e.detail == 0 ? '/personPost' : '/getCollection'
    util.request.get(url, { uid: app.globalData.id, type: e.detail })
      .then(res => {
        that.setData({
          lists: res.data.data
        })
      }) 
  },

  showDialog: function () {
    this.dialog.showDialog();
  },

  confirmEvent: function () {
    this.dialog.hideDialog();
  },

  bindGetUserInfo: function () {
    this.dialog.hideDialog();
    // 用户点击授权后，这里可以做一些登陆操作
    //  this.login();
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          }, function () {
            console.log('(app.globalData.userInfo2', app.globalData.userInfo)
          })
        }
      })
    }

  },

  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  } 
})
