// import { app } from 'electron'
import { makeDirectory } from 'make-dir'
import { join } from 'path'
// import { scanFolder } from './utils/getSummary'
import { readFile, writeFile } from 'fs/promises'
// import { dialog } from 'electron'
import { WorkSpacesPath } from './constants'
import { store } from '../../store'
// import { listFiles } from '../../agent/utils/listFiles'

export const readWorkspaceFiles = async ({
  mainWindow,
  event,
  inbound,
  randID,
  checkAborted,
  onEvent
}) => {
  try {
    store.read()
    let workspaces = store.data.workspaces

    let currentWorkspace = workspaces.find((r) => r.name === inbound.workspace)

    let workspaceFolder = currentWorkspace?.path

    onEvent({ type: 'workspace', workspace: workspaceFolder })
  } catch (e) {
    onEvent({ type: 'gate', gate: 'select-folder' })

    onEvent({ type: 'toast', toast: 'need to find folder' })
    console.log(e)
  }
}

// const aiIndex = join(WorkSpacesPath, `${inbound.workspace}`, `ai-index`)
// const aiMemory = join(WorkSpacesPath, `${inbound.workspace}`, `ai-memory`)
// const vectorDatabasePath = join(aiIndex, 'vector-database.json')
// //
// let defaultData = { files: [] }
// let vectorDatabaseData = { ...defaultData }
// await makeDirectory(aiIndex)
// await makeDirectory(aiMemory)
// // await makeDirectory(userFiles)
// try {
//   let str = await readFile(vectorDatabasePath, 'utf8')
//   try {
//     vectorDatabaseData = JSON.parse(str)
//   } catch (e) {
//     dialog.showErrorBox('Error', 'Cannot Parse AI Memory JSON')
//   }
// } catch (e) {
//   await writeFile(vectorDatabasePath, JSON.stringify(defaultData, null, '\t'), {
//     encoding: 'utf8'
//   })
//   let str = await readFile(vectorDatabasePath, 'utf8')
//   vectorDatabaseData = JSON.parse(str)
//   console.log(e)
// }
// console.log(vectorDatabaseData)
// const files = await listFiles(join(WorkSpacesPath, `${inbound.workspace}`))
// onEvent({ type: 'files', files: files })
//
