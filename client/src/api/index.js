// 配置API接口地址
var root = 'http://127.0.0.1:22028/' 

//var root = 'http://www.zhimengzhe.com/Javascriptjiaocheng/390541.html'
// 引用axios
var axios = require('axios')
// 自定义判断元素类型JS
function toType(obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}
// 参数过滤函数
function filterNull(o) {
  for (var key in o) {
    if (o[key] === null) {
      delete o[key]
    }
    if (toType(o[key]) === 'string') {
      o[key] = o[key].trim()
    } else if (toType(o[key]) === 'object') {
      o[key] = filterNull(o[key])
    } else if (toType(o[key]) === 'array') {
      o[key] = filterNull(o[key])
    }
  }
  return o
}
/*
  接口处理函数
  需要根据接口的参数进行调整。
  主要是，不同的接口的成功标识和失败提示是不一致的。
  另外，不同的项目的处理方法也是不一致的，这里出错就是简单的alert
*/

function apiAxios(method, url, params, success, failure) {

  // this.$Loading.start();
  if (params) {
    params = filterNull(params)
  }
  axios({
      method: method,
      url: url,
      data: method === 'POST' || method === 'PUT' ? params : null,
      params: method === 'GET' || method === 'DELETE' ? params : null,
      baseURL: root,
      withCredentials: false
    })
    .then(function(res) {
      //console.log("res",res)
      if (res.data) {
        if (success) {
          success(res.data)
        }
      } else {
        if (failure) {
          failure(res.data)
          } else {
            window.alert('error: ' + JSON.stringify(res.data))
          }
      }
        // if(res.data){
        //     /return Promise.reject(res);
        // }
      // return res;
      // if (res.data.success === true) {
      //   if (success) {
      //     success(res.data)
      //     // this.$Loading.finish();
      //     console.log('success: ' + JSON.stringify(res.data))
      //   }
      // } else {
      //   if (failure) {
      //     failure(res.data)
      //   } else {
      //     console.log('error: ' + JSON.stringify(res.data))
      //     // this.$Loading.error();
      //   }
      // }
    })
    .catch(function(err) {
      let res = err.response
      if (err) {
        // this.$Loading.error();
        console.log('api error, HTTP CODE: ' + res)
      }
    })
}

// 返回在vue模板中的调用接口
export default {
  get: function(url, params, success, failure) {
    return apiAxios('GET', url, params, success, failure)
  },
  post: function(url, params, success, failure) {
    return apiAxios('POST', url, params, success, failure)
  },
  put: function(url, params, success, failure) {
    return apiAxios('PUT', url, params, success, failure)
  },
  delete: function(url, params, success, failure) {
    return apiAxios('DELETE', url, params, success, failure)
  }
}
