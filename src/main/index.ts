import { app, shell, BrowserWindow, ipcMain, screen } from 'electron'
import path, { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { setupIPCMain } from './core'
// import { bootupIndexer } from './server/worker/IndexLoop'

// import { Worker } from 'node:worker_threads'
// import workerPath from './server/worker/IndexLoop?modulePath'

// import { utilityProcess, MessageChannelMain } from 'electron'
import createWorker from './server/worker/IndexLoop?modulePath'
import { Worker } from 'node:worker_threads'

const PROTOCOL = 'hyperegg-ai' // Choose a unique name
// hyperegg-ai://thankyou-for-choosing-us?apikey=thisisapikey123&token=thisistoken123

function createWindow(): void {
  // Create the browser window.
  let extraHeight = 0

  if (import.meta.env.DEV) {
    extraHeight = 300
  }
  const bounds = screen.getPrimaryDisplay().bounds

  const mainWindow = import.meta.env.DEV
    ? new BrowserWindow({
        width: bounds.width / 3,
        height: bounds.height,
        x: 0,
        y: 0,
        show: true,
        autoHideMenuBar: true,
        ...(process.platform === 'linux' ? { icon } : {}),
        webPreferences: {
          defaultEncoding: 'utf8',
          scrollBounce: false,
          preload: join(__dirname, '../preload/index.js'),
          sandbox: false
        }
      })
    : new BrowserWindow({
        width: bounds.width,
        height: bounds.height,
        x: 0,
        y: 0,
        show: true,
        autoHideMenuBar: true,

        ...(process.platform === 'linux' ? { icon } : {}),
        webPreferences: {
          defaultEncoding: 'utf8',
          scrollBounce: false,
          preload: join(__dirname, '../preload/index.js'),
          sandbox: false
        }
      })

  if (import.meta.env.DEV) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // example:
  // hyperegg-ai://thankyou-for-choosing-us?apikey=test123&token=test456
  function handleDeepLink(url: string): void {
    const obj = new URL(url)
    const apikey = obj.searchParams.get('apikey')
    const token = obj.searchParams.get('token')

    // console.log(apikey, token)

    // mainWindow.webContents.postMessage('deep-link-received', {
    //   url,
    //   apikey,
    //   token
    // })

    const dataToSend = { apikey, token, note: 'handle deep link' }

    mainWindow.webContents.send('data-update', dataToSend)
  }

  app.on('second-instance', (_: any, commandLine) => {
    // Someone tried to run a second instance, we should focus our window
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
    // Protocol handler for win32/Linux: process the commandLine to get the deep link URL
    const url = commandLine.pop()
    if (url && url.startsWith(`${PROTOCOL}://`)) {
      handleDeepLink(url)
    }
  })

  // macOS
  app.on('open-url', (event, url) => {
    event.preventDefault()
    // Protocol handler for osx: the url is passed directly
    handleDeepLink(url)
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  const allHandlers = []

  const makeApp = () => {
    let worker = new Worker(createWorker, {})

    let on = (eventName, handler) => {
      let func = (txt) => {
        try {
          let inbound = JSON.parse(txt)
          if (inbound.type === eventName) {
            handler(inbound)
          }
        } catch (e) {
          console.log(e)
        }
      }
      worker.addListener('message', func)

      return () => {
        worker.removeListener('message', func)
      }
    }

    let send = (data) => {
      try {
        worker.postMessage(JSON.stringify(data))
      } catch (e) {
        console.log(e)
      }
    }

    return {
      on: on,
      send,
      kill: () => {
        worker.terminate()
      }
    }
  }

  let subApp = makeApp()
  subApp.send({ type: 'bootup-engine', appDir: `${app.getPath('appData')}` })

  const indexerAPI = {
    on: (eventName, handler) => {
      allHandlers.push({
        eventName,
        handler
      })

      return subApp.on(eventName, handler)
    },
    sendObject: (data) => {
      subApp.send(data)
    },
    restart: () => {
      subApp.kill()

      subApp = makeApp()
      allHandlers.forEach((item) => {
        subApp.on(item.eventName, item.handler)
      })
      subApp.send({ type: 'bootup-engine', appDir: `${app.getPath('appData')}` })
    }
  }

  setupIPCMain({ ipcMain, mainWindow, indexerAPI: indexerAPI })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient(PROTOCOL, process.execPath, [path.resolve(process.argv[1])])
  }
} else {
  app.setAsDefaultProtocolClient(PROTOCOL)
}
