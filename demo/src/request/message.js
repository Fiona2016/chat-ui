import request from './request'
import {responseBody} from './mock'
import {aiAskUrl, aiAskUrlV2} from './config'
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
  try {
    // send a sse request
    const response = await fetch(aiAskUrlV2, {
      method: 'POST',
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        shop_owner: SHOP_OWNER,
        prompt: message,
        stream: 'True'
      })
    })
    const stream = response.body
    // consume response
    const reader = stream.pipeThrough(new TextDecoderStream()).getReader()
    while (true) {
      const {value, done} = await reader.read()
      if (done) break
      const objArray = extractTextSSE(value)
      objArray.forEach((obj) => {
        callBackFn(extractText(obj))
      })
    }
    reader.read().then()
  } catch (error) {
    console.error(error)
    throw error('SSE request failed')
  }
}
export function extractText(obj) {
  try {
    return obj?.choices[0]?.delta?.content || ''
  } catch (error) {
    console.error(error)
    throw new Error('Invalid JSON format')
  }
}

export function extractTextSSE(dataString) {
  const regex = /data:\s*({.*?})(?=\r\n|\r|\n|$)/gs
  let match
  const jsonObjects = []

  while ((match = regex.exec(dataString)) !== null) {
    try {
      const jsonObject = JSON.parse(match[1])
      jsonObjects.push(jsonObject)
    } catch (error) {
      console.error('Invalid JSON:', match[1])
    }
  }
  return jsonObjects
}
