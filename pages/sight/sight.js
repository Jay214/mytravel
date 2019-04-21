// pages/sight/sight.js
const util = require('../../utils/util.js')
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addr: '景点名称',
    imgUrls: [],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    bright: "",
    description: "",
    detailcon: "",
    s_sight_addr: "",
    s_sight_in_list: "",
    traffic: "",
    type: 0
  },
  changeIndicatorDots(e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay(e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange(e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange(e) {
    this.setData({
      duration: e.detail.value
    })
  },
  test(){
    console.log('----------test-------')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    console.log(options.tag)
    wx.setNavigationBarTitle({
      title: options.title
    })
    util.request.get('/getSightDetail', { url: options.url, type: options.tag})
      .then(res => {
        const { img, s_sight_addr, s_sight_in_list, description, detailcon, bright, traffic } = res.data.data
        that.setData({
          imgUrls: img,
          s_sight_addr: s_sight_addr,
          s_sight_in_list: s_sight_in_list,
          description: description,
          detailcon: detailcon,
          bright: bright,
          traffic: traffic,
          addr: options.title,
          type: options.tag

        })
        console.log(res.data.data)

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