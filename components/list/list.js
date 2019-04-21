// components/list/list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    lists: {
      type: Array,
      value: []
    },
    currentTab: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    hasImg: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    imgErr(e){
      console.log('load img Error: ',e.detail)
      this.setData({hasImg: false})
    }
  }
})
