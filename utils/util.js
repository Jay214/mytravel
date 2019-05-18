const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-');
  // + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
// 封装get请求
const get = (url, data) => {
  var promise = new Promise((resolve, reject) => {
    //网络请求
    wx.request({
      url: url,
      data: data,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {//服务器返回数据
        if (res.statusCode == 200) {
          resolve(res);
        } else {//返回错误提示信息
          reject(res.data);    
        }
      },
      error: function (e) {
        reject('网络出错');
      }
    })
  });
  return promise;
}

class Request {
  constructor(parms) {
    this.withBaseURL = parms.withBaseURL
    this.baseURL = parms.baseURL
  }
  get(url, data) {
    return this.request('GET', url, data)
  }
  post(url, data) {
    return this.request('POST', url, data)
  }
  put(url, data) {
    return this.request('PUT', url, data)
  }
  request(method, url, data) {
    const vm = this
    return new Promise((resolve, reject) => {
      wx.request({
        url: vm.withBaseURL ? vm.baseURL + url : url,
        data,
        method,
        success(res) {
          resolve(res)
        },
        fail() {
          reject({
            msg: '请求失败',
            url: vm.withBaseURL ? vm.baseURL + url : url,
            method,
            data
          })
        }
      })
    })
  }
}

const request = new Request({
  //手机
  /* baseURL: 'http://10.200.116.44', */
  baseURL: 'http://192.168.43.66',
  withBaseURL: true
})

module.exports = {
  formatTime: formatTime,
  get: get,
  request: request
}
