// import { app } from 'electron'
// import { makeDirectory } from 'make-dir'
// import promptTool from 'custom-electron-prompt'
import fs from 'fs'
// import path from 'path'
import { store } from '../../store'

export async function checkWorkspace({
  mainWindow,
  event,
  checkAborted,
  onEvent,
  inbound,
  randID
}) {
  store.read()
  let workspaces = store.data.workspaces

  let currentWorkspace = workspaces.find(
    (r) => r.name.toLowerCase() === `${inbound.workspace}`.toLowerCase()
  )

  if (!currentWorkspace?.path) {
    event.reply(`${'askAI-reply'}${randID}`, { exist: false })
    return
  }

  let currentFolder = fs.statSync(`${currentWorkspace?.path}`)?.isDirectory()

  event.reply(`${'askAI-reply'}${randID}`, { exist: currentFolder })
}
