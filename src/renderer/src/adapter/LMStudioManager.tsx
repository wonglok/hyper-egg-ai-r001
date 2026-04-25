// LMStudioManager.tsx
import React, { useState, useEffect, useCallback, type ReactNode } from 'react'
import { LMStudioSDK, type ModelInfo, type ModelStatus } from './LMStudioSDK'

interface LMStudioManagerProps {
  baseURL?: string
  authToken?: string
  showOK?: ReactNode
}

const DEFAULT_MODELS = [
  {
    id: 'text-embedding-nomic-embed-text-v1.5',
    huggingFaceID: 'nomic-ai/nomic-embed-text-v1.5',
    desc: 'Embedding Model',
    name: 'text-embedding-nomic-embed-text-v1.5',
    note: 'Text Embedding',
    ctxWin: 2048,
    needItem: true
  },

  {
    id: 'google/gemma-4-e2b',
    huggingFaceID: 'google/gemma-4-E2B',
    desc: 'Google Gemma 4 e2b',
    name: 'google/gemma-4-e2b',
    note: 'Smart',
    ctxWin: 100000,
    memory: '~ 2 GB',
    needItem: true
  },

  {
    id: 'google/gemma-4-e4b',
    huggingFaceID: 'google/gemma-4-E4B',
    desc: 'Google Gemma 4 e4b',
    name: 'google/gemma-4-e4b',
    note: 'Smart',
    ctxWin: 100000,
    memory: '~ 4 GB',
    needItem: false
  },

  {
    id: 'qwen/qwen3.5-4b',
    huggingFaceID: 'Qwen/Qwen3.5-4B',
    desc: 'Low',
    name: 'qwen/qwen3.5-4b',
    note: 'LLM',
    ctxWin: 100000,
    memory: '13.5 GB',
    needItem: false
  },
  {
    id: 'qwen/qwen3.5-9b',
    huggingFaceID: 'Qwen/Qwen3.5-9B',
    desc: 'Low',
    name: 'qwen/qwen3.5-9b',
    note: 'LLM',
    ctxWin: 100000,
    memory: '13.5 GB',
    needItem: false
  },

  {
    id: 'qwen/qwen3.5-35b-a3b',
    huggingFaceID: 'Qwen/Qwen3.5-35B-A3B',
    desc: 'Low',
    name: 'qwen/qwen3.5-35b-a3b',
    note: 'LLM',
    ctxWin: 100000,
    memory: '13.5 GB',
    needItem: false
  }

  //
]

const StatusBadge: React.FC<{ status: ModelStatus; progress?: number }> = ({
  status,
  progress
}) => {
  const styles: Record<ModelStatus, React.CSSProperties> = {
    not_downloaded: {
      backgroundColor: '#fee2e2',
      color: '#991b1b',
      border: '1px solid #fecaca'
    },
    downloading: {
      backgroundColor: '#dbeafe',
      color: '#1e40af',
      border: '1px solid #bfdbfe'
    },
    downloaded: {
      backgroundColor: '#fef3c7',
      color: '#92400e',
      border: '1px solid #fde68a'
    },
    loading: {
      backgroundColor: '#e0e7ff',
      color: '#3730a3',
      border: '1px solid #c7d2fe'
    },
    loaded: {
      backgroundColor: '#d1fae5',
      color: '#065f46',
      border: '1px solid #a7f3d0'
    }
  }

  const labels: Record<ModelStatus, string> = {
    not_downloaded: 'Not Downloaded',
    downloading: progress ? `Downloading ${progress.toFixed(1)}%` : 'Downloading',
    downloaded: 'Not in RAM',
    loading: 'Loading to RAM...',
    loaded: 'Loaded & Ready'
  }

  return (
    <span
      style={{
        padding: '4px 12px',
        borderRadius: '9999px',
        fontSize: '0.875rem',
        fontWeight: 500,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        ...styles[status]
      }}
    >
      {status === 'downloading' && (
        <span
          style={{
            width: '12px',
            height: '12px',
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}
        />
      )}
      {labels[status]}
    </span>
  )
}

export const LMStudioManager: React.FC<LMStudioManagerProps> = ({
  baseURL = 'http://localhost:1234',
  authToken,
  showOK = null
}) => {
  const [sdk] = useState(() => new LMStudioSDK(baseURL, authToken))
  const [models, setModels] = useState<ModelInfo[]>([])
  const [prepareStatus, setPrepareStatus] = useState('idle')
  const [error, setError] = useState<string | null>(null)

  const refreshStatus = useCallback(async () => {
    try {
      await new Promise((resolve) => {
        setTimeout(resolve, 150)
      })

      setModels([])
      setError(null)

      const downloadedModels = await sdk.listModels()

      const updatedModels = await Promise.all(
        DEFAULT_MODELS.map(async (defaultModel) => {
          const theModel: any = downloadedModels.find(
            (r: any) => r.key.toLowerCase() === defaultModel.id.toLowerCase()
          )

          if (!theModel) {
            return {
              id: defaultModel.id.toLowerCase(),
              status: 'not_downloaded'
            }
          }

          const data = {
            id: theModel.key,
            ...theModel
          }

          if (theModel) {
            data.status = 'downloaded'
          }

          if (theModel?.loaded_instances?.length >= 1) {
            data.status = 'loaded'
          }

          return data
        })
      )

      setModels(updatedModels)
    } catch (err) {
      console.log(err)
      setError(err instanceof Error ? err.message : 'Failed to fetch status')
    }
  }, [sdk])

  useEffect(() => {
    refreshStatus()
  }, [])

  useEffect(() => {
    if (
      models.filter((r) => r.status === 'loaded').length ===
      DEFAULT_MODELS.filter((r) => r.needItem).length
    ) {
      setPrepareStatus('done')
    } else {
      setPrepareStatus('idle')
    }
  }, [models.map((r) => r.status).join('_')])

  // Poll for updates

  const handleDownload = async (modelId: string): Promise<void> => {
    try {
      if (!modelId) {
        throw new Error(`modelId not found:${modelId}`)
      }
      // await sdk.downloadModel(modelId)
      // Check if it's currently downloading
      let timer: any = 0
      try {
        const downloadJob: any = await sdk.downloadModel(modelId)

        timer = setInterval(async () => {
          const downloadStatus = await sdk.getDownloadStatus(downloadJob.job_id)
          console.log(downloadStatus)
        }, 500)

        // if (
        // 	downloadStatus.status === "downloading" ||
        // 	downloadStatus.status === "pending"
        // ) {
        // 	return {
        // 		id: defaultModel.id,
        // 		status: "downloading" as ModelStatus,
        // 		downloadProgress: downloadStatus.progress,
        // 	};
        // }
      } catch (e) {
        console.error(e)
        // Not downloading
      } finally {
        clearInterval(timer)
      }

      refreshStatus()
    } catch (err) {
      console.log(err)
      setError(
        `Failed to download ${modelId}: ${err instanceof Error ? err.message : 'Unknown error'}`
      )
    }
  }

  const handleLoad = async (modelId: string): Promise<void> => {
    try {
      setModels((prev) => prev.map((m) => (m.id === modelId ? { ...m, status: 'loading' } : m)))
      await sdk.loadModel(modelId)
      refreshStatus()
    } catch (err) {
      setError(`Failed to load ${modelId}: ${err instanceof Error ? err.message : 'Unknown error'}`)
      refreshStatus()
    }
  }

  const handleUnload = async (instanceID: string): Promise<void> => {
    try {
      await sdk.unloadModel(instanceID)
      refreshStatus()
    } catch (err) {
      setError(
        `Failed to unload ${instanceID}: ${err instanceof Error ? err.message : 'Unknown error'}`
      )
    }
  }

  const handleDownloadAll = async (): Promise<void> => {
    setPrepareStatus('preparing')
    try {
      for (const model of DEFAULT_MODELS.filter((r) => r.needItem)) {
        const currentStatus = models.find((m) => m.id === model.id)
        if (currentStatus?.status === 'not_downloaded') {
          // await handleDownload(model.id)
          // await handleLoad(model.id)
        }
        if (currentStatus?.status === 'downloaded') {
          await handleLoad(model.id)
        }
      }
    } finally {
      setPrepareStatus('done')
    }
  }

  const getActionButton = (model: ModelInfo & any): ReactNode | null => {
    switch (model.status) {
      case 'not_downloaded':
        return (
          <button onClick={() => handleDownload(model.id)} style={buttonStyle('#3b82f6')}>
            Download
          </button>
        )
      case 'downloaded':
        return (
          <button onClick={() => handleLoad(model.id)} style={buttonStyle('#10b981')}>
            Load to RAM
          </button>
        )
      case 'loaded':
        return (
          <button
            onClick={() => {
              handleUnload(model.loaded_instances[0].id)
            }}
            style={buttonStyle('#ef4444')}
          >
            Unload
          </button>
        )
      default:
        return null
    }
  }

  if (showOK && prepareStatus === 'done') {
    return showOK
  }

  return (
    <div
      style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '24px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        overflowY: 'scroll',
        height: '100%'
      }}
    >
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div
        style={{
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: '1.5rem',
              color: '#111827'
            }}
          >
            LM Studio Model Manager
          </h1>
          <p
            style={{
              margin: '4px 0 0 0',
              color: '#6b7280',
              fontSize: '0.875rem'
            }}
          >
            Manage required AI models for the system
          </p>
        </div>
        <button
          onClick={handleDownloadAll}
          disabled={prepareStatus === 'done' || prepareStatus === 'preparing'}
          style={
            prepareStatus === 'done'
              ? {
                  ...buttonStyle('#198d19')
                }
              : {
                  ...buttonStyle('#111827')
                }
          }
        >
          {prepareStatus === 'idle' && 'Load Essential Models'}
          {prepareStatus === 'done' && 'Essential Models are ready.'}
          {prepareStatus === 'preparing' && 'Preparing'}
        </button>
      </div>

      {error && (
        <div
          style={{
            padding: '12px',
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            borderRadius: '6px',
            marginBottom: '16px',
            fontSize: '0.875rem'
          }}
        >
          {error}
        </div>
      )}
      <div
        style={{
          marginTop: '24px',
          padding: '12px',
          backgroundColor: '#f3f4f6',
          borderRadius: '6px',
          fontSize: '0.875rem',
          marginBlock: '20px',
          color: '#4b5563'
        }}
      >
        <strong>Note:</strong> Ensure LM Studio is running locally with the REST API server enabled
        on port 1234 and Cross Origin Resource Sharing CORS enabled.
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        {DEFAULT_MODELS.map((defaultModel) => {
          const modelState = models.find((m) => m.id === defaultModel.id) || {
            id: defaultModel.id,
            status: 'not_downloaded' as ModelStatus
          }

          return (
            <div
              key={defaultModel.id}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '16px',
                backgroundColor: 'white',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px'
                }}
              >
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: '1.125rem',
                      color: '#111827'
                    }}
                  >
                    {defaultModel.name}
                  </h3>
                  <p
                    style={{
                      margin: '4px 0 0 0',
                      fontSize: '0.875rem',
                      color: '#6b7280'
                    }}
                  >
                    {defaultModel.id} • {defaultModel.desc}
                  </p>
                </div>
                <StatusBadge status={modelState.status} progress={modelState.downloadProgress} />
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginTop: '12px'
                }}
              >
                {getActionButton({ ...defaultModel, ...modelState })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const buttonStyle = (bgColor: string): React.CSSProperties | any => ({
  padding: '8px 16px',
  backgroundColor: bgColor,
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  fontSize: '0.875rem',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'opacity 0.2s',
  ':hover': {
    opacity: 0.9
  }
})
