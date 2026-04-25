import { parentPort } from 'node:worker_threads'
// import { makeDirectory } from 'make-dir'
import { FileRAM, type FileRAMSDK } from './FileRAM'
import { isCSVType, isImageType, isPDFType, isTextType } from './detectType'
// import { join } from 'path'
import { setupWatcher } from './setupWatcher'
// import { WorkspaceFolder } from './WorkspaceFolder'
// import { readdirSync, statSync } from 'fs'
import { store } from '../../store'

let stepLoop = async () => {
  await Promise.all([
    //
    doEmbeddingWork(),
    doEmbeddingWork(),

    doEmbeddingWork(),
    doEmbeddingWork(),
    doEmbeddingWork()
    //
  ]).catch((r) => {
    console.log(r)
  })

  setTimeout(() => {
    stepLoop()
  }, 0)
}

const doEmbeddingWork = async () => {
  let item = FileRAM.getOneToWorkOnSync()
  if (!item) {
    return
  }

  const sdk: FileRAMSDK = await FileRAM.getSDK(item)
  const filepath = await FileRAM.getPathByItemAsync(item)

  if (isImageType(filepath)) {
    const found = (await sdk.textEmbeddingsDB.find((r) => r.path === item.path)) || []
    if (found.length > 0) {
      await FileRAM.doneWorking(item)
    } else {
      await FileRAM.startWorking(item)
      await FileRAM.processImageItem({ item, sdk })
      await FileRAM.doneWorking(item)
    }
  }

  if (isTextType(filepath)) {
    const found = (await sdk.textEmbeddingsDB.find((r) => r.path === item.path)) || []
    if (found.length > 0) {
      await FileRAM.doneWorking(item)
    } else {
      await FileRAM.startWorking(item)
      await FileRAM.processTextItem({ item, sdk })
      await FileRAM.doneWorking(item)
    }
  }

  if (isCSVType(filepath)) {
    const found = (await sdk.textEmbeddingsDB.find((r) => r.path === item.path)) || []
    if (found.length > 0) {
      await FileRAM.doneWorking(item)
    } else {
      await FileRAM.startWorking(item)
      await FileRAM.processCSVItem({ item, sdk })
      await FileRAM.doneWorking(item)
    }
  }

  if (isPDFType(filepath)) {
    const found = (await sdk.textEmbeddingsDB.find((r) => r.path === item.path)) || []
    if (found.length > 0) {
      await FileRAM.doneWorking(item)
    } else {
      await FileRAM.startWorking(item)
      await FileRAM.processPDFAsTextItem({ item, sdk })
      await FileRAM.doneWorking(item)
    }
  }
}

//

// function getDirectoriesSync(dirPath) {
//   return readdirSync(dirPath).filter(function (file) {
//     // Check if the item is a directory
//     return statSync(join(dirPath, file)).isDirectory()
//   })
// }

const bootupIndexer = async () => {
  stepLoop()

  store.read()

  const workspaces = store.data.workspaces

  workspaces
    .filter((r) => r.path)
    .map((item) => {
      setupWatcher({ workspace: item.name, resolve: () => {} })
    })
}

//
// console.log('global', global)
// global.onmessage = (e) => {
//   console.log(e)
// }
//

parentPort.on('message', (txt) => {
  let inbound = JSON.parse(txt || '{}')
  if (inbound.type === 'bootup-engine') {
    bootupIndexer()
    parentPort?.postMessage(JSON.stringify({ type: 'ready' }))
  }
  if (inbound.type === 'filelist') {
    parentPort?.postMessage(JSON.stringify({ type: 'filelist', filelist: FileRAM.list() }))
  }
})
