<template>
  <div :style="{background: backgroundColor}">
    <beautiful-chat
      :always-scroll-to-bottom="alwaysScrollToBottom"
      :close="closeChat"
      :colors="colors"
      :is-open="isChatOpen"
      :message-list="messageList"
      :message-styling="messageStyling"
      :new-messages-count="newMessagesCount"
      :on-message-was-sent="onMessageWasSent"
      :open="openChat"
      :participants="participants"
      :show-close-button="true"
      :show-launcher="true"
      :show-typing-indicator="showTypingIndicator"
      :show-confirmation-deletion="true"
      :confirmation-deletion-message="'Are you sure? (you can customize this message)'"
      :title-image-url="titleImageUrl"
      :disable-user-list-toggle="true"
      :block-submit="blockSubmit"
      placeholder="输入您的问题，然后按回车"
      @onType="handleOnType"
      @edit="editMessage"
      @remove="removeMessage"
    >
      <template v-slot:header>
        AI助手
      </template>
      <template v-slot:text-message-body="scopedProps">
        <!-- render html -->
        <div class="sc-message--text-content" v-html="scopedProps.message.data.text"></div>
      </template>
    </beautiful-chat>
  </div>
</template>

<script>
import messageHistory from './messageHistory'
import chatParticipants from './chatProfiles'
import availableColors from './colors'
import {sendPrompt} from './request/message'
import {sendPromptSSE} from './request/message'
import {REQUEST_ERROR_MAP} from './const/const'

export default {
  name: 'App',
  components: {},
  data() {
    return {
      participants: chatParticipants,
      titleImageUrl: '',
      messageList: messageHistory,
      newMessagesCount: 0,
      isChatOpen: false,
      showTypingIndicator: '',
      colors: null,
      availableColors,
      chosenColor: null,
      alwaysScrollToBottom: true,
      messageStyling: true,
      userIsTyping: false,
      overflow: 'auto',
      blockSubmit: false,
      isRestart: false
    }
  },
  computed: {
    isMobile() {
      // check is mobile 
      return window.innerWidth < 768;
    },
    linkColor() {
      return this.chosenColor === 'dark' ? this.colors.sentMessage.text : this.colors.launcher.bg
    },
    backgroundColor() {
      return this.chosenColor === 'dark' ? this.colors.messageList.bg : '#fff'
    }
  },
  created() {
    this.setColor('blue')
  },
  mounted() {
    this.messageList.forEach((x) => (x.liked = false))
  },
  methods: {
    sendMessage(text) {
      if (text.length > 0) {
        this.newMessagesCount = this.isChatOpen ? this.newMessagesCount : this.newMessagesCount + 1
        this.onMessageWasSent({
          author: 'Support',
          type: 'text',
          id: Math.random(),
          data: {text}
        })
      }
    },
    handleTyping(text) {
      this.showTypingIndicator =
        text.length > 0 ? this.participants[this.participants.length - 1].id : ''
    },
    onReceiveSSEMessage(message) {
      if(!this.isRestart) {
        this.messageList[this.messageList.length - 1] = {
          type: 'text',
          author: 'support',
          id: Math.random(),
          data: {text: message}
        }
        this.isRestart = true
      } else {
        // 将message追加到result的最后一个元素中
      const origin = this.messageList[this.messageList.length - 1].data.text
      this.messageList[this.messageList.length - 1].data.text = origin + message
      }
    },
    async handleSendMessage(text) {
      this.blockSubmit = true
        try {
          this.isRestart = false
          // 发送sse请求，等结果，拿到结果后，进行追加展示
          await sendPromptSSE(text, this.onReceiveSSEMessage)
        } catch (e) {
          // 根据status输出不同的错误类型
          const errorText = REQUEST_ERROR_MAP[e.response?.status] || '出错了，请稍后再试'
          this.messageList[this.messageList.length - 1] = {
            type: 'text',
            author: 'support',
            id: Math.random(),
            data: {text: errorText}
          }
          console.error('error!', e)
        }
        this.blockSubmit = false
    },
    async onMessageWasSent(message) {
      const text = message?.data?.text
      try {
        // 添加一条信息
        this.messageList = [...this.messageList, Object.assign({}, message, {id: Math.random()})]
        // 发送请求之前，先添加一条信息
        this.messageList = [
          ...this.messageList,
          Object.assign(
            {},
            {
              type: 'typing',
              author: 'support'
            }
          )
        ]
        await this.handleSendMessage(text)
      } catch (e) {
        console.error('error!', e)
      }
    },
    openChat() {
      // 如果是移动端，且为移动端，禁止滚动
      if (this.isMobile) {
        this.overflow = window.getComputedStyle(document.body).overflow
        console.log('get overflow', this.overflow)
        document.body.style.overflow = 'hidden'
      }
      this.isChatOpen = true
      this.newMessagesCount = 0
    },
    closeChat() {
      if (this.isMobile) {
        console.log('overflow', this.overflow)
        document.body.style.overflow = this.overflow
      }
      this.isChatOpen = false
    },
    setColor(color) {
      this.colors = this.availableColors[color]
      this.chosenColor = color
    },
    handleOnType(e) {
      this.$event.$emit('onType', e)
      this.userIsTyping = true
    },
    editMessage(message) {
      const m = this.messageList.find((m) => m.id === message.id)
      m.isEdited = true
      m.data.text = message.data.text
    },
    removeMessage(message) {
      const m = this.messageList.find((m) => m.id === message.id)
      m.type = 'system'
      m.data.text = 'This message has been removed'
    },
    like(id) {
      const m = this.messageList.findIndex((m) => m.id === id)
      var msg = this.messageList[m]
      msg.liked = !msg.liked
      this.messageList[m] = msg
    }
  }
}
</script>

<style>
body {
  padding: 0;
  margin: 0;
}

* {
  font-family: Avenir Next, Helvetica Neue, Helvetica, sans-serif;
}

p {
  margin-block-start: 0;
  margin-block-end: 0;
}
</style>
