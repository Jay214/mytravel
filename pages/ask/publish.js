// pages/publish/publish.js
const util = require('../../utils/util.js')
const App = getApp();
let that;
var arr = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    focus: false,
    full: false,
    hide: true,
    src: [],
    area: '惠州市惠城区',
    type: ['游记','攻略','问答'],
    index:0,
    region: ['广东省', '广州市'],
    customItem: '全部',
    tags: [
      { name: '景点推荐', id: 0, choosed: 0 }, { name: '购物', id: 1, choosed: 0 }, { name: '美食', id: 2, choosed: 0 }, 
      { name: '交通', id: 3, choosed: 0 }, { name: '住宿', id: 4, choosed: 0 }, { name: '自驾游', id: 5, choosed: 0 }, 
      { name: '出游准备', id: 6, choosed: 0 }, { name: '游玩娱乐', id: 7, choosed: 0 },{ name: '实用贴士', id: 8, choosed: 0 },
      { name: '人文', id: 9, choosed: 0 }, { name: '其他', id: 10, choosed: 0 }
      ],
      val: '',
      title: '',
      test: ''
  },
  bindButtonTap() {
    that.setData({
      focus: true
    })
  },
  bindTextAreaBlur(e) {
    that.setData({ val: e.detail.value})
  },
  bindTitleAreaBlur(e){ 
    that.setData({ title: e.detail.value })
  },
  bindFormSubmit(e) {
    console.log(e.detail.value.textarea)
  },
  bindPickerChange(e) {
    that.setData({
      index: e.detail.value
    })
  },
  bindDateChange(e) {
    that.setData({
      date: e.detail.value
    })
  },
  bindRegionChange(e) {
    that.setData({
      region: e.detail.value
    })
  },
  showTag(){
    that.setData({ hide: false })
  },
  addTag(){
     arr = [];
    that.data.tags.forEach(i => {
      if (i.choosed) { arr.push(i) }
    })
    that.setData({ hide: true, selectedTags: arr })
  },
  hideTag(){
    that.setData({ hide: true })
  },
  stopBubble(){
  },
  switchTag(e){
    if (arr.length == 3 && !that.data.tags[e.detail].choosed) {
      wx.showToast({
        title: '只能选择最多三个标签',
        icon: 'none'
      })
    } else {
      let a = that.data.tags;
      a[e.detail].choosed = !a[e.detail].choosed;
      that.setData({ tags: a })
      if (a[e.detail].choosed) {
        arr.push(1)
      } else {
        arr.pop()
      }
    }
  },
  bindSubmit(){
    setTimeout(() => {
      let data = that.data
      if (data.val.length<=0&&data.title.length<=0) {
        wx.showToast({
          title: '不能发表空内容',
          duration: 2000,
          icon: "none"
        })
      }else{
        let param = { title: data.title, content: data.val };
        param.moment = util.formatTime(new Date());
        param.address = data.region.join(".");
        param.type = 2;
        let  tag = [];
        data.tags.map(i => { if(i.choosed == true){ tag.push(i.name) } })
        param.tag = tag.join(",");
        param.name = App.globalData.userInfo.nickName
        console.log(param)
        util.request.post('/publish',param)
          .then(res => {  
            console.log(res)
            if(res.data.res){
              wx.showToast({
                title: '发布成功',
                icon: 'success',
                duration: 1500
              })
            }else{
              wx.showToast({
                title: res.data.err,
                icon: 'none',
                duration: 1500
              })
            }
            setTimeout(() => {
              wx.reLaunch({
                url: '../index/index'
              })
            })
          }).catch(err => {
            wx.showToast({
              title: res.data.err,
              icon: 'none',
              duration: 1500
            })
            console.error(err)
          })
      }
    },0)
  },
  /**  
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.setData({
      region: [options.province, options.city]
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