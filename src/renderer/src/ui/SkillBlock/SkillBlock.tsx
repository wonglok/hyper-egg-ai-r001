import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useEffect, useState } from 'react'

export type ItemType = {
  //
  _id: string
  name: string
  content?: string
  isDir: boolean

  folder?: ItemType[]
}

export function SkillBlock({
  soul = '',
  item,
  auto = false,
  parent = null
}: {
  soul: string
  item: ItemType
  auto?: boolean
  parent?: string | null
}) {
  const [stopFunc, setStop] = useState<any>(() => {
    return () => {}
  })

  const [myItem, setItem] = useState(item)

  const onClick = async () => {
    const controller = window.api.askAI(
      {
        baseURL: `http://localhost:1234/v1`,

        apiKey: 'N/A',

        route: 'runSkill',

        model: `google/gemma-4-e2b`,

        folder: `./`,

        soul: `
${soul}
        `,
        prompt: `
${JSON.stringify(item)}
        `
      },
      (stream) => {
        //
        const resp = JSON.parse(stream)

        if (resp.type === 'json') {
          console.log(resp.json)
          setItem(resp.json)
        }
      }
    )

    setStop(() => {
      return () => {
        controller.abort()
      }
    })
  }

  useEffect(() => {
    //
    if (auto) {
      onClick()
    }
    //
  }, [])
  return (
    <>
      <div>
        <div className="p-2 mb-2 rounded-2xl border">
          <Textarea
            value={myItem.name}
            onChange={(ev) => {
              myItem.name = ev.target.value
              setItem({ ...myItem })
            }}
            className="mb-2"
          ></Textarea>

          {!myItem.isDir && (
            <Textarea
              value={myItem.content}
              onChange={(ev) => {
                myItem.content = ev.target.value
                setItem({ ...myItem })
              }}
              className="mb-2"
            ></Textarea>
          )}
          <Button className="" onClick={onClick}>
            Think
          </Button>
          <Button
            className="ml-2"
            variant={'destructive'}
            onClick={() => {
              stopFunc()
            }}
          >
            Stop
          </Button>
        </div>

        <div className="ml-5">
          {myItem.isDir &&
            myItem?.folder?.map((li) => {
              return (
                <SkillBlock
                  key={li._id}
                  soul={soul}
                  parent={parent}
                  item={li}
                  auto={true}
                ></SkillBlock>
              )
            })}
        </div>
      </div>
    </>
  )
}
