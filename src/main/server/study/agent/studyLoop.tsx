import { ChatCompletionListParams, ChatCompletionMessageParam } from 'openai/resources/index.mjs'
import { InfoBlockStudyLoop, parseInfoblocks, StudyBlock } from './Utils/InfoBlockStudyLoop'
import { store } from '../../../store'
import { join } from 'path'
import { makeDirectorySync } from 'make-dir'
import { jsonlDir } from 'jsonl-db'
import { readFile } from 'fs/promises'
import OpenAI from 'openai'
import z from 'zod'
import { estimateTokenCount, isWithinTokenLimit, splitByTokens } from 'tokenx'

//

interface JsonObject {
  [key: string]: any
}
type DBInstance = {
  add(data: JsonObject | JsonObject[]): Promise<void>
  findOne(matchFn: (data: JsonObject) => boolean): Promise<JsonObject | undefined>
  find(matchFn: (data: JsonObject) => boolean): Promise<JsonObject[]>
  update(
    matchFn: (data: JsonObject) => boolean,
    updateFn: (data: JsonObject) => JsonObject
  ): Promise<JsonObject[]>
  delete(matchFn: (data: JsonObject) => boolean): Promise<JsonObject[]>
  count(): Promise<number>
}

const cosineSimilarity = (a: number[], b: number[]): number => {
  if (a.length !== b.length) {
    throw new Error('Vectors must have same length')
  }

  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0)
  const magA = Math.sqrt(a.reduce((s, v) => s + v * v, 0))
  const magB = Math.sqrt(b.reduce((s, v) => s + v * v, 0))

  return magA === 0 || magB === 0 ? 0 : dotProduct / (magA * magB)
}

interface SearchResult {
  embedding: number[]
  fragmentText: string
  caption?: string
  fullText?: string
  read: string
  path: string
  score: number
}

const sortByCosineSimilarity = (results: SearchResult[], queryVector: number[]): SearchResult[] => {
  return results
    .map((item) => ({ ...item, score: cosineSimilarity(item.embedding, queryVector) }))
    .sort((a, b) => b.score - a.score) // Sort descending by score
  // .map(({ embedding, fragmentText, path, score, read }) => ({
  //   read,
  //   score,
  //   embedding,
  //   fragmentText,
  //   path
  // })) // Return clean objects
}

export const studyLoop = async ({
  //
  onEvent,
  openai,
  inbound,
  signal,
  systemPrompt,
  last,
  accumulated = {
    logs: [],
    userMessageList: [],
    history: []
  }
}) => {
  const messages: ChatCompletionMessageParam[] = []

  messages.push({
    role: 'system',
    content: `
# System Prompt:
${systemPrompt}
`
  })

  let {
    query,
    nextStep,

    goalReached,
    actionLog,
    userMessage,
    readFileBlocks
  }: {
    query: StudyBlock[]
    goalReached: StudyBlock[]
    nextStep: StudyBlock[]
    actionLog: StudyBlock[]
    userMessage: StudyBlock[]
    readFileBlocks: StudyBlock[]
  } = last

  // nextStep
  {
    let accText = ''
    for (let eachitem of nextStep) {
      accText += `
What to do now: ${eachitem.content}
    `
    }

    if (accText) {
      messages.push({
        role: 'user',
        content: `
${accText}
        `
      })
    }
  }

  // handle logs
  {
    let logText = ''
    for (let eachLog of accumulated.logs) {
      logText += `
  Log: ${eachLog.content}
  Timestamp: ${eachLog.timestamp}
      `
    }

    if (logText) {
      messages.push({
        role: 'user',
        content: `
# Activity Log of the AI Agent
${logText}
          `
      })
    }
  }

  // query history
  {
    for (let eachitem of accumulated.history) {
      messages.push({
        role: 'user',
        content: `
# Serach History Log of the Knowledge Database:
Query:
${eachitem.content}
Results:
${eachitem.result}
Timestamp:
${eachitem.timestamp}

    `.trim()
      })
    }
  }

  for (let eachQuery of query) {
    messages.push({
      role: 'user',
      content: `
  # Latest Serach Result of the Knowledge Database:
  Query: ${eachQuery.content}
  Result:
  ${(eachQuery as any).result}
  Timestamp:
  ${eachQuery.timestamp}
          `
    })
  }

  messages.push({
    role: 'user',
    content: `
(please avoid repeat the similar search query by thinking new seach queries.)
(consider using  <infoblock type="goal-reached" extra=""> if you cannnot think of next step)
    `
  })

  messages.push({
    role: 'user',
    content: `
${InfoBlockStudyLoop}

# Instructions:
- MUST check to see if the loop ai agent has fullfilled the user's request in the user messsage:
    
  ## if every requests are fullfilled then:
    -- MUST use this infoblock to stop the working loop. 
      <infoblock type="goal-reached" extra="">[goal reached message here...]</infoblock>
    -- MUST send a message to user using infoblock when we end the process
      <infoblock type="message-to-user" extra="">
      [message here...]
      </infoblock>

  ## if not, then:
    -- write at least one or more "query" that is contextual to serach relevant information in the workspace:
      <infoblock type="query" workspace="...">
      [query here...]
      </infoblock>

    -- write about what to work on in the next step, which will be used in the next step
      <infoblock type="next-step" extra="">
      [next step here...]
      </infoblock>

    -- MUST send a message to user using infoblock
      <infoblock type="message-to-user" extra="">
      [message here...]
      </infoblock>

    `.trim()
  })

  messages.push({
    role: 'user',
    content: `
# Original User Request (for reference):
${inbound.userPrompt}

Check to see if User Request is fullfilled and when we can stop use this:
<infoblock type="goal-reached" extra="">
[message here...]
</infoblock>
    `
  })

  let thinking = ''
  let llmOutput = ''

  await openai.chat.completions
    .create(
      {
        model: inbound.model,
        messages: messages,
        stream: true,
        stream_options: {
          include_usage: true
        },
        // reasoning_effort: 'medium',
        reasoning_effort: 'xhigh',
        temperature: 0.5
      },
      { signal }
    )
    .then(async (response) => {
      //
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
          llmOutput += delta?.content || ''
        }

        currentStatus.thoughts = thinking
        currentStatus.words = llmOutput

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
    .catch((r) => {
      console.log(r)
      return
    })

  const studyBlocks: StudyBlock[] = parseInfoblocks(llmOutput)

  // serach
  {
    for (const eachQuery of studyBlocks.filter((r) => r.type === 'query')) {
      //

      const workspace = store.data.workspaces.find(
        (r) => r.name.toLowerCase() === eachQuery.workspace.toLowerCase()
      )

      console.log('Search Text', `[${eachQuery.workspace}]: `, eachQuery.content)
      // console.log('eachQuery.workspace', eachQuery.workspace)
      // console.log('workspace.path', workspace?.path)

      if (!workspace?.path) {
        console.log(new Error('no workspace path'))
        continue
      }

      const basepath = join(workspace?.path, './ai-system-memory')
      makeDirectorySync(basepath)
      const db = await jsonlDir(join(basepath))
      const textEmbeddingsDB = (await db.file('text-embeddings')) as DBInstance
      // const captionEmbeddingsDB = (await db.file('caption-embeddings')) as DBInstance

      // const captionEmbeddingsList = await captionEmbeddingsDB.find(() => true)
      const embeddingList = await textEmbeddingsDB.find(() => true)

      const vectorList: SearchResult[] = [
        ...embeddingList
        // ...captionEmbeddingsList
      ] as SearchResult[]

      const textParts = [eachQuery.content]
      const resp = await openai.embeddings.create({
        input: textParts,
        model: `${inbound.textEmbedModel}`,
        encoding_format: 'float',
        dimensions: 1024
      })

      for (const eachIDX in resp.data) {
        const each = resp.data[eachIDX]
        const fragmentText = textParts[eachIDX]
        const embedding = each.embedding

        const list = sortByCosineSimilarity(vectorList, embedding)
        // console.log('list', list.length)

        const shortlist = list.slice(0, 5)

        // console.log(
        //   'score',
        //   list.map((r) => r.score)
        // )

        const filterList = list.slice(5, 505).filter((r) => {
          // console.log('score', r.score)
          return r.score >= 0.5
        })

        // console.log('filterList', filterList.length)
        // console.log('shortlist', shortlist.length)

        let idx = 0
        let findings = ''
        for (let item of [...shortlist, ...filterList]) {
          idx++

          // let count = estimateTokenCount(findings)
          // console.log('estimateTokenCount', count)
          // console.log('idx', idx)
          if (!isWithinTokenLimit(findings, 1024)) {
            break
          } else {
            let readText = item.read ? item[item.read || 'fragmentText'] : fragmentText
            findings +=
              `\n------------\n${readText} \n- Relevance score with the query: ${Math.floor(item.score * 100)}%
            \n------------`.trim()
          }
        }

        ;(eachQuery as any).result = findings
      }
    }
  }

  return {
    blocks: studyBlocks,
    llmOutput,
    thinking
  }
}
