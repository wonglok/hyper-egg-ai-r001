import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electronAPI: ElectronAPI & {
      handleDataUpdate: (v: any) => void
      toAI: (v) => void
    }
    electron: ElectronAPI
    api: Record<string | 'toMain', an>
  }
}
