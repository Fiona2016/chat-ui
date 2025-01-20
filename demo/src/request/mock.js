export const responseBody = {
  content:
    '\n当然可以！根据您的需求，这里为您推荐几款不同领域的AI工具：\n\n1. **ChatGPT**：\n   - **用途**：自然语言处理，包括但不限于文本生成、对话系统、翻译等。\n   - **特点**：基于Transformer架构，能够生成高质量的文本，理解复杂语境，广泛应用于客服、内容创作等领域。\n\n2. **Stable Diffusion**：\n   - **用途**：图像生成和编辑。\n   - **特点**：通过深度学习模型生成高质量的图像，支持从文本描述生成图像、图像风格迁移等功能，适用于创意设计、广告制作等场景。\n\n3. **DALL-E 2**：\n   - **用途**：图像生成。\n   - **特点**：由OpenAI开发，能够根据文本描述生成逼真的图像，支持多种风格和细节控制，适合创意工作和视觉设计。\n\n4. **Midjourney**：\n   - **用途**：图像生成和编辑。\n   - **特点**：提供了一个简单易用的界面，用户可以通过简单的文本指令生成高质量的图像，特别适合快速原型设计和创意探索。\n\n5. **GitHub Copilot**：\n   - **用途**：代码辅助。\n   - **特点**：集成在Visual Studio Code等开发环境中，能够根据上下文自动补全代码，提高开发效率，适合软件开发者。\n\n6. **Notion AI**：\n   - **用途**：文档管理和协作。\n   - **特点**：结合了Notion的强大文档管理功能，提供AI辅助的写作和编辑能力，帮助用户更高效地创建和组织内容。\n\n7. **Descript**：\n   - **用途**：音频和视频编辑。\n   - **特点**：通过AI技术简化音频和视频的编辑过程，支持语音转文字、自动剪辑等功能，适合内容创作者和媒体制作人。\n\n如果您有特定的应用场景或需求，欢迎告诉我，我可以为您提供更加详细的建议和推荐。希望这些工具能对您有所帮助！\n',
  session_id: '92bb4df0865ecb062e4996452e90d73f'
}
export const request = {
  shop_owner: 'ym',
  prompt: '您好，请帮我介绍几个AI工具'
}

export const responseSSE_message = {
  data: {
    model: 'unknown',
    id: 'a66e05da-e28b-4071-a8e7-e2435f82d10f',
    object: 'chat.completion.chunk',
    choices: [
      {
        delta: {role: 'assistant', content: '<p>当然可以。'},
        finish_reason: null,
        index: 0,
        logprobs: null
      }
    ],
    created: 1737366130,
    system_fingerprint: 'fp_rT5lKi1We',
    usage: {prompt_tokens: 0, total_tokens: 0, completion_tokens: 0}
  }
}

export const responseSSE_message_stop = {
  model: 'unknown',
  id: 'a66e05da-e28b-4071-a8e7-e2435f82d10f',
  object: 'chat.completion.chunk',
  choices: [
    {
      delta: {
        role: null,
        content: null
      },
      finish_reason: 'stop',
      index: 0,
      logprobs: null
    }
  ],
  created: 1737366130,
  system_fingerprint: 'fp_aqosZ41oA',
  usage: {
    prompt_tokens: 0,
    total_tokens: 0,
    completion_tokens: 0
  }
}
export const responseSSE_message_end = '[DONE]'
