// pages/search/search.js
const util = require('../../utils/util.js')
const city = require('../../static/city.js')
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sercherStorage: [],
    hide:false,
    citys: city.city[0].list
  },
  showTag() {
    that.setData({ hide: false })
  },
  hideTag() {
    that.setData({ hide: true })
  },
  onCancel(){
    wx.navigateBack({
      
    })
  },
  getHistory: function () {
    var that = this;
    wx.getStorage({
      key: "history",
      success: function (res) {
        that.setData({
          sercherStorage: res.data
        })
      }
    })
  },
  onSearch(e){
    if(e.detail.value.length>0){
      const data = that.data.sercherStorage.push(e.detail.value)
      wx.setStorage({
        key: 'history',
        data: data,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.getHistory()
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
    console.log(that.data.citys[0].name)
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