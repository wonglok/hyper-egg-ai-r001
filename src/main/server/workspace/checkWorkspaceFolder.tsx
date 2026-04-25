import { store } from '../../store'
export async function checkWorkspaceFolder({
  mainWindow,
  event,
  checkAborted,
  onEvent,
  inbound,
  randID
}) {
  try {
    store.read()
    let workspaces = store.data.workspaces

    let currentWorkspace = workspaces.find((r) => r.name === inbound.workspace)

    onEvent({ type: 'folder', folder: currentWorkspace?.path })
  } catch (e) {
    onEvent({ type: 'folder', folder: false })
    console.log(e)
  }
}
