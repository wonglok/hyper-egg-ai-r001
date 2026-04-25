// LMStudioSDK.ts

const DEFAULT_BASE_URL = 'http://127.0.0.1:1234'

export type ModelStatus = 'not_downloaded' | 'downloading' | 'downloaded' | 'loading' | 'loaded'

export interface ModelInfo {
  id: string
  status: ModelStatus
  downloadProgress?: number // 0-100
  size?: number
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface ChatCompletionRequest {
  model: string
  messages: ChatMessage[]
  temperature?: number
  max_tokens?: number
  stream?: boolean
}

export interface ChatCompletionResponse {
  id: string
  object: string
  created: number
  model: string
  choices: {
    index: number
    message: ChatMessage
    finish_reason: string
  }[]
}

export interface DownloadStatusResponse {
  status: 'pending' | 'downloading' | 'completed' | 'error'
  progress?: number
  error?: string
}

export class LMStudioSDK {
  private baseURL: string
  private authToken?: string

  constructor(baseURL: string = DEFAULT_BASE_URL, authToken?: string) {
    this.baseURL = baseURL.replace(/\/$/, '') // Remove trailing slash
    this.authToken = authToken
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    }
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`
    }
    return headers
  }

  /**
   * Download a model from Hugging Face or other sources
   */
  async downloadModel(modelId: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/api/v1/models/download`, {
      method: 'POST',
      mode: 'cors',
      headers: this.getHeaders(),
      body: JSON.stringify({ model: modelId })
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to start download: ${error}`)
    }

    return await response.json()
  }

  /**
   * Check the status of a model download
   */
  async getDownloadStatus(jobID: string): Promise<DownloadStatusResponse> {
    const response = await fetch(
      `${this.baseURL}/api/v1/models/download/status/${encodeURIComponent(jobID)}`,
      {
        method: 'GET',
        headers: this.getHeaders(),
        mode: 'cors'
      }
    )

    if (!response.ok) {
      throw new Error('Failed to get download status')
    }

    return response.json()
  }

  /**
   * Load a model into RAM
   */
  async loadModel(modelId: string, ctxLength = 100000): Promise<void> {
    const response = await fetch(`${this.baseURL}/api/v1/models/load`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ model: modelId, context_length: ctxLength })
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to load model: ${error}`)
    }
  }

  /**
   * Unload a model from RAM
   */
  async unloadModel(instanceID: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/api/v1/models/unload`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ instance_id: instanceID })
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to unload model: ${error}`)
    }
  }

  /**
   * List all downloaded models
   */
  async listModels(): Promise<string[]> {
    const response = await fetch(`${this.baseURL}/api/v1/models`, {
      method: 'GET',
      headers: this.getHeaders(),
      mode: 'cors'
    })

    if (!response.ok) {
      throw new Error('Failed to list models')
    }

    const data = await response.json()

    return data.models || []
  }
}
