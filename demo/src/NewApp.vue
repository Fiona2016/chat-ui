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
      userIsTyping: false
    }
  },
  computed: {
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
    async onMessageWasSent(message) {
      // 向服务器发送信息，收到返回内容后，再重新渲染message
      // todo later
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
        // 发送请求
        const result = await sendPrompt(text)
        this.messageList[this.messageList.length - 1] = {
          type: 'text',
          author: 'support',
          id: Math.random(),
          data: {text: result.content}
        }
      } catch (e) {
        console.error('error!', e)
      }
    },
    openChat() {
      this.isChatOpen = true
      this.newMessagesCount = 0
    },
    closeChat() {
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
  padding: 0px;
  margin: 0px;
}

* {
  font-family: Avenir Next, Helvetica Neue, Helvetica, sans-serif;
}

p {
  margin-block-start: 0;
  margin-block-end: 0;
}
</style>
