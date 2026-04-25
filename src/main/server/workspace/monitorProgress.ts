// import { FileRAM } from '../worker/FileRAM'

export async function monitorProgress({
  mainWindow,
  event,
  checkAborted,
  onEvent,
  inbound,
  randID,
  indexerAPI
}) {
  if (!inbound.workspace) {
    console.log('no workspace')
    return { status: 'error', list: [] }
  }

  console.log('indexerAPI', indexerAPI)

  //
  let clean = indexerAPI.on('filelist', (data) => {
    if (data.filelist instanceof Array) {
      onEvent({
        list: data.filelist,
        //.filter((r) => r.workspace === inbound.workspace),
        // list: data.filelist.filter((r) => r.workspace === inbound.workspace),
        type: 'list'
      })
    }
  })

  let intv = setInterval(() => {
    if (checkAborted()) {
      clearInterval(intv)
      clean()
    } else {
      // request filelist
      indexerAPI.sendObject({ type: 'filelist' })
    }
  }, 100)

  // let list = FileRAM.list()
  // onEvent({ list: list, type: 'list' })

  return { status: 'ok', list: [] }
}

//
