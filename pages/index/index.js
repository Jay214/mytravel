//index.js
//获取应用实例
const util = require('../../utils/util.js')
const city = require('../../static/region.js')
const tags = [
  { name: '全部', id: 0, choosed: 0 }, { name: '购物', id: 1, choosed: 0 }, { name: '美食', id: 2, choosed: 0 },
  { name: '交通', id: 3, choosed: 0 }, { name: '住宿', id: 4, choosed: 0 }, { name: '自驾游', id: 5, choosed: 0 },
  { name: '出游准备', id: 6, choosed: 0 }, { name: '游玩娱乐', id: 7, choosed: 0 }, { name: '实用贴士', id: 8, choosed: 0 },
  { name: '人文', id: 9, choosed: 0 }, { name: '景点推荐', id: 10, choosed: 0 },{ name: '其他', id: 11, choosed: 0 }
]
const app = getApp()
var list = []
let that;
let url = '/getSightList';
let page = 2;
Page({
  data: {
    innerTexts: [{ name: "推荐", id: 0 }, { name: '游记', id: 1 }, { name: '攻略', id: 2 }, { name: '问答', id: 3 } ],
    lists: [],
    tags: [{ name: '景点', id: 0 }, { name: '购物', id: 1 }, { name: '美食',id:2}],
    multiIndex: [0, 0],
    multiArray: city.multiArray, 
    objectMultiArray: city.objectMultiArray,
    type: 0,
    tag: 0,
    loading: 0,
    top: 1
  },

  bindMultiPickerChange: function (e) {
    that.selectComponent('#tag').resetTab()
    that.setData({
      "multiIndex[0]": e.detail.value[0],
      "multiIndex[1]": e.detail.value[1],
      tag: 0
    })
    const region = [that.data.multiArray[0][that.data.multiIndex[0]],that.data.multiArray[1][that.data.multiIndex[1]]]
    wx.setStorageSync('region', region)
    const name = that.data.multiArray[1][that.data.multiIndex[1]];
    util.request.get(url,{name: name, tag: '全部', type: that.data.type})
      .then(res => {
        that.setData({
          lists: res.data.data,

        })
      })
  },
  bindMultiPickerColumnChange: function (e) {
    switch (e.detail.column) {
      case 0:
        list = []
        for (var i = 0; i < that.data.objectMultiArray.length; i++) {
          if (that.data.objectMultiArray[i].parid == that.data.objectMultiArray[e.detail.value].regid) {
            list.push(that.data.objectMultiArray[i].regname)
          }
        }
        that.setData({
          "multiArray[1]": list,
          "multiIndex[0]": e.detail.value,
          "multiIndex[1]": 0
        })

    }
  },
  onReady: function(){
     that = this;
    wx.getSetting({ 
      success: function (res) {
        if (!res.authSetting['scope.userInfo']) {   
          that.dialog = that.selectComponent("#dialog");
          // if (!app.globalData.userInfo && that.data.canIUse){
          that.showDialog()
        }
      }
     
    })
  },
  showDialog: function () {
    that.dialog.showDialog();
  },

  confirmEvent: function () {
    that.dialog.hideDialog();
  },

  bindGetUserInfo: function () {
    that.dialog.hideDialog();
    // 用户点击授权后，这里可以做一些登陆操作
    if (app.globalData.userInfo) {
      that.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (that.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        that.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理  
      wx.getUserInfo({    
        success: res => {   
          that.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          }) //查询数据库并登陆
          util.request.post('/signin',res.userInfo)
            .then(result => {
              console.log('sigin',result.data)
              app.globalData.userInfo = res.userInfo
              app.globalData.id = result.data.id
            })
        },
        fail: function(){
          //跳转到点击按钮授权页面
          wx.redirectTo({
            url: '../login/login',
          })
        }  
      })
    }
  },
  onLoad: function () {
    wx.getLocation({ 
      type: 'gcj02',
      success(res) { 
        const latitude = res.latitude
        const longitude = res.longitude
        let url = 'https://apis.map.qq.com/ws/geocoder/v1/?location='
        url += `${latitude},${longitude}&key=NSABZ-UPSWX-7R343-7SZYT-OULUE-6OFTW`;
        wx.setStorageSync('la', latitude);
        wx.setStorageSync('lg', longitude);
        util.get(url,null) 
          .then(res => { 
            const data = res.data.result.address_component
            const region = [data.province, data.city, data.district]
            wx.setStorageSync('region', region)
            const province = data.province.replace("省",''), city = data.city.replace('市','')
            const n = that.data.multiArray[0].findIndex(i => i==province)
            list = []
            for (let i = 0; i < that.data.objectMultiArray.length; i++) {
              if (that.data.objectMultiArray[i].parid == that.data.objectMultiArray[n].regid) {
                list.push(that.data.objectMultiArray[i].regname)
              }
            }
            that.setData({
              "multiArray[1]": list
            })
            const m = list.findIndex(i => i==city)
            that.setData({ multiIndex: [n,m]})
            return util.get(`http://192.168.43.66/getSightList?name=${city}&tag=全部`)
          }).then(res => {
            //console.log(res)
            that.setData({
              lists: res.data.data
            })
          }).catch(err => {
            console.error('err: ',err)
            wx.showToast({ 
              title: 'err',    
              icon: 'loading', 
              duration: 2000
            })
          })
      
      }
    })
  },
  getCollectList: function (e) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    //  let url = ''
    that.setData({
      type: e.detail
    })
    if(e.detail!=0){
      that.setData({ tags: tags })
      url = e.detail == 3 ? '/getQuestionList': '/getTravelList'
    }else{
      that.setData({ tags: [{ name: '景点', id: 0 }, { name: '购物', id: 1 }, { name: '美食', id: 2 }] })
      url = '/getSightList'
    }
    const name = that.data.multiArray[1][that.data.multiIndex[1]];
    util.request.get(url,{name: name, tag: '全部', type: e.detail})
      .then(res => {
        that.setData({
          tag: 0,
          lists: res.data.data
        })
        that.selectComponent('#tag').resetTab()
        console.log(res.data) 
        wx.hideLoading()
      }).catch(e => {
        console.error('err: ',e)
        wx.hideLoading()
        wx.showToast({
          title: '加载出错',
          icon: 'loading',
          duration: 1500
        })
      }) 
  },  
  switchTag: function(e) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    that.setData({
      tag: e.detail 
    })
    const name = that.data.multiArray[1][that.data.multiIndex[1]];
   try{
     util.request.get(url, { name: name, tag: that.data.tags[e.detail].name, type: that.data.type })
       .then(res => {
         // console.log(res.data)
         that.setData({
           lists: res.data.data
         })
         wx.hideLoading()
       }).catch(e => {
         console.error('err: ', e)
         wx.hideLoading()
         wx.showToast({
           title: '加载出错',
           icon: 'loading',
           duration: 1500
         })
       }) 
   }catch(e){
     wx.hideLoading()
     wx.showToast({
       title: '加载出错',
       icon: 'loading',
       duration: 1500
     })
   }
  },
  onShow: function(){
    wx.showTabBar({

    })  
  },
  onSearch() {
    wx.navigateTo({
      url: `../find/index?city=${that.data.multiArray[1][that.data.multiIndex[1]]}`,
    })

  },
  toAsk(){
    wx.navigateTo({
      url: `../ask/publish?province=${that.data.multiArray[0][that.data.multiIndex[0]]}&city=${that.data.multiArray[1][that.data.multiIndex[1]]}`
    })
  },
  onReachBottom(){
    if(that.data.type==0){
      that.setData({ loading: 1 })
      const name = that.data.multiArray[1][that.data.multiIndex[1]];
      util.request.get(url, { name: name, tag: that.data.tags[that.data.tag].name, type: that.data.type, page: page++ })
        .then(res => {
          // console.log(res.data)
          that.data.lists.forEach(i => {

          })
          that.setData({
            lists: that.data.lists.concat(res.data.data),
            loading: 0
          })
        }).catch(e => {
          console.error('err: ', e)
          that.setData({ loading: 0 })
          wx.showToast({
            title: '加载出错',
            icon: 'loading',
            duration: 1500
          })
        })
    }
  },
  //回到顶部
  gotoTop() {
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  //监听页面滚动
  onPageScroll(e){

    if(e.scrollTop>=500){
      that.setData({
        top: 0
      })
    }else{
      that.setData({ top: 1 })
    }
  }
})
