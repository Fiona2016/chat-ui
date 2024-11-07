import * as Vue from 'vue'
import App from './NewApp.vue'
import Chat from '@/index.js'

const app = Vue.createApp(App)

app.use(Chat)

// 先创建dom.然后再挂载啊？
createDom()

app.mount('#ai-chat-ui')

export function createDom() {
  const appElement = document.createElement('div')
  appElement.id = 'ai-chat-ui'
  document.body.insertBefore(appElement, document.body.firstChild)
}
