//user.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')
let url = '/personPost'
let that
let a,b
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
    type: 0,
    msg:0,
    num:[]
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
      let qids = []
    util.request.get('/message', { uid: app.globalData.id })
      .then(res => {
        qids = res.data
         a = wx.getStorageSync('msg') ? wx.getStorageSync('msg'):0
         b = wx.getStorageSync('arr') ? wx.getStorageSync('arr') : []
        that.setData({ msg: parseInt(a) })
        that.setData({
          num: qids
        })
      })
      setInterval(() => {

        util.request.get('/message', { uid: app.globalData.id })
        .then(res => {
          const count = that.data.num;
          let msg = 0;
          let arr = []
          res.data.forEach((i,k) => {
            i.answer - count[k].answer>0 ? arr.push(i):''
            msg += (i.answer-count[k].answer)
          })
          if(msg>0){
            wx.setStorageSync('arr', b.concat(arr))
            wx.setStorageSync('msg', msg+parseInt(a))
            that.setData({ msg: msg+parseInt(a) })
          }
        })
      },5000)
  },
  onShow(){
   /*  let qids = []
    util.request.get('/message', { uid: app.globalData.id })
      .then(res => {
        qids = res.data
        a = wx.getStorageSync('msg') ? wx.getStorageSync('msg') : 0
        b = wx.getStorageSync('arr') ? wx.getStorageSync('arr') : []
        that.setData({ msg: parseInt(a) })
        that.setData({
          num: qids
        })
      })
    var timer = null
    clearInterval(timer)
    var timer = setInterval(() => {
      util.request.get('/message', { uid: app.globalData.id })
        .then(res => {
          const count = that.data.num;
          let msg = 0;
          let arr = []
          res.data.forEach((i, k) => {
            i.answer - count[k].answer > 0 ? arr.push(i) : ''
            msg += (i.answer - count[k].answer)
          })
          if (msg > 0) {
            wx.setStorageSync('arr', b.concat(arr))
            wx.setStorageSync('msg', msg + parseInt(a))
            that.setData({ msg: msg + parseInt(a) })
          }
        })
    }, 5000) */
  },
  switchMsg(){
    wx.navigateTo({
      url: '../msg/msg',
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
