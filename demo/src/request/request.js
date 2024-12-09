import axios from 'axios'
import {JWT} from '../const/const'

let sessionId = undefined // 首次会话不带session, 后续对话将session带过去

// 创建 axios 实例
const instance = axios.create({
  timeout: 60 * 1000 // 设置默认的超时时间
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    console.log('config', config)
    // 在发送请求之前做些什么
    // 如果有sessionId，每次发送前带上
    if (sessionId) {
      config.data['session_id'] = sessionId
    }
    // 例如，添加一个 Authorization 头部
    // 🤷🏻‍♀️ 先改为在params里面加
    config.headers.authentication = JWT
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
    console.log('data', response.data)
    try {
      const {data} = response
      if (data.session_id) {
        sessionId = data.session_id
      }
      // 如果有sessionId,进行存储
      return response.data
    } catch (e) {
      // fixme 数据有问题怎么处理
      throw new Error('response error')
    }
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
const errorMap = {
  400: '请稍后再尝试',
  401: '请重新登录',
  399: '请稍后再尝试'
}

export default instance
