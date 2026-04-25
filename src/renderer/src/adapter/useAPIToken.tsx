import { useEffect } from 'react'

export const useAPIToken = () => {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  useEffect(() => {
    const cleanup = (window.electronAPI as any).handleDataUpdate((data: any) => {
      console.log('Received data from main process:', data) // Logs: Hello from the main process!

      console.log(data.apikey, data.token)
      localStorage.setItem('apikey', data.apikey)
      localStorage.setItem('token', data.token)
    })

    return () => {
      cleanup()
    }
  }, [])

  return {
    display: (
      <>
        <a href="hyperegg-ai://thank-you-for-choosing-us?apikey=testapi123&token=testtoken456">
          Link test
        </a>

        <div className="action">
          <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
            Send IPC
          </a>
        </div>
      </>
    )
  }
}
