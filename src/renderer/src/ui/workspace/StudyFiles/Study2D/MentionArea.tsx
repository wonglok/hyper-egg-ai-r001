import { useState, useEffect } from 'react'
import { Mention } from 'primereact/mention'
import { useStudy } from '../useStudy'

export function MentionPromptInputElement({
  onSubmit,
  model,
  userPrompt,
  apiKey,
  baseURL,
  textEmbedModel
}) {
  const [customers, setCustomers] = useState([])
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
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
      // {name: ''}
      setCustomers(
        data.workspaces.map((r) => {
          // r.name += ' Workspace'
          return r
        })
      )
    })
  }, [])

  const onSearch = (event) => {
    //
    //

    setTimeout(() => {
      const query = event.query
      let suggestions

      if (!query.trim().length) {
        suggestions = [...customers]
      } else {
        suggestions = customers.filter((customer) => {
          return customer.name.toLowerCase().startsWith(query.toLowerCase())
        })
      }

      setSuggestions(suggestions)
    }, 150)
  }

  const itemTemplate = (suggestion) => {
    return (
      <div className=" inline-block p-2 mb-2 bg-white rounded-lg border border-2 border-gray-300 shadow-2xl">
        <div>@{suggestion.name} Workspace</div>
      </div>
    )
  }

  return (
    <div className="w-full h-full mention relative">
      <div
        dangerouslySetInnerHTML={{
          __html: `
            <style>
            .mention textarea {
                width: 100%;
                padding: 8px;
            }
            </style>
            `
        }}
      ></div>
      <Mention
        className="w-full h-[115px] text-xs border rounded-lg focus:border-none bg-white"
        // onChange={(e: any) => }
        suggestions={suggestions}
        onSearch={onSearch}
        field="name"
        placeholder="Enter @ to mention workspace"
        rows={5}
        spellCheck={false}
        itemTemplate={itemTemplate}
        onKeyDownCapture={(ev) => {
          if (ev.key === 'Enter' && !ev.shiftKey) {
            //
            console.log(ev)
            ev.preventDefault()
            //

            onSubmit({
              model: model,
              text: userPrompt,
              apiKey: apiKey,
              baseURL: baseURL,
              textEmbedModel: textEmbedModel
            })

            ev.stopPropagation()
          }
        }}
        value={userPrompt}
        onChange={(ev: any) => {
          useStudy.setState({
            userPrompt: ev.target.value
          })
        }}
      />
    </div>
  )
}
