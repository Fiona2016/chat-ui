import axios from 'axios'
import {aiAskUrl} from './config'
// 创建 axios 实例
const instance = axios.create({
  baseURL: aiAskUrl, // 设置默认的 baseURL
  timeout: 15000 // 设置默认的超时时间
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    console.log('Sending request to:', config.url)
    // 例如，添加一个 Authorization 头部
    config.headers.Authorization = `Bearer your_token`
    return config
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    console.log('Received response from:', response.config.url)
    return response
  },
  (error) => {
    // 对响应错误做点什么
    if (error.response) {
      // 服务器返回的响应状态码不在 2xx 范围内
      console.error('Error status:', error.response.status)
      console.error('Error data:', error.response.data)
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      console.error('No response received:', error.request)
    } else {
      // 发生了触发请求错误的问题
      console.error('Error:', error.message)
    }
    return Promise.reject(error)
  }
)

export default instance
