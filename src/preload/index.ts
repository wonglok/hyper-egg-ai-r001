import { contextBridge, ipcMain, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
// In the preload script:
// import { ipcRenderer } from 'electron'

// Custom APIs for renderer

let tasklist = []
const Tasks = {}
const api = {
  getTasks() {
    return tasklist.sort((a, b) => {
      if (a.time > b.time) {
        return 1
      }

      if (a.time < b.time) {
        return -1
      }
      return 0
    })
  },
  abortTask: (randID) => {
    Tasks[randID] = false
    delete Tasks[randID]

    tasklist.splice(
      tasklist.findIndex((r) => r.ranID === randID),
      1
    )

    ipcRenderer.send('askAI-abort', {}, randID)
  },
  askAI: (data, stream: (v: any) => {}) => {
    //

    const controller = {
      randID: '',
      data: null,
      abort: () => {
        Tasks[randID] = false
        ipcRenderer.send('askAI-abort', data, randID)
      },
      getDataAsync() {
        return new Promise((resolve) => {
          let tt = setInterval(() => {
            if (controller.data !== null) {
              clearInterval(tt)
              resolve(controller.data)
            }
          }, 1)
        })
      }
    }

    const randID = `_${Math.random().toString(36).slice(2, 9)}`

    controller.randID = randID

    let li = {
      working: true,
      randID: `${randID}`,
      route: data.route,
      time: new Date().getTime()
    }

    tasklist.push(li)

    Tasks[randID] = data.route

    const handler = (_event, value: any) => {
      if (stream) {
        stream(value)
      }
    }
    ipcRenderer.on('askAI-stream' + randID, handler)

    ipcRenderer.once('askAI-reply' + randID, (_event, arg) => {
      controller.data = arg

      ipcRenderer.off('askAI-stream' + randID, handler)
      Tasks[randID] = false
      li.working = false
    })
    ipcRenderer.send('askAI-message', data, randID)

    return controller
  }
}

//

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electronAPI', {
      // Expose a function to register a callback for the 'data-update' channel
      handleDataUpdate: (callback: any) => {
        const fnc = (_: any, ...args: any): any => callback(...args)
        ipcRenderer.on('data-update', fnc)
        return () => {
          ipcRenderer.off('data-update', fnc)
        }
      },
      toAI: (event) => {
        ipcMain.emit(event.action, event.data)
      }
    })

    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
