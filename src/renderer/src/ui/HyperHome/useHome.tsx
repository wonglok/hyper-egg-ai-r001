import { create } from 'zustand'
// import { mindset } from './mindset'
import moment from 'moment'
import { Navigate } from 'react-router-dom'
import { resolve } from 'path'

const init = (set, get) => {
  let getSeed = () => {
    let date = new Date()
    let ver = moment(date).format('YYYY-MM-DD')
    let time = moment(date).format('HH-mm-(A)')
    // , `-${Math.random().toString(36).slice(2, 9)}`
    return `${[time, `${ver}`].join('-')}`
  }

  let newOne = `${getSeed()}`
  if (typeof localStorage !== 'undefined') {
    if (localStorage.getItem('seed')) {
      newOne = localStorage.getItem('seed')
    } else if (!localStorage.getItem('seed')) {
      localStorage.setItem('seed', getSeed())
      newOne = localStorage.getItem('seed')
    }
  }

  return {
    refreshSeed: () => {
      localStorage.setItem('seed', getSeed())
      let newOne = localStorage.getItem('seed')
      set({
        seed: newOne
      })
    },
    getSeed: getSeed,
    seed: `${newOne}`,

    baseURL: `http://127.0.0.1:1234/v1`,
    apiKey: `nono`,
    appModel: `google/gemma-4-e2b`,

    appName: 'understanding-folder',
    appUserPrompt: ``.trim(),

    files: [],

    gate: '',

    workspace: '',

    folder: '',
    loadFolderConfig: async ({}) => {
      return new Promise((resolve) => {
        window.api.askAI(
          {
            route: 'checkWorkspaceFolder',
            workspace: get().workspace
          },
          (stream) => {
            const resp = JSON.parse(stream)

            set({
              folder: resp.folder
            })
            resolve(resp.folder)
          }
        )
      })
    }
  }
}
export const useHome = create<ReturnType<typeof init>>(init)
