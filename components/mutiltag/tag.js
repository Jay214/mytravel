// components/tag/tag.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tags: {
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
 
  },

  /**
   * 组件的方法列表
   */
  methods: {
    switchTab(e) {
      //console.log(e);
      let tab = e.target.id;
      console.log(tab)
      if (tab != undefined) {
        this.setData({ currentTab: tab })
        this.triggerEvent('switchTag', tab)
      }
    },
    resetTab(){
      this.setData({ currentTab: 0 })
    }
  }
})
