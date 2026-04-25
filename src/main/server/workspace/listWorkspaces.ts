import { app } from 'electron'
import { makeDirectory } from 'make-dir'
import promptTool from 'custom-electron-prompt'
import fs from 'fs'
import path, { join } from 'path'
import { store } from '../../store'

export async function listWorkspaces({
  mainWindow,
  event,
  checkAborted,
  onEvent,
  inbound,
  randID
}) {
  store.read()
  let workspaces = store.data.workspaces

  event.reply(`${'askAI-reply'}${randID}`, {
    workspaces: workspaces.map((item) => {
      return {
        name: `${item.name}`
      }
    })
  })
}
