import { makeDirectory } from 'make-dir'
// import { RunOnce } from '../workspace/RunOnce'
import path, { extname, join } from 'path'
import { readFile } from 'fs/promises'
import chokidar from 'chokidar'
import { FileRAM as FileRAM } from './FileRAM'
import { WorkspaceFolder } from './WorkspaceFolder'
import { store } from '../../store'
// import { Parallel } from '../worker/Parallel'
// import { load, dump } from 'js-yaml'

export async function setupWatcher({ workspace, resolve }) {
  try {
    let workspaceFolder = (await new Promise((resolve) => {
      let tt = setInterval(() => {
        store.read()
        let workspaceItem = store.data.workspaces.find((r) => r.name === workspace)
        if (workspaceItem.path) {
          resolve(workspaceItem.path)
          clearInterval(tt)
        }
      }, 100)
    })) as string

    // if (!workspaceFolder) {
    //   console.log('[not found]', workspace)
    //   resolve()
    //   return async () => {}
    // }

    await makeDirectory(workspaceFolder)

    const watcher = chokidar.watch(workspaceFolder, {
      cwd: workspaceFolder,
      ignored: (filepath, stats) => {
        //
        if (stats?.isDirectory()) {
          return false
        } else if (stats?.isFile()) {
          if (filepath.endsWith('.md')) {
            return false
          } else if (filepath.endsWith('.txt')) {
            return false
          } else if (filepath.endsWith('.png')) {
            return false
          } else if (filepath.endsWith('.webp')) {
            return false
          } else if (filepath.endsWith('.jpg')) {
            return false
          } else if (filepath.endsWith('.jpeg')) {
            return false
          } else if (filepath.endsWith('.DS_Store')) {
            return true
          } else if (filepath.endsWith('.json')) {
            return true
          } else if (filepath.endsWith('.js')) {
            return true
          } else if (filepath.endsWith('.jsonl')) {
            return true
          } else if (filepath.endsWith('.ts')) {
            return true
          } else if (filepath.endsWith('.tsx')) {
            return true
          } else if (filepath.endsWith('.jsx')) {
            return true
          } else if (filepath.endsWith('.py')) {
            return true
          } else {
            return false
          }
        }
      },
      persistent: true
    })

    watcher
      .on('ready', () => {
        console.log('Initial scan complete. Ready for changes' + workspace)
        resolve()
      })
      .on('add', (path) => {
        FileRAM.add({ workspace, path })
      })
      .on('change', (path) => {
        FileRAM.change({ workspace, path })
      })
      .on('unlink', (path) => {
        FileRAM.unlink({ workspace, path })
      })

    return async () => {
      await watcher
        //
        .close()
        .then(() => {
          console.log('closed')
        })
    }
  } catch (e) {
    console.log(e)
    return async () => {
      //
    }
  }
}
