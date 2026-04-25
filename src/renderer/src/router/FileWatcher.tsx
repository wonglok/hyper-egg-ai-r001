import { useEffect } from 'react'

// refresh-watcher

export function FileWatcher({ name }: { name: string }) {
  useEffect(() => {
    if (!name) {
      return () => {
        //
      }
    }

    if (name) {
      console.log('watching', name)

      const controller = window.api.askAI(
        {
          workspace: name,
          route: 'startWatchingWorkspace'
        },
        (stream) => {
          //
          const resp = JSON.parse(stream)
          console.log(resp)
        }
      )

      console.log('start watching workspace', name)
      controller.getDataAsync().then((data) => {
        console.log('start watching workspace', name)
      })

      return () => {
        //

        const controller = window.api.askAI(
          {
            workspace: name,
            route: 'stopWatchingWorkspace'
          },
          (stream) => {
            //
            const resp = JSON.parse(stream)
            console.log(resp)
          }
        )

        console.log('stop watching workspace', name)
        controller.getDataAsync().then((data) => {
          console.log('stop watching workspace', name)
        })

        //
      }
    }
  }, [name])

  return <></>
}
