import { ChatCompletionMessageParam } from 'openai/resources/index.mjs'
import { InfoBlockStudyLoop } from './Utils/InfoBlockStudyLoop'
import type OpenAI from 'openai'

export const planLoop = async ({
  //
  onEvent,
  openai,
  inbound,
  signal
}) => {
  const messages: ChatCompletionMessageParam[] = []

  messages.push({
    role: 'user',
    content: `
You write a "system prompt" for handling user's reuqest in their message.
You can write query to search the knowledge base

# User Message:
${inbound.userPrompt}
`
  })

  let thinking = ''
  let plan = ''

  await (openai as OpenAI).chat.completions
    .create(
      {
        model: inbound.model,
        messages: messages,
        stream: true,
        stream_options: {
          include_usage: true
        }
        // reasoning_effort: 'medium',
        // // reasoning_effort: 'xhigh',
        // temperature: 0.15
      },
      { signal }
    )
    .then(async (response) => {
      //
      let currentStatus = {
        thoughts: '',
        words: ''
      }

      for await (let event of response) {
        if (event && event.choices && event.choices[0]) {
          let delta = event?.choices[0]?.delta as any
          thinking += delta?.reasoning_content || ''
        }
        if (event && event.choices && event.choices[0]) {
          let delta = event?.choices[0]?.delta as any
          plan += delta?.content || ''
        }

        currentStatus.thoughts = thinking
        currentStatus.words = plan

        onEvent({
          type: 'currentStatus',
          currentStatus: currentStatus
        })
      }

      onEvent({
        type: 'currentStatus',
        currentStatus: currentStatus
      })

      //
    })

  return {
    plan,
    thinking
  }
}
