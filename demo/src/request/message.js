import request from './request'
import {responseBody} from './mock'
import {aiAskUrl} from './config'
import {SHOP_OWNER} from '../const/const'
export async function sendPrompt(message, sessionId) {
  // mock
  // return responseBody

  return await request.post(aiAskUrl, {
    shop_owner: SHOP_OWNER,
    prompt: message
  })
}
