<template>
  <div :id="message.id" class="sc-message">
    <div
      class="sc-message--content"
      :class="{
        sent: message.author === 'me',
        received: message.type !== 'system',
        system: message.type === 'system'
      }"
    >
      <slot name="user-avatar" :message="message" :user="user">
        <div
          v-if="message.type !== 'system'"
          v-tooltip="authorName"
          :title="authorName"
          class="sc-message--avatar"
          :style="{
            backgroundImage: `url(${chatImageUrl})`
          }"
        ></div>
      </slot>

      <TextMessage
        v-if="message.type === 'text'"
        :message="message"
        :message-colors="messageColors"
        :message-styling="messageStyling"
        :show-confirmation-deletion="showConfirmationDeletion"
        :confirmation-deletion-message="confirmationDeletionMessage"
        @remove="$emit('remove')"
      >
        <template v-slot:default="scopedProps">
          <slot
            name="text-message-body"
            :message="scopedProps.message"
            :messageText="scopedProps.messageText"
            :messageColors="scopedProps.messageColors"
            :me="scopedProps.me"
          >
          </slot>
        </template>
        <template v-slot:text-message-toolbox="scopedProps">
          <slot name="text-message-toolbox" :message="scopedProps.message" :me="scopedProps.me">
          </slot>
        </template>
      </TextMessage>
      <EmojiMessage v-else-if="message.type === 'emoji'" :data="message.data" />
      <FileMessage
        v-else-if="message.type === 'file'"
        :data="message.data"
        :message-colors="messageColors"
      />
      <TypingMessage v-else-if="message.type === 'typing'" :message-colors="messageColors" />
      <SystemMessage
        v-else-if="message.type === 'system'"
        :data="message.data"
        :message-colors="messageColors"
      >
        <slot name="system-message-body" :message="message.data"> </slot>
      </SystemMessage>
    </div>
  </div>
</template>

<script>
import TextMessage from './messages/TextMessage.vue'
import FileMessage from './messages/FileMessage.vue'
import EmojiMessage from './messages/EmojiMessage.vue'
import TypingMessage from './messages/TypingMessage.vue'
import SystemMessage from './messages/SystemMessage.vue'
const visitorIcon = 'data:image/png;base64,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'

export default {
  components: {
    TextMessage,
    FileMessage,
    EmojiMessage,
    TypingMessage,
    SystemMessage
  },
  props: {
    message: {
      type: Object,
      required: true
    },
    colors: {
      type: Object,
      required: true
    },
    messageStyling: {
      type: Boolean,
      required: true
    },
    user: {
      type: Object,
      required: true
    },
    showConfirmationDeletion: {
      type: Boolean,
      required: true
    },
    confirmationDeletionMessage: {
      type: String,
      required: true
    }
  },
  computed: {
    authorName() {
      return this.user && this.user.name
    },
    chatImageUrl() {
      return (this.user && this.user.imageUrl) || visitorIcon
    },
    messageColors() {
      return this.message.author === 'me' ? this.sentColorsStyle : this.receivedColorsStyle
    },
    receivedColorsStyle() {
      return {
        color: this.colors.receivedMessage.text,
        backgroundColor: this.colors.receivedMessage.bg
      }
    },
    sentColorsStyle() {
      return {
        color: this.colors.sentMessage.text,
        backgroundColor: this.colors.sentMessage.bg
      }
    }
  }
}
</script>

<style lang="scss">
.sc-message {
  width: 330px;
  margin: auto;
  padding-bottom: 10px;
  display: flex;
  .sc-message--edited {
    opacity: 0.7;
    word-wrap: normal;
    font-size: xx-small;
    text-align: center;
  }
}

.sc-message--content {
  width: 100%;
  display: flex;
  margin-right: 40px;
}

.sc-message--content.sent {
  justify-content: end;
  flex-direction: row-reverse;
  margin-right: 0;
}

.sc-message--content.system {
  justify-content: center;
}

.sc-message--content.sent .sc-message--avatar {
  margin: 0 0 0 10px;
}

.sc-message--avatar {
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: center;
  min-width: 30px;
  min-height: 30px;
  border-radius: 50%;
  align-self: start;
  margin-right: 15px;
}

.sc-message--meta {
  font-size: xx-small;
  margin-bottom: 0px;
  color: white;
  text-align: center;
}

@media (max-width: 450px) {
  .sc-message {
    width: 80%;
  }
}

.sc-message--text {
  max-width: calc(100% - 60px);
  word-break: break-word;
  padding: 5px 0;
  border-radius: 6px;
  font-weight: 300;
  font-size: 14px;
  line-height: 1.4;
  position: relative;
  -webkit-font-smoothing: subpixel-antialiased;
  .sc-message--text-body {
    .sc-message--text-content {
      white-space: pre-wrap;
    }
  }
  &:hover .sc-message--toolbox {
    left: -20px;
    opacity: 1;
  }
  &.confirm-delete:hover .sc-message--toolbox {
    left: -90px;
  }
  &.confirm-delete .sc-message--toolbox {
    width: auto;
  }
  .sc-message--toolbox {
    transition: left 0.2s ease-out 0s;
    white-space: normal;
    opacity: 0;
    position: absolute;
    left: 0px;
    width: 25px;
    top: 0;
    button {
      background: none;
      border: none;
      padding: 0px;
      margin: 0px;
      outline: none;
      width: 100%;
      text-align: center;
      cursor: pointer;
      &:focus {
        outline: none;
      }
    }
  }
}
.sc-message--content.sent .sc-message--text {
  color: white;
  background-color: #4e8cff;
  max-width: calc(100% - 120px);
  word-wrap: break-word;
}

.sc-message--text code {
  font-family: 'Courier New', Courier, monospace !important;
}

.sc-message--content.received .sc-message--text {
  color: #263238;
  background-color: #f4f7f9;
  //margin-right: 40px;
}

.tooltip {
  display: block !important;
  z-index: 10000;
  .tooltip-inner {
    background: black;
    color: white;
    border-radius: 16px;
    padding: 5px 10px 4px;
  }
  .tooltip-arrow {
    width: 0;
    height: 0;
    border-style: solid;
    position: absolute;
    margin: 5px;
    border-color: black;
    z-index: 1;
  }
  &[x-placement^='top'] {
    margin-bottom: 5px;
    .tooltip-arrow {
      border-width: 5px 5px 0 5px;
      border-left-color: transparent !important;
      border-right-color: transparent !important;
      border-bottom-color: transparent !important;
      bottom: -5px;
      left: calc(50% - 5px);
      margin-top: 0;
      margin-bottom: 0;
    }
  }
  &[x-placement^='bottom'] {
    margin-top: 5px;
    .tooltip-arrow {
      border-width: 0 5px 5px 5px;
      border-left-color: transparent !important;
      border-right-color: transparent !important;
      border-top-color: transparent !important;
      top: -5px;
      left: calc(50% - 5px);
      margin-top: 0;
      margin-bottom: 0;
    }
  }
  &[x-placement^='right'] {
    margin-left: 5px;
    .tooltip-arrow {
      border-width: 5px 5px 5px 0;
      border-left-color: transparent !important;
      border-top-color: transparent !important;
      border-bottom-color: transparent !important;
      left: -5px;
      top: calc(50% - 5px);
      margin-left: 0;
      margin-right: 0;
    }
  }
  &[x-placement^='left'] {
    margin-right: 5px;
    .tooltip-arrow {
      border-width: 5px 0 5px 5px;
      border-top-color: transparent !important;
      border-right-color: transparent !important;
      border-bottom-color: transparent !important;
      right: -5px;
      top: calc(50% - 5px);
      margin-left: 0;
      margin-right: 0;
    }
  }
  &[aria-hidden='true'] {
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.15s, visibility 0.15s;
  }
  &[aria-hidden='false'] {
    visibility: visible;
    opacity: 1;
    transition: opacity 0.15s;
  }
  &.info {
    $color: rgba(#004499, 0.9);
    .tooltip-inner {
      background: $color;
      color: white;
      padding: 24px;
      border-radius: 5px;
      box-shadow: 0 5px 30px rgba(black, 0.1);
    }
    .tooltip-arrow {
      border-color: $color;
    }
  }
  &.popover {
    $color: #f9f9f9;
    .popover-inner {
      background: $color;
      color: black;
      padding: 24px;
      border-radius: 5px;
      box-shadow: 0 5px 30px rgba(black, 0.1);
    }
    .popover-arrow {
      border-color: $color;
    }
  }
}
</style>
