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
    type: 0,
    distance: '',
    lat:0,
    lng: 0
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
    console.log(options)
    wx.setNavigationBarTitle({
      title: options.title
    })
    util.request.get('/getSightDetail', { url: options.url, type: options.tag, flag: options.flag })
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
       
        setTimeout(() => {
          util.get(`https://apis.map.qq.com/ws/geocoder/v1/?address=${that.data.s_sight_addr}&key=NSABZ-UPSWX-7R343-7SZYT-OULUE-6OFTW`)
            .then(res => {
              console.log(res)
              const { lat, lng } = res.data.result.location
              const la = wx.getStorageSync('la');
              const lg = wx.getStorageSync('lg');
              const url = `https://apis.map.qq.com/ws/distance/v1/?mode=driving&from=${la},${lg}&to=${lat},${lng}&key=NSABZ-UPSWX-7R343-7SZYT-OULUE-6OFTW`;
              util.get(url)
                .then(res => {
                  const distance = res.data.result.elements[0].distance
                  that.setData({
                    distance: distance > 1000 ? parseInt(distance / 1000) + '公里' : distance + 'm',
                    lat: lat,
                    lng: lng
                  })
                })
            })
        },50)
      })

   
  },
  openMap(){
    util.get(`https://apis.map.qq.com/ws/geocoder/v1/?address=${that.data.s_sight_addr}&key=NSABZ-UPSWX-7R343-7SZYT-OULUE-6OFTW`)
      .then(res => {
       
        const { lat, lng } = that.data;
        wx.openLocation({
          latitude: lat, // 纬度，范围为-90~90，负数表示南纬
          longitude: lng, // 经度，范围为-180~180，负数表示西经
          scale: 18, // 缩放比例
          name: that.data.s_sight_addr,
          address: that.data.s_sight_addr
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