import * as React from 'react'
import { ButtonGroup } from '@/components/ui/button-group'
import { Button } from '@/components/ui/button'
import {
  Check,
  CpuIcon,
  FilterIcon,
  GpuIcon,
  GridIcon,
  MoonIcon,
  SearchIcon,
  Tv,
  TvIcon
} from 'lucide-react'

const Item = ({ num, li }: any) => {
  return (
    <>
      <GridItem li={li}></GridItem>
    </>
  )
}

const getStatus = (ev: string) => {
  if (ev === 'done') {
    return (
      <div
        className={`p-2 flex justify-center items-center bg-[#8cdb3c] text-xs rounded-b-xl border text-white `}
      >{`OK`}</div>
    )
  } else if (ev === 'checking') {
    return (
      <div
        className={`p-2 flex justify-center items-center bg-[#e3a554] text-xs rounded-b-xl border text-white `}
      >{`Processing`}</div>
    )
  } else if (ev === 'processing') {
    return (
      <div
        className={`p-2 flex justify-center items-center bg-[#54afe3] text-xs rounded-b-xl border text-white `}
      >{`Indexing`}</div>
    )
  } else if (ev === 'idle') {
    return (
      <div
        className={`p-2 flex justify-center items-center bg-[#0d1262] text-xs rounded-b-xl border text-white`}
      >{`Scheduled`}</div>
    )
  }
}

const GridItem = ({ li }) => {
  return (
    <div key={li.path + li.workspace} className="flex mr-3 mb-3 flex-col w-[150px]">
      <div className="p-2 bg-[#fbfbfb] text-[#3a3a3a] text-xs flex items-start rounded-t-xl border whitespace-pre-wrap  wrap-break-word overflow-hidden overflow-x-scroll  min-h-[100px]">
        {li.path}
      </div>

      {getStatus(li.status)}
    </div>
  )
}
//

export function SerachIndexGrid({ list }) {
  let [tab, setTab] = React.useState('checking')
  let [auto, setAuto] = React.useState(true)
  let [showAll, setShowAll] = React.useState(false)
  React.useEffect(() => {
    if (!auto) {
      return
    }
    let output = `${tab}`

    let isChecking = list.filter((r) => r.status === 'checking')?.length > 0
    if (isChecking) {
      output = 'checking'
    }

    // let isProcessing = list.filter((r) => r.status === 'processing')?.length > 0
    // if (isProcessing) {
    //   output = 'processing'
    // }

    let isDone = list.filter((r) => r.status === 'done')?.length === list.length
    if (isDone) {
      output = 'done'
    }

    if (output !== tab) {
      setTab(output)
    }
  }, [auto, tab, list])

  return (
    <>
      <div className="">
        <div className="mb-3">
          <ButtonGroup>
            <Button variant="outline" size="lg">
              Filter
              <FilterIcon></FilterIcon>
            </Button>

            <Button
              variant={`${tab === 'all' ? 'default' : 'outline'}`}
              size="lg"
              onClick={() => {
                setTab('all')
                setShowAll(false)
                setAuto(false)
              }}
            >
              <GridIcon></GridIcon> ALL ({list.length})
            </Button>
            <Button
              variant={`${tab === 'idle' ? 'default' : 'outline'}`}
              size="lg"
              onClick={() => {
                setTab('idle')
                setShowAll(false)
                setAuto(false)
              }}
            >
              <MoonIcon></MoonIcon> ({list.filter((r) => r.status === 'idle').length}) Scheduled for
              Rescan
            </Button>
            <Button
              variant={`${tab === 'checking' ? 'default' : 'outline'}`}
              size="lg"
              onClick={() => {
                setTab('checking')
                setShowAll(false)
                setAuto(false)
              }}
            >
              <CpuIcon></CpuIcon>({list.filter((r) => r.status === 'checking').length}) Rescanning
            </Button>

            <Button
              variant={`${tab === 'processing' ? 'default' : 'outline'}`}
              size="lg"
              onClick={() => {
                setTab('processing')
                setShowAll(false)
                setAuto(false)
              }}
            >
              <GpuIcon></GpuIcon> ({list.filter((r) => r.status === 'processing').length})
              Processsing
            </Button>
            <Button
              variant={`${tab === 'done' ? 'default' : 'outline'}`}
              size="lg"
              onClick={() => {
                setTab('done')
                setShowAll(false)
                setAuto(false)
              }}
            >
              <Check></Check> OK ({list.filter((r) => r.status === 'done').length})
            </Button>
          </ButtonGroup>
        </div>
      </div>
      <div className="w-full flex flex-wrap">
        {list
          .sort((a, b) => {
            //
            //
            if (a.status === tab && b.status === tab) {
              return -2
            }
            if (a.status === tab || b.status === tab) {
              return -1
            }

            //
            //
            return 0
          })
          .filter((r, idx) => {
            if (tab === 'all') {
              if (!showAll) {
                if (idx >= 100) {
                  return false
                }
              }
              return true
            }

            if (tab === 'idle') {
              if (!showAll) {
                if (idx >= 100) {
                  return false
                }
              }
              return r.status === 'idle'
            }

            if (tab === 'checking') {
              // if (!showAll) {
              //   if (idx >= 100) {
              //     return false
              //   }
              // }
              return r.status === 'checking'
            }

            if (tab === 'processing') {
              // if (!showAll) {
              //   if (idx >= 100) {
              //     return false
              //   }
              // }
              return r.status === 'processing'
            }

            if (tab === 'done') {
              if (!showAll) {
                if (idx >= 100) {
                  return false
                }
              }
              return r.status === 'done'
            }

            return false
          })
          .map((item, idx) => (
            <Item
              data-grid-groupkey={item.groupKey + 'idx' + idx}
              li={item}
              key={item.key + 'idx' + idx}
              num={item.key}
            />
          ))}
      </div>

      {!showAll && list.length > 100 && (
        <div className="text-center">
          <div className="p-3 ">
            <div
              className="p-3  border bg-blue-500 text-xs inline-block px-12 py-3 my-8 rounded-2xl text-white"
              onClick={() => {
                setShowAll(true)
              }}
            >
              Load More {`${list.length - 100 < 0 ? `` : `(${list.length - 100})`}`}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
