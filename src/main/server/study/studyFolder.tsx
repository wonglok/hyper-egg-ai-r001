import OpenAI from 'openai'
import { studyLoop } from './agent/studyLoop'
import { store } from '../../store'
// import { planLoop } from './agent/planLoop'

export const studyFolder = async ({
  mainWindow,
  event,
  checkAborted,
  onEvent,
  inbound,
  randID,
  indexerAPI
}) => {
  //

  const controller = new AbortController()
  const signal = controller.signal

  const intrv = setInterval(() => {
    if (!signal.aborted && checkAborted()) {
      clearInterval(intrv)
      controller.abort()
    }
  }, 1)

  const openai = new OpenAI({
    baseURL: inbound.baseURL,
    apiKey: inbound.apiKey
  })

  // let planResult = await planLoop({
  //   signal,
  //   onEvent,
  //   openai,
  //   inbound
  // })

  let work = async ({
    lastBlocks = [],
    accumulated = { logs: [], userMessageList: [], history: [] }
  }) => {
    let goalReached = lastBlocks.filter((r) => r.type === 'goal-reached')
    let query = lastBlocks.filter((r) => r.type === 'query')
    let nextStep = lastBlocks.filter((r) => r.type === 'next-step')
    let actionLog = lastBlocks.filter((r) => r.type === 'action-log')
    let userMessage = lastBlocks.filter((r) => r.type === 'message-to-user')
    let readFileBlocks = lastBlocks.filter((r) => r.type === 'read-file')

    onEvent({
      type: 'history',
      history: accumulated.history
    })

    onEvent({
      type: 'userMessage',
      userMessage: accumulated.userMessageList
    })

    onEvent({
      type: 'goalReached',
      goalReached: goalReached
    })

    let output = await studyLoop({
      accumulated: {
        logs: accumulated.logs,
        userMessageList: accumulated.userMessageList,
        history: accumulated.history
      },
      last: {
        readFileBlocks,
        goalReached,
        query,
        nextStep,
        actionLog,
        userMessage
      },
      systemPrompt: `
# Identity:
You are an Knowledge base helpful AI Agent.
You help user achieve his / her goal in the user message.
You dont ask questions from user.
You can write query to search the knowledge base in specific workspaces:
We have only workspaces: ${store.data.workspaces.map((r) => JSON.stringify(r.name.toLowerCase())).join(',')}
      `.trim(), // planResult.plan

      signal,
      onEvent,
      openai,
      inbound
    })

    let currentBlocks = output.blocks

    // query history
    accumulated.history = [
      ...accumulated.history,
      ...currentBlocks.filter((bl) =>
        //
        {
          return bl.type === 'query'
        }
      )
    ]

    accumulated.logs = [
      //
      ...accumulated.logs,
      ...currentBlocks.filter((r) =>
        //
        {
          return r.type === 'next-step'
        }
      )
    ]

    accumulated.userMessageList = [
      ...accumulated.userMessageList,
      ...currentBlocks.filter((r) =>
        //
        {
          return r.type === 'message-to-user'
        }
      )
    ]

    onEvent({
      type: 'currentQuery',
      currentQuery: currentBlocks.filter((bl) =>
        //
        {
          return bl.type === 'query'
        }
      )
    })

    onEvent({
      type: 'history',
      history: accumulated.history
    })

    onEvent({
      type: 'actionLogs',
      actionLogs: accumulated.logs
    })

    onEvent({
      type: 'userMessage',
      userMessage: accumulated.userMessageList
    })

    onEvent({
      type: 'goalReached',
      goalReached: currentBlocks.filter((r) => r.type === 'goal-reached')
    })

    if (currentBlocks.filter((r) => r.type === 'goal-reached').length === 0) {
      return await work({
        lastBlocks: currentBlocks,
        accumulated: JSON.parse(JSON.stringify(accumulated))
      })
    } else {
    }
  }

  await work({
    //
    lastBlocks: [],
    accumulated: {
      logs: [],
      userMessageList: [],
      history: []
    }
  })

  await new Promise((resolve) => {
    setTimeout(resolve, 2000)
  })
}
