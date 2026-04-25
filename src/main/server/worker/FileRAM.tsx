// import { renderToString } from 'react-dom/server'

import md5 from 'md5'
let array = []
export const TaskList = array
import { jsonlDir } from 'jsonl-db'
import { join } from 'path'
import { readFile } from 'fs/promises'
import { makeDirectorySync } from 'make-dir'
import { JSONFileSyncPreset } from 'lowdb/node'
import { splitByTokens } from 'tokenx'
import OpenAI from 'openai'
import { processImageItem } from './convertImage'
import { isCSVType, isImageType, isPDFType, isTextType } from './detectType'
import { store } from '../../store'
import csvToJson from 'convert-csv-to-json'
import { extractText, getDocumentProxy } from 'unpdf'
import { file } from 'zod'

export interface JsonObject {
  [key: string]: any
}

export type DBInstance = {
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

export type FileRAMSDK = {
  captionEmbeddingsDB: DBInstance
  textEmbeddingsDB: DBInstance
  aiConfig: any
  workspace: string
  workspaceFolder: string
}

export const DBs = []

export const FileRAM = {
  array: array,

  getPathByItemAsync: async (item) => {
    // const workspaceFolder: string = await readFile(
    //   join(WorkspaceFolder.value, `${item.workspace}`, `workspace-path.txt`),
    //   {
    //     encoding: 'utf-8'
    //   }
    // ).catch((r) => {
    //   console.log(r)
    //   return ''
    // })

    let workspaceObject = store.data.workspaces.find((r) => r.name === item.workspace)
    let filepath = workspaceObject?.path

    return join(filepath, item.path)
  },

  readTextFileAsync: async (item) => {
    let filepath = await FileRAM.getPathByItemAsync(item)

    let filecontent = await readFile(filepath, {
      encoding: 'utf8'
    })

    return filecontent
  },

  //
  readThumbImageBase64Async: async (item) => {
    let filepath = await FileRAM.getPathByItemAsync(item)

    let thumbImageBase64 = await processImageItem(filepath)

    return thumbImageBase64
  },
  getSDK: async (item) => {
    if (DBs.some((r) => r.workspace === item.workspace)) {
      return DBs.find((r) => r.workspace === item.workspace)
    }

    let workspaceObject = store.data.workspaces.find((r) => r.name === item.workspace)
    let filepath = workspaceObject?.path

    const workspaceFolder: string = filepath

    if (workspaceFolder) {
      let basepath = join(workspaceFolder, './ai-system-memory')
      makeDirectorySync(basepath)
      const db = await jsonlDir(join(basepath))
      const textEmbeddingsDB = await db.file('text-embeddings')
      const captionEmbeddingsDB = await db.file('caption-embeddings')

      const aiConfig = await JSONFileSyncPreset(join(basepath, 'ai.config.json'), {
        baseURL: `http://localhost:1234/v1`,
        apiKey: `no`,
        //
        textEmbedModel: `text-embedding-nomic-embed-text-v1.5`,
        visionModel: `google/gemma-4-e2b`
      })
      await aiConfig.read()
      await aiConfig.write()

      DBs.push({
        workspace: item.workspace,
        workspaceFolder: workspaceFolder,
        textEmbeddingsDB,
        captionEmbeddingsDB,
        aiConfig
      })
    }

    if (DBs.some((r) => r.workspace === item.workspace)) {
      return DBs.find((r) => r.workspace === item.workspace)
    }
  },

  add: async (v: { path: string; workspace: string }) => {
    if (!array.some((ar) => ar.path === v.path && ar.workspace === v.workspace)) {
      let item = {
        id: `${`${v.workspace}${v.path}`}`,
        path: v.path,
        workspace: v.workspace,
        status: 'idle' // idle / processing / done
      }

      array.push(item)

      return item
    } else {
      return array.find((ar) => ar.path === v.path && ar.workspace === v.workspace)
    }
  },

  change: async (v: { path: string; workspace: string }) => {
    let item = await FileRAM.getOneByWorkspacePath(v)

    const sdk: FileRAMSDK = await FileRAM.getSDK(item)
    const filepath = await FileRAM.getPathByItemAsync(item)

    if (isImageType(filepath)) {
      await sdk.captionEmbeddingsDB.delete((r) => r.path === item.path)
    }
    if (isTextType(filepath)) {
      await sdk.textEmbeddingsDB.delete((r) => r.path === item.path)
    }

    await FileRAM.remove(item)
    await FileRAM.add(v)
    //
  },
  unlink: async (v: { path: string; workspace: string }) => {
    let item = await FileRAM.getOneByWorkspacePath(v)

    const sdk: FileRAMSDK = await FileRAM.getSDK(item)
    const filepath = await FileRAM.getPathByItemAsync(item)

    if (isImageType(filepath)) {
      await sdk.captionEmbeddingsDB.delete((r) => r.path === item.path)
    }
    if (isTextType(filepath) || isCSVType(filepath) || isPDFType(filepath)) {
      await sdk.textEmbeddingsDB.delete((r) => r.path === item.path)
    }

    await FileRAM.remove(item)
    //
  },
  remove: (v: { path: string; workspace: string }) => {
    if (array.some((ar) => ar.path === v.path && ar.workspace === v.workspace)) {
      array.splice(
        array.findIndex((ar) => ar.path === v.path && ar.workspace === v.workspace),
        1
      )
    }
  },
  list: () => {
    return array
  },
  getOneByWorkspacePath: (v) => {
    let item = array.find((r) => {
      return r.workspace === v.workspace && r.path === v.path
    })
    if (item) {
      console.log('getOneToWorkOnSync', item)
    }
    return item
  },
  getOneToWorkOnSync: () => {
    let item = array.find((r) => {
      return r.status === 'idle'
    })
    if (item) {
      item.status = 'checking'
      console.log('getOneToWorkOnSync', item)
    }
    return item
  },
  startWorking: (item) => {
    if (item) {
      item.status = 'processing'
    }
    console.log('startWorking', item)
  },
  doneWorking: (item) => {
    if (item) {
      item.status = 'done'
    }
    console.log('doneWorking', item)
  },

  processTextItem: async ({ item, sdk }) => {
    try {
      let fullText = await FileRAM.readTextFileAsync(item)

      let textParts = []
      if (fullText) {
        textParts = await splitByTokens(`${fullText}`, 2000)
      }

      const openai = new OpenAI({
        baseURL: sdk.aiConfig.data.baseURL,
        apiKey: sdk.aiConfig.data.apiKey
      })

      const resp = await openai.embeddings.create({
        input: textParts,
        model: `${sdk.aiConfig.data.textEmbedModel}`,
        encoding_format: 'float',
        dimensions: 1024
      })

      for (const eachIDX in resp.data) {
        const each = resp.data[eachIDX]
        const fragmentText = textParts[eachIDX]
        const id = `${md5(`${fragmentText}${eachIDX}`)}`
        const embedding = each.embedding

        const newItem = {
          id: `${id}`,

          read: 'fullText',
          fullText: fullText,
          fragmentText: fragmentText,
          embedding: embedding,

          //
          path: item.path,
          workspace: item.workspace,
          type: 'text'
          // file: await FileRAM.getPathByItemAsync(item)
        }

        await sdk.textEmbeddingsDB.add(newItem)
      }
    } catch (e) {
      console.log(e)
    }
  },

  processCSVItem: async ({ item, sdk }) => {
    try {
      let fullText = await FileRAM.readTextFileAsync(item)

      let manyParts = []
      if (fullText) {
        const json = csvToJson.csvStringToJson(fullText)

        manyParts = json.map((r) => {
          let textAccu = ''

          for (let key in r) {
            try {
              if (!key && r[key]) {
                textAccu += `${r[key]}\n`
              } else {
                textAccu += `${key}: ${r[key]}\n`
              }
            } catch (e) {
              console.log(e)
            }
          }

          return textAccu // JSON.stringify(r)
        })

        console.log(manyParts)
      }

      const openai = new OpenAI({
        baseURL: sdk.aiConfig.data.baseURL,
        apiKey: sdk.aiConfig.data.apiKey
      })

      for (let onePart of manyParts) {
        const textParts = [onePart]

        const resp = await openai.embeddings.create({
          input: textParts,
          model: `${sdk.aiConfig.data.textEmbedModel}`,
          encoding_format: 'float',
          dimensions: 1024
        })

        let all = []
        for (const eachIDX in resp.data) {
          const each = resp.data[eachIDX]
          const fragmentText = textParts[eachIDX]

          const id = `${md5(`${fragmentText}${eachIDX}`)}`
          const embedding = each.embedding

          const newItem = {
            id: `${id}`,
            read: 'fragmentText',
            fragmentText: fragmentText,
            embedding: embedding,

            //
            path: item.path,
            workspace: item.workspace,
            type: 'csv'
            // file: await FileRAM.getPathByItemAsync(item)
          }

          all.push(newItem)
        }

        await sdk.textEmbeddingsDB.add(all)
      }
    } catch (e) {
      console.log(e)
    }
  },

  readPDFTextAsync: async (item) => {
    //

    let filepath = await FileRAM.getPathByItemAsync(item)

    const binary = await readFile(filepath)
    const pdf = await getDocumentProxy(new Uint8Array(binary))
    const { totalPages, text } = await extractText(pdf, { mergePages: true })

    console.log(`Total pages: ${totalPages}`)
    console.log(text)

    // let allText = docs.map((r) => r.pageContent).join('\n\n\n\n') || ''

    // console.log('allText', allText)

    // return allText

    return text
  },
  processPDFAsTextItem: async ({ item, sdk }) => {
    try {
      let fullText = await FileRAM.readPDFTextAsync(item)

      let textParts = []
      if (fullText) {
        textParts = await splitByTokens(`${fullText}`, 512)
      }

      const openai = new OpenAI({
        baseURL: sdk.aiConfig.data.baseURL,
        apiKey: sdk.aiConfig.data.apiKey
      })

      const resp = await openai.embeddings.create({
        input: textParts,
        model: `${sdk.aiConfig.data.textEmbedModel}`,
        encoding_format: 'float',
        dimensions: 1024
      })

      for (const eachIDX in resp.data) {
        const each = resp.data[eachIDX]
        const fragmentText = textParts[eachIDX]
        const id = `${md5(`${fragmentText}${eachIDX}`)}`
        const embedding = each.embedding

        const newItem = {
          id: `${id}`,
          read: 'fragmentText',
          fragmentText: fragmentText,
          embedding: embedding,

          //
          path: item.path,
          workspace: item.workspace,
          type: 'pdf'
          // file: await FileRAM.getPathByItemAsync(item)
        }

        await sdk.textEmbeddingsDB.add(newItem)
      }
    } catch (e) {
      console.log(e)
    }
  },

  describeImageWithText: async ({ item, sdk }): Promise<string> => {
    const openai = new OpenAI({
      baseURL: sdk.aiConfig.data.baseURL,
      apiKey: sdk.aiConfig.data.apiKey
    })

    async function describeImageWithAIAsync(base64URL: string) {
      try {
        const response = await openai.chat.completions.create({
          // 指定視覺模型，Qwen2-VL 是目前最強的開源視覺系列
          model: `${sdk.aiConfig.data.visionModel}`,
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: 'Please describe the image in details.' },
                {
                  type: 'image_url',
                  image_url: {
                    // 支持網路圖片 URL 或 Base64 (data:image/jpeg;base64,xxx)
                    url: base64URL
                  }
                }
              ]
            }
          ],
          max_tokens: 2048 // 限制描述長度
        })

        console.log('🎨 圖片描述結果：')
        console.log(response.choices[0].message.content)

        return response.choices[0].message.content
      } catch (error) {
        if (error instanceof Error) {
          console.error('❌ 請求出錯：', error.message)
        }
        return ''
      }
    }

    const base64 = await FileRAM.readThumbImageBase64Async(item)

    return await describeImageWithAIAsync(base64)
  },
  processImageItem: async ({ item, sdk }) => {
    try {
      let caption = await FileRAM.describeImageWithText({ item, sdk })

      let textParts = []
      if (caption) {
        textParts = await splitByTokens(`${caption}`, 2048)
      }

      const openai = new OpenAI({
        baseURL: sdk.aiConfig.data.baseURL,
        apiKey: sdk.aiConfig.data.apiKey
      })

      const resp = await openai.embeddings.create({
        input: textParts,
        model: `${sdk.aiConfig.data.textEmbedModel}`,
        encoding_format: 'float',
        dimensions: 1024
      })

      for (const eachIDX in resp.data) {
        const each = resp.data[eachIDX]
        const fragmentText = textParts[eachIDX]
        const id = `${md5(`${fragmentText}${eachIDX}`)}`
        const embedding = each.embedding

        const newItem = {
          id: `${id}`,
          read: 'caption',
          fragmentText: fragmentText,
          embedding: embedding,

          caption: caption,

          path: item.path,
          workspace: item.workspace,
          type: 'image'
          // file: await FileRAM.getPathByItemAsync(item)
        }

        await sdk.textEmbeddingsDB.add(newItem)
      }
    } catch (e) {
      console.log(e)
    }
  }
}
