// components/collection/collection.js
Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    innerTexts: {
      type: Array,
      value: [],
    }
  },
  data: {
    // 这里是一些组件内部数据
    currentTab: 0,
  },
  methods: {
    // 这里是一个自定义方法
    switchTab(e){
      //console.log(e);
      let tab = e.target.id;
      console.log(tab)
      if(tab!=undefined){
        this.setData({ currentTab: tab })
        this.triggerEvent('onTab', tab)
      }
    }
  }
})