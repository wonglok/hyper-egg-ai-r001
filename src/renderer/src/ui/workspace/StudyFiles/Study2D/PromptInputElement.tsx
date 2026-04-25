'use client'

import {
  Attachment,
  AttachmentPreview,
  AttachmentRemove,
  Attachments
} from '@/components/ai-elements/attachments'
import {
  ModelSelector,
  ModelSelectorContent,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorInput,
  ModelSelectorItem,
  ModelSelectorList,
  ModelSelectorLogo,
  ModelSelectorLogoGroup,
  ModelSelectorName,
  ModelSelectorTrigger
} from '@/components/ai-elements/model-selector'
import type { PromptInputMessage } from '@/components/ai-elements/prompt-input'
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionAddScreenshot,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputAttachments
} from '@/components/ai-elements/prompt-input'
import { Input } from '@/components/ui/input'
import {
  BotIcon,
  CheckIcon,
  ChevronDown,
  Cloud,
  CloudSun,
  CloudSync,
  CloudUploadIcon,
  Database,
  FolderSyncIcon,
  KeyIcon,
  Plug2Icon,
  Search,
  SearchCode
} from 'lucide-react'
import { memo, useCallback, useEffect, useState } from 'react'
import { useStudy } from '../useStudy'
import { Textarea } from '@/components/ui/textarea'
import { Mention } from 'primereact/mention'
import { MentionPromptInputElement } from './MentionArea'

const models = [
  {
    chef: 'Google',
    id: 'google/gemma-4-e2b',
    name: 'Gemma 4 E2B'
  },
  {
    chef: 'Google',
    id: 'google/gemma-4-e4b',
    name: 'Gemma 4 E4B'
  },

  {
    chef: 'Google',
    id: 'google/gemma-4-26b-a4b',
    name: 'Gemma 4 26B A4B'
  },

  {
    chef: 'Qwen',
    id: 'qwen/qwen3.5-4b',
    name: 'Qwen3.5 4B'
  },
  {
    chef: 'Qwen',
    id: 'qwen/qwen3.5-9b',
    name: 'Qwen3.5 9B'
  },
  {
    chef: 'Qwen',
    id: 'qwen/qwen3.5-35b-a3b',
    name: 'Qwen3.5 35B A3B'
  }
]

export const DefaultAIModels = models

const SUBMITTING_TIMEOUT = 200
const STREAMING_TIMEOUT = 2000

interface AttachmentItemProps {
  attachment: {
    id: string
    type: 'file'
    filename?: string
    mediaType?: string
    url: string
  }
  onRemove: (id: string) => void
}

const AttachmentItem = memo(({ attachment, onRemove }: AttachmentItemProps) => {
  const handleRemove = useCallback(() => onRemove(attachment.id), [onRemove, attachment.id])
  return (
    <Attachment data={attachment as any} key={attachment.id} onRemove={handleRemove}>
      <AttachmentPreview />
      <AttachmentRemove />
    </Attachment>
  )
})

AttachmentItem.displayName = 'AttachmentItem'

interface ModelItemProps {
  m: (typeof models)[0]
  selectedModel: string
  onSelect: (id: string) => void
}

const ModelItem = memo(({ m, selectedModel, onSelect }: ModelItemProps) => {
  const handleSelect = useCallback(() => onSelect(m.id), [onSelect, m.id])
  return (
    <ModelSelectorItem key={m.id} onSelect={handleSelect} value={m.id}>
      {/* <ModelSelectorLogo provider={m.chefSlug} /> */}
      <ModelSelectorName>{m.name}</ModelSelectorName>
      {/* <ModelSelectorLogoGroup>
        {m.providers.map((provider) => (
          <ModelSelectorLogo key={provider} provider={provider} />
        ))}
      </ModelSelectorLogoGroup> */}
      {selectedModel === m.id ? (
        <CheckIcon className="ml-auto size-4" />
      ) : (
        <div className="ml-auto size-4" />
      )}
    </ModelSelectorItem>
  )
})

ModelItem.displayName = 'ModelItem'

const PromptInputAttachmentsDisplay = () => {
  const attachments = usePromptInputAttachments()

  const handleRemove = useCallback((id: string) => attachments.remove(id), [attachments])

  if (attachments.files.length === 0) {
    return null
  }

  return (
    <Attachments variant="inline">
      {attachments.files.map((attachment) => (
        <AttachmentItem attachment={attachment} key={attachment.id} onRemove={handleRemove} />
      ))}
    </Attachments>
  )
}

export const PromptInputElement = ({
  tasks = [],
  closeInstances = <></>,
  onAbort = (): void => {},
  onSubmit = (v: {
    baseURL: string
    apiKey: string
    model: string
    text: string
    textEmbedModel: string
  }) => {}
}) => {
  const [model, setModel] = useState<string>(models[0].id)
  const [modelSelectorOpen, setModelSelectorOpen] = useState(false)
  const [status, setStatus] = useState<'submitted' | 'streaming' | 'ready' | 'error'>('ready')

  const [textEmbedModel, setTextEmbedModel] = useState('text-embedding-nomic-embed-text-v1.5')
  const [baseURL, setBaseURL] = useState('http://localhost:1234/v1')
  const [apiKey, setAPIKey] = useState('no-key')

  const selectedModelData = models.find((m) => m.id === model)

  const handleModelSelect = useCallback((id: string) => {
    setModel(id)
    setModelSelectorOpen(false)
  }, [])

  const userPrompt = useStudy((r) => r.userPrompt)
  const handleSubmit = useCallback(
    (message: PromptInputMessage) => {
      const hasText = Boolean(userPrompt)
      const hasAttachments = Boolean(message.files?.length)

      if (!(hasText || hasAttachments)) {
        return
      }

      setStatus('submitted')

      // eslint-disable-next-line no-console
      // console.log('Submitting message:', message)

      setTimeout(() => {
        setStatus('streaming')
      }, SUBMITTING_TIMEOUT)

      setTimeout(() => {
        setStatus('ready')
      }, STREAMING_TIMEOUT)

      onSubmit({
        model: model,
        text: userPrompt,
        apiKey: apiKey,
        baseURL: baseURL,
        textEmbedModel: textEmbedModel
      })
    },
    [apiKey, model, userPrompt, baseURL, onSubmit]
  )

  return (
    <div className="size-full">
      <PromptInputProvider>
        <PromptInput
          globalDrop
          multiple
          className=" bg-blue-500 rounded-lg"
          onSubmit={handleSubmit}
        >
          <PromptInputAttachmentsDisplay />
          <PromptInputBody>
            <div className="p-2 w-full">
              <MentionPromptInputElement
                onSubmit={onSubmit}
                model={model}
                userPrompt={userPrompt}
                apiKey={apiKey}
                baseURL={baseURL}
                textEmbedModel={textEmbedModel}
              ></MentionPromptInputElement>
            </div>

            {/* <PromptInputTextarea
              // value={userPrompt}
              // onChange={(ev) => {
              //   useStudy.setState({
              //     userPrompt: ev.target.value
              //   })
              // }}
              placeholder={`Let's study your workspace.`}
            /> */}
          </PromptInputBody>
          <PromptInputFooter className="bg-white rounded-b-md">
            <PromptInputTools>
              {/* <PromptInputActionMenu>
                <PromptInputActionMenuTrigger />
                <PromptInputActionMenuContent>
                  <PromptInputActionAddAttachments />
                </PromptInputActionMenuContent>
              </PromptInputActionMenu> */}
              {/* <PromptInputButton>
                <GlobeIcon size={16} />
                <span>Search</span>
              </PromptInputButton> */}

              <BotIcon className="mr-2"></BotIcon>
              <div className="mr-2">
                <ModelSelector onOpenChange={setModelSelectorOpen} open={modelSelectorOpen}>
                  <ModelSelectorTrigger asChild>
                    {/* {selectedModelData?.chefSlug && (
                      <ModelSelectorLogo provider={selectedModelData.chefSlug} />
                    )} */}

                    <PromptInputButton className="w-[100px] px-2 border border-[#bababa]">
                      {selectedModelData?.name && (
                        <ModelSelectorName>{selectedModelData.name}</ModelSelectorName>
                      )}
                      {/* <ChevronDown></ChevronDown> */}
                    </PromptInputButton>
                  </ModelSelectorTrigger>
                  <ModelSelectorContent>
                    <ModelSelectorInput placeholder="Search models..." />
                    <ModelSelectorList>
                      <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
                      {['Qwen', 'Google'].map((chef) => (
                        <ModelSelectorGroup heading={chef} key={chef}>
                          {models
                            .filter((m) => m.chef === chef)
                            .map((m) => (
                              <ModelItem
                                key={m.id}
                                m={m}
                                onSelect={handleModelSelect}
                                selectedModel={model}
                              />
                            ))}
                        </ModelSelectorGroup>
                      ))}
                    </ModelSelectorList>
                  </ModelSelectorContent>
                </ModelSelector>
              </div>

              <div className="flex items-center">
                <input
                  key={model}
                  placeholder="Text Embed Model"
                  defaultValue={model}
                  onChange={(ev: any) => {
                    setModel(ev.target.value)
                  }}
                  className="w-[100px] h-[32px] mr-3 border border-[#a3a3a3] rounded-lg py-2 px-3 text-xs"
                ></input>

                <Database className="mr-2"></Database>
                <input
                  placeholder="Text Embed Model"
                  defaultValue={textEmbedModel}
                  onChange={(ev: any) => {
                    setTextEmbedModel(ev.target.value)
                  }}
                  className="w-[150px] h-[32px] mr-3 border border-[#a3a3a3] rounded-lg py-2 px-3 text-xs"
                ></input>

                <Plug2Icon className="mr-2"></Plug2Icon>
                <input
                  placeholder="Base URL"
                  defaultValue={baseURL}
                  onChange={(ev: any) => {
                    setBaseURL(ev.target.value)
                  }}
                  className="w-[150px] h-[32px] mr-3 border border-[#a3a3a3] rounded-lg py-2 px-3 text-xs"
                ></input>

                {/*  */}

                <KeyIcon className="mr-2"></KeyIcon>
                <input
                  placeholder="API Key"
                  defaultValue={apiKey}
                  onChange={(ev: any) => {
                    setAPIKey(ev.target.value)
                  }}
                  className="w-[150px] h-[32px]  border border-[#a3a3a3] rounded-lg py-2 px-3 text-xs"
                ></input>

                {closeInstances}
              </div>
            </PromptInputTools>

            <PromptInputSubmit
              className={` cursor-pointer ${tasks.length > 0 ? `hidden` : ``}`}
              // status={status}
              onAbort={() => {
                onAbort()
              }}
            />

            {/*  */}
          </PromptInputFooter>
        </PromptInput>
      </PromptInputProvider>
    </div>
  )
}

// export default Example
