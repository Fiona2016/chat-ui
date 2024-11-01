// import request from './request'
import {responseBody} from './mock'
export function sendPrompt(message, sessionId) {
  // mock
  return responseBody

  // request.post({
  //   shop_owner: '',
  //   prompt: message,
  //   session_id: sessionId || undefined // fixme 这里，如果有sessionID, 就传入，否则开启新会话
  // })
}
