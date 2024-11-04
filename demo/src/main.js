import * as Vue from 'vue'
import App from './NewApp.vue'
import Chat from '@/index.js'

const app = Vue.createApp(App)

app.use(Chat)

app.mount('#app')
