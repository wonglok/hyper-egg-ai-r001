import { useEffect, useState } from 'react'
import { FileWatcher } from './FileWatcher'

export function AllFiles() {
  let [spaces, setWorkspaces] = useState([])

  let [rand, setRand] = useState('')
  useEffect(() => {
    let hh = () => {
      setRand(`_${Math.random().toString(36).slice(2, 9)}`)
    }
    window.addEventListener('refresh-watcher', hh)

    return () => {
      window.removeEventListener('refresh-watcher', hh)
    }
  }, [])
  useEffect(() => {
    //
    //

    const controller = window.api.askAI(
      {
        route: 'listWorkspaces'
      },
      (stream) => {
        //
        const resp = JSON.parse(stream)
        console.log(resp)
      }
    )

    controller.getDataAsync().then((data) => {
      setTimeout(() => {
        setWorkspaces(data.workspaces)
      }, 500)
    })

    //

    return () => {
      setWorkspaces([])
    }
  }, [rand])

  //

  return (
    <>
      {spaces.map((eachSpace) => {
        return <FileWatcher key={eachSpace.path} name={eachSpace.name}></FileWatcher>
      })}
    </>
  )
}

//
