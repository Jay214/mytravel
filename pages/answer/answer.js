// pages/answer/answer.js
let that;
const app = getApp()
const util = require('../../utils/util.js')
let qid;//问题id
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: { content: '很难无法完成怎么办？', pv: '999次浏览', collection: 999, moment: "2019-3-7" },
    answers: {
      length: 999,
      list: [
        { src: "/img/pic.jpg", username: 'juajdisa', content: "很难无法完成很难无法完成很难无法完成很难无法完成", support: 999, moment: "2019-2-21" },
        { src: "/img/pic.jpg", username: 'juajdisa', content: "很难无法完成很难无法完成很难无法完成很难无法完成", support: 999, moment: "2019-2-21" },
        { src: "/img/pic.jpg", username: 'juajdisa', content: "很难无法完成很难无法完成很难无法完成很难无法完成", support: 999, moment: "2019-2-21" }
      ],
      userId:0
    },
    show: true,
    content: '',
    hide:true
  },
  replyFocus(e){
    this.setData({ show: false })
  },
  replyBlur(e){
    this.setData({ show: true })
  },
  replyInput(e){
    that.setData({ content: e.detail.value })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    const { id, uid, type } = options;
    qid = id
    util.request.get('/getPost', { id, uid, type, ownid: app.globalData.id })
      .then(res => {
        that.setData({
          item: res.data.data,
          userId: app.globalData.id
        })
      }).catch(e => {
        console.log('err: ', e)
      })
    util.request.get('/getComments', { qid: id, ownid: app.globalData.id })
      .then(res => {
        that.setData({ answers: res.data.data })
      }).catch(e => {
        console.log('err: ',e)
      })
  },
  onCollect() {
    let { is_collect, id } = that.data.item;
    util.request.get('/triggerInfo', { isGet: is_collect, post_id: id, uid: app.globalData.id, flag:2,t:2 })
      .then(res => {
        console.log(res)
        that.data.item.is_collect = !is_collect;
        if (is_collect) {
          that.data.item.collection -= 1
        } else {
          that.data.item.collection += 1
        }
        that.setData({ item: that.data.item })
      })
      .catch(err => {
        wx.showToast({
          title: '出bug啦',
          duration: 1500
        })
      })
  },
  onSend(){
    const content = that.data.content
    if(content.length>0){
      const uid = app.globalData.id;
      const qid = that.data.item.id;
      const moment = util.formatTime(new Date)
      util.request.post('/comment', { uid, content, qid, moment, to_uid: 0,flag:0 })
        .then(res => {
          util.request.get('/getComments', { qid: qid, ownid: app.globalData.id,flag:0 })
            .then(res => {
              let item = that.data.item
              item.answer = item.answer+1
              that.setData({ answers: res.data.data, item: item, content: '' })
              wx.showToast({
                title: '发表成功',
                duration: 1500
              })
            }).catch(e => {
              console.log('err: ', e)
            })
        }).catch(e => {
          console.error("err: ",e)
          wx.showToast({
            title: '发表失败',
            icon: 'none',
            duration: 2000
          })
        })
    }else{
      wx.showToast({
        title: '不能发送空内容',
        icon: 'none',
        duration: 2000
      })
    }
  },
  onSupport(e) {
    const id = e.target.id;
    const is_support = e.target.dataset.support
    util.request.get('/triggerSupport', { isGet: is_support, post_id: id, uid: app.globalData.id, type: 1 })
      .then(res => {
        const i = that.data.answers.findIndex(i => { return i.id==id })
        that.data.answers[i].is_support = !is_support;
        if (is_support) {
          that.data.answers[i].support -= 1
        } else {
          that.data.answers[i].support += 1
        }
        that.setData({ answers: that.data.answers })
      }).catch(err => {
        wx.showToast({
          title: '出bug啦',
          duration: 1500
        })
      })
  },
  onDelete() {
    wx.showModal({
      title: '确认删除该内容？',
      content: '',  
      success(res) {
        if (res.confirm) {
          util.request.get('/deletePost', { id: that.data.item.id, flag: 2 })
            .then(res => {
              wx.reLaunch({
                url: '../index/index',
              })
            })
        }
      }
    })
    
  },
  onPush(e){
    that.setData({
      hide:false
    })
  },
  hidePush(){
    that.setData({
      hide:true
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