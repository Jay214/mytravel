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
    userId: 0,
    content: '',
    answers:[]
  },
  replyFocus(e) {
    this.setData({ show: false })
  },
  replyBlur(e) {
    this.setData({ show: true })
  },
  replyInput(e) {
    that.setData({ content: e.detail.value })
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
    util.request.get('/getComments', { qid: id, ownid: app.globalData.id,flag:1 })
      .then(res => {
        that.setData({ answers: res.data.data })
      }).catch(e => {
        console.log('err: ', e)
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
        title: '更新收藏失败',
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
  onSend() {
    const content = that.data.content
    if (content.length > 0) {
      const uid = app.globalData.id;
      const qid = that.data.item.id;
      const moment = util.formatTime(new Date)
      util.request.post('/comment', { uid, content, qid, moment, to_uid: 0, flag: 1 })
        .then(res => {
          util.request.get('/getComments', { qid: qid, ownid: app.globalData.id,flag:1 })
            .then(res => {
              let item = that.data.item
              item.comments = item.comments + 1
              that.setData({ answers: res.data.data, item: item, content: '' })
              wx.showToast({
                title: '发表成功',
                duration: 1500
              })
            }).catch(e => {
              console.log('err: ', e)
            })
        }).catch(e => {
          console.error("err: ", e)
          wx.showToast({
            title: '发表失败',
            icon: 'none',
            duration: 2000
          })
        })
    } else {
      wx.showToast({
        title: '不能发送空内容',
        icon: 'none',
        duration: 2000
      })
    }
  },
  onDelete(){
    wx.showActionSheet({
      itemList: ['删除'],
      itemColor: '#DD4F43',
      success(res) {
        util.request.get('/deletePost', { id: that.data.item.id, flag: 1 })
          .then(res => {
            const url = (getCurrentPages()[0].route).replace('pages', '..')
            wx.reLaunch({
              url: '../index/index'
            })
          })
      }
    });
   
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