//
//   <div>{name}</div>
//

import { useEffect, useState } from 'react'
import { PromptInputElement } from './Study2D/PromptInputElement'
// import { Shimmer } from '@/components/ai-elements/shimmer'
import { initState, useStudy } from './useStudy'
// import { BubbleCanvas } from './Study2D/BubbleCanvas'
import { Study2D } from './Study2D/Study2D'
import { StopCircleIcon } from 'lucide-react'
import moment from 'moment'
import { Tooltip } from '@/components/ui/tooltip'

//
// import { Scroller } from './Study2D/Scroller'
// import { Streamdown } from 'streamdown'
// import Markdown from 'react-markdown'

export function StudyFiles({ name }) {
  // name
  const workspace = name

  //
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    if (tasks.length === 0) {
      return () => {}
    }
    sessionStorage.setItem('tasks', JSON.stringify(tasks))
    return () => {}
  }, [tasks])

  useEffect(() => {
    try {
      let jsonstr = sessionStorage.getItem('tasks')
      let data = JSON.parse(jsonstr || '[]')
      if (data?.length === 0) {
        return () => {}
      }
      if (data?.length > 0) {
        setTasks(data)
      }
    } catch (e) {}

    return () => {
      //
      //
    }
  }, [])

  // currentQuery

  return (
    <>
      <div className="p-3 h-[240px] w-full ">
        <div>
          <PromptInputElement
            tasks={tasks}
            closeInstances={
              <>
                {/*  */}
                {/*  */}
              </>
            }
            onAbort={() => {
              //
              let it = tasks[tasks.length - 1]

              window.api.abortTask(`${it.randID}`)
              setTasks(tasks.filter((r) => r.randID !== `${it.randID}`))
              //
            }}
            onSubmit={({ model, text, baseURL, apiKey, textEmbedModel }) => {
              //
              // reset the state
              useStudy.setState({ ...useStudy.getInitialState() })

              console.log({ model, text })

              useStudy.setState({
                userPrompt: text
              })

              const controller = window.api.askAI(
                {
                  route: 'studyFolder',

                  userPrompt: `${text}`,

                  baseURL: baseURL || `http://localhost:1234/v1`,

                  apiKey: apiKey || 'nokey',

                  model: `${model}`,

                  textEmbedModel: `${textEmbedModel}`,

                  workspace: `${workspace}`
                },
                (stream) => {
                  //
                  const resp = JSON.parse(stream)

                  // console.log(resp)

                  if (resp.type === 'currentQuery') {
                    console.log(resp.type, resp.currentQuery)
                    useStudy.setState({
                      currentQuery: resp.currentQuery
                    })
                  }

                  if (resp.type === 'history') {
                    console.log(resp.type, resp.history)
                    useStudy.setState({
                      history: resp.history
                    })
                  }

                  if (resp.type === 'actionLogs') {
                    console.log(resp.type, resp.actionLogs)
                    useStudy.setState({
                      actionLogs: resp.actionLogs
                    })
                  }

                  if (resp.type === 'userMessage') {
                    console.log(resp.type, resp.userMessage)
                    useStudy.setState({
                      userMessage: resp.userMessage
                    })
                  }

                  if (resp.type === 'currentStatus') {
                    useStudy.setState({
                      currentStatus: resp.currentStatus
                    })
                  }

                  if (resp.type === 'goalReached') {
                    useStudy.setState({
                      goalReached: resp.goalReached
                    })
                    console.log('goalReached', resp.goalReached)

                    if (resp?.goalReached?.length > 0) {
                      // tasks.forEach((it) => {
                      //   window.api.abortTask(`${it.randID}`)
                      // })
                      setTasks(tasks.filter((r) => r.randID !== `${controller.randID}`))
                    }
                  }

                  if (resp.type === 'phase') {
                    useStudy.setState({
                      phase: resp.phase
                    })
                  }
                }
              )

              //
              // let randID_ctrl = `${controller.randID}`
              // setHandleAbort(() => {
              //   handleAbort()
              //   return () => {
              //     window.api.abortTask(randID_ctrl)
              //   }
              // })
              //

              tasks.forEach((it) => {
                window.api.abortTask(`${it.randID}`)
                // setTasks(tasks.filter((r) => r.randID !== `${it.randID}`))
              })

              setTasks([{ randID: `${controller.randID}` }])

              controller.getDataAsync().then(() => {})

              // setKeyValue(controller.randID)
            }}
          ></PromptInputElement>
        </div>

        <div className="w-full from-[#a4faff] to-[#a7ff9b] bg-linear-90 my-2 rounded-2xl h-[42px] p-1">
          {tasks.map((it, i) => {
            return (
              <div
                key={it.randID}
                onClick={() => {
                  window.api.abortTask(`${it.randID}`)
                  setTasks(tasks.filter((r) => r.randID !== `${it.randID}`))
                }}
                className="text-center inline-flex items-center p-1 bg-red-100 border hover:bg-red-300 cursor-pointer rounded-lg px-3 text-xs"
              >
                <div className="text-[13px] mr-2">{moment(it.time).fromNow()}</div>
                <StopCircleIcon className=" fill-white-500 text-red-500"></StopCircleIcon>
              </div>
            )
          })}
        </div>
      </div>

      <div className="" style={{ height: `calc(100% - 240px)` }}>
        <div className="p-3 h-full">
          <StudyViewer></StudyViewer>
        </div>
      </div>

      {/* <PromptInput></PromptInput> */}
    </>
  )
}

//

function StudyViewer() {
  return (
    <>
      <Study2D></Study2D>
    </>
  )
}
