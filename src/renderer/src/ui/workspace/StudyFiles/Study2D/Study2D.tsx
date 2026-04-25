import { Streamdown } from 'streamdown'
import { useStudy } from '../useStudy'
import { Scroller } from './Scroller'
import { Reasoning, ReasoningContent, ReasoningTrigger } from '@/components/ai-elements/reasoning'

export function Study2D() {
  let currentStatus = useStudy((r) => r.currentStatus)
  let currentQuery = useStudy((r) => r.currentQuery)
  let history = useStudy((r) => r.history)
  let userMessage = useStudy((r) => r.userMessage)

  return (
    <>
      <div className="h-full">
        <div style={{ height: `calc(80px)` }}>
          <div className=" relative w-full h-full rounded-t-lg overflow-hidden">
            <div className="flex w-full h-full">
              <div className="h-full w-1/3 bg-[#91ffbf] p-3">
                <div className="bg-white h-[100%] w-[100%] rounded-lg text-xs p-3  flex items-center justify-center ">
                  AI Mind
                </div>
              </div>
              <div className="h-full w-1/3 bg-[#8f97ff] p-3">
                <div className="bg-white h-[100%] w-[100%] rounded-lg text-xs p-3  flex items-center justify-center ">
                  AI Queries & Lookup
                </div>
              </div>
              <div className="h-full w-1/3 bg-[#f6a4ff]  p-3">
                <div className="bg-white h-[100%] w-[100%] rounded-lg text-xs p-3  flex items-center justify-center ">
                  AI Message
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ height: `calc(100% - 80px)` }}>
          <div className=" relative w-full h-full rounded-b-lg overflow-hidden">
            <div className="flex w-full h-full">
              <div className="h-full w-1/3 from-teal-100 to-teal-400 bg-linear-0 p-3 overflow-y-scroll">
                <div className="bg-white/80 w-[100%] h-[30%] mb-[15px] rounded-lg text-xs p-3 ">
                  <Scroller reloader={currentStatus.thoughts} className={'w-full h-full text-xs'}>
                    {currentStatus.thoughts && (
                      <Reasoning open>
                        <ReasoningTrigger className="text-xs" />
                        <ReasoningContent className="text-xs">{`${currentStatus.thoughts}`}</ReasoningContent>
                      </Reasoning>
                    )}
                  </Scroller>
                </div>
                <div
                  style={{ height: `calc(100% - 30% - 15px)` }}
                  className="bg-white/80 w-[100%] rounded-lg text-xs p-3 "
                >
                  <Scroller reloader={currentStatus.words} className={'w-full h-full text-xs'}>
                    <div className=" whitespace-pre-wrap text-xs text-gray-600">
                      <>{currentStatus.words.trim()}</>
                    </div>
                  </Scroller>
                </div>
              </div>
              {
                <div className="h-full w-1/3 from-blue-100 to-blue-400 bg-linear-0  p-3">
                  <Scroller
                    reloader={JSON.stringify({ history, currentQuery })}
                    className={'h-full w-full text-xs'}
                  >
                    <div>
                      {history
                        .map((r, i) => {
                          return [
                            <div
                              key={'action' + i + 'a'}
                              className="bg-white/80 rounded-lg w-[100%] mb-3 text-xs p-3 whitespace-pre-wrap "
                            >
                              <Streamdown>{r.content}</Streamdown>
                            </div>,
                            <div
                              key={'action' + i + 'b'}
                              className="bg-white/80 w-[100%] rounded-lg mb-3 text-xs p-3 whitespace-pre-wrap "
                            >
                              <Streamdown>{r.result}</Streamdown>
                            </div>
                          ]
                        })
                        .flat()}

                      {/* <div className="bg-white/80 h-[100px] w-[100%] rounded-lg mb-3 text-xs p-3 "></div>

                    <div className="bg-white/80 h-[150px] w-[100%] rounded-lg mb-3 text-xs p-3 "></div>
                    <div className="bg-white/80 h-[100px] w-[100%] rounded-lg mb-3 text-xs p-3 "></div>
                    <div className="bg-white/80 h-[100px] w-[100%] rounded-lg mb-3 text-xs p-3 "></div>
                    <div className="bg-white/80 h-[100px] w-[100%] rounded-lg mb-3 text-xs p-3 "></div>
                    <div className="bg-white/80 h-[100px] w-[100%] rounded-lg mb-3 text-xs p-3 "></div>
                    <div className="bg-white/80 h-[100px] w-[100%] rounded-lg mb-3 text-xs p-3 "></div>
                    <div className="bg-white/80 h-[100px] w-[100%] rounded-lg mb-3 text-xs p-3 "></div> */}
                    </div>
                  </Scroller>
                </div>
              }
              <div className="h-full w-1/3 from-purple-100 to-purple-400 bg-linear-0   p-3 overflow-y-scroll">
                <Scroller
                  reloader={JSON.stringify({ userMessage })}
                  className={'h-full w-full text-xs'}
                >
                  {userMessage.map((r, i) => {
                    return (
                      <div
                        key={'foundout' + i}
                        className="bg-white/80 w-[100%] rounded-lg mb-3 text-xs p-3 "
                      >
                        <Streamdown>{r.content}</Streamdown>
                      </div>
                    )
                  })}
                </Scroller>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

//
//
//
