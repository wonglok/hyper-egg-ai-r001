import { JSONFileSyncPreset } from 'lowdb/node'
import { dirname, join } from 'path'
import * as os from 'os'
import { makeDirectorySync } from 'make-dir'

let homejson = join(os.homedir(), './hyper-egg-ai/workspace-info.json')

makeDirectorySync(dirname(homejson))

const systemStore = JSONFileSyncPreset(homejson, {
  workspaces: [
    {
      name: 'Personal',
      path: ''
    },
    {
      name: 'Work',
      path: ''
    },
    {
      name: 'Bible',
      path: ''
    }
  ] as { name: string; path?: string }[]
})

systemStore.read()

export const store = systemStore
