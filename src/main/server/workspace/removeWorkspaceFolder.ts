// import { app } from 'electron'
// import { makeDirectory } from 'make-dir'
// import { join } from 'path'
// import { scanFolder } from './utils/getSummary'
// import { readFile, writeFile } from 'fs/promises'
import { app, dialog } from 'electron'
import { WorkSpacesPath } from './constants'
import { join } from 'path'
import { writeFile } from 'fs/promises'
import { unlinkSync } from 'fs'
import { store } from '../../store'

export const removeWorkspaceFolder = async ({
  mainWindow,
  event,
  inbound,
  randID,
  checkAborted,
  onEvent,
  indexerAPI
}) => {
  //

  if (inbound.workspace === 'Personal') {
    return
  }
  if (inbound.workspace === 'Work') {
    return
  }

  store.read()

  store.data.workspaces.splice(
    store.data.workspaces.findIndex((r) => r.name === inbound.workspace),
    1
  )

  store.write()
  //
}

//

//
