// pages/publish/publish.js
const util = require('../../utils/util.js')
const App = getApp();
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ycy: true,
    navH: 0,
    height: 20,
    focus: false,
    full: false,
    hide: true,
    src: [],
    area: '惠州市惠城区',
    type: ['游记','攻略','问答'],
    index:0,
    date: util.formatTime(new Date()),
    end: util.formatTime(new Date()),
    region: ['广东省', '广州市', '海珠区'],
    customItem: '全部',
    tags: [
      { name: '景点推荐', id: 0, choosed: 0 }, { name: '购物', id: 1, choosed: 0 }, { name: '美食', id: 2, choosed: 0 }, 
      { name: '交通', id: 3, choosed: 0 }, { name: '住宿', id: 4, choosed: 0 }, { name: '自驾游', id: 5, choosed: 0 }, 
      { name: '徒步', id: 6, choosed: 0}
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
  hideTag(){
    that.setData({ hide: true }) 
  },
  switchTag(e){
    let a = that.data.tags;
    a[e.detail].choosed = !a[e.detail].choosed;
    that.setData({ tags: a })
  },
  upload: function(){
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        let tempFiles =res.tempFiles;
      /*   if(that.data.src.length>=12){
          that.setData({ full: true })
          return;
        }  */
        if ((tempFiles.length + that.data.src.length)>=11){
          wx.showToast({
            title: '已上传最多图片数量!',  //标题
            icon: 'none'       //图标 none不使用图标，详情看官方文档
          })
          tempFiles = tempFiles.slice(0, 11 - that.data.src.length)
        }
        for(let i = 0;i<tempFiles.length;i++){
        var tempFilesSize = res.tempFiles[i].size;  //获取图片的大小，单位B
        if (tempFilesSize <= 2000000) {   //图片小于或者等于2M时 可以执行获取图片
          var tempFilePaths = res.tempFilePaths[i]; //获取图片
          that.data.src.push(tempFilePaths);   //添加到数组
          that.setData({
            src: that.data.src
          })
        } else {    //图片大于2M，弹出一个提示框
          wx.showToast({
            title: '上传图片不能大于2M!',  //标题
            icon: 'none'       //图标 none不使用图标，详情看官方文档
          })
        }
      }
      }
    })
  },
  bindSubmit(){
    setTimeout(() => {
      let data = that.data
      console.log(data.val.length, data.title.length)
      if (data.val.length<=0&&data.title.length<=0) {
        wx.showToast({
          title: '不能发表空内容',
          duration: 2000,
          icon: "none"
        })
      }else{
        let param = { title: data.title, content: data.val };
        param.moment = data.date;
        param.address = data.region.join(".");
        param.type = data.index;
        param.imgSrc = data.src;
        let  tag = [];
        data.tags.map(i => { if(i.choosed == true){ tag.push(i.name) } })
        param.tag = tag.join(",");
        param.name = App.globalData.userInfo.nickName
        console.log(param)
        util.request.post('/publish',param)
          .then(res => {  
            console.log(res)
            let i = 0;
            const postId = res.data
            const len = data.src.length;
            //that.uploadDIY(data.src,i,len,postId)
            for(let i = 0,len = data.src.length;i<len;i++){
                wx.uploadFile({
                  url: 'http://10.200.116.44/upload',
                  filePath: data.src[i],
                  name: `img`,
                  formData: {
                    postId: res.data
                  },
                  success(res) {
                    console.log(res)
                  }
                })                                
            }
          }).catch(err => {
            console.error(err)
          })
            /* wx.showToast({
              title: '发表成功',
              duration: 15000,
              success: () => {
                wx.reLaunch({
                  url: '../index/index',
                })
              }
            })  */
      }
    },0)
  },
  uploadDIY(filePaths, i, len,postId){
    wx.uploadFile({
      url: 'http://10.200.116.44/upload',
      filePath: filePaths[i],
      name: `img`,
      formData: {
        postId: postId
      },
      success(res) {
        console.log(res)
      },
      complete: () => {
        i++;
        if (i == len) {
          console.log('完成')
        }
        else {  //递归调用uploadDIY函数
          that.uploadDIY(filePaths, i, len, postId);
        }
      }
    })     
  },
  navBack(){
    wx.switchTab({  
      url: "../index/index",
    })
  },
  /**  
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.setData({
      navH: App.globalData.navHeight
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
    wx.hideTabBar({

    })
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