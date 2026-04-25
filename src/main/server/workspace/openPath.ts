import { shell } from 'electron'
import { store } from '../../store'

export async function openPath({
  //
  mainWindow,
  event,
  checkAborted,
  onEvent,
  inbound,
  randID
}) {
  store.read()
  let workspaces = store.data.workspaces

  let currentWorkspace = workspaces.find((r) => r.name === inbound.workspace)

  let workspaceFolder = currentWorkspace.path

  if (!workspaceFolder) {
    console.log('[not found]', workspaceFolder)
  }

  await shell.openPath(workspaceFolder)

  return null
}
