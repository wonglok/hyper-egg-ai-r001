// import { app } from 'electron'
// import { makeDirectory } from 'make-dir'
// import { join } from 'path'
// import { scanFolder } from './utils/getSummary'
// import { readFile, writeFile } from 'fs/promises'
import { app, dialog } from 'electron'
// import { join } from 'path'
// import { writeFile } from 'fs/promises'
import { store } from '../../store'

export const selectWorkspaceFolder = async ({
  mainWindow,
  event,
  inbound,
  randID,
  checkAborted,
  onEvent,
  indexerAPI
}) => {
  //

  let dir = await dialog
    .showOpenDialog(mainWindow, {
      defaultPath: app.getPath('documents'),
      title: 'Select a Folder for AI to use',
      properties: ['openDirectory', 'createDirectory', 'dontAddToRecent']
    })
    .then((data) => {
      //
      console.log(data)

      return data
    })

  if (!dir.canceled && dir.filePaths[0]) {
    //
    let firstFolder = dir.filePaths[0]

    let item = store.data.workspaces.find((r) => r.name === inbound.workspace)

    item.path = `${firstFolder}`

    store.write()
    store.read()

    onEvent({ type: 'folder', folder: firstFolder })

    indexerAPI.restart()

    return firstFolder
    //
  }

  return false
  //
}

//
