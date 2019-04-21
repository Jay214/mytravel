// pages/post/post.js
const util = require('../../utils/util.js')
const app = getApp()
//console.log('uid',uid)
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item:{},
    show: true,
    userId: 0
  },
  replyFocus(e) {
    this.setData({ show: false })
  },
  replyBlur(e) {
    this.setData({ show: true })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log((getCurrentPages()[0].route).replace('pages', '..'))
    that = this;
    const {id, uid, type} = options;
    util.request.get('/getPost', { id, uid, type, ownid: app.globalData.id })
      .then(res => {
        console.log(res.data)
        that.setData({
          item: res.data.data,
          userId: app.globalData.id
        })
      })
  },
  onCollect(){
    let { is_collect, id,type } = that.data.item;
    util.request.get('/triggerInfo',{ isGet: is_collect, post_id: id, uid: app.globalData.id, type: 0, t:type  })
      .then(res => {
        console.log(res)
        that.data.item.is_collect = !is_collect;
        if(is_collect){
          that.data.item.collection -= 1
        }else{
          that.data.item.collection += 1
        }
        that.setData({ item: that.data.item })
        })
      .catch(err => { wx.showToast({
        title: '出bug啦',
        duration: 1500
      })})
  },
  onSupport(){
    let {is_support, id, type} = that.data.item;
    util.request.get('/triggerInfo', { isGet: is_support, post_id: id, uid: app.globalData.id, type: 1,t:type })
      .then(res => {
        console.log(res)
        that.data.item.is_support = !is_support;
        if(is_support){
          that.data.item.support -= 1
        }else{
          that.data.item.support += 1
        }
        that.setData({ item: that.data.item })
      }).catch(err => {
        wx.showToast({
          title: '出bug啦',
          duration: 1500
        })
      })
  },
  onSend(){

  },
  onDelete(){
    util.request.get('/deletePost', { id: that.data.item.id , flag: 1 })
      .then(res => {
        const url = (getCurrentPages()[0].route).replace('pages', '..')
        wx.reLaunch({
          url: url
        })
      })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})