import request from './request'
import {responseBody} from './mock'
import {aiAskUrl} from './config'
export async function sendPrompt(message, sessionId) {
  // mock
  // return responseBody

  return await request.post(aiAskUrl, {
    shop_owner: 'ym',
    prompt: message
  })
}
