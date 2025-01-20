import request from './request'
import {responseBody} from './mock'
import {aiAskUrl} from './config'
import {SHOP_OWNER} from '../const/const'
// import {fetchEventData} from 'fetch-sse'

export async function sendPrompt(message) {
  // mock
  // return responseBody
  return await request.post(aiAskUrl, {
    shop_owner: SHOP_OWNER,
    prompt: message
  })
}

export async function sendPromptSSE(message, callBackFn) {
  // await fetchEventData('http://localhost:3000/streaming', {
  //   method: 'POST',
  //   data: {
  //     shop_owner: SHOP_OWNER,
  //     prompt: message
  //   },
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': 'Bearer token'
  //   },
  //   onMessage: (event) => {
  //     console.log(event.data)
  //     callBackFn(event.data)
  //   }
  // })

  try {
    // send a sse request
    const response = await fetch('http://localhost:3000/streaming', {
      method: 'POST',
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        shop_owner: SHOP_OWNER,
        prompt: message
      })
    })
    const stream = response.body
    // consume response
    const reader = stream.pipeThrough(new TextDecoderStream()).getReader()
    while (true) {
      const {value, done} = await reader.read()
      if (done) break
      console.log(value)
      callBackFn(value)
    }
    reader.read().then()
  } catch (error) {
    console.error(error)
    throw error('SSE request failed')
  }
}
