// import { MessageChannelMain, utilityProcess } from 'electron'
// import { generateJSON } from './tools/adapter'
// import { z } from 'zod'
// import { processPromptRequest } from './tools/processStack'
// import { prepToolListFiles } from './tools/fsTools'

import { studyFolder } from './server/study/studyFolder'
import { checkWorkspace } from './server/workspace/checkWorkspace'
import { checkWorkspaceFolder } from './server/workspace/checkWorkspaceFolder'
import { createWorkspace } from './server/workspace/createWorkspace'
import { listWorkspaces } from './server/workspace/listWorkspaces'
import { monitorProgress } from './server/workspace/monitorProgress'
import { openPath } from './server/workspace/openPath'
import { readWorkspaceFiles } from './server/workspace/readWorkspaceFiles'
import { removeWorkspaceFolder } from './server/workspace/removeWorkspaceFolder'
import { selectWorkspaceFolder } from './server/workspace/selectWorkspaceFolder'

// import { utilityProcess, MessageChannelMain } from 'electron'
// import { runAgent } from './agent-pi/runAgent'
// function removeThinkTags(input) {
//   const regex = /<think>.*?<\/think>/gis
//   const result = input.replace(regex, '')
//   return result
// }

// console.log('plan', removeThinkTags(plan))

export const abortedFlags = {}

export const setupIPCMain = async ({ ipcMain, mainWindow, indexerAPI }) => {
  //
  ipcMain.on('askAI-abort', async (event, inbound, randID) => {
    abortedFlags[randID] = abortedFlags[randID] || true
    console.log('abortedFlags[randID]', abortedFlags[randID])
  })

  ipcMain.on('askAI-message', async (event, inbound, randID) => {
    try {
      if (inbound.route === 'readWorkspaceFiles') {
        return await readWorkspaceFiles({
          mainWindow,
          event,
          inbound,
          randID,
          checkAborted: () => {
            return abortedFlags[randID]
          },
          onEvent: (ev) => {
            mainWindow.webContents.send(`askAI-stream${randID}`, JSON.stringify(ev))
          }
        })
      }

      if (inbound.route === 'listWorkspaces') {
        return await listWorkspaces({
          mainWindow,
          event,
          inbound,
          randID,
          checkAborted: () => {
            return abortedFlags[randID]
          },
          onEvent: (ev) => {
            mainWindow.webContents.send(`askAI-stream${randID}`, JSON.stringify(ev))
          }
        })
      }

      if (inbound.route === 'createWorkspace') {
        return await createWorkspace({
          mainWindow,
          event,
          inbound,
          randID,
          checkAborted: () => {
            return abortedFlags[randID]
          },
          onEvent: (ev) => {
            mainWindow.webContents.send(`askAI-stream${randID}`, JSON.stringify(ev))
          }
        })
      }

      if (inbound.route === 'checkWorkspace') {
        return await checkWorkspace({
          mainWindow,
          event,
          inbound,
          randID,
          checkAborted: () => {
            return abortedFlags[randID]
          },
          onEvent: (ev) => {
            mainWindow.webContents.send(`askAI-stream${randID}`, JSON.stringify(ev))
          }
        })
      }

      if (inbound.route === 'selectWorkspaceFolder') {
        return await selectWorkspaceFolder({
          mainWindow,
          event,
          inbound,
          randID,
          indexerAPI,
          checkAborted: () => {
            return abortedFlags[randID]
          },
          onEvent: (ev) => {
            mainWindow.webContents.send(`askAI-stream${randID}`, JSON.stringify(ev))
          }
        })
      }

      if (inbound.route === 'removeWorkspaceFolder') {
        return await removeWorkspaceFolder({
          mainWindow,
          event,
          inbound,
          randID,
          indexerAPI,
          checkAborted: () => {
            return abortedFlags[randID]
          },
          onEvent: (ev) => {
            mainWindow.webContents.send(`askAI-stream${randID}`, JSON.stringify(ev))
          }
        })
      }

      if (inbound.route === 'checkWorkspaceFolder') {
        return await checkWorkspaceFolder({
          mainWindow,
          event,
          inbound,
          randID,
          checkAborted: () => {
            return abortedFlags[randID]
          },
          onEvent: (ev) => {
            mainWindow.webContents.send(`askAI-stream${randID}`, JSON.stringify(ev))
          }
        })
      }

      if (inbound.route === 'openPath') {
        return await openPath({
          mainWindow,
          event,
          inbound,
          randID,
          checkAborted: () => {
            return abortedFlags[randID]
          },
          onEvent: (ev) => {
            mainWindow.webContents.send(`askAI-stream${randID}`, JSON.stringify(ev))
          }
        })
      }

      if (inbound.route === 'monitorProgress') {
        return await monitorProgress({
          indexerAPI,
          mainWindow,
          event,
          inbound,
          randID,
          checkAborted: () => {
            return abortedFlags[randID]
          },
          onEvent: (ev) => {
            try {
              mainWindow.webContents.send(`askAI-stream${randID}`, JSON.stringify(ev))
            } catch (e) {
              console.log(e)
            }
          }
        })
      }

      if (inbound.route === 'studyFolder') {
        return await studyFolder({
          mainWindow,
          event,
          inbound,
          randID,
          checkAborted: () => {
            return abortedFlags[randID]
          },
          onEvent: (ev) => {
            mainWindow?.webContents?.send(`askAI-stream${randID}`, JSON.stringify(ev))
          },
          indexerAPI
        })
      }

      event.reply(`${'askAI-reply'}${randID}`, { status: 'done' })
    } catch (e) {
      console.error(e)
      event.reply(`${'askAI-reply'}${randID}`, { status: 'failed' })
    } finally {
    }
  })
}
